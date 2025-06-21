import { z } from 'zod';
import { RiskLevel, RiskStatus, TreatmentStatus, TreatmentType } from '@prisma/client';

// Risk validation schemas
export const riskCreateSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.string().min(2).max(100),
  impact: z.number().int().min(1).max(5),
  likelihood: z.number().int().min(1).max(5),
  ownerId: z.string().uuid().optional(),
  riskMatrixId: z.string().uuid().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
  dueDate: z.string().datetime().optional(),
  nextReviewDate: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export const riskUpdateSchema = riskCreateSchema.partial().extend({
  status: z.enum([
    'IDENTIFIED',
    'ANALYZING',
    'EVALUATED',
    'TREATING',
    'MONITORING',
    'CLOSED',
  ] as const).optional(),
  residualRisk: z.number().int().min(1).max(25).optional(),
  isArchived: z.boolean().optional(),
});

// Risk Assessment validation schemas
export const riskAssessmentCreateSchema = z.object({
  riskId: z.string().uuid(),
  impact: z.number().int().min(1).max(5),
  likelihood: z.number().int().min(1).max(5),
  notes: z.string().max(2000).optional(),
  nextReviewDate: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

// Risk Treatment validation schemas
export const riskTreatmentCreateSchema = z.object({
  riskId: z.string().uuid(),
  type: z.enum(['MITIGATE', 'ACCEPT', 'TRANSFER', 'AVOID'] as const),
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'] as const).optional(),
  assignedToId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  metadata: z.record(z.any()).optional(),
});

export const riskTreatmentUpdateSchema = riskTreatmentCreateSchema.partial().extend({
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'] as const).optional(),
  completedDate: z.string().datetime().optional(),
  effectiveness: z.number().int().min(1).max(5).optional(),
});

// Query parameter schemas
export const riskQuerySchema = z.object({
  status: z.enum([
    'IDENTIFIED',
    'ANALYZING',
    'EVALUATED',
    'TREATING',
    'MONITORING',
    'CLOSED',
  ] as const).optional(),
  riskLevel: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'] as const).optional(),
  category: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  sortBy: z.enum([
    'title',
    'createdAt',
    'updatedAt',
    'riskLevel',
    'status',
  ] as const).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'] as const).default('desc'),
  includeArchived: z.string().transform(val => val === 'true').optional(),
});
