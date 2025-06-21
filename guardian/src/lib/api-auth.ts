// Server-side authentication helpers for API routes
// This will be replaced with Active Directory integration later

import { mockUser } from './auth';
import { NextRequest } from 'next/server';

export function auth() {
  return {
    userId: mockUser.id,
    user: mockUser,
    protect: async () => {
      // No-op for now, always authenticated
      return { userId: mockUser.id };
    }
  };
}

export async function currentUser() {
  return mockUser;
}

export async function getAuth(req: NextRequest) {
  return {
    userId: mockUser.id,
    user: mockUser
  };
}

// Mock Clerk client for user operations
export const clerkClient = () => ({
  users: {
    getUser: async (userId: string) => ({
      id: mockUser.id,
      emailAddresses: [{ id: '1', emailAddress: mockUser.email }],
      primaryEmailAddressId: '1'
    }),
    getUserList: async (params: any) => ({
      data: [mockUser]
    })
  }
});

export type EmailAddress = {
  id: string;
  emailAddress: string;
};

export type User = typeof mockUser;
