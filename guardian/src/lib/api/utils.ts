import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

export function successResponse<T>(data: T, meta?: ApiResponse<T>['meta']): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta,
  });
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return errorResponse(400, 'VALIDATION_ERROR', 'Validation failed', error.errors);
  }

  if (error instanceof Error) {
    return errorResponse(500, 'INTERNAL_SERVER_ERROR', error.message);
  }

  return errorResponse(500, 'UNKNOWN_ERROR', 'An unknown error occurred');
}

export async function withErrorHandling<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    return await handler();
  } catch (error) {
    return handleApiError(error) as NextResponse<ApiResponse<T>>;
  }
}

export const paginate = <T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): { data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } } => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);

  return {
    data: paginatedItems,
    meta: {
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit),
    },
  };
};
