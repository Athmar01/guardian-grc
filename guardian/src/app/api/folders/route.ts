import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAccessibleFolders, hasPermission } from '@/lib/rbac';

// GET: List all accessible folders for the user
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const accessibleFolderIds = await getAccessibleFolders(userId);
        
        const folders = await prisma.folder.findMany({
            where: {
                id: { in: accessibleFolderIds }
            },
            orderBy: {
                path: 'asc',
            },
            include: {
                children: true, // Optionally include direct children
            }
        });

        await prisma.changeLog.create({
            data: {
                entityType: 'Folder',
                entityId: 'LIST_VIEW',
                fieldName: 'VIEW_LIST',
                changedById: userId,
            },
        });

        return NextResponse.json(folders);
    } catch (error) {
        console.error('[FOLDERS_GET]', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
    }
}

const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name cannot be empty.'),
  parentId: z.string().uuid().optional().nullable(),
});

// POST: Create a new folder
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = createFolderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }
        
        const { name, parentId } = validation.data;

        const userOrg = await prisma.userOrganization.findFirst({ where: { userId } });
        if (!userOrg) {
            return NextResponse.json({ error: 'User is not part of an organization.' }, { status: 403 });
        }

        let parentPath = '';
        if (parentId) {
            // User must have write permission in the parent folder to create a subfolder
            const canWrite = await hasPermission(userId, 'write', parentId);
            if (!canWrite) {
                return NextResponse.json({ error: 'Forbidden: You do not have permission to create a folder here.' }, { status: 403 });
            }
            const parentFolder = await prisma.folder.findUnique({ where: { id: parentId } });
            if (!parentFolder) {
                return NextResponse.json({ error: 'Parent folder not found.' }, { status: 404 });
            }
            parentPath = parentFolder.path;
        } else {
            // To create a root folder, user needs to be an org admin (or similar role)
            // This logic can be expanded in hasPermission or a new RBAC function
            const canCreateRoot = await hasPermission(userId, 'write', userOrg.organizationId); // Using orgId as a proxy for root permissions
            if (!canCreateRoot) {
                return NextResponse.json({ error: 'Forbidden: You do not have permission to create a root folder.' }, { status: 403 });
            }
        }

        const newFolder = await prisma.folder.create({
            data: {
                name,
                parentId,
                organizationId: userOrg.organizationId,
                path: `${parentPath}/${name}`.replace('//','/'), // Construct path and avoid double slashes
            },
        });

        await prisma.changeLog.create({
            data: {
                entityType: 'Folder',
                entityId: newFolder.id,
                fieldName: 'CREATE',
                newValue: JSON.stringify(newFolder),
                changedById: userId,
            },
        });

        return NextResponse.json(newFolder, { status: 201 });
    } catch (error) {
        console.error('[FOLDERS_POST]', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
    }
}
