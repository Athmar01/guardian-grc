import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/middleware/error-handler';
import { withAuth } from '@/middleware/auth';
import { UserRole, TreatmentType, TreatmentStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/response';
import { ApiError } from '@/lib/api/error';
import { riskService } from '@/lib/services/risk.service';

declare module 'next/server' {
  interface NextRequest {
    user?: {
      id: string;
      role: UserRole;
      organizationId: string | null;
    };
  }
}

interface User {
  id: string;
  role: UserRole;
  organizationId: string | null;
}

type RequestHandler = (req: NextRequest, context: { params: { id: string } }) => Promise<NextResponse>;

const withRoleCheck = (handler: RequestHandler, allowedRoles: UserRole[]): typeof handler => {
  // First wrap with auth (which handles role checking)
  const authedHandler = withAuth(
    async (req: NextRequest, context: { params: { id: string } }) => {
      // If we get here, the user is authenticated and has one of the allowed roles
      return handler(req, context);
    },
    allowedRoles // Pass allowedRoles as the second parameter to withAuth
  );
  
  // Then wrap with error handling
  return withErrorHandling(authedHandler);
};

// Type for the treatment creation data
type CreateTreatmentData = {
  type: TreatmentType;
  title: string;
  description: string;
  status?: TreatmentStatus;
  assignedToId?: string | null;
  dueDate?: string | null;
  costEstimate?: number | null;
  budgetAllocated?: number | null;
  notes?: string | null;
};

// GET /api/risks/[id]/treatments - Get all treatments for a risk
const GET = withRoleCheck(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const user = req.user!;
  const riskId = params.id;
  
  if (!user.organizationId) {
    throw new ApiError(400, 'User is not associated with an organization');
  }
  
  try {
    // Get the risk to verify it exists - using organizationId from user
    if (!user.organizationId) {
      throw new ApiError(400, 'User is not associated with an organization');
    }
    
    const risk = await riskService.getRiskById(riskId, user.organizationId);
    
    // Get all treatments for this risk
    const treatments = await prisma.riskTreatment.findMany({
      where: { riskId },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        updatedBy: {
          select: { id: true, name: true, email: true }
        },
        risk: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return successResponse({ data: treatments });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error fetching risk treatments:', error);
    throw new ApiError(500, 'Failed to fetch risk treatments');
  }
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER, UserRole.CONTROL_OWNER]);

// POST /api/risks/[id]/treatments - Create a new risk treatment
const POST = withRoleCheck(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const user = req.user!;
  const riskId = params.id;
  
  if (!user.organizationId) {
    throw new ApiError(400, 'User is not associated with an organization');
  }
  
  // Validate request body
  const schema = z.object({
    type: z.nativeEnum(TreatmentType),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    status: z.nativeEnum(TreatmentStatus).optional(),
    assignedToId: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable(),
    costEstimate: z.number().optional().nullable(),
    budgetAllocated: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
  });
  
  const body = await req.json();
  const validation = schema.safeParse(body);
  
  if (!validation.success) {
    return validationErrorResponse(validation.error);
  }
  
  try {
    // Verify risk exists - using organizationId from user
    if (!user.organizationId) {
      throw new ApiError(400, 'User is not associated with an organization');
    }
    
    const risk = await riskService.getRiskById(riskId, user.organizationId);
    
    // Create the treatment data
    const treatmentData: CreateTreatmentData = {
      type: validation.data.type,
      title: validation.data.title,
      description: validation.data.description,
      status: validation.data.status || 'PLANNED',
      assignedToId: validation.data.assignedToId || null,
      dueDate: validation.data.dueDate || null,
      costEstimate: validation.data.costEstimate || null,
      budgetAllocated: validation.data.budgetAllocated || null,
      notes: validation.data.notes || null,
    };
    
    // Create the treatment
    const treatment = await prisma.riskTreatment.create({
      data: {
        type: treatmentData.type,
        title: treatmentData.title,
        description: treatmentData.description,
        status: treatmentData.status,
        assignedToId: treatmentData.assignedToId,
        dueDate: treatmentData.dueDate ? new Date(treatmentData.dueDate) : null,
        costEstimate: treatmentData.costEstimate,
        budgetAllocated: treatmentData.budgetAllocated,
        notes: treatmentData.notes,
        riskId,
        createdById: user.id,
        updatedById: user.id,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        updatedBy: {
          select: { id: true, name: true, email: true }
        },
        risk: {
          select: { id: true, title: true }
        }
      }
    });
    
    return successResponse({ 
      data: treatment,
      message: 'Risk treatment created successfully'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error creating risk treatment:', error);
    throw new ApiError(500, 'Failed to create risk treatment');
  }
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER, UserRole.CONTROL_OWNER]);

export { GET, POST };
