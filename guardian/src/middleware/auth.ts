import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jst';
import { UserRole } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '@/lib/api/error';

export async function requireAuth(request: NextRequest, roles?: UserRole[]) {
  // Get the session token from the request cookies
  const token = await getToken({ req: request });
  
  // If no token, user is not authenticated
  if (!token) {
    throw new UnauthorizedError('Authentication required');
  }

  // If roles are specified, check if user has required role
  if (roles && roles.length > 0) {
    const userRole = token.role as UserRole;
    
    // Super admin has access to everything
    if (userRole === UserRole.SUPER_ADMIN) {
      return token;
    }

    // Check if user has one of the required roles
    if (!roles.includes(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }
  }

  return token;
}

export function withAuth(handler: Function, roles?: UserRole[]) {
  return async function (request: NextRequest, ...args: any[]) {
    try {
      const token = await requireAuth(request, roles);
      
      // Add user info to request for use in route handlers
      const newRequest = new NextRequest(request);
      newRequest.user = {
        id: token.sub,
        role: token.role,
        organizationId: token.organizationId,
      };
      
      return handler(newRequest, ...args);
    } catch (error) {
      // Let the error handler middleware handle the error
      throw error;
    }
  };
}
