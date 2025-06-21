import { NextResponse } from 'next/server';
import { z } from 'zod';
import { riskService } from '@/lib/services/risk.service';
import { withErrorHandling } from '@/middleware/error-handler';
import { withAuth } from '@/middleware/auth';
import { UserRole } from '@prisma/client';
import { successResponse, validationErrorResponse } from '@/lib/api/response';

// GET /api/risks - List risks with filtering and pagination
export const GET = withErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;
  const severity = searchParams.get('severity') || undefined;
  const category = searchParams.get('category') || undefined;
  const ownerId = searchParams.get('ownerId') || undefined;
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return validationErrorResponse({ organizationId: 'Organization ID is required' });
  }

  const result = await riskService.listRisks({
    organizationId,
    page,
    limit,
    search,
    status: status ? [status as any] : undefined,
    severity: severity ? [severity as any] : undefined,
    ownerId,
  });

  return successResponse(result.data, {
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
    totalPages: result.meta.totalPages,
  });
});

// POST /api/risks - Create a new risk
export const POST = withErrorHandling(withAuth(async (request: Request) => {
  const authUser = (request as any).user;
  const data = await request.json();
  
  const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    status: z.enum(['OPEN', 'IN_REVIEW', 'MITIGATING', 'CLOSED'] as const),
    severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const),
    impact: z.number().min(1).max(5),
    likelihood: z.number().min(1).max(5),
    ownerId: z.string().optional(),
    organizationId: z.string().min(1, 'Organization ID is required'),
    controls: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  });

  const validation = schema.safeParse(data);
  if (!validation.success) {
    return validationErrorResponse(validation.error.errors);
  }

  const risk = await riskService.createRisk({
    ...validation.data,
    createdById: authUser.id,
  });

  return successResponse(risk, undefined, 201);
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER]));

// PATCH /api/risks/:id - Update a risk
export const PATCH = withErrorHandling(withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const authUser = (request as any).user;
  const riskId = params.id;
  const data = await request.json();
  
  const schema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required').optional(),
    status: z.enum(['OPEN', 'IN_REVIEW', 'MITIGATING', 'CLOSED'] as const).optional(),
    severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).optional(),
    impact: z.number().min(1).max(5).optional(),
    likelihood: z.number().min(1).max(5).optional(),
    ownerId: z.string().optional(),
    controls: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  });

  const validation = schema.safeParse(data);
  if (!validation.success) {
    return validationErrorResponse(validation.error.errors);
  }

  const risk = await riskService.updateRisk(riskId, {
    ...validation.data,
    updatedById: authUser.id,
  });

  return successResponse(risk);
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER]));

// DELETE /api/risks/:id - Delete a risk
export const DELETE = withErrorHandling(withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const authUser = (request as any).user;
  const riskId = params.id;
  
  await riskService.deleteRisk(riskId, authUser.id);
  
  return successResponse({ success: true });
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER]));