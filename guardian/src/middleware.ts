import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Temporary middleware that allows all requests
// Authentication will be re-enabled later
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For all requests, add default user headers
  const requestHeaders = new Headers(request.headers);
  
  // Set default user for development
  if (!requestHeaders.has('x-user-id')) {
    requestHeaders.set('x-user-id', 'dev-user');
    requestHeaders.set('x-user-role', 'admin');
  }
  
  // Skip auth for all routes
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Match all routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
