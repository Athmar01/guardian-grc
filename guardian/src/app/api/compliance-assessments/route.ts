import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAccessibleFolders, hasPermission } from '@/lib/rbac';
import { AssessmentType, AssessmentStatus } from '@prisma/client';

const createAssessmentSchema = z.object({
    name: z.string().min(1, 'Assessment name is required'),
    folderId: z.string().uuid('A folder scope is required'),
    frameworkId: z.string().uuid('A framework is required'),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

/**
 * @swagger
 * /api/compliance-assessments:
 *   get:
 *     summary: Retrieve all accessible compliance assessments
 *     tags: [ComplianceAssessments]
 *     responses:
 *       200: { description: 'A list of compliance assessments.' }
 */
export async function GET(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const accessibleFolderIds = await getAccessibleFolders(userId, 'read');

    const assessments = await prisma.assessment.findMany({
        where: {
            type: 'COMPLIANCE',
            folderId: { in: accessibleFolderIds },
        },
        include: {
            folder: { select: { name: true } },
            complianceAssessment: { include: { framework: { select: { name: true, version: true } } } },
        },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(assessments);
}

/**
 * @swagger
 * /api/compliance-assessments:
 *   post:
 *     summary: Create a new compliance assessment
 *     tags: [ComplianceAssessments]
 *     requestBody:
 *       required: true
 *       content: { 'application/json': { schema: { $ref: '#/components/schemas/ComplianceAssessmentCreate' } } }
 *     responses:
 *       201: { description: 'The created assessment.' }
 *       403: { description: 'Forbidden.' }
 */
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const validation = createAssessmentSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    const { folderId, frameworkId, name, startDate, endDate } = validation.data;
    const canWrite = await hasPermission(userId, 'write', folderId);

    if (!canWrite) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden: You do not have write access to this folder.' }), { status: 403 });
    }

    try {
        const newAssessment = await prisma.assessment.create({
            data: {
                name,
                folderId,
                type: AssessmentType.COMPLIANCE,
                status: AssessmentStatus.PLANNED,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                complianceAssessment: {
                    create: {
                        frameworkId: frameworkId,
                    },
                },
            },
            include: {
                complianceAssessment: true,
            },
        });

        return new NextResponse(JSON.stringify(newAssessment), { status: 201 });
    } catch (error) {
        console.error('Failed to create compliance assessment:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create assessment' }), { status: 500 });
    }
}
