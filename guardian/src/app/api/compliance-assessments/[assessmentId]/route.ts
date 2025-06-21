import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { AssessmentStatus } from '@prisma/client';

const updateAssessmentSchema = z.object({
    name: z.string().min(1, 'Assessment name is required').optional(),
    status: z.nativeEnum(AssessmentStatus).optional(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
});

async function checkPermissions(userId: string, assessmentId: string, permission: 'read' | 'write'): Promise<boolean> {
    const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
        select: { folderId: true },
    });
    if (!assessment) return false;
    return hasPermission(userId, permission, assessment.folderId);
}

/**
 * @swagger
 * /api/compliance-assessments/{assessmentId}:
 *   get:
 *     summary: Get a specific compliance assessment by ID
 *     tags: [ComplianceAssessments]
 *     parameters: [{ in: 'path', name: 'assessmentId', required: true }]
 *     responses:
 *       200: { description: 'The compliance assessment.' }
 *       404: { description: 'Not Found.' }
 */
export async function GET(request: Request, { params }: { params: { assessmentId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkPermissions(userId, params.assessmentId, 'read'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const assessment = await prisma.assessment.findUnique({
        where: { id: params.assessmentId, type: 'COMPLIANCE' },
        include: {
            folder: { select: { name: true, path: true } },
            complianceAssessment: {
                include: {
                    framework: {
                        include: { referenceControls: { orderBy: { ref_id: 'asc' } } }
                    }
                }
            }
        }
    });

    if (!assessment) {
        return new NextResponse(JSON.stringify({ error: 'Compliance Assessment not found' }), { status: 404 });
    }

    return NextResponse.json(assessment);
}

/**
 * @swagger
 * /api/compliance-assessments/{assessmentId}:
 *   put:
 *     summary: Update a compliance assessment
 *     tags: [ComplianceAssessments]
 *     parameters: [{ in: 'path', name: 'assessmentId', required: true }]
 *     requestBody:
 *       required: true
 *       content: { 'application/json': { schema: { $ref: '#/components/schemas/ComplianceAssessmentUpdate' } } }
 *     responses:
 *       200: { description: 'The updated assessment.' }
 *       404: { description: 'Not Found.' }
 */
export async function PUT(request: Request, { params }: { params: { assessmentId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkPermissions(userId, params.assessmentId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const body = await request.json();
    const validation = updateAssessmentSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const updatedAssessment = await prisma.assessment.update({
            where: { id: params.assessmentId },
            data: validation.data,
        });
        return NextResponse.json(updatedAssessment);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to update assessment' }), { status: 500 });
    }
}

/**
 * @swagger
 * /api/compliance-assessments/{assessmentId}:
 *   delete:
 *     summary: Delete a compliance assessment
 *     tags: [ComplianceAssessments]
 *     parameters: [{ in: 'path', name: 'assessmentId', required: true }]
 *     responses:
 *       204: { description: 'No Content.' }
 *       404: { description: 'Not Found.' }
 */
export async function DELETE(request: Request, { params }: { params: { assessmentId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkPermissions(userId, params.assessmentId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    try {
        await prisma.assessment.delete({
            where: { id: params.assessmentId },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to delete assessment' }), { status: 500 });
    }
}
