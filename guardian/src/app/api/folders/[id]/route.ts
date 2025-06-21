import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { Prisma } from '@prisma/client';

// GET /api/folders/{id} - Get a single folder
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const folderId = params.id;
        const canRead = await hasPermission(userId, 'read', folderId);
        if (!canRead) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: { children: true, parent: true },
        });

        if (!folder) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        await prisma.changeLog.create({
            data: {
                entityType: 'Folder',
                entityId: folderId,
                fieldName: 'VIEW',
                changedById: userId,
            },
        });

        return NextResponse.json(folder);
    } catch (e: unknown) {
        console.error('[FOLDER_GET]', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

const updateFolderSchema = z.object({
    name: z.string().min(1).optional(),
    parentId: z.string().uuid().nullable().optional(),
});

// Helper to recursively update child paths
async function updateChildPaths(folderId: string, newPath: string, tx: Prisma.TransactionClient) {
    const children = await tx.folder.findMany({ where: { parentId: folderId } });
    for (const child of children) {
        const childNewPath = `${newPath}/${child.name}`;
        await tx.folder.update({
            where: { id: child.id },
            data: { path: childNewPath },
        });
        await updateChildPaths(child.id, childNewPath, tx);
    }
}

// PUT /api/folders/{id} - Update a folder (rename, move)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const folderId = params.id;
        const canWrite = await hasPermission(userId, 'write', folderId);
        if (!canWrite) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const validation = updateFolderSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { name, parentId } = validation.data;

        const currentFolder = await prisma.folder.findUnique({ where: { id: folderId } });
        if (!currentFolder) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        // If moving, check permission on new parent
        if (parentId && parentId !== currentFolder.parentId) {
            const canWriteNewParent = await hasPermission(userId, 'write', parentId);
            if (!canWriteNewParent) {
                return NextResponse.json({ error: 'Forbidden to move folder to this location.' }, { status: 403 });
            }
        }

        const updatedFolder = await prisma.$transaction(async (tx) => {
            let newPath = currentFolder.path;

            // Handle rename or move
            if (name !== currentFolder.name || parentId !== currentFolder.parentId) {
                let parentPath = '';
                if (parentId) {
                    const parentFolder = await tx.folder.findUnique({ where: { id: parentId } });
                    if (!parentFolder) throw new Error('Parent folder not found');
                    parentPath = parentFolder.path;
                }
                newPath = `${parentPath}/${name || currentFolder.name}`.replace('//','/');
            }

            const updated = await tx.folder.update({
                where: { id: folderId },
                data: {
                    name: name || undefined,
                    parentId: parentId,
                    path: newPath,
                },
            });

            // If path changed, update all children recursively
            if (newPath !== currentFolder.path) {
                await updateChildPaths(folderId, newPath, tx);
            }

            return updated;
        });


        await prisma.changeLog.create({
            data: {
                entityType: 'Folder',
                entityId: folderId,
                fieldName: 'UPDATE',
                oldValue: JSON.stringify(currentFolder),
                newValue: JSON.stringify(updatedFolder),
                changedById: userId,
            },
        });

        return NextResponse.json(updatedFolder);
    } catch (e: unknown) {
        console.error('[FOLDER_PUT]', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// DELETE /api/folders/{id} - Delete a folder
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const folderId = params.id;
        const canWrite = await hasPermission(userId, 'write', folderId);
        if (!canWrite) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const folderToDelete = await prisma.folder.findUnique({ where: { id: folderId } });
        if (!folderToDelete) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        // Check if folder is empty
        const nonEmptyChecks = await Promise.all([
            prisma.folder.count({ where: { parentId: folderId } }),
            prisma.control.count({ where: { folderId: folderId } }),
            prisma.risk.count({ where: { folderId: folderId } }),
            prisma.policy.count({ where: { folderId: folderId } }),
            prisma.framework.count({ where: { folderId: folderId } }),
            prisma.asset.count({ where: { folderId: folderId } }),
            prisma.assessment.count({ where: { folderId: folderId } }),
        ]);

        if (nonEmptyChecks.some((count: number) => count > 0)) {
            return NextResponse.json({ error: 'Folder is not empty. Cannot delete a folder that contains subfolders or other items.' }, { status: 409 });
        }

        await prisma.folder.delete({ where: { id: folderId } });

        await prisma.changeLog.create({
            data: {
                entityType: 'Folder',
                entityId: folderId,
                fieldName: 'DELETE',
                oldValue: JSON.stringify(folderToDelete),
                changedById: userId,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        console.error('[FOLDER_DELETE]', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

