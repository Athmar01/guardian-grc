import { NextResponse } from 'next/server';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
};

export function successResponse<T>(
  data: T,
  meta?: ApiResponse<T>['meta'],
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status }
  );
}

export function notFoundResponse(resource: string, id?: string) {
  return errorResponse(
    404,
    'NOT_FOUND',
    `${resource}${id ? ` with ID ${id}` : ''} not found`
  );
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(401, 'UNAUTHORIZED', message);
}

export function forbiddenResponse(message = 'Forbidden') {
  return errorResponse(403, 'FORBIDDEN', message);
}

export function validationErrorResponse(errors: any) {
  return errorResponse(400, 'VALIDATION_ERROR', 'Validation failed', errors);
}

export function conflictResponse(message: string) {
  return errorResponse(409, 'CONFLICT', message);
}

export function internalServerErrorResponse(message = 'Internal server error') {
  return errorResponse(500, 'INTERNAL_SERVER_ERROR', message);
}
