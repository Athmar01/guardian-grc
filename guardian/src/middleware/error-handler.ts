import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError, handleApiError } from '@/lib/api/error';

export function apiErrorHandler(error: unknown) {
  console.error('API Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  // Handle our custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details && { details: error.details }),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle unexpected errors
  console.error('Unexpected error:', error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}

export function withErrorHandling(handler: Function) {
  return async function (...args: any[]) {
    try {
      return await handler(...args);
    } catch (error) {
      return apiErrorHandler(error);
    }
  };
}
