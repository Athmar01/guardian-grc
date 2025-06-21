import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import Papa from 'papaparse';
import { z } from 'zod';
import type { Folder, RiskMatrix } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { setCache } from '@/lib/cache';

const riskImportRowSchema = z.object({
    Name: z.string().min(1, 'Name is required.'),
    Description: z.string().optional(),
    Folder: z.string().min(1, 'Folder name is required.'),
    Status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
    'Risk Matrix': z.string().min(1, 'Risk Matrix name is required.'),
    'Risk ID': z.string().optional(), // Used to identify existing risks for updates
});

/**
 * @swagger
 * /api/risks/import/validate:
 *   post:
 *     summary: Validate a CSV file for risk import
 *     tags:
 *       - Risks
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: 'string', format: 'binary' }
 *     responses:
 *       200:
 *         description: Validation successful. Returns a summary and a validation token.
 *       400:
 *         description: Validation failed or bad request.
 */
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new NextResponse(JSON.stringify({ error: 'No file uploaded.' }), { status: 400 });
        }

        const fileContent = await file.text();
        const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

        const validationResults: {
            toCreate: any[];
            toUpdate: any[];
            errors: any[];
        } = {
            toCreate: [],
            toUpdate: [],
            errors: [],
        };

        const allFolders = await prisma.folder.findMany();
        const allMatrices = await prisma.riskMatrix.findMany();

        for (let i = 0; i < parsed.data.length; i++) {
            const row = parsed.data[i];
            const rowIndex = i + 2; // For user-friendly error messages (1-based index + header)

            const validation = riskImportRowSchema.safeParse(row);
            if (!validation.success) {
                validationResults.errors.push({ row: rowIndex, error: validation.error.format() });
                continue;
            }

            const { Folder, 'Risk Matrix': matrixName, 'Risk ID': riskId } = validation.data;

            const folder = allFolders.find((f: Folder) => f.name === Folder);
            if (!folder) {
                validationResults.errors.push({ row: rowIndex, error: `Folder '${Folder}' not found.` });
                continue;
            }

            const canAccess = await hasPermission(userId, 'create_riskassessment', folder.id);
            if (!canAccess) {
                validationResults.errors.push({ row: rowIndex, error: `You do not have permission to create risks in folder '${Folder}'.` });
                continue;
            }

            const matrix = allMatrices.find((m: RiskMatrix) => m.name === matrixName);
            if (!matrix) {
                validationResults.errors.push({ row: rowIndex, error: `Risk Matrix '${matrixName}' not found.` });
                continue;
            }

            if (riskId) {
                validationResults.toUpdate.push({ ...validation.data, folderId: folder.id, matrixId: matrix.id });
            } else {
                validationResults.toCreate.push({ ...validation.data, folderId: folder.id, matrixId: matrix.id });
            }
        }

        if (validationResults.errors.length > 0) {
            return new NextResponse(JSON.stringify({ errors: validationResults.errors }), { status: 400 });
        }

        const validationToken = uuidv4();
        setCache(validationToken, { toCreate: validationResults.toCreate, toUpdate: validationResults.toUpdate }); // Default TTL is 10 minutes

        return NextResponse.json({
            message: 'Validation successful.',
            summary: {
                createCount: validationResults.toCreate.length,
                updateCount: validationResults.toUpdate.length,
            },
            validationToken,
        });

    } catch (error) {
        console.error('Import validation error:', error);
        return new NextResponse(JSON.stringify({ error: 'An unexpected error occurred during validation.' }), { status: 500 });
    }
}
