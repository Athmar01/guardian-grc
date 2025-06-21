import { compare, hash } from 'bcryptjs';
import { prisma } from './prisma';
import { UserRole } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export async function createUser(email: string, password: string, name: string, role: UserRole = UserRole.VIEWER) {
  const hashedPassword = await hash(password, 12);
  
  return prisma.user.create({
    data: {
      email,
      name,
      role,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await compare(password, user.password || ''))) {
    throw new Error('Invalid email or password');
  }

  const token = sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Set HTTP-only cookie
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function logoutUser() {
  cookies().delete('token');
}

export async function getCurrentUser() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const payload = verify(token, JWT_SECRET) as { userId: string; role: UserRole };
    
    return prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        organization: true,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function requireUser(requiredRole?: UserRole) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }

  if (requiredRole && user.role !== requiredRole && user.role !== UserRole.SUPER_ADMIN) {
    throw new Error('Insufficient permissions');
  }

  return user;
}

export async function requireOrganizationAccess(organizationId: string) {
  const user = await requireUser();
  
  // Super admins can access any organization
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Regular users can only access their own organization
  if (user.organizationId !== organizationId) {
    throw new Error('Access to this organization is forbidden');
  }

  return true;
}
