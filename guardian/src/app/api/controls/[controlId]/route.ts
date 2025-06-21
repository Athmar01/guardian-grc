import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { ControlStatus } from '@prisma/client';

const updateControlSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    status: z.nativeEnum(ControlStatus).optional(),
    effectiveness: z.number().int().min(0).max(100).optional(),
    ownerId: z.string().uuid().optional().nullable(),
});

async function checkControlPermissions(userId: string, controlId: string, permission: 'read' | 'write'): Promise<boolean> {
    const control = await prisma.control.findUnique({
        where: { id: controlId },
        select: { folderId: true },
    });
    if (!control || !control.folderId) return false;
    return hasPermission(userId, permission, control.folderId);
}

export async function GET(request: Request, { params }: { params: { controlId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkControlPermissions(userId, params.controlId, 'read'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const control = await prisma.control.findUnique({
        where: { id: params.controlId },
        include: { owner: { select: { id: true, name: true, email: true } } },
    });

    if (!control) {
        return new NextResponse(JSON.stringify({ error: 'Control not found' }), { status: 404 });
    }

    return NextResponse.json(control);
}

export async function PUT(request: Request, { params }: { params: { controlId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkControlPermissions(userId, params.controlId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    const body = await request.json();
    const validation = updateControlSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const updatedControl = await prisma.control.update({
            where: { id: params.controlId },
            data: validation.data,
        });
        return NextResponse.json(updatedControl);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to update control' }), { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { controlId: string } }) {
    const { userId } = await auth();
    if (!userId || !(await checkControlPermissions(userId, params.controlId, 'write'))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden or Not Found' }), { status: 404 });
    }

    try {
        await prisma.control.delete({
            where: { id: params.controlId },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Control not found or is in use.' }), { status: 400 });
    }
}
