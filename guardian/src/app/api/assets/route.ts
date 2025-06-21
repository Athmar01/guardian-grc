import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAccessibleFolders, hasPermission } from '@/lib/rbac';
import { AssetType } from '@prisma/client';

const createAssetSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    folderId: z.string().uuid('Invalid folder ID'),
    type: z.nativeEnum(AssetType),
    businessValue: z.string().optional(),
    confidentiality: z.number().int().min(0).max(10).default(0),
    integrity: z.number().int().min(0).max(10).default(0),
    availability: z.number().int().min(0).max(10).default(0),
});

/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: Retrieve all accessible assets
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: A list of assets.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const accessibleFolderIds = await getAccessibleFolders(userId, 'read');

    const assets = await prisma.asset.findMany({
        where: {
            folderId: { in: accessibleFolderIds },
        },
        include: { folder: { select: { name: true } } },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(assets);
}

/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Create a new asset
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AssetCreate' }
 *     responses:
 *       201:
 *         description: The created asset.
 *       403:
 *         description: Forbidden.
 */
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const validation = createAssetSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    const { folderId } = validation.data;
    const canWrite = await hasPermission(userId, 'write', folderId);

    if (!canWrite) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden: You do not have write access to this folder.' }), { status: 403 });
    }

    try {
        const newAsset = await prisma.asset.create({
            data: validation.data,
        });
        return new NextResponse(JSON.stringify(newAsset), { status: 201 });
    } catch (error) {
        console.error('Failed to create asset:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create asset' }), { status: 500 });
    }
}
