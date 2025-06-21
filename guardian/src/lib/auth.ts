import { prisma } from './prisma';

// Mock authentication for development
// This will be replaced with Active Directory integration later

export type UserRole = 'ADMIN' | 'RISK_MANAGER' | 'AUDITOR' | 'COMPLIANCE_OFFICER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock user for development
export const mockUser: User = {
  id: 'dev-user-001',
  email: 'admin@guardian-grc.com',
  name: 'Development Admin',
  role: 'ADMIN' as const
};

// Mock auth functions
export function useAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
    userId: mockUser.id
  };
}

export function useUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: mockUser
  };
}

export function getAuth() {
  return {
    userId: mockUser.id,
    user: mockUser
  };
}

// For server-side auth checks
export async function currentUser() {
  return mockUser;
}

export function auth() {
  return {
    userId: mockUser.id,
    user: mockUser,
    protect: () => ({}), // No-op for now
    redirectToSignIn: () => ({}) // No-op for now
  };
}

export async function getRoleFromUser(userId: string): Promise<UserRole> {
  try {
    // In a real implementation, this would fetch the user's role from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    return (user?.role as UserRole) || 'VIEWER'; // Default to VIEWER if role not found
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'VIEWER';
  }
}

export function getCurrentUserRole(): UserRole {
  return mockUser.role as UserRole;
}
