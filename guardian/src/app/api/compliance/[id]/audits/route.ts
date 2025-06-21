import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { Prisma } from '@prisma/client';

const createAuditSchema = z.object({
  name: z.string().min(1, 'Audit name is required'),
  status: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  report: z.string().optional(),
  metadata: z.object({}).passthrough().optional(),
});

async function checkFrameworkPermissions(userId: string, frameworkId: string, permission: 'read' | 'write') {
    const framework = await prisma.framework.findUnique({ where: { id: frameworkId }, select: { folderId: true } });
    if (!framework || !framework.folderId) {
        return { error: NextResponse.json({ error: 'Framework not found or is missing folder data.' }, { status: 404 }) };
    }
    const canAccess = await hasPermission(userId, permission, framework.folderId);
    if (!canAccess) {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }
    return { framework };
}

// GET /api/compliance/{id}/audits - List audits for a framework
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await checkFrameworkPermissions(userId, params.id, 'read');
        if (error) return error;

        const audits = await prisma.audit.findMany({
            where: { frameworkId: params.id },
            orderBy: { startDate: 'desc' },
        });

        await prisma.changeLog.create({
            data: {
                entityType: 'Audit',
                entityId: 'LIST',
                fieldName: 'VIEW_LIST',
                newValue: JSON.stringify({ frameworkId: params.id }),
                changedById: userId,
            },
        });

        return NextResponse.json(audits);
    } catch (e: unknown) {
        console.error('Error fetching audits:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// POST /api/compliance/{id}/audits - Create a new audit for a framework
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        const user = await currentUser();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await checkFrameworkPermissions(userId, params.id, 'write');
        if (error) return error;

        const body = await request.json();
        const validation = createAuditSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { name, status, startDate, endDate, report, metadata } = validation.data;

        const newAudit = await prisma.$transaction(async (tx) => {
            const audit = await tx.audit.create({
                data: {
                    name,
                    status: status || 'Planned',
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    report,
                    frameworkId: params.id,
                    auditorId: userId,
                    metadata: metadata || {},
                },
            });

            await tx.changeLog.create({
                data: {
                    entityType: 'Audit',
                    entityId: audit.id,
                    fieldName: 'CREATE',
                    newValue: JSON.stringify(audit),
                    changedById: userId,
                },
            });

            return audit;
        });

        return NextResponse.json(newAudit, { status: 201 });
    } catch (e: unknown) {
        console.error('Error creating audit:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
