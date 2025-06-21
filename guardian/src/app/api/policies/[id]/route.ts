import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Policy, { IPolicy, IPolicyPopulatedFolder } from '@/models/Policy';
import { auth } from '@/lib/api-auth';
import { checkPermission, getAccessibleFolderIds } from '@/lib/permission-utils';
import Folder from '@/models/Folder'; // Import Folder model
import mongoose, { Types } from 'mongoose'; // Added Types
import AuditLog from '@/models/AuditLog'; // Uncommented AuditLog

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unknown error occurred';
}

// GET /api/policies/[id] - Get specific policy
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser(); // For audit log email, if used

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid policy ID format' }, { status: 400 });
    }

    const policy = await Policy.findById(params.id).populate('folder', '_id name').lean() as IPolicyPopulatedFolder | null;

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    if (!policy.folder || !policy.folder._id) { // folder is now typed as IPopulatedFolderMin via IPolicyPopulatedFolder
      return NextResponse.json({ error: 'Policy is not associated with a folder, cannot verify permissions.' }, { status: 500 });
    }

    const hasPermission = await checkPermission(userId, policy.folder._id.toString(), Folder, 'Viewer');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_POLICY',
      details: `Viewed policy: ${policy.name} (ID: ${params.id}) in folder ${policy.folder.name}`,
      itemId: policy._id,
      itemType: 'Policy',
      folderId: policy.folder._id
    });

    return NextResponse.json({ success: true, data: policy });
  } catch (error) {
    console.error(`Error fetching policy ${params.id}:`, error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// PUT /api/policies/[id] - Update specific policy
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser(); // For audit log email, if used

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid policy ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { folderId: newFolderIdFromRequest, ...otherUpdates } = body;

    const currentPolicyState = await Policy.findById(params.id).populate('folder', '_id name').lean() as IPolicyPopulatedFolder | null;
    if (!currentPolicyState) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }
    if (!currentPolicyState.folder || !currentPolicyState.folder._id) {
      console.error(`Policy ${params.id} is missing folder information for PUT.`);
      return NextResponse.json({ error: 'Policy is not associated with a folder, cannot verify permissions for update.' }, { status: 500 });
    }
    const currentFolderId = currentPolicyState.folder._id.toString();
    const currentFolderName = currentPolicyState.folder.name;

    const hasEditPermission = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    const policyInstance = await Policy.findById(params.id); // Get the Mongoose document for update
    if (!policyInstance) { // Should be caught by currentPolicyState check, but good to be safe
        return NextResponse.json({ error: 'Policy not found for update instance.' }, { status: 404 });
    }

    let newFolderDetailsForAudit = "";
    let targetFolderIdForAudit = policyInstance.folder; // existing folder by default

    if (newFolderIdFromRequest !== undefined) {
      const newFolderIdStr = newFolderIdFromRequest.toString();
      if (!mongoose.Types.ObjectId.isValid(newFolderIdStr)) {
        return NextResponse.json({ error: 'Invalid new folder ID format' }, { status: 400 });
      }
      if (newFolderIdStr !== currentFolderId) {
        const hasMovePermission = await checkPermission(userId, newFolderIdStr, Folder, 'Contributor');
        if (!hasMovePermission) {
          return NextResponse.json({ error: 'Forbidden: Insufficient permissions for the new target folder.' }, { status: 403 });
        }
        policyInstance.folder = new Types.ObjectId(newFolderIdStr);
        targetFolderIdForAudit = policyInstance.folder;
        const newFolderDoc = await Folder.findById(newFolderIdStr).lean();
        newFolderDetailsForAudit = ` to folder ${newFolderDoc ? newFolderDoc.name : `ID ${newFolderIdStr}`}`;
      }
    }

    Object.keys(otherUpdates).forEach(key => {
      if (key !== 'comments' && key !== 'attachments') { // folderId is already handled
        (policyInstance as any)[key] = otherUpdates[key];
      }
    });

    await policyInstance.save();
    const populatedPolicy = await Policy.findById(policyInstance._id).populate('folder', 'name').lean() as IPolicyPopulatedFolder | null;
    
    if (!populatedPolicy || !populatedPolicy.folder) { 
        console.error(`Failed to retrieve updated policy ${params.id} with folder details after save.`);
        return NextResponse.json({ error: 'Failed to retrieve updated policy with folder details' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_POLICY',
      details: `Updated policy: ${populatedPolicy.name} (ID: ${params.id})${newFolderDetailsForAudit}. Original folder: ${currentFolderName} (ID: ${currentFolderId}).`,
      itemId: populatedPolicy._id,
      itemType: 'Policy',
      folderId: targetFolderIdForAudit
    });

    return NextResponse.json({ success: true, data: populatedPolicy });
  } catch (error) {
    console.error(`Error updating policy ${params.id}:`, error);
    let message = getErrorMessage(error);
    if (error instanceof mongoose.Error.ValidationError) {
        message = error.message;
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/policies/[id] - Delete specific policy
export async function DELETE(
  request: NextRequest, // request is unused but part of the signature
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser(); // For audit log email, if used

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid policy ID format' }, { status: 400 });
    }

    const policyToDelete = await Policy.findById(params.id).populate('folder', '_id name').lean() as IPolicyPopulatedFolder | null;
    if (!policyToDelete) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    if (!policyToDelete.folder || !policyToDelete.folder._id) { // folder is now typed
      return NextResponse.json({ error: 'Policy is not associated with a folder, cannot verify permissions for delete.' }, { status: 500 });
    }

    const hasDeletePermission = await checkPermission(userId, policyToDelete.folder._id.toString(), Folder, 'Editor');
    if (!hasDeletePermission) {
      return NextResponse.json({ error: 'Forbidden to delete this policy from its current folder' }, { status: 403 });
    }

    const deletedPolicy = await Policy.findByIdAndDelete(params.id);
    if (!deletedPolicy) {
      // Should not happen if found before, but good to check
      return NextResponse.json({ error: 'Policy not found during delete operation' }, { status: 404 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_POLICY',
      details: `Deleted policy: ${policyToDelete.name} (ID: ${params.id}) from folder ${policyToDelete.folder.name}.`,
      itemId: policyToDelete._id,
      itemType: 'Policy',
      folderId: policyToDelete.folder._id
    });

    return NextResponse.json({ success: true, message: 'Policy deleted successfully' });
  } catch (error) {
    console.error(`Error deleting policy ${params.id}:`, error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
