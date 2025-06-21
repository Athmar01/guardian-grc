import { 
  Risk, 
  RiskAssessment, 
  RiskTreatment, 
  RiskMatrix, 
  User, 
  Organization, 
  Control, 
  RiskStatus, 
  RiskLevel, 
  TreatmentType, 
  TreatmentStatus,
  Prisma 
} from '@prisma/client';

// Types for Risk Management

export const riskInclude = {
  owner: true,
  createdBy: true,
  organization: true,
  controls: true,
  treatments: {
    include: {
      assignedTo: true,
      createdBy: true,
      updatedBy: true,
    },
  },
  assessments: {
    include: {
      assessedBy: true,
    },
    orderBy: {
      assessmentDate: 'desc' as const,
    },
  },
  riskMatrix: true,
};

export type RiskWithRelations = Prisma.RiskGetPayload<{
  include: typeof riskInclude;
}>;

export const riskAssessmentInclude = {
  assessedBy: true,
  risk: true,
  organization: true,
};

export type RiskAssessmentWithRelations = Prisma.RiskAssessmentGetPayload<{
  include: typeof riskAssessmentInclude;
}>;

export const riskTreatmentInclude = {
  assignedTo: true,
  createdBy: true,
  updatedBy: true,
  risk: true,
};

export type RiskTreatmentWithRelations = Prisma.RiskTreatmentGetPayload<{
  include: typeof riskTreatmentInclude;
}>;

export interface RiskInput {
  title: string;
  description: string;
  category: string;
  impact: number;
  likelihood: number;
  status?: RiskStatus;
  ownerId?: string | null;
  tags?: string[];
  dueDate?: string | null;
  nextReviewDate?: string | null;
  metadata?: Record<string, unknown>;
  riskMatrixId?: string;
}

export interface RiskResponse extends Omit<Risk, 'createdAt' | 'updatedAt' | 'deletedAt' | 'metadata'> {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: Record<string, unknown> | null;
  owner: User | null;
  createdBy: User;
  organization: Organization;
  controls: Control[];
  treatments: RiskTreatmentWithRelations[];
  assessments: RiskAssessmentWithRelations[];
  riskMatrix: RiskMatrix | null;
}

export interface RiskAssessmentInput {
  riskId: string;
  impact: number;
  likelihood: number;
  notes?: string;
  nextReviewDate?: string;
  metadata?: Record<string, unknown>;
}

export interface RiskAssessmentResponse extends Omit<RiskAssessment, 'createdAt' | 'updatedAt' | 'assessmentDate' | 'nextReviewDate' | 'metadata'> {
  createdAt: string;
  updatedAt: string;
  assessmentDate: string;
  nextReviewDate: string | null;
  metadata: Record<string, unknown> | null;
  assessedBy: User;
  risk: Risk;
  organization: Organization;
}

export interface RiskTreatmentInput {
  riskId: string;
  type: TreatmentType;
  title: string;
  description: string;
  status?: TreatmentStatus;
  assignedToId?: string | null;
  dueDate?: string | null;
  completedDate?: string | null;
  effectiveness?: number | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
}

export interface RiskTreatmentResponse extends Omit<RiskTreatment, 'createdAt' | 'updatedAt' | 'dueDate' | 'completedDate' | 'metadata'> {
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  completedDate: string | null;
  metadata: Record<string, unknown> | null;
  assignedTo: User | null;
  createdBy: User;
  updatedBy: User;
  risk: Risk;
}

export interface RiskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RiskStatus[];
  category?: string[];
  ownerId?: string[];
  impact?: number[];
  likelihood?: number[];
  riskLevel?: RiskLevel[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
