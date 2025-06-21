import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAccessibleFolders, hasPermission } from '@/lib/rbac';
import { Prisma } from '@prisma/client';

// GET /api/policies - Get a list of policies
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const accessibleFolderIds = await getAccessibleFolders(userId);
        if (accessibleFolderIds.length === 0) {
            return NextResponse.json({ data: [], pagination: { total: 0 } });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const search = searchParams.get('search');
        const status = searchParams.get('status');
        const folderId = searchParams.get('folderId');

        const where: Prisma.PolicyWhereInput = {
            folderId: { in: accessibleFolderIds },
            ...(folderId && { folderId: folderId }),
            ...(search && { name: { contains: search, mode: 'insensitive' } }),
            ...(status && { status: status }),
        };

        const policies = await prisma.policy.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { folder: true, owner: true },
        });

        const total = await prisma.policy.count({ where });

        await prisma.changeLog.create({
            data: {
                entityType: 'Policy',
                entityId: 'LIST_VIEW',
                fieldName: 'VIEW_LIST',
                newValue: JSON.stringify({ page, limit, search, status, folderId }),
                changedById: userId,
            },
        });

        return NextResponse.json({
            data: policies,
            pagination: { total, page, limit },
        });
    } catch (e: unknown) {
        console.error('Error fetching policies:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

const createPolicySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional().nullable(),
    folderId: z.string().uuid('A valid folder ID is required'),
    policyId: z.string().min(1, 'A unique policy ID is required'),
    version: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
});


// POST /api/policies - Create a new policy
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = createPolicySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { folderId, ...policyData } = validation.data;

        const canWrite = await hasPermission(userId, 'write', folderId);
        if (!canWrite) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const newPolicy = await prisma.policy.create({
            data: {
                ...policyData,
                folderId: folderId,
                ownerId: userId,
            },
        });

        await prisma.changeLog.create({
            data: {
                entityType: 'Policy',
                entityId: newPolicy.id,
                fieldName: 'CREATE',
                newValue: JSON.stringify(newPolicy),
                changedById: userId,
            },
        });

        return NextResponse.json(newPolicy, { status: 201 });
    } catch (e: unknown) {
        console.error('Error creating policy:', e);
        let errorMessage = 'An unknown error occurred.';
        let statusCode = 500;

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                const target = e.meta?.target as string[] | undefined;
                errorMessage = `A policy with this ${target?.join(', ') || 'value'} already exists.`;
                statusCode = 409;
            }
        } else if (e instanceof Error) {
            errorMessage = e.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}