import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAccessibleFolders, hasPermission } from '@/lib/rbac';
import { Prisma } from '@prisma/client';

const frameworkListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  status: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  complianceLevel: z.string().optional(),
  ownerUserId: z.string().uuid().optional(),
  search: z.string().optional(),
  folderId: z.string().uuid().optional(),
});

const createFrameworkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  version: z.string().min(1, 'Version is required'),
  description: z.string().optional(),
  folderId: z.string().uuid('Folder ID is required'),
  urn: z.string().optional(),
  metadata: z.object({
    type: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    authority: z.string().optional(),
    tags: z.array(z.string()).optional(),
    complianceLevel: z.string().optional(),
    owner: z.object({ userId: z.string(), userEmail: z.string() }).optional(),
  }).optional().default({}),
});

// GET /api/compliance - List compliance frameworks
export async function GET(request: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = frameworkListQuerySchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { page, limit, sortBy, sortOrder, status, category, type, complianceLevel, ownerUserId, search, folderId } = validation.data;

    const accessibleFolderIds = await getAccessibleFolders(currentUserId);
    
    const whereConditions: Prisma.FrameworkWhereInput[] = [];

    if (folderId) {
      if (!accessibleFolderIds.includes(folderId)) {
         return NextResponse.json({ error: 'Forbidden: Access to specified folder denied.' }, { status: 403 });
      }
      whereConditions.push({ folderId: folderId });
    } else {
      if (accessibleFolderIds.length === 0) {
        return NextResponse.json({ data: [], pagination: { total: 0, page, limit, totalPages: 0 } });
      }
      whereConditions.push({ folderId: { in: accessibleFolderIds } });
    }

    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { metadata: { path: ['authority'], string_contains: search } },
          { metadata: { path: ['tags'], array_contains: search } },
        ],
      });
    }
    
    if (status) whereConditions.push({ metadata: { path: ['status'], equals: status } });
    if (category) whereConditions.push({ metadata: { path: ['category'], equals: category } });
    if (type) whereConditions.push({ metadata: { path: ['type'], equals: type } });
    if (complianceLevel) whereConditions.push({ metadata: { path: ['complianceLevel'], equals: complianceLevel } });
    if (ownerUserId) whereConditions.push({ metadata: { path: ['owner', 'userId'], equals: ownerUserId } });

    const finalWhere: Prisma.FrameworkWhereInput = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const [frameworks, total] = await prisma.$transaction([
        prisma.framework.findMany({
            where: finalWhere,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: { Folder: { select: { id: true, name: true } } },
        }),
        prisma.framework.count({ where: finalWhere })
    ]);
    
    const totalPages = Math.ceil(total / limit);

    await prisma.changeLog.create({
      data: {
        entityType: 'Framework',
        entityId: 'LIST',
        fieldName: 'VIEW_LIST',
        newValue: JSON.stringify({ page, limit, sortBy, sortOrder, filters: { status, category, type, search, folderId } }),
        changedById: currentUserId,
      },
    });

    return NextResponse.json({
      data: frameworks,
      pagination: { page, limit, total, totalPages },
    });

  } catch (e: unknown) {
    console.error('Error fetching frameworks:', e);
    let errorMessage = 'An unknown error occurred while fetching frameworks.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/compliance - Create new compliance framework
export async function POST(request: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();
    const user = await currentUser();

    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createFrameworkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { name, version, description, folderId, urn, metadata } = validation.data;

    const canWrite = await hasPermission(currentUserId, 'write', folderId);
    if (!canWrite) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to create content in this folder.' }, { status: 403 });
    }

    const ownerInfo = metadata?.owner || {
        userId: currentUserId,
        userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown@example.com',
    };
    const finalMetadata = {
        ...metadata,
        owner: ownerInfo,
    };

    const newFramework = await prisma.$transaction(async (tx) => {
        const framework = await tx.framework.create({
            data: {
                name,
                version,
                description,
                folderId,
                urn: urn || `${name.toLowerCase().replace(/\s+/g, '-')}-${version}-${Date.now()}`,
                metadata: finalMetadata as Prisma.InputJsonValue, 
            },
            include: { Folder: { select: { id: true, name: true } } },
        });

        await tx.changeLog.create({
            data: {
                entityType: 'Framework',
                entityId: framework.id,
                fieldName: 'CREATE',
                newValue: JSON.stringify(framework),
                changedById: currentUserId,
            },
        });

        return framework;
    });

    return NextResponse.json(newFramework, { status: 201 });

  } catch (e: unknown) {
    console.error('Error creating framework:', e);
    let errorMessage = 'An unknown error occurred while creating the framework.';
    let statusCode = 500;

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        const target = e.meta?.target as string[] | undefined;
        errorMessage = `Failed to create framework: A framework with the URN '${target?.join(', ') || 'unique field'}' already exists.`;
        statusCode = 409;
      } else {
        errorMessage = `Prisma Error (${e.code}): An error occurred while processing your request.`;
      }
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
