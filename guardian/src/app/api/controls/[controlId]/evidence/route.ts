import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';

const createEvidenceSchema = z.object({
    name: z.string().min(1, 'Evidence name is required'),
    description: z.string().optional(),
    type: z.string().min(1, 'Evidence type is required'), // e.g., document, link, screenshot
    externalUrl: z.string().url('Must be a valid URL').optional(),
});

async function checkControlPermissions(userId: string, controlId: string, permission: 'read' | 'write'): Promise<boolean> {
    const control = await prisma.control.findUnique({
        where: { id: controlId },
        select: { folderId: true },
    });
    if (!control) return false;
    return hasPermission(userId, permission, control.folderId);
}

/**
 * @swagger
 * /api/controls/{controlId}/evidence:
 *   get:
 *     summary: Retrieve all evidence for a specific control
 *     tags: [Evidence, Controls]
 *     parameters: [{ in: 'path', name: 'controlId', required: true }]
 *     responses:
 *       200: { description: 'A list of evidence.' }
 *       404: { description: 'Control not found.' }
 */
export async function GET(request: Request, { params }: { params: { controlId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkControlPermissions(userId, params.controlId, 'read'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const controlWithEvidence = await prisma.control.findUnique({
        where: { id: params.controlId },
        include: { evidences: { orderBy: { createdAt: 'desc' } } },
    });

    return NextResponse.json(controlWithEvidence?.evidences || []);
}

/**
 * @swagger
 * /api/controls/{controlId}/evidence:
 *   post:
 *     summary: Create and link new evidence to a control
 *     tags: [Evidence, Controls]
 *     parameters: [{ in: 'path', name: 'controlId', required: true }]
 *     requestBody:
 *       required: true
 *       content: { 'application/json': { schema: { $ref: '#/components/schemas/EvidenceCreate' } } }
 *     responses:
 *       201: { description: 'The created evidence.' }
 *       403: { description: 'Forbidden.' }
 */
export async function POST(request: Request, { params }: { params: { controlId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkControlPermissions(userId, params.controlId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const body = await request.json();
    const validation = createEvidenceSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const newEvidence = await prisma.evidence.create({
            data: {
                ...validation.data,
                controls: {
                    connect: { id: params.controlId },
                },
            },
        });
        return new NextResponse(JSON.stringify(newEvidence), { status: 201 });
    } catch (error) {
        console.error('Failed to create evidence:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create evidence' }), { status: 500 });
    }
}
