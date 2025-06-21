import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function withAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  roles: UserRole[] = [],
  handler: (req: NextApiRequest, res: NextApiResponse, userId: string) => Promise<void>
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, organizationId: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (roles.length > 0 && !roles.includes(user.role as UserRole)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    // Add user to request for use in handlers
    (req as any).user = user;
    
    return await handler(req, res, user.id);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}

export function validateBody<T>(body: any, schema: any): { valid: boolean; data?: T; error?: string } {
  try {
    const result = schema.safeParse(body);
    if (!result.success) {
      return { 
        valid: false, 
        error: result.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ') 
      };
    }
    return { valid: true, data: result.data as T };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Validation error' 
    };
  }
}

export async function getOrganizationId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true }
  });
  return user?.organizationId || null;
}
