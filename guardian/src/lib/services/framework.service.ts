import { prisma } from '../db/prisma';
import { Framework, UserRole } from '@prisma/client';
import { ApiError, ConflictError, ForbiddenError, NotFoundError } from '../api/error';

type CreateFrameworkInput = {
  name: string;
  description?: string;
  referenceId?: string;
  version?: string;
  category?: string;
  isActive?: boolean;
  organizationId: string;
  createdById: string;
  requirements?: Array<{
    referenceId: string;
    title: string;
    description?: string;
    category?: string;
    level?: string;
  }>;
};

type UpdateFrameworkInput = Partial<Omit<CreateFrameworkInput, 'createdById' | 'organizationId' | 'requirements'>> & {
  updatedById: string;
};

export const frameworkService = {
  async createFramework(data: CreateFrameworkInput) {
    const { requirements = [], ...frameworkData } = data;
    
    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: data.organizationId },
    });
    
    if (!organization) {
      throw new NotFoundError('Organization', data.organizationId);
    }

    // Check if framework with same reference ID already exists
    if (data.referenceId) {
      const existingFramework = await prisma.framework.findFirst({
        where: {
          organizationId: data.organizationId,
          referenceId: data.referenceId,
        },
      });

      if (existingFramework) {
        throw new ConflictError('A framework with this reference ID already exists');
      }
    }

    // Create the framework
    const framework = await prisma.framework.create({
      data: {
        ...frameworkData,
        organization: { connect: { id: data.organizationId } },
        createdBy: { connect: { id: data.createdById } },
        requirements: {
          create: requirements.map(req => ({
            referenceId: req.referenceId,
            title: req.title,
            description: req.description,
            category: req.category,
            level: req.level,
          })),
        },
      },
      include: {
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
        _count: {
          select: {
            requirements: true,
          },
        },
      },
    });

    return framework;
  },

  async updateFramework(id: string, data: UpdateFrameworkInput, userId: string, userRole: UserRole) {
    const framework = await prisma.framework.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!framework) {
      throw new NotFoundError('Framework', id);
    }

    // Only allow updates if user is admin or creator
    if (
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.SUPER_ADMIN &&
      framework.createdById !== userId
    ) {
      throw new ForbiddenError('You do not have permission to update this framework');
    }

    const { updatedById, ...updateData } = data;

    // If referenceId is being updated, check for conflicts
    if (updateData.referenceId && updateData.referenceId !== framework.referenceId) {
      const existingFramework = await prisma.framework.findFirst({
        where: {
          organizationId: framework.organizationId,
          referenceId: updateData.referenceId,
          id: { not: id },
        },
      });

      if (existingFramework) {
        throw new ConflictError('A framework with this reference ID already exists');
      }
    }

    const updatedFramework = await prisma.framework.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: { connect: { id: updatedById } },
      },
      include: {
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
        _count: {
          select: {
            requirements: true,
          },
        },
      },
    });

    return updatedFramework;
  },

  async getFrameworkById(id: string, organizationId: string) {
    const framework = await prisma.framework.findUnique({
      where: { id, organizationId },
      include: {
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
          select: {
            id: true,
            referenceId: true,
            title: true,
            category: true,
            level: true,
            _count: {
              select: {
                controls: true,
              },
            },
          },
          orderBy: [
            { referenceId: 'asc' },
            { title: 'asc' },
          ],
        },
      },
    });

    if (!framework) {
      throw new NotFoundError('Framework', id);
    }

    return framework;
  },

  async listFrameworks({
    organizationId,
    isActive,
    search,
    page = 1,
    limit = 10,
  }: {
    organizationId: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = { organizationId };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { referenceId: { contains: search, mode: 'insensitive' } },
      ];
    }


    const [total, frameworks] = await Promise.all([
      prisma.framework.count({ where }),
      prisma.framework.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              requirements: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return {
      data: frameworks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async deleteFramework(id: string, userId: string, userRole: UserRole) {
    const framework = await prisma.framework.findUnique({
      where: { id },
      select: { createdById: true, organizationId: true },
    });

    if (!framework) {
      throw new NotFoundError('Framework', id);
    }

    // Only allow deletion if user is admin or creator
    if (
      userRole !== UserRole.ADMIN &&
      userRole !== UserRole.SUPER_ADMIN &&
      framework.createdById !== userId
    ) {
      throw new ForbiddenError('You do not have permission to delete this framework');
    }

    // Check if there are any requirements linked to controls
    const requirementsWithControls = await prisma.requirement.findMany({
      where: {
        frameworkId: id,
        controls: {
          some: {},
        },
      },
      select: {
        id: true,
        referenceId: true,
        _count: {
          select: {
            controls: true,
          },
        },
      },
    });

    if (requirementsWithControls.length > 0) {
      throw new ConflictError(
        'Cannot delete framework with requirements linked to controls. ' +
        'Please unlink all requirements from controls first.'
      );
    }

    // Delete related records
    await prisma.requirement.deleteMany({
      where: { frameworkId: id },
    });

    // Delete the framework
    await prisma.framework.delete({
      where: { id },
    });

    return { success: true };
  },

  async createRequirement(
    frameworkId: string,
    data: {
      referenceId: string;
      title: string;
      description?: string;
      category?: string;
      level?: string;
      metadata?: Record<string, any>;
    },
    organizationId: string
  ) {
    // Verify framework exists and belongs to organization
    const framework = await prisma.framework.findUnique({
      where: { id: frameworkId, organizationId },
      select: { id: true },
    });

    if (!framework) {
      throw new NotFoundError('Framework', frameworkId);
    }

    // Check if requirement with same reference ID already exists in this framework
    const existingRequirement = await prisma.requirement.findFirst({
      where: {
        frameworkId,
        referenceId: data.referenceId,
      },
    });

    if (existingRequirement) {
      throw new ConflictError('A requirement with this reference ID already exists in this framework');
    }

    // Create the requirement
    const requirement = await prisma.requirement.create({
      data: {
        ...data,
        framework: { connect: { id: frameworkId } },
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });

    return requirement;
  },

  async updateRequirement(
    id: string,
    data: {
      referenceId?: string;
      title?: string;
      description?: string;
      category?: string;
      level?: string;
      metadata?: Record<string, any>;
    },
    organizationId: string
  ) {
    // Verify requirement exists and belongs to organization
    const requirement = await prisma.requirement.findFirst({
      where: {
        id,
        framework: {
          organizationId,
        },
      },
      include: {
        framework: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!requirement) {
      throw new NotFoundError('Requirement', id);
    }

    // If referenceId is being updated, check for conflicts
    if (data.referenceId && data.referenceId !== requirement.referenceId) {
      const existingRequirement = await prisma.requirement.findFirst({
        where: {
          frameworkId: requirement.frameworkId,
          referenceId: data.referenceId,
          id: { not: id },
        },
      });

      if (existingRequirement) {
        throw new ConflictError('A requirement with this reference ID already exists in this framework');
      }
    }

    // Update the requirement
    const updatedRequirement = await prisma.requirement.update({
      where: { id },
      data: {
        ...data,
        ...(data.metadata && { metadata: JSON.stringify(data.metadata) }),
      },
      include: {
        _count: {
          select: {
            controls: true,
          },
        },
      },
    });

    return updatedRequirement;
  },

  async getRequirementById(id: string, organizationId: string) {
    const requirement = await prisma.requirement.findFirst({
      where: {
        id,
        framework: {
          organizationId,
        },
      },
      include: {
        framework: {
          select: {
            id: true,
            name: true,
            referenceId: true,
          },
        },
        controls: {
          select: {
            control: {
              select: {
                id: true,
                name: true,
                implementationStatus: true,
                testingStatus: true,
                owner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!requirement) {
      throw new NotFoundError('Requirement', id);
    }

    // Parse metadata if it exists
    const metadata = requirement.metadata ? JSON.parse(requirement.metadata as string) : undefined;

    return {
      ...requirement,
      metadata,
      controls: requirement.controls.map(c => ({
        ...c.control,
      })),
    };
  },

  async deleteRequirement(id: string, organizationId: string) {
    // Verify requirement exists and belongs to organization
    const requirement = await prisma.requirement.findFirst({
      where: {
        id,
        framework: {
          organizationId,
        },
      },
      include: {
        _count: {
          select: {
            controls: true,
          },
        },
      },
    });

    if (!requirement) {
      throw new NotFoundError('Requirement', id);
    }

    // Check if requirement is linked to any controls
    if (requirement._count.controls > 0) {
      throw new ConflictError(
        'Cannot delete requirement that is linked to controls. ' +
        'Please unlink all controls from this requirement first.'
      );
    }

    // Delete the requirement
    await prisma.requirement.delete({
      where: { id },
    });

    return { success: true };
  },

  async getFrameworkMetrics(organizationId: string) {
    const [
      totalFrameworks,
      frameworksByCategory,
      frameworksByStatus,
      frameworksWithMostRequirements,
    ] = await Promise.all([
      prisma.framework.count({ where: { organizationId } }),
      prisma.framework.groupBy({
        by: ['category'],
        where: { organizationId },
        _count: { _all: true },
      }),
      prisma.framework.groupBy({
        by: ['isActive'],
        where: { organizationId },
        _count: { _all: true },
      }),
      prisma.framework.findMany({
        where: { organizationId },
        include: {
          _count: {
            select: {
              requirements: true,
            },
          },
        },
        orderBy: {
          requirements: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Get compliance status by framework
    const complianceByFramework = await prisma.$queryRaw`
      SELECT 
        f.id,
        f.name,
        COUNT(r.id) as total_requirements,
        COUNT(DISTINCT cr.controlId) as implemented_controls,
        ROUND(
          (COUNT(DISTINCT cr.controlId) * 100.0) / 
          NULLIF(COUNT(r.id), 0), 
          2
        ) as compliance_percentage
      FROM "Framework" f
      LEFT JOIN "Requirement" r ON f.id = r."frameworkId"
      LEFT JOIN "ControlRequirement" cr ON r.id = cr."requirementId"
      WHERE f."organizationId" = ${organizationId}
      GROUP BY f.id, f.name
      ORDER BY compliance_percentage DESC
    `;

    return {
      totalFrameworks,
      frameworksByCategory: frameworksByCategory.reduce((acc, curr) => ({
        ...acc,
        [curr.category || 'Uncategorized']: curr._count._all,
      }), {}),
      frameworksByStatus: frameworksByStatus.reduce((acc, curr) => ({
        ...acc,
        [curr.isActive ? 'ACTIVE' : 'INACTIVE']: curr._count._all,
      }), {}),
      frameworksWithMostRequirements: frameworksWithMostRequirements.map(fw => ({
        id: fw.id,
        name: fw.name,
        requirementCount: fw._count.requirements,
      })),
      complianceByFramework,
    };
  },
};
