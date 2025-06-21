import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

type Handler = (req: NextRequest, context: any) => Promise<NextResponse>;

export function withRoleCheck(handler: Handler, allowedRoles: UserRole[]) {
  return async (req: NextRequest, context: any) => {
    const session = await auth();
    
    if (!session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database to verify role
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has required role
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Add user to request context
    context.user = {
      id: session.userId,
      role: user.role,
    };

    return handler(req, context);
  };
}
