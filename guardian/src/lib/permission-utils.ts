import mongoose, { LeanDocument } from 'mongoose';
import Folder, { IFolder } from '@/models/Folder';
import RoleAssignment, { IRoleAssignment, RoleType } from '@/models/RoleAssignment';

// Define role hierarchy (e.g., Owner can do everything Editor can do)
const roleHierarchy: Record<RoleType, number> = {
  'Owner': 3,
  'Editor': 2,
  'Contributor': 1, // Can create items, maybe edit own items
  'Viewer': 0,
};

export async function checkPermission(
  userId: string, // Clerk User ID
  resourceId: string | mongoose.Types.ObjectId, // ID of the GRC object (Risk, Control, etc.)
  resourceModel: mongoose.Model<any & { folder?: mongoose.Types.ObjectId | IFolder; owner?: string }>, // Added owner to type hint
  requiredRole: RoleType
): Promise<boolean> {
  if (!userId) {
    console.warn('checkPermission called without userId');
    return false; // No user, no permission
  }

  const resource: LeanDocument<any & { folder?: mongoose.Types.ObjectId; owner?: string }> | null = 
    await resourceModel.findById(resourceId).select('folder owner').lean();
  if (!resource) {
    console.warn(`Resource ${resourceId.toString()} not found in model ${resourceModel.modelName}.`);
    return false; // Resource not found
  }

  // Case 1: Direct ownership of the resource itself (if applicable and grants max permissions)
  // This depends on whether GRC items have an 'owner' field and if that implies full control, bypassing folder permissions.
  // For now, assuming permissions are primarily folder-based as per the plan.
  // if (resource.owner && resource.owner === userId && roleHierarchy['Owner'] >= roleHierarchy[requiredRole]) {
  //   return true;
  // }

  if (!resource.folder) {
    console.warn(`Resource ${resourceId.toString()} in ${resourceModel.modelName} has no folder assigned.`);
    return false; // Resource not in a folder (should not happen if 'folder' is required)
  }

  const folderId = resource.folder as mongoose.Types.ObjectId; // Assert as ObjectId after check
  let currentFolderToCheck: LeanDocument<IFolder> | null = await Folder.findById(folderId).lean();

  while (currentFolderToCheck) {
    // Check direct role assignment on this folder
    const assignment: LeanDocument<IRoleAssignment> | null = await RoleAssignment.findOne({ 
      userId, 
      folderId: currentFolderToCheck._id as mongoose.Types.ObjectId, 
      role: { $exists: true } 
    }).lean();

    if (assignment && roleHierarchy[assignment.role as RoleType] >= roleHierarchy[requiredRole]) {
      return true; // Permission granted through this folder
    }

    // Check if the user is the direct owner of this folder in the hierarchy
    if (currentFolderToCheck.owner && currentFolderToCheck.owner === userId && roleHierarchy['Owner'] >= roleHierarchy[requiredRole]) {
      return true; // Permission granted through folder ownership
    }

    // Move to parent folder for next iteration if it exists
    if (currentFolderToCheck.parent) {
      currentFolderToCheck = currentFolderToCheck.parent ? await Folder.findById(currentFolderToCheck.parent).lean() : null;
    } else {
      currentFolderToCheck = null; // Reached root, no more parents
    }
  }

  return false; // No sufficient role found in the folder hierarchy
}

export async function getAccessibleFolderIds(userId: string, minRole: RoleType): Promise<string[]> {
  if (!userId) return [];
  
  const accessibleFolderIds = new Set<string>();

  // 1. Folders where user has a direct role assignment meeting minRole
  const directAssignments: LeanDocument<IRoleAssignment>[] = await RoleAssignment.find({ userId }).lean();
  for (const assignment of directAssignments) {
    if (roleHierarchy[assignment.role as RoleType] >= roleHierarchy[minRole]) {
      accessibleFolderIds.add(assignment.folderId.toString());
      // Add all subfolders as well, since permission cascades down
      const subFolders: LeanDocument<Pick<IFolder, '_id'>>[] = await Folder.find({ ancestors: assignment.folderId }).select('_id').lean();
      subFolders.forEach(sf => accessibleFolderIds.add((sf._id as mongoose.Types.ObjectId).toString()));
    }
  }

  // 2. Folders directly owned by the user (implies 'Owner' role)
  if (roleHierarchy['Owner'] >= roleHierarchy[minRole]) {
    const ownedFolders: LeanDocument<Pick<IFolder, '_id' | 'ancestors' | 'owner'>>[] = await Folder.find({ owner: userId }).select('_id ancestors owner').lean();
    for (const folder of ownedFolders) {
      accessibleFolderIds.add((folder._id as mongoose.Types.ObjectId).toString());
      // Add all subfolders of owned folders
      const subFoldersOfOwned: LeanDocument<Pick<IFolder, '_id'>>[] = await Folder.find({ ancestors: folder._id as mongoose.Types.ObjectId }).select('_id').lean();
      subFoldersOfOwned.forEach(sf => accessibleFolderIds.add((sf._id as mongoose.Types.ObjectId).toString()));
    }
  }
  
  // Deduplicate and return
  return Array.from(accessibleFolderIds);
}
