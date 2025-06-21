import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Basic check if user is authenticated
// In a real app, you'd check for specific roles/permissions to manage matrices
async function hasAdminRights(userId: string): Promise<boolean> {
    // This is a simplified check. A real implementation would query the user's role.
    // For now, we assume any authenticated user can manage matrices for simplicity.
    return !!userId;
}

/**
 * @swagger
 * /api/risk-matrices:
 *   get:
 *     summary: Retrieve all risk matrices
 *     tags:
 *       - RiskMatrices
 *     responses:
 *       200:
 *         description: A list of risk matrices.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const matrices = await prisma.riskMatrix.findMany({
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(matrices);
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

const createMatrixSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    probability: z.array(scaleItemSchema).min(1, 'Probability scale is required'),
    impact: z.array(scaleItemSchema).min(1, 'Impact scale is required'),
    levels: z.array(levelItemSchema).min(1, 'Risk levels are required'),
});

/**
 * @swagger
 * /api/risk-matrices:
 *   post:
 *     summary: Create a new risk matrix
 *     tags:
 *       - RiskMatrices
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: {
 *             $ref: '#/components/schemas/RiskMatrixCreate'
 *           }
 *     responses:
 *       201:
 *         description: The created risk matrix.
 *       400: 
 *         description: Bad Request.
 *       403: 
 *         description: Forbidden.
 */
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Simplified permission check
    const canCreate = await hasAdminRights(userId);
    if (!canCreate) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const body = await request.json();
    const validation = createMatrixSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const newMatrix = await prisma.riskMatrix.create({
            data: validation.data,
        });
        return new NextResponse(JSON.stringify(newMatrix), { status: 201 });
    } catch (error) {
        console.error('Failed to create risk matrix:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create risk matrix' }), { status: 500 });
    }
}
