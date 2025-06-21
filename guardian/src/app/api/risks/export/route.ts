import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getAccessibleFolders } from '@/lib/rbac';
import Papa from 'papaparse';
import type { RiskAssessment, Assessment, Folder, RiskMatrix, RiskScenario } from '@prisma/client';

/**
 * @swagger
 * /api/risks/export:
 *   post:
 *     summary: Export risk assessments to a CSV file
 *     tags:
 *       - Risks
 *     description: >
 *       Generates and returns a CSV file of all risk assessments the user has access to.
 *       The request body can be empty.
 *     responses:
 *       200:
 *         description: A CSV file containing risk assessment data.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const accessibleFolders = await getAccessibleFolders(userId);
    if (accessibleFolders.length === 0) {
        // Return an empty CSV if user has no access to any folders with risks
        const csv = Papa.unparse([]);
        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="risks-export-${new Date().toISOString()}.csv"`,
            },
        });
    }

    const risks: (RiskAssessment & { assessment: Assessment & { folder: Folder }; matrix: RiskMatrix | null; scenarios: RiskScenario[] })[] = await prisma.riskAssessment.findMany({
        where: {
            assessment: {
                folderId: {
                    in: accessibleFolders,
                },
            },
        },
        include: {
            assessment: {
                include: {
                    folder: true,
                },
            },
            matrix: true,
            scenarios: true,
        },
        orderBy: {
            assessment: {
                name: 'asc',
            },
        },
    });

    const dataForCsv = risks.map((risk) => {
        const scenariosCount = risk.scenarios.length;
        const avgLikelihood = scenariosCount > 0 ? risk.scenarios.reduce((sum: number, s: RiskScenario) => sum + s.likelihood, 0) / scenariosCount : 0;
        const avgImpact = scenariosCount > 0 ? risk.scenarios.reduce((sum: number, s: RiskScenario) => sum + s.impact, 0) / scenariosCount : 0;
        const avgRiskScore = scenariosCount > 0 ? risk.scenarios.reduce((sum: number, s: RiskScenario) => sum + (s.riskScore || 0), 0) / scenariosCount : 0;

        return {
            'Risk ID': risk.id,
            'Name': risk.assessment.name,
            'Description': risk.assessment.description,
            'Folder': risk.assessment.folder.name,
            'Status': risk.status,
            'Risk Matrix': risk.matrix?.name || 'N/A',
            'Scenarios Count': scenariosCount,
            'Avg. Likelihood': avgLikelihood.toFixed(2),
            'Avg. Impact': avgImpact.toFixed(2),
            'Avg. Risk Score': avgRiskScore.toFixed(2),
            'Created At': risk.assessment.createdAt.toISOString(),
        };
    });

    const csv = Papa.unparse(dataForCsv);

    return new NextResponse(csv, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="risks-export-${new Date().toISOString()}.csv"`,
        },
    });
}
