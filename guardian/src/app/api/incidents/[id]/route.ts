import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { Prisma } from '@prisma/client';

const updateIncidentSchema = z.object({
    title: z.string().min(1, 'Title is required.').optional(),
    description: z.string().optional().nullable(),
    status: z.string().min(1, 'Status is required.').optional(),
    severity: z.string().min(1, 'Severity is required.').optional(),
    priority: z.string().optional().nullable(),
    category: z.string().min(1, 'Category is required.').optional(),
    detectedAt: z.string().datetime().optional(),
    resolvedAt: z.string().datetime().optional().nullable(),
    ownerId: z.string().uuid().optional().nullable(),
    folderId: z.string().uuid('Valid folderId is required.').optional(),
});

// GET /api/incidents/[id] - Get a specific incident
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const incident = await prisma.incident.findUnique({
            where: { id: params.id },
            include: {
                folder: { select: { id: true, name: true, path: true } },
                owner: { select: { id: true, name: true, avatarUrl: true } },
            },
        });

        if (!incident) {
            return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
        }

        const canView = await hasPermission(userId, 'read', incident.folderId);
        if (!canView) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.changeLog.create({
            data: {
                entityType: 'Incident',
                entityId: incident.id,
                fieldName: 'VIEW',
                changedById: userId,
                newValue: JSON.stringify({ id: incident.id, title: incident.title })
            }
        });

        return NextResponse.json(incident);

    } catch (e: unknown) {
        console.error('[INCIDENT_GET_ID]', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// PUT /api/incidents/[id] - Update an incident
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = updateIncidentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const dataToUpdate = validation.data;

        const incident = await prisma.incident.findUnique({ where: { id: params.id } });
        if (!incident) {
            return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
        }

        // Check permission for the current folder
        const canWriteCurrent = await hasPermission(userId, 'write', incident.folderId);
        if (!canWriteCurrent) {
            return NextResponse.json({ error: 'Forbidden: Insufficient permissions for the current folder.' }, { status: 403 });
        }

        // If moving folder, check permission for the new folder
        if (dataToUpdate.folderId && dataToUpdate.folderId !== incident.folderId) {
            const canWriteNew = await hasPermission(userId, 'write', dataToUpdate.folderId);
            if (!canWriteNew) {
                return NextResponse.json({ error: 'Forbidden: Insufficient permissions for the target folder.' }, { status: 403 });
            }
        }

        const updatedIncident = await prisma.$transaction(async (tx) => {
            const updated = await tx.incident.update({
                where: { id: params.id },
                data: dataToUpdate,
                include: {
                    folder: { select: { id: true, name: true } },
                    owner: { select: { id: true, name: true } },
                }
            });

            await tx.changeLog.create({
                data: {
                    entityType: 'Incident',
                    entityId: updated.id,
                    fieldName: 'UPDATE',
                    oldValue: JSON.stringify(incident),
                    newValue: JSON.stringify(updated),
                    changedById: userId,
                },
            });

            return updated;
        });

        return NextResponse.json(updatedIncident);

    } catch (e: unknown) {
        console.error('[INCIDENT_PUT]', e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
                return NextResponse.json({ error: 'Incident not found.' }, { status: 404 });
            }
        }
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// DELETE /api/incidents/[id] - Delete an incident
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const incident = await prisma.incident.findUnique({ where: { id: params.id } });
        if (!incident) {
            return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
        }

        const canDelete = await hasPermission(userId, 'write', incident.folderId);
        if (!canDelete) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.incident.delete({ where: { id: params.id } });

            await tx.changeLog.create({
                data: {
                    entityType: 'Incident',
                    entityId: incident.id,
                    fieldName: 'DELETE',
                    oldValue: JSON.stringify(incident),
                    changedById: userId,
                },
            });
        });

        return new NextResponse(null, { status: 204 });

    } catch (e: unknown) {
        console.error('[INCIDENT_DELETE]', e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
                return NextResponse.json({ error: 'Incident not found.' }, { status: 404 });
            }
        }
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

