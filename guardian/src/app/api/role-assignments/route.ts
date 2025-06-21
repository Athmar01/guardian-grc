import { NextResponse } from 'next/server';
import { auth } from '@/lib/api-auth';
import { dbConnect } from '@/lib/mongoose';
import RoleAssignment, { IRoleAssignment, RoleType } from '@/models/RoleAssignment';
import Folder from '@/models/Folder';
import { checkPermission } from '@/lib/permission-utils';
import mongoose from 'mongoose';

// POST: Create a new role assignment
export async function POST(request: Request) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userIdToAssign, emailToAssign, role, folderId } = body;

    if ((!userIdToAssign && !emailToAssign) || (userIdToAssign && emailToAssign)) {
      return NextResponse.json({ error: 'Either userIdToAssign or emailToAssign must be provided, but not both.' }, { status: 400 });
    }
    if (!role || !['Owner', 'Editor', 'Contributor', 'Viewer'].includes(role)) {
      return NextResponse.json({ error: 'Valid role is required (Owner, Editor, Contributor, Viewer)' }, { status: 400 });
    }
    if (!folderId || !mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: 'Valid folderId is required' }, { status: 400 });
    }

    // Check if performing user has 'Owner' permission on the target folder to manage roles
    const hasPermissionToManageRoles = await checkPermission(performingUserId, folderId, Folder, 'Owner');
    if (!hasPermissionToManageRoles) {
      return NextResponse.json({ error: 'Forbidden: Only folder owners can assign roles.' }, { status: 403 });
    }

    let targetUserId = userIdToAssign;
    if (emailToAssign) {
        try {
            const users = await (clerkClient()).users.getUserList({ emailAddress: [emailToAssign] });
            if (users.data.length === 0) {
                return NextResponse.json({ error: `User with email '${emailToAssign}' not found.` }, { status: 404 });
            }
            targetUserId = users.data[0].id;
        } catch (clerkError) {
            console.error('Clerk API error fetching user by email:', clerkError);
            return NextResponse.json({ error: 'Failed to find user by email via Clerk.' }, { status: 500 });
        }
    }

    if (!targetUserId) {
        return NextResponse.json({ error: 'Target user ID could not be determined.' }, { status: 400 });
    }

    // Prevent assigning 'Owner' role if the performing user is not the folder owner or trying to assign Owner to someone else
    // The folder owner is determined by the Folder model's owner field, not just by having an 'Owner' role.
    const targetFolder = await Folder.findById(folderId);
    if (!targetFolder) {
        return NextResponse.json({ error: 'Target folder not found.' }, { status: 404 });
    }
    if (role === 'Owner' && targetFolder.owner !== performingUserId) {
        return NextResponse.json({ error: 'Only the original folder owner can assign the Owner role.' }, { status: 403 });
    }
    if (role === 'Owner' && targetUserId !== targetFolder.owner) {
        // This check is a bit redundant if the above holds, but good for clarity.
        // It means you cannot make someone else an 'Owner' if they are not the original folder.owner.
        // The original owner always retains an implicit Owner role. This prevents transfer of true ownership via role assignment.
        return NextResponse.json({ error: 'The Owner role can only be held by the original folder creator.' }, { status: 403 });
    }

    // Check for existing assignment for this user on this folder
    const existingAssignment = await RoleAssignment.findOne({ userId: targetUserId, folderId });
    if (existingAssignment) {
      if (existingAssignment.role === role) {
        return NextResponse.json({ error: 'User already has this role on this folder.' }, { status: 409 }); // Conflict
      }
      // If role is different, we'll update it via PUT to /api/role-assignments/[assignmentId] instead of creating a new one.
      // Or, for simplicity here, we can just update it.
      existingAssignment.role = role as RoleType;
      await existingAssignment.save();
      return NextResponse.json(existingAssignment, { status: 200 });
    }

    const newRoleAssignment = new RoleAssignment({
      userId: targetUserId,
      role,
      folderId,
    });

    await newRoleAssignment.save();
    return NextResponse.json(newRoleAssignment, { status: 201 });

  } catch (error: any) {
    console.error('Error creating role assignment:', error);
    if (error.code === 11000 || error.name === 'MongoServerError' && error.message.includes('duplicate key')) { // Handle unique index violation
      return NextResponse.json({ error: 'This role assignment already exists or conflicts with an existing one.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create role assignment' }, { status: 500 });
  }
}

// GET: List role assignments (e.g., for a folder or a user)
export async function GET(request: Request) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
  const userIdParam = searchParams.get('userId'); // User whose roles are being listed

  try {
    let query: mongoose.FilterQuery<IRoleAssignment> = {};

    if (folderId) {
      if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return NextResponse.json({ error: 'Invalid folder ID format' }, { status: 400 });
      }
      // To list roles for a folder, performing user must be at least 'Viewer' of that folder.
      const hasPermissionToList = await checkPermission(performingUserId, folderId, Folder, 'Viewer');
      if (!hasPermissionToList) {
        return NextResponse.json({ error: 'Forbidden: Insufficient permissions to view roles for this folder.' }, { status: 403 });
      }
      query.folderId = folderId;
    }

    if (userIdParam) {
      // If querying for a specific user's roles, only that user or an admin (not implemented yet) should be able to see them.
      // For now, let's restrict this to the user themselves or if they are also querying a folder they have access to.
      if (userIdParam !== performingUserId && !folderId) { // If not querying own roles and not scoping by a folder
          return NextResponse.json({ error: 'Forbidden: Can only list your own roles or roles for a folder you can access.' }, { status: 403 });
      }
      query.userId = userIdParam;
    }
    
    // If no specific folderId or userIdParam is given, it implies listing all roles the performingUser can see.
    // This could be a large list and might need admin privileges or further scoping in a real app.
    // For now, if neither is provided, we'll assume they want to see their own assignments across all folders they have a role on.
    if (!folderId && !userIdParam) {
        query.userId = performingUserId;
    }

    const assignments = await RoleAssignment.find(query).populate('folderId', 'name'); // Populate folder name
    
    // Enhance assignments with user email from Clerk (if listing for a folder)
    if (folderId && assignments.length > 0) {
        const userIdsToFetch = Array.from(new Set(assignments.map(a => a.userId)));
        try {
            const users = await (clerkClient()).users.getUserList({ userId: userIdsToFetch });
            const userMap = new Map(users.data.map((u: User) => [u.id, u.emailAddresses[0]?.emailAddress || 'N/A']));
            
            const populatedAssignments = assignments.map(a => {
                const assignmentObj = a.toObject(); // Convert Mongoose doc to plain object to add properties
                return {
                    ...assignmentObj,
                    userEmail: userMap.get(a.userId)
                };
            });
            return NextResponse.json(populatedAssignments, { status: 200 });
        } catch (clerkError) {
            console.error('Clerk API error fetching user details for role assignments:', clerkError);
            // Return assignments without email if Clerk fails, rather than failing the whole request
            return NextResponse.json(assignments, { status: 200 }); 
        }
    }

    return NextResponse.json(assignments, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching role assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch role assignments' }, { status: 500 });
  }
}
