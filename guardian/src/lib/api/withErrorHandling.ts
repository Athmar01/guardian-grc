import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './error';

type Handler = (req: NextRequest, context: any) => Promise<NextResponse>;

export function withErrorHandling(handler: Handler) {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error('API Error:', error);
      
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
