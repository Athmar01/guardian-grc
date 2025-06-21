import { z } from 'zod';
import { NextResponse } from 'next/server';
import { riskService } from '@/lib/services/risk.service';
import { withErrorHandling } from '@/middleware/error-handler';
import { withAuth } from '@/middleware/auth';
import { UserRole, RiskStatus } from '@prisma/client';
import { successResponse, notFoundResponse, validationErrorResponse } from '@/lib/api/response';

// Map our status strings to Prisma enum values
const statusMap: Record<string, RiskStatus> = {
  'OPEN': 'OPEN',
  'IN_REVIEW': 'IN_REVIEW',
  'MITIGATING': 'MITIGATING',
  'CLOSED': 'CLOSED'
} as const;

// Type definitions for request data
interface RiskUpdateData {
  title?: string;
  description?: string;
  category?: string;
  status?: 'OPEN' | 'IN_REVIEW' | 'MITIGATING' | 'CLOSED';
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  impact?: number;
  likelihood?: number;
  ownerId?: string;
  controls?: string[];
  tags?: string[];
}

interface RiskTreatmentData {
  treatmentType: 'MITIGATE' | 'TRANSFER' | 'ACCEPT' | 'AVOID';
  description: string;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  ownerId?: string;
  targetDate?: string;
  effectiveness?: number;
  cost?: number;
}

// GET /api/risks/:id - Get a single risk by ID
export const GET = withErrorHandling(withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const riskId = params.id;
  const risk = await riskService.getRiskById(riskId);
  
  if (!risk) {
    return notFoundResponse('Risk', riskId);
  }
  
  return successResponse(risk);
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER, UserRole.RISK_MANAGER, UserRole.USER]));

// PATCH /api/risks/:id - Update a risk
export const PATCH = withErrorHandling(withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const authUser = (request as any).user;
  const riskId = params.id;
  const data = await request.json() as RiskUpdateData;
  
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

  // Map status string to enum value if provided
  const updateData = {
    ...validation.data,
    updatedById: authUser.id,
  };

  if (updateData.status) {
    updateData.status = statusMap[updateData.status] || 'OPEN';
  }

  const risk = await riskService.updateRisk(riskId, updateData);

  return successResponse(risk);
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER]));

// DELETE /api/risks/:id - Delete a risk
export const DELETE = withErrorHandling(withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const authUser = (request as any).user;
  const riskId = params.id;
  
  await riskService.deleteRisk(riskId, authUser.id);
  
  return successResponse({ success: true });
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER]));

// GET /api/risks/:id/treatments - Get risk treatments
export async function GET_TREATMENTS(request: Request, { params }: { params: { id: string } }) {
  const riskId = params.id;
  // Use the risk service to get treatments with proper error handling
  const treatments = await riskService.getRiskById(riskId).then(risk => risk?.treatments || []);
  return successResponse(treatments);
}

// POST /api/risks/:id/treatments - Add a risk treatment
export async function POST_TREATMENT(request: Request, { params }: { params: { id: string } }) {
  const authUser = (request as any).user;
  const riskId = params.id;
  const data = await request.json() as RiskTreatmentData;
  
  const schema = z.object({
    treatmentType: z.enum(['MITIGATE', 'TRANSFER', 'ACCEPT', 'AVOID'] as const),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'] as const).optional(),
    ownerId: z.string().optional(),
    targetDate: z.string().optional(),
    effectiveness: z.number().min(0).max(100).optional(),
    cost: z.number().min(0).optional(),
  });

  const validation = schema.safeParse(data);
  if (!validation.success) {
    return validationErrorResponse(validation.error.errors);
  }

  // First get the risk to ensure it exists
  const risk = await riskService.getRiskById(riskId);
  if (!risk) {
    return notFoundResponse('Risk', riskId);
  }

  // Create treatment using the risk service
  const treatment = await riskService.createRiskTreatment({
    ...validation.data,
    riskId,
    createdById: authUser.id,
    organizationId: risk.organizationId,
  });

  return successResponse(treatment, undefined, 201);
}
