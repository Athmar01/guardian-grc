import { prisma } from './prisma';

/**
 * Retrieves a list of folder IDs that a user has access to via their organization memberships.
 * @param userId - The ID of the user from Clerk.
 * @returns A promise that resolves to an array of folder IDs.
 */
export async function getAccessibleFolders(userId: string): Promise<string[]> {
  // 1. Find all organizations the user belongs to.
  const userOrgs = await prisma.userOrganization.findMany({
    where: { userId: userId },
    select: { organizationId: true },
  });

  if (userOrgs.length === 0) {
    return [];
  }

  const organizationIds = userOrgs.map((org) => org.organizationId);

  // 2. Find all folders within those organizations.
  const folders = await prisma.folder.findMany({
    where: {
      organizationId: { in: organizationIds },
    },
    select: { id: true },
  });

  return folders.map((folder) => folder.id);
}

/**
 * Checks if a user has a specific permission within a given folder.
 * This is a simplified implementation based on organization-level roles.
 * It assumes the 'admin' role grants all permissions for now.
 * @param userId - The ID of the user.
 * @param permission - The permission string (e.g., 'add_riskassessment'). Currently unused, but kept for API consistency.
 * @param folderId - The ID of the folder to check permissions in.
 * @returns A promise that resolves to true if the user has the permission, false otherwise.
 */
export async function hasPermission(
  userId: string,
  permission: string, // Kept for future use and API consistency
  folderId: string
): Promise<boolean> {
  // 1. Find the folder to get its organizationId
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { organizationId: true },
  });

  if (!folder) {
    // If folder doesn't exist, no permissions can be granted.
    return false;
  }

  // 2. Find the user's role in that specific organization.
  const userOrgRole = await prisma.userOrganization.findUnique({
    where: {
      userId_organizationId: {
        userId: userId,
        organizationId: folder.organizationId,
      },
    },
    select: { role: true },
  });

  if (!userOrgRole) {
    return false;
  }

  // 3. Simplified permission logic: 'admin' can do anything.
  // This can be expanded later to check for specific permissions vs roles.
  if (userOrgRole.role === 'admin') {
    return true;
  }

  // Future expansion: check for 'member' role for read-only access, etc.

  return false;
}
