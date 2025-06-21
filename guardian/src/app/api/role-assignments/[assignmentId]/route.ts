import { NextResponse } from 'next/server';
import { auth } from '@/lib/api-auth';
import { dbConnect } from '@/lib/mongoose';
import RoleAssignment, { RoleType } from '@/models/RoleAssignment';
import Folder from '@/models/Folder'; // To check folder owner for 'Owner' role modifications
import { checkPermission } from '@/lib/permission-utils';
import mongoose from 'mongoose';

// PUT: Update a specific role assignment (e.g., change role)
export async function PUT(request: Request, { params }: { params: { assignmentId: string } }) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.assignmentId)) {
    return NextResponse.json({ error: 'Invalid role assignment ID format' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { role: newRole } = body;

    if (!newRole || !['Owner', 'Editor', 'Contributor', 'Viewer'].includes(newRole)) {
      return NextResponse.json({ error: 'Valid new role is required (Owner, Editor, Contributor, Viewer)' }, { status: 400 });
    }

    const assignmentToUpdate = await RoleAssignment.findById(params.assignmentId).populate('folderId');
    if (!assignmentToUpdate) {
      return NextResponse.json({ error: 'Role assignment not found' }, { status: 404 });
    }

    const folderId = assignmentToUpdate.folderId._id.toString(); // Populated folderId
    const targetFolder = await Folder.findById(folderId); // Re-fetch for owner info
    if (!targetFolder) {
        return NextResponse.json({ error: 'Associated folder not found. This should not happen.' }, { status: 500 });
    }

    // Check if performing user has 'Owner' permission on the target folder to manage roles
    const hasPermissionToManageRoles = await checkPermission(performingUserId, folderId, Folder, 'Owner');
    if (!hasPermissionToManageRoles) {
      return NextResponse.json({ error: 'Forbidden: Only folder owners can modify roles.' }, { status: 403 });
    }
    
    // Prevent changing role TO 'Owner' if the target user is not the original folder owner
    // And prevent changing role FROM 'Owner' for the original folder owner (they must always retain owner status implicitly)
    if (newRole === 'Owner' && assignmentToUpdate.userId !== targetFolder.owner) {
        return NextResponse.json({ error: 'The Owner role can only be held by the original folder creator.' }, { status: 403 });
    }
    if (assignmentToUpdate.role === 'Owner' && assignmentToUpdate.userId === targetFolder.owner && newRole !== 'Owner') {
        return NextResponse.json({ error: 'The original folder owner cannot have their Owner role changed or removed.' }, { status: 403 });
    }
    // Prevent changing role TO 'Owner' if the performing user is not the folder owner themselves.
    if (newRole === 'Owner' && performingUserId !== targetFolder.owner) {
        return NextResponse.json({ error: 'Only the original folder owner can assign/set the Owner role.' }, { status: 403 });
    }

    assignmentToUpdate.role = newRole as RoleType;
    await assignmentToUpdate.save();

    // Re-populate folderId after save if needed, or just return the updated assignment
    const finalAssignment = await RoleAssignment.findById(assignmentToUpdate._id).populate('folderId', 'name');

    return NextResponse.json(finalAssignment, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating role assignment ${params.assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to update role assignment' }, { status: 500 });
  }
}

// DELETE: Delete a specific role assignment
export async function DELETE(request: Request, { params }: { params: { assignmentId: string } }) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.assignmentId)) {
    return NextResponse.json({ error: 'Invalid role assignment ID format' }, { status: 400 });
  }

  try {
    const assignmentToDelete = await RoleAssignment.findById(params.assignmentId).populate('folderId');
    if (!assignmentToDelete) {
      return NextResponse.json({ error: 'Role assignment not found' }, { status: 404 });
    }

    const folderId = assignmentToDelete.folderId._id.toString();
    const targetFolder = await Folder.findById(folderId); // Re-fetch for owner info
    if (!targetFolder) {
        return NextResponse.json({ error: 'Associated folder not found. This should not happen.' }, { status: 500 });
    }

    // Check if performing user has 'Owner' permission on the target folder to manage roles
    const hasPermissionToManageRoles = await checkPermission(performingUserId, folderId, Folder, 'Owner');
    if (!hasPermissionToManageRoles) {
      return NextResponse.json({ error: 'Forbidden: Only folder owners can delete roles.' }, { status: 403 });
    }

    // Prevent deleting the 'Owner' role for the original folder owner
    if (assignmentToDelete.role === 'Owner' && assignmentToDelete.userId === targetFolder.owner) {
      return NextResponse.json({ error: 'Cannot delete the Owner role for the original folder owner.' }, { status: 403 });
    }

    await RoleAssignment.findByIdAndDelete(params.assignmentId);
    return NextResponse.json({ message: 'Role assignment deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting role assignment ${params.assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to delete role assignment' }, { status: 500 });
  }
}
