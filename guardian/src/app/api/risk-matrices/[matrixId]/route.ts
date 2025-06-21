import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Simplified permission check for admin rights
async function hasAdminRights(userId: string): Promise<boolean> {
    return !!userId; // Assume any authenticated user can manage for now
}

const scaleItemSchema = z.object({
    name: z.string(),
    value: z.number(),
    description: z.string(),
});

const levelItemSchema = z.object({
    name: z.string(),
    color: z.string(),
    range: z.tuple([z.number(), z.number()]),
});

const updateMatrixSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    probability: z.array(scaleItemSchema).min(1, 'Probability scale is required').optional(),
    impact: z.array(scaleItemSchema).min(1, 'Impact scale is required').optional(),
    levels: z.array(levelItemSchema).min(1, 'Risk levels are required').optional(),
});

/**
 * @swagger
 * /api/risk-matrices/{matrixId}:
 *   get:
 *     summary: Get a specific risk matrix by ID
 *     tags: [RiskMatrices]
 *     parameters:
 *       - in: path
 *         name: matrixId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The risk matrix.
 *       404:
 *         description: Not Found.
 */
export async function GET(request: Request, { params }: { params: { matrixId: string } }) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const matrix = await prisma.riskMatrix.findUnique({
        where: { id: params.matrixId },
    });

    if (!matrix) {
        return new NextResponse(JSON.stringify({ error: 'Risk Matrix not found' }), { status: 404 });
    }

    return NextResponse.json(matrix);
}

/**
 * @swagger
 * /api/risk-matrices/{matrixId}:
 *   put:
 *     summary: Update a risk matrix
 *     tags: [RiskMatrices]
 *     parameters:
 *       - in: path
 *         name: matrixId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RiskMatrixUpdate' }
 *     responses:
 *       200:
 *         description: The updated risk matrix.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Not Found.
 */
export async function PUT(request: Request, { params }: { params: { matrixId: string } }) {
    const { userId } = await auth();
    if (!userId || !await hasAdminRights(userId)) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const body = await request.json();
    const validation = updateMatrixSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const updatedMatrix = await prisma.riskMatrix.update({
            where: { id: params.matrixId },
            data: validation.data,
        });
        return NextResponse.json(updatedMatrix);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Risk Matrix not found' }), { status: 404 });
    }
}

/**
 * @swagger
 * /api/risk-matrices/{matrixId}:
 *   delete:
 *     summary: Delete a risk matrix
 *     tags: [RiskMatrices]
 *     parameters:
 *       - in: path
 *         name: matrixId
 *         required: true
 *     responses:
 *       204:
 *         description: No Content.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Not Found.
 */
export async function DELETE(request: Request, { params }: { params: { matrixId: string } }) {
    const { userId } = await auth();
    if (!userId || !await hasAdminRights(userId)) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    try {
        await prisma.riskMatrix.delete({
            where: { id: params.matrixId },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Risk Matrix not found or in use' }), { status: 404 });
    }
}
