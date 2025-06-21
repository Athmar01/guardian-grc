import { prisma } from '../db/prisma';
import { Risk, RiskStatus, RiskSeverity, UserRole } from '@prisma/client';
import { ApiError, ConflictError, ForbiddenError, NotFoundError } from '../api/error';

type CreateRiskInput = {
  title: string;
  description?: string;
  category: string;
  status: RiskStatus;
  severity: RiskSeverity;
  impact: number;
  likelihood: number;
  ownerId?: string;
  organizationId: string;
  createdById: string;
  controls?: string[];
  tags?: string[];
};

type UpdateRiskInput = Partial<Omit<CreateRiskInput, 'createdById' | 'organizationId'>> & {
  updatedById: string;
};

export const riskService = {
  async createRisk(data: CreateRiskInput) {
    const { controls = [], tags = [], ...riskData } = data;
    
    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: data.organizationId },
    });
    
    if (!organization) {
      throw new NotFoundError('Organization', data.organizationId);
    }

    // Verify owner exists if provided
    if (data.ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: data.ownerId },
      });
      
      if (!owner) {
        throw new NotFoundError('User', data.ownerId);
      }
    }

    // Calculate inherent risk score
    const inherentScore = data.impact * data.likelihood;

    // Create the risk
    const risk = await prisma.risk.create({
      data: {
        ...riskData,
        inherentScore,
        residualScore: inherentScore, // Initially same as inherent
        organization: { connect: { id: data.organizationId } },
        createdBy: { connect: { id: data.createdById } },
        owner: data.ownerId ? { connect: { id: data.ownerId } } : undefined,
        controls: {
          connect: controls.map(id => ({ id })),
        },
        tags: tags.length > 0 ? { set: tags } : undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        controls: {
          select: {
            id: true,
            name: true,
            implementationStatus: true,
          },
        },
      },
    });

    return risk;
  },

  async updateRisk(id: string, data: UpdateRiskInput, userId: string, userRole: UserRole) {
    const risk = await prisma.risk.findUnique({
      where: { id },
      include: { owner: true, createdBy: true },
    });

    if (!risk) {
      throw new NotFoundError('Risk', id);
    }

    // Only allow updates if user is admin, owner, or creator
    if (
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.SUPER_ADMIN &&
      risk.ownerId !== userId &&
      risk.createdById !== userId
    ) {
      throw new ForbiddenError('You do not have permission to update this risk');
    }

    const { controls, tags, ...updateData } = data;

    // Recalculate scores if impact or likelihood changes
    if (data.impact !== undefined || data.likelihood !== undefined) {
      const impact = data.impact ?? risk.impact;
      const likelihood = data.likelihood ?? risk.likelihood;
      updateData.inherentScore = impact * likelihood;
      
      // If no controls are connected, update residual score as well
      const controlCount = await prisma.riskControl.count({
        where: { riskId: id },
      });
      
      if (controlCount === 0) {
        updateData.residualScore = updateData.inherentScore;
      }
    }

    const updatedRisk = await prisma.risk.update({
      where: { id },
      data: {
        ...updateData,
        ...(controls && {
          controls: {
            set: controls.map(id => ({ id })),
          },
        }),
        ...(tags && { tags: { set: tags } }),
        updatedBy: { connect: { id: userId } },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        controls: {
          select: {
            id: true,
            name: true,
            implementationStatus: true,
          },
        },
      },
    });

    return updatedRisk;
  },

  async getRiskById(id: string, organizationId: string) {
    const risk = await prisma.risk.findUnique({
      where: { id, organizationId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        controls: {
          select: {
            id: true,
            name: true,
            description: true,
            implementationStatus: true,
            testingStatus: true,
          },
        },
        treatments: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!risk) {
      throw new NotFoundError('Risk', id);
    }

    return risk;
  },

  async listRisks({
    organizationId,
    status,
    severity,
    ownerId,
    search,
    page = 1,
    limit = 10,
  }: {
    organizationId: string;
    status?: RiskStatus[];
    severity?: RiskSeverity[];
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = { organizationId };

    if (status && status.length > 0) {
      where.status = { in: status };
    }

    if (severity && severity.length > 0) {
      where.severity = { in: severity };
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, risks] = await Promise.all([
      prisma.risk.count({ where }),
      prisma.risk.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              controls: true,
              treatments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data: risks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async deleteRisk(id: string, userId: string, userRole: UserRole) {
    const risk = await prisma.risk.findUnique({
      where: { id },
      select: { createdById: true, ownerId: true },
    });

    if (!risk) {
      throw new NotFoundError('Risk', id);
    }

    // Only allow deletion if user is admin or creator
    if (
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.SUPER_ADMIN &&
      risk.createdById !== userId
    ) {
      throw new ForbiddenError('You do not have permission to delete this risk');
    }

    // Delete related records first
    await prisma.riskControl.deleteMany({
      where: { riskId: id },
    });

    await prisma.riskTreatment.deleteMany({
      where: { riskId: id },
    });

    await prisma.riskAssessment.deleteMany({
      where: { riskId: id },
    });

    // Delete the risk
    await prisma.risk.delete({
      where: { id },
    });

    return { success: true };
  },

  async createRiskTreatment(
    riskId: string,
    data: {
      type: string;
      description: string;
      status: string;
      targetDate: Date;
      assignedToId: string;
      createdById: string;
    }
  ) {
    const risk = await prisma.risk.findUnique({
      where: { id: riskId },
      select: { id: true },
    });

    if (!risk) {
      throw new NotFoundError('Risk', riskId);
    }

    // Verify assigned user exists
    const assignedUser = await prisma.user.findUnique({
      where: { id: data.assignedToId },
      select: { id: true },
    });

    if (!assignedUser) {
      throw new NotFoundError('User', data.assignedToId);
    }

    const treatment = await prisma.riskTreatment.create({
      data: {
        ...data,
        risk: { connect: { id: riskId } },
        assignedTo: { connect: { id: data.assignedToId } },
        createdBy: { connect: { id: data.createdById } },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return treatment;
  },

  async updateRiskTreatment(
    id: string,
    data: {
      type?: string;
      description?: string;
      status?: string;
      targetDate?: Date;
      assignedToId?: string;
      updatedById: string;
    }
  ) {
    const treatment = await prisma.riskTreatment.findUnique({
      where: { id },
      include: { risk: true },
    });

    if (!treatment) {
      throw new NotFoundError('Risk treatment', id);
    }

    const { updatedById, ...updateData } = data;

    // If changing assigned user, verify the new user exists
    if (updateData.assignedToId) {
      const user = await prisma.user.findUnique({
        where: { id: updateData.assignedToId },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundError('User', updateData.assignedToId);
      }
    }

    const updatedTreatment = await prisma.riskTreatment.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.assignedToId && {
          assignedTo: { connect: { id: updateData.assignedToId } },
        }),
        updatedBy: { connect: { id: updatedById } },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedTreatment;
  },

  async deleteRiskTreatment(id: string, userId: string, userRole: UserRole) {
    const treatment = await prisma.riskTreatment.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!treatment) {
      throw new NotFoundError('Risk treatment', id);
    }

    // Only allow deletion if user is admin or creator
    if (
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.SUPER_ADMIN &&
      treatment.createdById !== userId
    ) {
      throw new ForbiddenError('You do not have permission to delete this treatment');
    }

    await prisma.riskTreatment.delete({
      where: { id },
    });

    return { success: true };
  },

  async getRiskMetrics(organizationId: string) {
    const [
      totalRisks,
      risksByStatus,
      risksBySeverity,
      risksByCategory,
    ] = await Promise.all([
      prisma.risk.count({ where: { organizationId } }),
      prisma.risk.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: { _all: true },
      }),
      prisma.risk.groupBy({
        by: ['severity'],
        where: { organizationId },
        _count: { _all: true },
      }),
      prisma.risk.groupBy({
        by: ['category'],
        where: { organizationId },
        _count: { _all: true },
      }),
    ]);

    // Get top 5 risks by score
    const topRisks = await prisma.risk.findMany({
      where: { organizationId },
      orderBy: { residualScore: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        severity: true,
        residualScore: true,
        status: true,
      },
    });

    // Get risk trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const riskTrend = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "Risk"
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    return {
      totalRisks,
      risksByStatus: risksByStatus.reduce((acc, curr) => ({
        ...acc,
        [curr.status]: curr._count._all,
      }), {}),
      risksBySeverity: risksBySeverity.reduce((acc, curr) => ({
        ...acc,
        [curr.severity]: curr._count._all,
      }), {}),
      risksByCategory: risksByCategory.reduce((acc, curr) => ({
        ...acc,
        [curr.category || 'Uncategorized']: curr._count._all,
      }), {}),
      topRisks,
      riskTrend,
    };
  },
};
