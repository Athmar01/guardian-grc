import { PrismaClient, RiskLevel, RiskStatus, TreatmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculates the risk level based on the risk score
 * @param score Risk score (impact * likelihood)
 * @returns RiskLevel enum value
 */
export function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 20) return 'CRITICAL';
  if (score >= 12) return 'HIGH';
  if (score >= 6) return 'MEDIUM';
  return 'LOW';
}

/**
 * Updates the risk status based on its treatments
 * @param riskId ID of the risk to update
 * @returns Promise that resolves when the update is complete
 */
export async function updateRiskStatus(riskId: string): Promise<void> {
  // Get the risk with its treatments
  const risk = await prisma.risk.findUnique({
    where: { id: riskId },
    include: { 
      treatments: {
        where: { deletedAt: null }
      } 
    },
  });

  if (!risk) return;

  // If no treatments, set status to EVALUATED if not already set
  if (risk.treatments.length === 0) {
    if (risk.status !== 'EVALUATED') {
      await prisma.risk.update({
        where: { id: riskId },
        data: { status: 'EVALUATED', updatedAt: new Date() },
      });
    }
    return;
  }

  // Check if all treatments are completed
  const allCompleted = risk.treatments.every(
    (t) => t.status === 'COMPLETED' || t.status === 'REJECTED'
  );

  // Check if any treatments are in progress
  const anyInProgress = risk.treatments.some(
    (t) => t.status === 'PLANNED' || t.status === 'IN_PROGRESS'
  );

  let newStatus: RiskStatus = risk.status;

  if (allCompleted) {
    newStatus = 'MONITORING';
  } else if (anyInProgress) {
    newStatus = 'TREATING';
  }

  // Only update if status has changed
  if (newStatus !== risk.status) {
    await prisma.risk.update({
      where: { id: riskId },
      data: { status: newStatus, updatedAt: new Date() },
    });
  }
}

/**
 * Calculates the residual risk based on treatments
 * @param riskId ID of the risk
 * @returns Promise that resolves with the new residual risk score or null if not calculable
 */
export async function calculateResidualRisk(riskId: string): Promise<number | null> {
  const risk = await prisma.risk.findUnique({
    where: { id: riskId },
    include: { 
      treatments: {
        where: { 
          status: 'COMPLETED',
          deletedAt: null,
          effectiveness: { not: null }
        }
      } 
    },
  });

  if (!risk || !risk.treatments.length) return null;

  // Calculate average effectiveness (1-5 scale, higher is more effective)
  const totalEffectiveness = risk.treatments.reduce(
    (sum, t) => sum + (t.effectiveness || 0),
    0
  );
  const avgEffectiveness = totalEffectiveness / risk.treatments.length;

  // Calculate residual risk (scale effectiveness to 0-1 and reduce inherent risk)
  const effectivenessFactor = (5 - avgEffectiveness) / 5; // Invert so higher effectiveness = lower risk
  const residualRisk = Math.round(risk.inherentRisk * effectivenessFactor);

  // Ensure residual risk is at least 1
  return Math.max(1, residualRisk);
}

/**
 * Updates the residual risk for a risk and returns the updated risk
 * @param riskId ID of the risk
 * @returns Promise that resolves with the updated risk or null if not found
 */
export async function updateResidualRisk(riskId: string) {
  const residualRisk = await calculateResidualRisk(riskId);
  
  if (residualRisk === null) return null;

  return prisma.risk.update({
    where: { id: riskId },
    data: {
      residualRisk,
      riskLevel: calculateRiskLevel(residualRisk),
      updatedAt: new Date(),
    },
  });
}

/**
 * Gets the risk matrix configuration for an organization
 * @param organizationId ID of the organization
 * @returns Promise that resolves with the risk matrix or null if not found
 */
export async function getOrganizationRiskMatrix(organizationId: string) {
  return prisma.riskMatrix.findFirst({
    where: { 
      organizationId,
      OR: [
        { isDefault: true },
        { isDefault: { equals: null } }, // Handle case where isDefault might be null
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Gets risks that are due for review
 * @param daysBefore Number of days before due date to consider for review
 * @returns Promise that resolves with the list of risks due for review
 */
export async function getRisksDueForReview(daysBefore = 7) {
  const reviewDate = new Date();
  reviewDate.setDate(reviewDate.getDate() + daysBefore);

  return prisma.risk.findMany({
    where: {
      nextReviewDate: {
        lte: reviewDate,
        gte: new Date(), // Only future dates
      },
      deletedAt: null, // Only non-deleted risks
    },
    include: {
      owner: true,
      createdBy: true,
      organization: true,
    },
  });
}

/**
 * Gets the risk treatment with related data
 * @param treatmentId ID of the treatment
 * @returns Promise that resolves with the treatment or null if not found
 */
export async function getRiskTreatmentWithRelations(treatmentId: string) {
  return prisma.riskTreatment.findUnique({
    where: { id: treatmentId, deletedAt: null },
    include: {
      assignedTo: true,
      createdBy: true,
      updatedBy: true,
      risk: true,
    },
  });
}

/**
 * Validates if a user has permission to modify a risk treatment
 * @param treatmentId ID of the treatment
 * @param userId ID of the user
 * @returns Promise that resolves with a boolean indicating if the user has permission
 */
export async function canModifyTreatment(treatmentId: string, userId: string): Promise<boolean> {
  const treatment = await prisma.riskTreatment.findUnique({
    where: { id: treatmentId },
    include: { 
      risk: {
        include: { organization: true }
      } 
    },
  });

  if (!treatment) return false;
  
  // Check if user is admin, risk manager, or the treatment owner
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, organizationId: true },
  });

  if (!user) return false;
  
  // User must be in the same organization as the risk
  if (user.organizationId !== treatment.risk.organizationId) return false;
  
  // Admin or risk manager can modify any treatment
  if (user.role === 'ADMIN' || user.role === 'RISK_MANAGER') return true;
  
  // Regular users can only modify their own treatments
  return treatment.assignedToId === userId;
}
