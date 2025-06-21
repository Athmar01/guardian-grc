import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { calculateRiskScore } from '@/lib/risk-calculator';
import type { RiskAssessment, Risk, RiskScenario, RiskLevel, Organization } from '@prisma/client';

// Type definitions for the risk assessment with related data
interface RiskWithFolder extends Risk {
    folderId: string;
    organization: Organization;
}

interface AssessmentWithRisk extends RiskAssessment {
    risk: RiskWithFolder | null;
}

// Schema for creating a new risk scenario
const createScenarioSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    likelihoodScore: z.number().min(1, 'Likelihood score is required'),
    impactScore: z.number().min(1, 'Impact score is required'),
    threatSource: z.string().optional(),
    threatEvent: z.string().optional(),
    vulnerability: z.string().optional(),
    riskCatalogId: z.string().uuid().optional(),
});

/**
 * Helper function to check if a user has access to a risk assessment
 */
async function checkAssessmentAccess(
    userId: string, 
    assessmentId: string, 
    permission: string
): Promise<{ error?: NextResponse, assessment?: AssessmentWithRisk }> {
    try {
        const assessment = await prisma.riskAssessment.findUnique({
            where: { id: assessmentId },
            include: {
                risk: {
                    include: {
                        organization: true
                    }
                }
            }
        }) as unknown as AssessmentWithRisk | null;

        if (!assessment || !assessment.risk) {
            return { 
                error: new NextResponse(
                    JSON.stringify({ error: 'Risk Assessment not found' }), 
                    { status: 404 }
                ) 
            };
        }

        const canAccess = await hasPermission(userId, permission, assessment.risk.folderId);
        if (!canAccess) {
            return { 
                error: new NextResponse(
                    JSON.stringify({ error: 'Forbidden' }), 
                    { status: 403 }
                )
            };
        }

        return { assessment };
    } catch (error) {
        console.error('Error checking assessment access:', error);
        return {
            error: new NextResponse(
                JSON.stringify({ error: 'Internal server error' }),
                { status: 500 }
            )
        };
    }
}

/**
 * GET /api/risk-assessments/[id]/scenarios
 * Get all scenarios for a risk assessment
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }), 
                { status: 401 }
            );
        }

        const { error } = await checkAssessmentAccess(userId, params.id, 'view_riskassessment');
        if (error) {
            return error;
        }

        const scenarios = await prisma.riskScenario.findMany({
            where: { riskAssessmentId: params.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(scenarios);
    } catch (error) {
        console.error('Error fetching risk assessment scenarios:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }), 
            { status: 500 }
        );
    }
}

/**
 * POST /api/risk-assessments/[id]/scenarios
 * Create a new risk scenario for a risk assessment
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }), 
                { status: 401 }
            );
        }

        // Check permissions and get assessment with risk
        const { error, assessment } = await checkAssessmentAccess(userId, params.id, 'edit_riskassessment');
        if (error) return error;

        if (!assessment?.risk) {
            return new NextResponse(
                JSON.stringify({ error: 'Associated risk not found' }), 
                { status: 404 }
            );
        }

        const body = await request.json();
        const validation = createScenarioSchema.safeParse(body);

        if (!validation.success) {
            return new NextResponse(
                JSON.stringify({ error: validation.error.format() }), 
                { status: 400 }
            );
        }

        const { likelihoodScore, impactScore, ...restOfData } = validation.data;

        // For now, use a simple risk calculation until we have a proper risk matrix
        const riskScore = likelihoodScore * impactScore;
        // Map the score to a risk level (customize these thresholds as needed)
        let riskLevel: RiskLevel = 'LOW';
        if (riskScore >= 12) {
            riskLevel = 'CRITICAL';
        } else if (riskScore >= 8) {
            riskLevel = 'HIGH';
        } else if (riskScore >= 4) {
            riskLevel = 'MEDIUM';
        }

        const scenario = await prisma.riskScenario.create({
            data: {
                ...restOfData,
                likelihoodScore,
                impactScore,
                riskScore,
                riskLevel,
                riskAssessmentId: params.id,
                createdById: userId,
                updatedById: userId,
            },
        });

        return new NextResponse(JSON.stringify(scenario), { status: 201 });
    } catch (error) {
        console.error('Error creating risk scenario:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }), 
            { status: 500 }
        );
    }
}
