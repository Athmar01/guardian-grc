import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { AssessmentStatus, UserRole, RiskLevel } from '@prisma/client';
import { riskAssessmentService } from '@/lib/services/risk-assessment.service';
import { ApiError } from '@/lib/api/error';
import { getRoleFromUser } from '@/lib/auth';

// Type guard for error response
function isErrorResponse<T>(
  response: SuccessResponse<T> | ErrorResponse
): response is ErrorResponse {
  return 'error' in response && response.error !== undefined;
}

// Type for successful response
interface SuccessResponse<T> {
  riskAssessment: T;
  error?: never;
}

// Type for error response
interface ErrorResponse {
  error: Error | ApiError;
  riskAssessment?: never;
}

// Map auth roles to Prisma UserRole
const mapToPrismaRole = (role: string): UserRole => {
  switch (role) {
    case 'ADMIN': return UserRole.ORG_ADMIN;
    case 'RISK_MANAGER': return UserRole.GRC_MANAGER;
    case 'AUDITOR': return UserRole.AUDITOR;
    case 'COMPLIANCE_OFFICER': return UserRole.CONTROL_OWNER;
    default: return UserRole.VIEWER;
  }
};

// Type definitions for risk assessment response
type RiskAssessmentResponse = {
  id: string;
  riskId: string;
  assessmentDate: Date;
  assessedById: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  notes: string | null;
  metadata: any;
  risk: {
    id: string;
    title: string;
    description: string | null;
  };
  assessedBy: {
    id: string;
    name: string | null;
    email: string;
  };
  scenarios: Array<{
    id: string;
    name: string;
    description: string | null;
    likelihoodScore: number;
    impactScore: number;
    riskScore: number;
    riskLevel: RiskLevel;
    threatSource: string | null;
    threatEvent: string | null;
    vulnerability: string | null;
  }>;
};

// Type for risk assessment with risk details
type RiskAssessmentWithRisk = RiskAssessmentResponse & {
  risk: {
    id: string;
    title: string;
    description: string | null;
    folderId: string;
  };
};

/**
 * Check user permissions and get risk assessment
 */
async function checkPermissionsAndGetAssessment(
  userId: string,
  id: string,
  permission: 'read' | 'write' | 'delete'
): Promise<SuccessResponse<RiskAssessmentWithRisk> | ErrorResponse> {
  try {
    // First check if user has permission to access this assessment
    const userRole = await getRoleFromUser(userId);
    const hasAccess = await hasPermission(userRole, `risk_assessment:${permission}`);
    
    if (!hasAccess) {
      return {
        error: new ApiError('Forbidden', 'You do not have permission to access this resource', 403)
      };
    }

    // Get the assessment with related data
    const riskAssessment = await prisma.riskAssessment.findUnique({
      where: { id },
      include: {
        risk: {
          select: {
            id: true,
            title: true,
            description: true,
            folderId: true
          }
        },
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        scenarios: true
      }
    });

    if (!riskAssessment) {
      return { 
        error: new ApiError('Not Found', 'Risk Assessment not found', 404)
      };
    }

    return { riskAssessment };
  } catch (error) {
    console.error('Error in checkPermissionsAndGetAssessment:', error);
    return {
      error: new ApiError('Internal Server Error', 'An error occurred while fetching the risk assessment', 500)
    };
  }
}

// GET /api/risk-assessments/[id] - Get a specific risk assessment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = params;
  
  try {
    const result = await checkPermissionsAndGetAssessment(userId, id, 'read');
    
    if (isErrorResponse(result)) {
      const error = result.error;
      return NextResponse.json(
        { error: error instanceof ApiError ? error.message : 'An error occurred' },
        { status: error instanceof ApiError ? error.statusCode : 500 }
      );
    }

    return NextResponse.json(result.riskAssessment);
  } catch (error) {
    console.error('Error in GET /api/risk-assessments/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/risk-assessments/[id] - Update a risk assessment
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = params;
  
  try {
    // Check permissions
    const permissionResult = await checkPermissionsAndGetAssessment(userId, id, 'write');
    if (isErrorResponse(permissionResult)) {
      const error = permissionResult.error;
      return NextResponse.json(
        { error: error instanceof ApiError ? error.message : 'An error occurred' },
        { status: error instanceof ApiError ? error.statusCode : 500 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    
    const schema = z.object({
      assessmentDate: z.string().datetime().optional(),
      likelihood: z.number().min(1).max(5).optional(),
      impact: z.number().min(1).max(5).optional(),
      notes: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    });

    const data = schema.parse(body);
    const userRole = await getRoleFromUser(userId);
    const prismaRole = mapToPrismaRole(userRole);
    
    // Prepare update data
    const updateData: any = {
      ...data,
      updatedById: userId,
    };
    
    // Convert string date to Date object if present
    if (updateData.assessmentDate) {
      updateData.assessmentDate = new Date(updateData.assessmentDate);
    }
    
    // Update the risk assessment
    const updatedAssessment = await riskAssessmentService.updateRiskAssessment(
      id, 
      updateData, 
      userId, 
      prismaRole
    );

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating risk assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/risk-assessments/[id] - Delete a risk assessment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = params;
  
  try {
    // Check permissions
    const permissionResult = await checkPermissionsAndGetAssessment(userId, id, 'delete');
    if (isErrorResponse(permissionResult)) {
      const error = permissionResult.error;
      return NextResponse.json(
        { error: error instanceof ApiError ? error.message : 'An error occurred' },
        { status: error instanceof ApiError ? error.statusCode : 500 }
      );
    }

    // Delete the risk assessment
    await riskAssessmentService.deleteRiskAssessment(id, userId);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting risk assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
