import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { riskAssessmentService } from '@/lib/services/risk-assessment.service';
import { withErrorHandling } from '@/lib/api/withErrorHandling';
import { withRoleCheck } from '@/lib/api/withRoleCheck';
import { UserRole } from '@prisma/client';

// GET /api/risk-assessments - List risk assessments with pagination and filtering
const GET = withRoleCheck(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const riskId = searchParams.get('riskId') || undefined;
  const assessedById = searchParams.get('assessedById') || undefined;

  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const result = await riskAssessmentService.listRiskAssessments({
    riskId,
    assessedById,
    page,
    limit,
    userId: user.id,
    userRole: user.role as UserRole,
  });

  return NextResponse.json(result);
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER, UserRole.CONTROL_OWNER]);

// POST /api/risk-assessments - Create a new risk assessment
const POST = withRoleCheck(async (req: NextRequest) => {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, organizationId: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.organizationId) {
    return NextResponse.json({ error: 'User is not associated with an organization' }, { status: 400 });
  }

  const data = await req.json();

  try {
    const riskAssessment = await riskAssessmentService.createRiskAssessment({
      ...data,
      assessedById: userId,
    });

    return NextResponse.json(riskAssessment, { status: 201 });
  } catch (error: any) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create risk assessment' }, { status: 500 });
  }
}, [UserRole.ORG_ADMIN, UserRole.GRC_MANAGER, UserRole.CONTROL_OWNER]);

export { GET, POST };
