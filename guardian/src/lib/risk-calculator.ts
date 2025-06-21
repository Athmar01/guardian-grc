import { RiskMatrix } from '@prisma/client';

// Define the structure of the JSON fields in the RiskMatrix model
interface ScaleItem {
    name: string;
    value: number;
    description: string;
}

interface LevelItem {
    name: string;
    color: string;
    range: [number, number];
}

interface CalculatedRisk {
    riskScore: number;
    riskLevel: string;
}

/**
 * Calculates the risk score and determines the risk level based on a given risk matrix.
 * 
 * @param likelihoodScore - The numerical score for likelihood (e.g., 1-5).
 * @param impactScore - The numerical score for impact (e.g., 1-5).
 * @param matrix - The RiskMatrix object from Prisma, containing the scoring rules.
 * @returns An object containing the calculated riskScore and the corresponding riskLevel name.
 *          Returns null if the matrix levels are not properly defined.
 */
export function calculateRiskScore(
    likelihoodScore: number,
    impactScore: number,
    matrix: RiskMatrix
): CalculatedRisk | null {
    // Ensure the JSON fields are parsed correctly
    const levels = matrix.levels as unknown as LevelItem[];

    if (!Array.isArray(levels)) {
        console.error('Risk matrix levels are not configured correctly.');
        return null;
    }

    // Simple multiplication is a common way to calculate the raw score
    const riskScore = likelihoodScore * impactScore;

    // Find the corresponding risk level from the matrix definitions
    const level = levels.find(l => riskScore >= l.range[0] && riskScore <= l.range[1]);

    return {
        riskScore,
        riskLevel: level ? level.name : 'Undefined',
    };
}
