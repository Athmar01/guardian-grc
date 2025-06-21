import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Prisma, PrismaClientKnownRequestError } from '@prisma/client';
import { getCache, deleteCache } from '@/lib/cache';
import { z } from 'zod';

const commitSchema = z.object({
    validationToken: z.string().uuid(),
});

/**
 * @swagger
 * /api/risks/import/commit:
 *   post:
 *     summary: Commit a validated risk import
 *     tags:
 *       - Risks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validationToken: { type: 'string' }
 *     responses:
 *       200:
 *         description: Import committed successfully.
 *       400:
 *         description: Invalid or expired token.
 */
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = commitSchema.safeParse(body);

        if (!validation.success) {
            return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
        }

        const { validationToken } = validation.data;
        const cachedData = getCache<{ toCreate: any[], toUpdate: any[] }>(validationToken);

        if (!cachedData) {
            return new NextResponse(JSON.stringify({ error: 'Invalid or expired validation token.' }), { status: 400 });
        }

        const { toCreate, toUpdate } = cachedData;

        const results = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const createdRisks = [];
            for (const item of toCreate) {
                const newAssessment = await tx.assessment.create({
                    data: {
                        name: item.Name,
                        description: item.Description,
                        folderId: item.folderId,
                        type: 'RISK',
                        authorId: userId,
                    },
                });
                const newRisk = await tx.riskAssessment.create({
                    data: {
                        assessmentId: newAssessment.id,
                        status: item.Status,
                        matrixId: item.matrixId,
                    },
                });
                createdRisks.push(newRisk);
            }

            const updatedRisks = [];
            for (const item of toUpdate) {
                const updatedRisk = await tx.riskAssessment.update({
                    where: { id: item['Risk ID'] },
                    data: {
                        status: item.Status,
                        matrixId: item.matrixId,
                        assessment: {
                            update: {
                                name: item.Name,
                                description: item.Description,
                                folderId: item.folderId,
                            },
                        },
                    },
                });
                updatedRisks.push(updatedRisk);
            }

            return { createdCount: createdRisks.length, updatedCount: updatedRisks.length };
        });

        // Invalidate the token after use
        deleteCache(validationToken);

        return NextResponse.json({
            message: 'Import committed successfully.',
            ...results,
        });

    } catch (error: unknown) {
        console.error('Import commit error:', error);
                if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') { // Record to update not found
                return new NextResponse(JSON.stringify({ error: 'One or more risks to update could not be found. Please re-validate your file.' }), { status: 400 });
            }
        }
        return new NextResponse(JSON.stringify({ error: 'An unexpected error occurred during commit.' }), { status: 500 });
    }
}
