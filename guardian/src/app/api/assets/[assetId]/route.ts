import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { AssetType } from '@prisma/client';

const updateAssetSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    type: z.nativeEnum(AssetType).optional(),
    businessValue: z.string().optional(),
    confidentiality: z.number().int().min(0).max(10).optional(),
    integrity: z.number().int().min(0).max(10).optional(),
    availability: z.number().int().min(0).max(10).optional(),
});

async function checkAssetPermissions(userId: string, assetId: string, permission: 'read' | 'write'): Promise<boolean> {
    const asset = await prisma.asset.findUnique({
        where: { id: assetId },
        select: { folderId: true },
    });

    if (!asset) {
        return false; // Asset not found
    }

    return hasPermission(userId, permission, asset.folderId);
}

/**
 * @swagger
 * /api/assets/{assetId}:
 *   get:
 *     summary: Get a specific asset by ID
 *     tags: [Assets]
 *     parameters: [{ in: 'path', name: 'assetId', required: true, schema: { type: 'string' } }]
 *     responses:
 *       200: { description: 'The asset.' }
 *       404: { description: 'Not Found.' }
 */
export async function GET(request: Request, { params }: { params: { assetId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkAssetPermissions(userId, params.assetId, 'read'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const asset = await prisma.asset.findUnique({
        where: { id: params.assetId },
    });

    return NextResponse.json(asset);
}

/**
 * @swagger
 * /api/assets/{assetId}:
 *   put:
 *     summary: Update an asset
 *     tags: [Assets]
 *     parameters: [{ in: 'path', name: 'assetId', required: true }]
 *     requestBody:
 *       required: true
 *       content: { 'application/json': { schema: { $ref: '#/components/schemas/AssetUpdate' } } }
 *     responses:
 *       200: { description: 'The updated asset.' }
 *       404: { description: 'Not Found.' }
 */
export async function PUT(request: Request, { params }: { params: { assetId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkAssetPermissions(userId, params.assetId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const body = await request.json();
    const validation = updateAssetSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const updatedAsset = await prisma.asset.update({
            where: { id: params.assetId },
            data: validation.data,
        });
        return NextResponse.json(updatedAsset);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to update asset' }), { status: 500 });
    }
}

/**
 * @swagger
 * /api/assets/{assetId}:
 *   delete:
 *     summary: Delete an asset
 *     tags: [Assets]
 *     parameters: [{ in: 'path', name: 'assetId', required: true }]
 *     responses:
 *       204: { description: 'No Content.' }
 *       404: { description: 'Not Found.' }
 */
export async function DELETE(request: Request, { params }: { params: { assetId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkAssetPermissions(userId, params.assetId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    try {
        await prisma.asset.delete({
            where: { id: params.assetId },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        // Catch foreign key constraint errors if asset is in use
        return new NextResponse(JSON.stringify({ error: 'Asset not found or is in use and cannot be deleted.' }), { status: 400 });
    }
}
