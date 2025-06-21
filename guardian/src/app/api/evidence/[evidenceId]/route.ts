import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';

const updateEvidenceSchema = z.object({
    name: z.string().min(1, 'Evidence name is required').optional(),
    description: z.string().optional(),
    type: z.string().min(1, 'Evidence type is required').optional(),
    externalUrl: z.string().url('Must be a valid URL').optional().nullable(),
});

// Checks if the user has permission for any of the controls linked to the evidence
async function checkEvidencePermissions(userId: string, evidenceId: string, permission: 'read' | 'write'): Promise<boolean> {
    const evidence = await prisma.evidence.findUnique({
        where: { id: evidenceId },
        include: { controls: { select: { folderId: true } } },
    });

    if (!evidence) return false;

    for (const control of evidence.controls) {
        if (await hasPermission(userId, permission, control.folderId)) {
            return true; // Permission granted if user has access to at least one linked control
        }
    }

    return false; // No permission found
}

/**
 * @swagger
 * /api/evidence/{evidenceId}:
 *   get:
 *     summary: Get a specific evidence item by ID
 *     tags: [Evidence]
 *     parameters: [{ in: 'path', name: 'evidenceId', required: true }]
 *     responses:
 *       200: { description: 'The evidence item.' }
 *       404: { description: 'Not Found.' }
 */
export async function GET(request: Request, { params }: { params: { evidenceId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkEvidencePermissions(userId, params.evidenceId, 'read'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const evidence = await prisma.evidence.findUnique({ where: { id: params.evidenceId } });
    return NextResponse.json(evidence);
}

/**
 * @swagger
 * /api/evidence/{evidenceId}:
 *   put:
 *     summary: Update an evidence item
 *     tags: [Evidence]
 *     parameters: [{ in: 'path', name: 'evidenceId', required: true }]
 *     requestBody:
 *       required: true
 *       content: { 'application/json': { schema: { $ref: '#/components/schemas/EvidenceUpdate' } } }
 *     responses:
 *       200: { description: 'The updated evidence.' }
 *       404: { description: 'Not Found.' }
 */
export async function PUT(request: Request, { params }: { params: { evidenceId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkEvidencePermissions(userId, params.evidenceId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const body = await request.json();
    const validation = updateEvidenceSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const updatedEvidence = await prisma.evidence.update({
            where: { id: params.evidenceId },
            data: validation.data,
        });
        return NextResponse.json(updatedEvidence);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to update evidence' }), { status: 500 });
    }
}

/**
 * @swagger
 * /api/evidence/{evidenceId}:
 *   delete:
 *     summary: Delete an evidence item
 *     tags: [Evidence]
 *     parameters: [{ in: 'path', name: 'evidenceId', required: true }]
 *     responses:
 *       204: { description: 'No Content.' }
 *       404: { description: 'Not Found.' }
 */
export async function DELETE(request: Request, { params }: { params: { evidenceId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkEvidencePermissions(userId, params.evidenceId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    try {
        await prisma.evidence.delete({ where: { id: params.evidenceId } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to delete evidence' }), { status: 500 });
    }
}
