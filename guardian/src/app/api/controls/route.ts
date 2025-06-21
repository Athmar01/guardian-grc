import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { ControlStatus } from '@prisma/client';

// Zod schema for creating a control
const createControlSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  controlId: z.string().min(1, 'Control ID is required'),
  folderId: z.string().uuid('Invalid Folder ID'),
  family: z.string().optional(),
  status: z.nativeEnum(ControlStatus).optional(),
  effectiveness: z.number().int().min(0).max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validation = createControlSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(JSON.stringify({ error: 'Invalid input', details: validation.error.formErrors }), { status: 400 });
    }

    const { name, description, controlId, folderId, family, status, effectiveness } = validation.data;

    // TODO: Check if user has access to the folder

    const newControl = await prisma.control.create({
      data: {
        name,
        description,
        controlId,
        folderId,
        family,
        status,
        effectiveness,
        ownerId: userId,
      },
    });

    return NextResponse.json(newControl, { status: 201 });
  } catch (error) {
    console.error('[CONTROLS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const folderId = searchParams.get('folderId');

        if (!folderId) {
            return new NextResponse(JSON.stringify({ error: 'folderId is required' }), { status: 400 });
        }

        // TODO: Verify user has access to this folderId

        const controls = await prisma.control.findMany({
            where: {
                folderId: folderId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(controls);
    } catch (error) {
        console.error('[CONTROLS_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
