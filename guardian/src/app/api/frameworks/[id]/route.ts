import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for updating a framework
const updateFrameworkSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  version: z.string().min(1, 'Version is required').optional(),
  description: z.string().optional(),
  urn: z.string().min(1, 'URN is required').optional(),
});

// Simplified permission check for admin rights
async function hasAdminRights(userId: string): Promise<boolean> {
  return !!userId; // Assume any authenticated user is an admin for now.
}

/**
 * @swagger
 * /api/frameworks/{id}:
 *   get:
 *     summary: Get a specific framework by ID
 *     tags: [Frameworks]
 *     parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }]
 *     responses:
 *       200: { description: 'The framework.' }
 *       401: { description: 'Unauthorized' }
 *       404: { description: 'Not Found' }
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const framework = await prisma.framework.findUnique({
      where: { id: params.id },
      include: { 
        controls: {
          orderBy: { identifier: 'asc' },
          include: {
            sourceMappings: true,
            targetMappings: true
          }
        } 
      },
    });

    if (!framework) {
      return new NextResponse(JSON.stringify({ error: 'Framework not found' }), { status: 404 });
    }

    return NextResponse.json(framework);
  } catch (error) {
    console.error('Error fetching framework:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * PUT /api/frameworks/[id]
 * Update a framework
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId || !(await hasAdminRights(userId))) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = updateFrameworkSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: validation.error.format() }),
        { status: 400 }
      );
    }

    // Check if framework exists
    const existingFramework = await prisma.framework.findUnique({
      where: { id: params.id },
    });

    if (!existingFramework) {
      return new NextResponse('Framework not found', { status: 404 });
    }

    // Check for URN conflict with other frameworks
    if (body.urn !== existingFramework.urn) {
      const urnExists = await prisma.framework.findFirst({
        where: {
          urn: body.urn,
          id: { not: params.id },
        },
      });

      if (urnExists) {
        return new NextResponse(
          JSON.stringify({ error: 'A framework with this URN already exists' }),
          { status: 409 }
        );
      }
    }

    // Update the framework
    const updatedFramework = await prisma.framework.update({
      where: { id: params.id },
      data: validation.data,
    });

    return NextResponse.json(updatedFramework);
  } catch (error) {
    console.error('Error updating framework:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * DELETE /api/frameworks/[id]
 * Delete a framework
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId || !(await hasAdminRights(userId))) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    // Check if framework exists
    const existingFramework = await prisma.framework.findUnique({
      where: { id: params.id },
      include: {
        controls: true, // Check for related controls
      },
    });

    if (!existingFramework) {
      return new NextResponse('Framework not found', { status: 404 });
    }

    // Prevent deletion if there are associated controls
    if (existingFramework.controls.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: 'Cannot delete framework with associated controls. Remove the controls first.',
        }),
        { status: 400 }
      );
    }

    // Delete the framework
    await prisma.framework.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting framework:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
