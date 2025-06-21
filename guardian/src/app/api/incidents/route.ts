import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAccessibleFolders, hasPermission } from '@/lib/rbac';
import { Prisma } from '@prisma/client';

// Zod schema for creating an incident
const createIncidentSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().optional(),
    status: z.string().min(1, 'Status is required.'),
    severity: z.string().min(1, 'Severity is required.'),
    priority: z.string().optional(),
    category: z.string().min(1, 'Category is required.'),
    detectedAt: z.string().datetime().optional(),
    ownerId: z.string().uuid().optional(),
    folderId: z.string().uuid('Valid folderId is required.'),
});

// Zod schema for query parameters on GET
const getIncidentsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.string().default('detectedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    status: z.string().optional(),
    category: z.string().optional(),
    severity: z.string().optional(),
    priority: z.string().optional(),
    ownerId: z.string().uuid().optional(),
    search: z.string().optional(),
});


// GET /api/incidents - List incidents with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const queryParams = Object.fromEntries(request.nextUrl.searchParams.entries());
        const validation = getIncidentsSchema.safeParse(queryParams);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { page, limit, sortBy, sortOrder, status, category, severity, priority, ownerId, search } = validation.data;

        const accessibleFolderIds = await getAccessibleFolders(userId);
        if (accessibleFolderIds.length === 0) {
            return NextResponse.json({
                data: [],
                pagination: { page, limit, total: 0, totalPages: 1 },
            });
        }

        const where: Prisma.IncidentWhereInput = {
            folderId: { in: accessibleFolderIds },
        };

        if (status) where.status = status;
        if (category) where.category = category;
        if (severity) where.severity = severity;
        if (priority) where.priority = priority;
        if (ownerId) where.ownerId = ownerId;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { incidentId: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [incidents, total] = await prisma.$transaction([
            prisma.incident.findMany({
                where,
                include: {
                    folder: { select: { id: true, name: true, path: true } },
                    owner: { select: { id: true, name: true, avatarUrl: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.incident.count({ where }),
        ]);

        await prisma.changeLog.create({
            data: {
                entityType: 'Incident',
                entityId: 'LIST',
                fieldName: 'VIEW_LIST',
                changedById: userId,
                newValue: JSON.stringify({ page, limit, filters: { status, category, severity, priority, ownerId, search } })
            }
        });

        return NextResponse.json({
            data: incidents,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (e: unknown) {
        console.error('[INCIDENTS_GET]', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}


// POST /api/incidents - Create a new incident
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = createIncidentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { folderId, ...data } = validation.data;

        const canWrite = await hasPermission(userId, 'write', folderId);
        if (!canWrite) {
            return NextResponse.json({ error: 'Forbidden: You do not have permission to create an incident in this folder.' }, { status: 403 });
        }
        
        // Generate a unique, human-readable incident ID
        const incidentCount = await prisma.incident.count();
        const incidentId = `INC-${new Date().getFullYear()}-${(incidentCount + 1).toString().padStart(4, '0')}`;

        const newIncident = await prisma.incident.create({
            data: {
                ...data,
                incidentId: incidentId,
                folderId: folderId,
                ownerId: data.ownerId || userId, // Default to creator if no owner is specified
            },
            include: {
                folder: { select: { id: true, name: true } },
                owner: { select: { id: true, name: true } },
            }
        });

        await prisma.changeLog.create({
            data: {
                entityType: 'Incident',
                entityId: newIncident.id,
                fieldName: 'CREATE',
                newValue: JSON.stringify(newIncident),
                changedById: userId,
            },
        });

        return NextResponse.json(newIncident, { status: 201 });

    } catch (e: unknown) {
        console.error('[INCIDENT_POST]', e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma errors, e.g., foreign key constraint
            if (e.code === 'P2003') {
                return NextResponse.json({ error: `Invalid input: The specified ${e.meta?.field_name} does not exist.` }, { status: 400 });
            }
        }
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}