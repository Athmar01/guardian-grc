import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/middleware/error-handler';
import { withAuth } from '@/middleware/auth';
import { UserRole, TreatmentStatus, TreatmentType, RiskStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { successResponse, validationErrorResponse } from '@/lib/api/response';
import { ApiError, NotFoundError } from '@/lib/api/error';
import { riskService } from '@/lib/services/risk.service';
import { z } from 'zod';

declare module 'next/server' {
  interface NextRequest {
    user?: {
      id: string;
      role: UserRole;
      organizationId: string | null;
    };
  }
}

type RequestHandler = (
  req: NextRequest, 
  context: { params: { id: string; treatmentId: string } }
) => Promise<NextResponse>;

const withRoleCheck = (handler: RequestHandler, allowedRoles: UserRole[]): typeof handler => {
  // First wrap with auth (which handles role checking)
  const authedHandler = withAuth(
    async (req: NextRequest, context: { params: { id: string; treatmentId: string } }) => {
      // If we get here, the user is authenticated and has one of the allowed roles
      return handler(req, context);
    },
    allowedRoles // Pass allowedRoles as the second parameter to withAuth
  );
  
  // Then wrap with error handling
  return withErrorHandling(authedHandler);
};

// GET /api/risks/[id]/treatments/[treatmentId] - Get a specific treatment
const GET = withRoleCheck(async (req: NextRequest, { params }: { params: { id: string; treatmentId: string } }) => {
  const user = req.user!;
  const { id: riskId, treatmentId } = params;
  
  if (!user.organizationId) {
    throw new ApiError(400, 'User is not associated with an organization');
  }
  
  try {
    // Verify risk exists and user has access
    const risk = await riskService.getRiskById(riskId, user.organizationId!);
    if (!risk) {
      throw new NotFoundError('Risk', riskId);
    }
    
    // Get the treatment
    const treatment = await prisma.riskTreatment.findUnique({
      where: { 
        id: treatmentId,
        riskId,
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
      },
    });
    
    if (!treatment) {
      throw new NotFoundError('Risk treatment', treatmentId);
    }
    
    return successResponse({ data: treatment });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error fetching risk treatment:', error);
    throw new ApiError(500, 'Failed to fetch risk treatment');
  }
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER, UserRole.CONTROL_OWNER]);

// PATCH /api/risks/[id]/treatments/[treatmentId] - Update a treatment
const PATCH = withRoleCheck(async (req: NextRequest, { params }: { params: { id: string; treatmentId: string } }) => {
  const user = req.user!;
  const { id: riskId, treatmentId } = params;
  
  if (!user.organizationId) {
    throw new ApiError(400, 'User is not associated with an organization');
  }
  
  // Validate request body
  const schema = z.object({
    type: z.nativeEnum(TreatmentType).optional(),
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
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
    // Verify risk exists and user has access
    const risk = await riskService.getRiskById(riskId, user.organizationId!);
    if (!risk) {
      throw new NotFoundError('Risk', riskId);
    }
    
    // Check if treatment exists
    const existingTreatment = await prisma.riskTreatment.findUnique({
      where: { 
        id: treatmentId,
        riskId,
      },
    });
    
    if (!existingTreatment) {
      throw new NotFoundError('Risk treatment', treatmentId);
    }
    
    // Prepare update data
    const updateData: any = {
      ...validation.data,
      updatedById: user.id,
    };
    
    // Convert dueDate to Date if provided
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }
    
    // Update the treatment
    const updatedTreatment = await prisma.riskTreatment.update({
      where: { id: treatmentId },
      data: updateData,
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
    });
    
    // Update risk status if treatment status changed
    if (validation.data.status) {
      await updateRiskStatusBasedOnTreatments(riskId);
    }

    // TODO: Add audit logging once ChangeLog model is available in schema
    // await prisma.changeLog.create({
    //   data: {
    //     action: 'UPDATE',
    //     entityType: 'RiskTreatment',
    //     entityId: treatmentId,
    //     userId: user.id,
    //     organizationId: user.organizationId!,
    //     changes: JSON.stringify({
    //       previous: existingTreatment,
    //       updated: validation.data,
    //     }),
    //     description: `Updated risk treatment: ${updatedTreatment.title}`,
    //   },
    // });

    return successResponse({ 
      data: updatedTreatment,
      message: 'Risk treatment updated successfully'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error updating risk treatment:', error);
    throw new ApiError(500, 'Failed to update risk treatment');
  }
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER, UserRole.CONTROL_OWNER]);

// DELETE /api/risks/[id]/treatments/[treatmentId] - Delete a treatment
const DELETE = withRoleCheck(async (req: NextRequest, { params }: { params: { id: string; treatmentId: string } }) => {
  const user = req.user!;
  const { id: riskId, treatmentId } = params;
  
  if (!user.organizationId) {
    throw new ApiError(400, 'User is not associated with an organization');
  }
  
  try {
    // Verify risk exists and user has access
    const risk = await riskService.getRiskById(riskId, user.organizationId!);
    if (!risk) {
      throw new NotFoundError('Risk', riskId);
    }
    
    // Check if treatment exists
    const treatment = await prisma.riskTreatment.findUnique({
      where: { 
        id: treatmentId,
        riskId,
      },
    });
    
    if (!treatment) {
      throw new NotFoundError('Risk treatment', treatmentId);
    }
    
    // Delete the treatment
    await prisma.riskTreatment.delete({
      where: { id: treatmentId },
    });
    
    // Update risk status if needed
    await updateRiskStatusBasedOnTreatments(riskId);
    
    return successResponse({ 
      success: true,
      message: 'Risk treatment deleted successfully' 
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error deleting risk treatment:', error);
    throw new ApiError(500, 'Failed to delete risk treatment');
  }
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER]);

// Helper function to handle risk status updates based on treatments
async function updateRiskStatusBasedOnTreatments(riskId: string): Promise<void> {
  const treatments = await prisma.riskTreatment.findMany({
    where: { riskId },
  });

  if (treatments.length === 0) {
    // No treatments left, set status back to IDENTIFIED
    await prisma.risk.update({
      where: { id: riskId },
      data: { 
        status: RiskStatus.IDENTIFIED,
        updatedAt: new Date()
      },
    });
  } else if (treatments.some(t => t.status === 'IN_PROGRESS')) {
    // At least one treatment is in progress
    await prisma.risk.update({
      where: { id: riskId },
      data: { 
        status: RiskStatus.TREATING, // Using TREATING instead of IN_PROGRESS to match schema
        updatedAt: new Date()
      },
    });
  } else if (treatments.every(t => t.status === 'COMPLETED')) {
    // All treatments are completed
    await prisma.risk.update({
      where: { id: riskId },
      data: { 
        status: RiskStatus.MONITORING, // Using MONITORING instead of TREATED
        updatedAt: new Date()
      },
    });
  } else if (treatments.some(t => t.status === 'REJECTED')) {
    // At least one treatment is rejected
    await prisma.risk.update({
      where: { id: riskId },
      data: { 
        status: RiskStatus.EVALUATED, // Using EVALUATED instead of REVIEW_REQUIRED
        updatedAt: new Date()
      },
    });
  }
}

// Export the handlers
export { GET, PATCH, DELETE };
