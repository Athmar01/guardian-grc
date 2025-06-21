import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { Prisma } from '@prisma/client';

const updateAuditSchema = z.object({
  name: z.string().min(1, 'Audit name is required').optional(),
  status: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  report: z.string().optional(),
  metadata: z.object({}).passthrough().optional(),
});

async function getAuditAndCheckPermissions(userId: string, frameworkId: string, auditId: string, permission: 'read' | 'write' | 'delete') {
    const audit = await prisma.audit.findUnique({ where: { id: auditId } });

    if (!audit || audit.frameworkId !== frameworkId) {
        return { error: NextResponse.json({ error: 'Audit not found' }, { status: 404 }) };
    }

    const framework = await prisma.framework.findUnique({ where: { id: frameworkId }, select: { folderId: true } });
    if (!framework || !framework.folderId) {
        return { error: NextResponse.json({ error: 'Framework not found or is missing folder data.' }, { status: 404 }) };
    }

    const canAccess = await hasPermission(userId, permission, framework.folderId);
    if (!canAccess) {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { audit };
}

// GET /api/compliance/{id}/audits/{auditId} - Get a single audit
export async function GET(request: NextRequest, { params }: { params: { id: string, auditId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { audit, error } = await getAuditAndCheckPermissions(userId, params.id, params.auditId, 'read');
        if (error) return error;

        await prisma.changeLog.create({
            data: {
                entityType: 'Audit',
                entityId: params.auditId,
                fieldName: 'VIEW_DETAIL',
                newValue: audit.name,
                changedById: userId,
            },
        });

        return NextResponse.json(audit);
    } catch (e: unknown) {
        console.error('Error fetching audit:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// PUT /api/compliance/{id}/audits/{auditId} - Update an audit
export async function PUT(request: NextRequest, { params }: { params: { id: string, auditId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { audit: currentAudit, error } = await getAuditAndCheckPermissions(userId, params.id, params.auditId, 'write');
        if (error) return error;

        const body = await request.json();
        const validation = updateAuditSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const dataToUpdate: Prisma.AuditUpdateInput = {};
        const changes: Prisma.ChangeLogCreateManyInput[] = [];

        Object.keys(validation.data).forEach(key => {
            const typedKey = key as keyof typeof validation.data;
            const newValue = validation.data[typedKey];
            const oldValue = currentAudit[typedKey];

            if (newValue !== undefined && newValue !== oldValue) {
                (dataToUpdate[typedKey] as any) = newValue;
                changes.push({
                    entityType: 'Audit',
                    entityId: params.auditId,
                    fieldName: typedKey,
                    oldValue: JSON.stringify(oldValue),
                    newValue: JSON.stringify(newValue),
                    changedById: userId,
                });
            }
        });

        if (changes.length === 0) {
            return NextResponse.json(currentAudit, { status: 200 });
        }

        const updatedAudit = await prisma.$transaction(async (tx) => {
            const audit = await tx.audit.update({
                where: { id: params.auditId },
                data: dataToUpdate,
            });
            await tx.changeLog.createMany({ data: changes });
            return audit;
        });

        return NextResponse.json(updatedAudit);
    } catch (e: unknown) {
        console.error('Error updating audit:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// DELETE /api/compliance/{id}/audits/{auditId} - Delete an audit
export async function DELETE(request: NextRequest, { params }: { params: { id: string, auditId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { audit, error } = await getAuditAndCheckPermissions(userId, params.id, params.auditId, 'delete');
        if (error) return error;

        await prisma.$transaction(async (tx) => {
            await tx.changeLog.create({
                data: {
                    entityType: 'Audit',
                    entityId: params.auditId,
                    fieldName: 'DELETE',
                    oldValue: JSON.stringify(audit),
                    newValue: 'DELETED',
                    changedById: userId,
                },
            });
            await tx.audit.delete({ where: { id: params.auditId } });
        });

        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        console.error('Error deleting audit:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
