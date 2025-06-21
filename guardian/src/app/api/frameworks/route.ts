import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Simplified permission check for admin rights
async function hasAdminRights(userId: string): Promise<boolean> {
    // In a real app, this would check for a specific 'admin' role.
    return !!userId; // Assume any authenticated user is an admin for now.
}

const createFrameworkSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    version: z.string().min(1, 'Version is required'),
    description: z.string().optional(),
    urn: z.string().min(1, 'URN is required'), // Unique Resource Name
    folderId: z.string().uuid('Invalid folder ID').optional(), // Frameworks can be global or in a folder
});

/**
 * @swagger
 * /api/frameworks:
 *   get:
 *     summary: Retrieve all frameworks
 *     tags: [Frameworks]
 *     responses:
 *       200: { description: 'A list of frameworks.' }
 */
export async function GET(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const frameworks = await prisma.framework.findMany({
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(frameworks);
}

/**
 * @swagger
 * /api/frameworks:
 *   post:
 *     summary: Create a new framework
 *     tags: [Frameworks]
 *     requestBody:
 *       required: true
 *       content: { 'application/json': { schema: { $ref: '#/components/schemas/FrameworkCreate' } } }
 *     responses:
 *       201: { description: 'The created framework.' }
 *       403: { description: 'Forbidden.' }
 */
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId || !(await hasAdminRights(userId))) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const body = await request.json();
    const validation = createFrameworkSchema.safeParse(body);

    if (!validation.success) {
        return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    try {
        const newFramework = await prisma.framework.create({
            data: validation.data,
        });
        return new NextResponse(JSON.stringify(newFramework), { status: 201 });
    } catch (error) {
        // Check for unique constraint violation on 'urn'
        if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return new NextResponse(JSON.stringify({ error: 'A framework with this URN already exists.' }), { status: 409 });
        }
        console.error('Failed to create framework:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create framework' }), { status: 500 });
    }
}
