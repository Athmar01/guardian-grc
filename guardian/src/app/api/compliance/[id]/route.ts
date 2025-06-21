import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { Prisma, Framework } from '@prisma/client';

const updateFrameworkSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  version: z.string().min(1, 'Version is required').optional(),
  description: z.string().optional(),
  folderId: z.string().uuid('Folder ID must be a valid UUID').optional(),
  urn: z.string().optional(),
  metadata: z.object({}).passthrough().optional(),
});

type PermissionCheckResult = { error?: NextResponse; framework?: Framework & { Folder: { id: string; name: string } | null } };

async function getFrameworkAndCheckPermissions(
  userId: string, 
  frameworkId: string, 
  permission: 'read' | 'write' | 'delete'
): Promise<PermissionCheckResult> {
  const framework = await prisma.framework.findUnique({
    where: { id: frameworkId },
    include: { Folder: { select: { id: true, name: true } } },
  });

  if (!framework) {
    return { error: NextResponse.json({ error: 'Framework not found' }, { status: 404 }) };
  }

  if (!framework.folderId) {
    console.error(`Framework ${framework.id} is missing folderId.`);
    return { error: NextResponse.json({ error: 'Framework is missing folder data, cannot verify permissions.' }, { status: 500 }) };
  }

  const hasAccess = await hasPermission(userId, permission, framework.folderId);
  if (!hasAccess) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { framework };
}

// GET /api/compliance/{id} - Get a specific compliance framework
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error, framework } = await getFrameworkAndCheckPermissions(userId, params.id, 'read');
        if (error) return error;

        await prisma.changeLog.create({
            data: {
                entityType: 'Framework',
                entityId: params.id,
                fieldName: 'VIEW',
                newValue: JSON.stringify({ name: framework?.name }),
                changedById: userId,
            },
        });

        return NextResponse.json(framework);
    } catch (e: unknown) {
        console.error('Error fetching framework:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// PUT /api/compliance/{id} - Update a compliance framework
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error, framework: currentFramework } = await getFrameworkAndCheckPermissions(userId, params.id, 'write');
        if (error) return error;
        if (!currentFramework) return NextResponse.json({ error: 'Framework not found' }, { status: 404 });

        const body = await request.json();
        const validation = updateFrameworkSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }
        
        const { folderId: newFolderId, ...updateData } = validation.data;

        if (newFolderId && newFolderId !== currentFramework.folderId) {
            const canMove = await hasPermission(userId, 'write', newFolderId);
            if (!canMove) {
                return NextResponse.json({ error: 'Forbidden: You do not have write permission for the target folder.' }, { status: 403 });
            }
        }

        const updatedFramework = await prisma.$transaction(async (tx) => {
            const changes: Prisma.ChangeLogCreateManyInput[] = [];
            const dataToUpdate: Prisma.FrameworkUpdateInput = {};

            for (const key in updateData) {
                const typedKey = key as keyof typeof updateData;
                const oldValue = currentFramework[typedKey as keyof Framework];
                const newValue = updateData[typedKey];

                if (newValue !== undefined && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                    changes.push({
                        entityType: 'Framework',
                        entityId: params.id,
                        fieldName: typedKey,
                        oldValue: JSON.stringify(oldValue),
                        newValue: JSON.stringify(newValue),
                        changedById: userId,
                    });
                    (dataToUpdate as any)[typedKey] = newValue;
                }
            }

            if (newFolderId && newFolderId !== currentFramework.folderId) {
                changes.push({
                    entityType: 'Framework',
                    entityId: params.id,
                    fieldName: 'folderId',
                    oldValue: JSON.stringify(currentFramework.folderId),
                    newValue: newFolderId,
                    changedById: userId,
                });
                dataToUpdate.Folder = { connect: { id: newFolderId } };
            }

            if (Object.keys(dataToUpdate).length === 0) {
                return currentFramework;
            }

            const framework = await tx.framework.update({
                where: { id: params.id },
                data: dataToUpdate,
                include: { Folder: { select: { id: true, name: true } } },
            });

            if (changes.length > 0) {
                await tx.changeLog.createMany({ data: changes });
            }

            return framework;
        });

        return NextResponse.json(updatedFramework);
    } catch (e: unknown) {
        console.error('Error updating framework:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// DELETE /api/compliance/{id} - Delete a compliance framework
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error, framework } = await getFrameworkAndCheckPermissions(userId, params.id, 'delete');
        if (error) return error;
        if (!framework) return NextResponse.json({ error: 'Framework not found' }, { status: 404 });

        await prisma.$transaction(async (tx) => {
            await tx.changeLog.create({
                data: {
                    entityType: 'Framework',
                    entityId: params.id,
                    fieldName: 'DELETE',
                    oldValue: JSON.stringify(framework),
                    newValue: 'DELETED',
                    changedById: userId,
                },
            });

            await tx.framework.delete({ where: { id: params.id } });
        });

        return NextResponse.json({ message: 'Framework deleted successfully' });
    } catch (e: unknown) {
        console.error('Error deleting framework:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 