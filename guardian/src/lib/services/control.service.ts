import { prisma } from '../db/prisma';
import { Control, ControlStatus, TestingStatus, UserRole } from '@prisma/client';
import { ApiError, ConflictError, ForbiddenError, NotFoundError } from '../api/error';

type CreateControlInput = {
  name: string;
  description?: string;
  category?: string;
  family?: string;
  implementationStatus?: ControlStatus;
  testingStatus?: TestingStatus;
  notes?: string;
  referenceUrl?: string;
  isAutomated?: boolean;
  isActive?: boolean;
  ownerId?: string;
  organizationId: string;
  createdById: string;
  requirements?: string[];
  risks?: string[];
  tags?: string[];
};

type UpdateControlInput = Partial<Omit<CreateControlInput, 'createdById' | 'organizationId'>> & {
  updatedById: string;
};

export const controlService = {
  async createControl(data: CreateControlInput) {
    const { requirements = [], risks = [], tags = [], ...controlData } = data;
    
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

    // Create the control
    const control = await prisma.control.create({
      data: {
        ...controlData,
        organization: { connect: { id: data.organizationId } },
        createdBy: { connect: { id: data.createdById } },
        owner: data.ownerId ? { connect: { id: data.ownerId } } : undefined,
        requirements: {
          create: requirements.map(requirementId => ({
            requirement: { connect: { id: requirementId } },
          })),
        },
        risksMitigated: {
          connect: risks.map(id => ({ id })),
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
        requirements: {
          include: {
            requirement: {
              select: {
                id: true,
                title: true,
                referenceId: true,
              },
            },
          },
        },
        risksMitigated: {
          select: {
            id: true,
            title: true,
            severity: true,
          },
        },
      },
    });

    return control;
  },

  async updateControl(id: string, data: UpdateControlInput, userId: string, userRole: UserRole) {
    const control = await prisma.control.findUnique({
      where: { id },
      include: { owner: true, createdBy: true },
    });

    if (!control) {
      throw new NotFoundError('Control', id);
    }

    // Only allow updates if user is admin, owner, or creator
    if (
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.SUPER_ADMIN &&
      control.ownerId !== userId &&
      control.createdById !== userId
    ) {
      throw new ForbiddenError('You do not have permission to update this control');
    }

    const { requirements, risks, tags, ...updateData } = data;

    const updatedControl = await prisma.control.update({
      where: { id },
      data: {
        ...updateData,
        ...(requirements && {
          requirements: {
            deleteMany: {},
            create: requirements.map(requirementId => ({
              requirement: { connect: { id: requirementId } },
            })),
          },
        }),
        ...(risks && {
          risksMitigated: {
            set: risks.map(id => ({ id })),
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
        requirements: {
          include: {
            requirement: {
              select: {
                id: true,
                title: true,
                referenceId: true,
              },
            },
          },
        },
        risksMitigated: {
          select: {
            id: true,
            title: true,
            severity: true,
          },
        },
      },
    });

    return updatedControl;
  },

  async getControlById(id: string, organizationId: string) {
    const control = await prisma.control.findUnique({
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
        requirements: {
          include: {
            requirement: {
              select: {
                id: true,
                title: true,
                description: true,
                referenceId: true,
                framework: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        risksMitigated: {
          select: {
            id: true,
            title: true,
            severity: true,
            status: true,
          },
        },
        evidences: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            uploadedAt: true,
          },
        },
      },
    });

    if (!control) {
      throw new NotFoundError('Control', id);
    }

    return control;
  },

  async listControls({
    organizationId,
    status,
    search,
    frameworkId,
    requirementId,
    riskId,
    page = 1,
    limit = 10,
  }: {
    organizationId: string;
    status?: ControlStatus[];
    search?: string;
    frameworkId?: string;
    requirementId?: string;
    riskId?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = { organizationId };

    if (status && status.length > 0) {
      where.implementationStatus = { in: status };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }


    if (frameworkId) {
      where.requirements = {
        some: {
          requirement: {
            frameworkId,
          },
        },
      };
    }


    if (requirementId) {
      where.requirements = {
        some: {
          requirementId,
        },
      };
    }


    if (riskId) {
      where.risksMitigated = {
        some: {
          id: riskId,
        },
      };
    }

    const [total, controls] = await Promise.all([
      prisma.control.count({ where }),
      prisma.control.findMany({
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
              requirements: true,
              risksMitigated: true,
              evidences: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return {
      data: controls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async deleteControl(id: string, userId: string, userRole: UserRole) {
    const control = await prisma.control.findUnique({
      where: { id },
      select: { createdById: true, ownerId: true },
    });

    if (!control) {
      throw new NotFoundError('Control', id);
    }


    // Only allow deletion if user is admin or creator
    if (
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.SUPER_ADMIN &&
      control.createdById !== userId
    ) {
      throw new ForbiddenError('You do not have permission to delete this control');
    }

    // Delete related records first
    await prisma.controlRequirement.deleteMany({
      where: { controlId: id },
    });


    await prisma.riskControl.deleteMany({
      where: { controlId: id },
    });

    await prisma.evidence.deleteMany({
      where: { controlId: id },
    });

    // Delete the control
    await prisma.control.delete({
      where: { id },
    });

    return { success: true };
  },

  async getControlMetrics(organizationId: string) {
    const [
      totalControls,
      controlsByStatus,
      controlsByFamily,
      controlsByCategory,
    ] = await Promise.all([
      prisma.control.count({ where: { organizationId } }),
      prisma.control.groupBy({
        by: ['implementationStatus'],
        where: { organizationId },
        _count: { _all: true },
      }),
      prisma.control.groupBy({
        by: ['family'],
        where: { organizationId },
        _count: { _all: true },
      }),
      prisma.control.groupBy({
        by: ['category'],
        where: { organizationId },
        _count: { _all: true },
      }),
    ]);

    // Get controls by testing status
    const controlsByTestingStatus = await prisma.control.groupBy({
      by: ['testingStatus'],
      where: { organizationId },
      _count: { _all: true },
    });

    // Get controls by automation status
    const controlsByAutomation = await prisma.control.groupBy({
      by: ['isAutomated'],
      where: { organizationId },
      _count: { _all: true },
    });

    // Get controls with most risks
    const controlsWithMostRisks = await prisma.control.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        implementationStatus: true,
        _count: {
          select: {
            risksMitigated: true,
          },
        },
      },
      orderBy: {
        risksMitigated: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return {
      totalControls,
      controlsByStatus: controlsByStatus.reduce((acc, curr) => ({
        ...acc,
        [curr.implementationStatus]: curr._count._all,
      }), {}),
      controlsByFamily: controlsByFamily.reduce((acc, curr) => ({
        ...acc,
        [curr.family || 'Uncategorized']: curr._count._all,
      }), {}),
      controlsByCategory: controlsByCategory.reduce((acc, curr) => ({
        ...acc,
        [curr.category || 'Uncategorized']: curr._count._all,
      }), {}),
      controlsByTestingStatus: controlsByTestingStatus.reduce((acc, curr) => ({
        ...acc,
        [curr.testingStatus || 'NOT_TESTED']: curr._count._all,
      }), {}),
      controlsByAutomation: controlsByAutomation.reduce((acc, curr) => ({
        ...acc,
        [curr.isAutomated ? 'AUTOMATED' : 'MANUAL']: curr._count._all,
      }), {}),
      controlsWithMostRisks: controlsWithMostRisks.map(control => ({
        id: control.id,
        name: control.name,
        status: control.implementationStatus,
        riskCount: control._count.risksMitigated,
      })),
    };
  },

  async linkControlToRequirement(controlId: string, requirementId: string) {
    // Check if control exists
    const control = await prisma.control.findUnique({
      where: { id: controlId },
      select: { id: true },
    });

    if (!control) {
      throw new NotFoundError('Control', controlId);
    }

    // Check if requirement exists
    const requirement = await prisma.requirement.findUnique({
      where: { id: requirementId },
      select: { id: true },
    });

    if (!requirement) {
      throw new NotFoundError('Requirement', requirementId);
    }

    // Check if the link already exists
    const existingLink = await prisma.controlRequirement.findUnique({
      where: {
        controlId_requirementId: {
          controlId,
          requirementId,
        },
      },
    });

    if (existingLink) {
      throw new ConflictError('This control is already linked to the specified requirement');
    }

    // Create the link
    const link = await prisma.controlRequirement.create({
      data: {
        control: { connect: { id: controlId } },
        requirement: { connect: { id: requirementId } },
      },
      include: {
        control: {
          select: {
            id: true,
            name: true,
          },
        },
        requirement: {
          select: {
            id: true,
            title: true,
            referenceId: true,
          },
        },
      },
    });

    return link;
  },

  async unlinkControlFromRequirement(controlId: string, requirementId: string) {
    // Check if the link exists
    const link = await prisma.controlRequirement.findUnique({
      where: {
        controlId_requirementId: {
          controlId,
          requirementId,
        },
      },
    });

    if (!link) {
      throw new NotFoundError('Control-Requirement link');
    }

    // Delete the link
    await prisma.controlRequirement.delete({
      where: {
        controlId_requirementId: {
          controlId,
          requirementId,
        },
      },
    });

    return { success: true };
  },

  async linkControlToRisk(controlId: string, riskId: string) {
    // Check if control exists
    const control = await prisma.control.findUnique({
      where: { id: controlId },
      select: { id: true },
    });

    if (!control) {
      throw new NotFoundError('Control', controlId);
    }

    // Check if risk exists
    const risk = await prisma.risk.findUnique({
      where: { id: riskId },
      select: { id: true },
    });

    if (!risk) {
      throw new NotFoundError('Risk', riskId);
    }

    // Update the risk to connect to the control
    await prisma.riskControl.create({
      data: {
        risk: { connect: { id: riskId } },
        control: { connect: { id: controlId } },
      },
    });

    // Recalculate residual score for the risk
    await this.updateRiskResidualScore(riskId);

    return { success: true };
  },

  async unlinkControlFromRisk(controlId: string, riskId: string) {
    // Check if the link exists
    const link = await prisma.riskControl.findFirst({
      where: {
        riskId,
        controlId: controlId,
      },
    });

    if (!link) {
      throw new NotFoundError('Risk-Control link');
    }

    // Delete the link
    await prisma.riskControl.deleteMany({
      where: {
        riskId,
        controlId: controlId,
      },
    });

    // Recalculate residual score for the risk
    await this.updateRiskResidualScore(riskId);

    return { success: true };
  },

  // Helper method to update risk's residual score based on linked controls
  private async updateRiskResidualScore(riskId: string) {
    const risk = await prisma.risk.findUnique({
      where: { id: riskId },
      include: {
        controls: {
          select: {
            effectiveness: true,
          },
        },
      },
    });

    if (!risk) return;

    // If no controls, residual score = inherent score
    if (risk.controls.length === 0) {
      await prisma.risk.update({
        where: { id: riskId },
        data: {
          residualScore: risk.inherentScore,
        },
      });
      return;
    }

    // Calculate average effectiveness of controls (0-100%)
    const avgEffectiveness = risk.controls.reduce(
      (sum, control) => sum + (control.effectiveness || 0),
      0
    ) / risk.controls.length;

    // Calculate residual score (inherent score reduced by effectiveness)
    const riskReduction = risk.inherentScore * (avgEffectiveness / 100);
    const newResidualScore = Math.max(1, Math.min(25, Math.round(risk.inherentScore - riskReduction)));

    await prisma.risk.update({
      where: { id: riskId },
      data: {
        residualScore: newResidualScore,
      },
    });
  },
};
