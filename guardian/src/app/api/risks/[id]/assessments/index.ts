import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
import { riskAssessmentCreateSchema } from '@/validations/risk';
import { riskAssessmentInclude } from '@/types/risk';

// POST /api/risks/[riskId]/assessments - Create a new risk assessment
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createRiskAssessment(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}

async function createRiskAssessment(req: NextApiRequest, res: NextApiResponse) {
  return withAuth(req, res, async (req, res, userId) => {
    try {
      const { riskId } = req.query;
      const organizationId = await getOrganizationId(userId);
      
      if (!organizationId) {
        return res.status(400).json({ success: false, error: 'Organization not found' });
      }

      if (typeof riskId !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid risk ID' });
      }

      // Verify risk exists and belongs to organization
      const risk = await prisma.risk.findUnique({
        where: { id: riskId, organizationId },
      });

      if (!risk) {
        return res.status(404).json({ success: false, error: 'Risk not found' });
      }

      const data = riskAssessmentCreateSchema.parse(req.body);
      
      // Calculate risk score
      const riskScore = data.impact * data.likelihood;
      
      // Set previous assessment as not current if it exists
      await prisma.riskAssessment.updateMany({
        where: { riskId, isCurrent: true },
        data: { isCurrent: false },
      });

      // Create new assessment
      const assessment = await prisma.riskAssessment.create({
        data: {
          riskId,
          assessedById: userId,
          organizationId,
          impact: data.impact,
          likelihood: data.likelihood,
          riskScore,
          notes: data.notes,
          nextReviewDate: data.nextReviewDate ? new Date(data.nextReviewDate) : null,
          metadata: data.metadata || {},
          isCurrent: true,
        },
        include: riskAssessmentInclude,
      });

      // Update risk with new assessment data
      await prisma.risk.update({
        where: { id: riskId },
        data: {
          impact: data.impact,
          likelihood: data.likelihood,
          inherentRisk: riskScore,
          riskLevel: calculateRiskLevel(riskScore),
          status: 'EVALUATED',
          updatedAt: new Date(),
        },
      });

      return res.status(201).json({ success: true, data: assessment });
    } catch (error) {
      console.error('Failed to create risk assessment:', error);
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create risk assessment',
      });
    }
  });
}

// Helper function to calculate risk level based on score
function calculateRiskLevel(score: number): string {
  if (score >= 20) return 'CRITICAL';
  if (score >= 12) return 'HIGH';
  if (score >= 6) return 'MEDIUM';
  return 'LOW';
}
