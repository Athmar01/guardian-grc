import { prisma } from '../prisma';
import { RiskAssessment, RiskStatus, UserRole, RiskLevel, RiskScenario } from '@prisma/client';
import { ApiError, ConflictError, ForbiddenError, NotFoundError } from '../api/error';

type CreateRiskAssessmentInput = {
  riskId: string;
  assessmentDate: Date;
  assessedById: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  notes?: string;
  metadata?: any;
};

type UpdateRiskAssessmentInput = Partial<Omit<CreateRiskAssessmentInput, 'riskId' | 'assessedById'>> & {
  updatedById: string;
};

type CreateRiskScenarioInput = {
  riskAssessmentId: string;
  name: string;
  description?: string;
  likelihoodScore: number;
  impactScore: number;
  threatSource?: string;
  threatEvent?: string;
  vulnerability?: string;
  riskCatalogId?: string;
  notes?: string;
  metadata?: any;
  createdById: string;
};

type UpdateRiskScenarioInput = Partial<Omit<CreateRiskScenarioInput, 'riskAssessmentId' | 'createdById'>> & {
  updatedById: string;
};

export const riskAssessmentService = {
  /**
   * Create a new risk assessment
   */
  async createRiskAssessment(data: CreateRiskAssessmentInput): Promise<RiskAssessment> {
    // Verify risk exists
    const risk = await prisma.risk.findUnique({
      where: { id: data.riskId },
    });
    
    if (!risk) {
      throw new NotFoundError('Risk', data.riskId);
    }

    // Verify assessor exists
    const assessor = await prisma.user.findUnique({
      where: { id: data.assessedById },
    });
    
    if (!assessor) {
      throw new NotFoundError('User', data.assessedById);
    }

    // Calculate risk score
    const riskScore = data.likelihood * data.impact;

    // Create the risk assessment
    const riskAssessment = await prisma.riskAssessment.create({
      data: {
        risk: { connect: { id: data.riskId } },
        assessmentDate: data.assessmentDate,
        assessedBy: { connect: { id: data.assessedById } },
        likelihood: data.likelihood,
        impact: data.impact,
        riskScore,
        notes: data.notes,
        metadata: data.metadata || {},
      },
      include: {
        risk: true,
        assessedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Update risk status if needed
    await this.updateRiskStatus(riskAssessment.riskId);

    return riskAssessment;
  },

  /**
   * Update an existing risk assessment
   */
  async updateRiskAssessment(
    id: string,
    data: UpdateRiskAssessmentInput,
    userId: string,
    userRole: UserRole
  ): Promise<RiskAssessment> {
    // Verify risk assessment exists
    const existingAssessment = await prisma.riskAssessment.findUnique({
      where: { id },
      include: { risk: true }
    });
    
    if (!existingAssessment) {
      throw new NotFoundError('Risk assessment', id);
    }

    // Only admin or the original assessor can update
    if (userRole !== UserRole.ORG_ADMIN && existingAssessment.assessedById !== userId) {
      throw new ForbiddenError('You do not have permission to update this risk assessment');
    }

    // Calculate risk score if likelihood or impact changed
    let riskScore = existingAssessment.riskScore;
    let likelihood = existingAssessment.likelihood;
    let impact = existingAssessment.impact;
  
    if (data.likelihood !== undefined) {
      likelihood = data.likelihood;
    }
    if (data.impact !== undefined) {
      impact = data.impact;
    }
  
    if (data.likelihood !== undefined || data.impact !== undefined) {
      riskScore = likelihood * impact;
    }

    // Update the risk assessment
    const updatedAssessment = await prisma.riskAssessment.update({
      where: { id },
      data: {
        ...data,
        likelihood,
        impact,
        riskScore,
        updatedAt: new Date(),
      },
      include: {
        risk: true,
        assessedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Update risk status if needed
    await this.updateRiskStatus(updatedAssessment.riskId);

    return updatedAssessment;
  },

  /**
   * Get a risk assessment by ID
   */
  async getRiskAssessmentById(id: string, userId: string, userRole: UserRole): Promise<RiskAssessment> {
    const riskAssessment = await prisma.riskAssessment.findUnique({
      where: { id },
      include: {
        risk: true,
        assessedBy: {
          select: { id: true, name: true, email: true }
        },
        scenarios: true
      }
    });
    
    if (!riskAssessment) {
      throw new NotFoundError('Risk assessment', id);
    }

    // Only admin or the original assessor can view
    if (userRole !== UserRole.ORG_ADMIN && riskAssessment.assessedById !== userId) {
      throw new ForbiddenError('You do not have permission to view this risk assessment');
    }

    return riskAssessment;
  },

  /**
   * List risk assessments with pagination and filtering
   */
  async listRiskAssessments({
    riskId,
    assessedById,
    page = 1,
    limit = 10,
    userId,
    userRole
  }: {
    riskId?: string;
    assessedById?: string;
    page?: number;
    limit?: number;
    userId: string;
    userRole: UserRole;
  }) {
    const where: any = {};
    
    if (riskId) {
      where.riskId = riskId;
    }
    
    // Non-admins can only see their own assessments
    if (userRole !== UserRole.ORG_ADMIN) {
      where.assessedById = userId;
    } else if (assessedById) {
      where.assessedById = assessedById;
    }

    const [total, items] = await Promise.all([
      prisma.riskAssessment.count({ where }),
      prisma.riskAssessment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { assessmentDate: 'desc' },
        include: {
          risk: {
            select: { id: true, title: true, status: true }
          },
          assessedBy: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { scenarios: true }
          }
        }
      })
    ]);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      items,
    };
  },

  /**
   * Delete a risk assessment
   */
  async deleteRiskAssessment(id: string, userId: string, userRole: UserRole): Promise<void> {
    // Verify risk assessment exists
    const riskAssessment = await prisma.riskAssessment.findUnique({
      where: { id },
    });
    
    if (!riskAssessment) {
      throw new NotFoundError('Risk assessment', id);
    }

    // Only admin or the original assessor can delete
    if (userRole !== UserRole.ORG_ADMIN && riskAssessment.assessedById !== userId) {
      throw new ForbiddenError('You do not have permission to delete this risk assessment');
    }

    // Delete the risk assessment (cascades to scenarios)
    await prisma.riskAssessment.delete({
      where: { id },
    });

    // Update risk status
    await this.updateRiskStatus(riskAssessment.riskId);
  },

  // Create a new risk scenario

  async createRiskScenario(data: CreateRiskScenarioInput): Promise<RiskScenario> {
    // Verify risk assessment exists
    const riskAssessment = await prisma.riskAssessment.findUnique({
      where: { id: data.riskAssessmentId },
    });

    if (!riskAssessment) {
      throw new NotFoundError('Risk assessment', data.riskAssessmentId);
    }

    // Calculate risk score and level
    const riskScore = data.likelihoodScore * data.impactScore;
    let riskLevel: RiskLevel = RiskLevel.LOW;
    if (riskScore >= 12) riskLevel = RiskLevel.CRITICAL;
    else if (riskScore >= 8) riskLevel = RiskLevel.HIGH;
    else if (riskScore >= 4) riskLevel = RiskLevel.MEDIUM;

    // Create the risk scenario
    const scenario = await prisma.riskScenario.create({
      data: {
        riskAssessmentId: data.riskAssessmentId,
        name: data.name,
        description: data.description,
        likelihoodScore: data.likelihoodScore,
        impactScore: data.impactScore,
        riskScore,
        riskLevel,
        threatSource: data.threatSource,
        threatEvent: data.threatEvent,
        vulnerability: data.vulnerability,
        riskCatalogId: data.riskCatalogId,
        createdById: data.createdById,
        updatedById: data.createdById,
      },
    });

    return scenario;
  }

  async updateRiskScenario(
    id: string,
    data: UpdateRiskScenarioInput,
    userId: string,
    userRole: UserRole,
  ): Promise<RiskScenario> {
    // Verify scenario exists
    const existingScenario = await prisma.riskScenario.findUnique({
      where: { id },
      include: {
        createdBy: true,
      },
    });

    if (!existingScenario) {
      throw new NotFoundError('Risk scenario', id);
    }

    // Only admin or the original creator can update
    if (userRole !== UserRole.ORG_ADMIN && existingScenario.createdById !== userId) {
      throw new ForbiddenError('You do not have permission to update this risk scenario');
    }

    // Calculate risk score and level if likelihood or impact changed
    let updateData: any = { ...data };

    if (data.likelihoodScore !== undefined || data.impactScore !== undefined) {
      const likelihoodScore = data.likelihoodScore ?? existingScenario.likelihoodScore;
      const impactScore = data.impactScore ?? existingScenario.impactScore;
      const riskScore = likelihoodScore * impactScore;

      let riskLevel: RiskLevel = RiskLevel.LOW;
      if (riskScore >= 12) riskLevel = RiskLevel.CRITICAL;
      else if (riskScore >= 8) riskLevel = RiskLevel.HIGH;
      else if (riskScore >= 4) riskLevel = RiskLevel.MEDIUM;

      updateData = {
        ...updateData,
        likelihoodScore,
        impactScore,
        riskScore,
        riskLevel,
      };
    }

    // Update the risk scenario
    const updatedScenario = await prisma.riskScenario.update({
      where: { id },
      data: {
        ...updateData,
        updatedById: userId,
        updatedAt: new Date(),
      },
      include: {
        riskAssessment: {
          include: {
            risk: {
              select: { id: true, title: true }
            }
          }
        }
      }
    });

    return updatedScenario;
  },

  /**
   * Get a risk scenario by ID
   */
  async getRiskScenarioById(id: string, userId: string, userRole: UserRole): Promise<any> {
    const riskScenario = await prisma.riskScenario.findUnique({
      where: { id },
      include: {
        riskAssessment: {
          include: {
            risk: {
              select: { id: true, title: true, status: true }
            },
            assessedBy: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
    
    if (!riskScenario) {
      throw new NotFoundError('Risk scenario', id);
    }

    // Only admin or the original assessor can view
    if (userRole !== UserRole.ORG_ADMIN && riskScenario.riskAssessment.assessedById !== userId) {
      throw new ForbiddenError('You do not have permission to view this risk scenario');
    }

    return riskScenario;
  },

  /**
   * List risk scenarios for a risk assessment
   */
  async listRiskScenarios({
    riskAssessmentId,
    page = 1,
    limit = 10,
    userId,
    userRole
  }: {
    riskAssessmentId: string;
    page?: number;
    limit?: number;
    userId: string;
    userRole: UserRole;
  }) {
    // Verify risk assessment exists and user has access
    const riskAssessment = await prisma.riskAssessment.findUnique({
      where: { id: riskAssessmentId },
      select: { assessedById: true }
    });
    
    if (!riskAssessment) {
      throw new NotFoundError('Risk assessment', riskAssessmentId);
    }

    // Only admin or the original assessor can view
    if (userRole !== UserRole.ORG_ADMIN && riskAssessment.assessedById !== userId) {
      throw new ForbiddenError('You do not have permission to view these risk scenarios');
    }

    const [total, items] = await Promise.all([
      prisma.riskScenario.count({ where: { riskAssessmentId } }),
      prisma.riskScenario.findMany({
        where: { riskAssessmentId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
    ]);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      items,
    };
  },

  /**
   * Delete a risk scenario
   */
  async deleteRiskScenario(id: string, userId: string, userRole: UserRole): Promise<void> {
    // Verify risk scenario exists and get related assessment
    const riskScenario = await prisma.riskScenario.findUnique({
      where: { id },
      include: {
        riskAssessment: true
      }
    });
    
    if (!riskScenario) {
      throw new NotFoundError('Risk scenario', id);
    }

    // Only admin or the original assessor can delete
    if (userRole !== UserRole.ORG_ADMIN && riskScenario.riskAssessment.assessedById !== userId) {
      throw new ForbiddenError('You do not have permission to delete this risk scenario');
    }

    // Delete the risk scenario
    await prisma.riskScenario.delete({
      where: { id },
    });
  },

  /**
   * Update risk status based on its assessments
   */
  private async updateRiskStatus(riskId: string): Promise<void> {
    // Get all assessments for this risk
    const assessments = await prisma.riskAssessment.findMany({
      where: { riskId },
      orderBy: { assessmentDate: 'desc' },
      take: 1
    });

    if (assessments.length === 0) {
      // No assessments, set to IDENTIFIED
      await prisma.risk.update({
        where: { id: riskId },
        data: { status: 'IDENTIFIED' },
      });
      return;
    }

    // Use the most recent assessment to determine status
    const latestAssessment = assessments[0];
    let status: RiskStatus = 'IDENTIFIED';
    const score = latestAssessment.riskScore;

    if (score >= 16) {
      status = 'CRITICAL' as RiskStatus;
    } else if (score >= 9) {
      status = 'HIGH' as RiskStatus;
    } else if (score >= 4) {
      status = 'MEDIUM' as RiskStatus;
    } else if (score >= 1) {
      status = 'LOW' as RiskStatus;
    }

    // Update risk status
    await prisma.risk.update({
      where: { id: riskId },
      data: { status },
    });
  },

  /**
   * Get risk assessment metrics
   */
  async getRiskAssessmentMetrics(riskId: string, userId: string, userRole: UserRole) {
    // Verify risk exists and user has access
    const risk = await prisma.risk.findUnique({
      where: { id: riskId },
      select: { id: true, organizationId: true }
    });
    
    if (!risk) {
      throw new NotFoundError('Risk', riskId);
    }

    // Get assessment count
    const assessmentCount = await prisma.riskAssessment.count({
      where: { riskId }
    });

    // Get scenario count
    const scenarioCount = await prisma.riskScenario.count({
      where: {
        riskAssessment: { riskId }
      }
    });

    // Get risk score trend
    const assessments = await prisma.riskAssessment.findMany({
      where: { riskId },
      orderBy: { assessmentDate: 'asc' },
      select: {
        assessmentDate: true,
        riskScore: true,
        likelihood: true,
        impact: true,
      },
      take: 10, // Limit to last 10 assessments for trend
    });

    // Calculate average risk score
    const avgRiskScore = assessments.length > 0
      ? assessments.reduce((sum, a) => sum + a.riskScore, 0) / assessments.length
      : 0;

    return {
      assessmentCount,
      scenarioCount: scenarioCount,
      avgRiskScore: parseFloat(avgRiskScore.toFixed(2)),
      trend: assessments.map(a => ({
        date: a.assessmentDate,
        score: a.riskScore,
        likelihood: a.likelihood,
        impact: a.impact,
      })),
    };
  },
};
