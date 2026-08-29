import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standardized API response helpers for INCLUSA.
 * Ensures every endpoint returns the same shape: { success, data?, error?, details?, timestamp }
 */

export interface ApiSuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Array<{ path: string; message: string }>;
  timestamp: string;
}

/**
 * Return a successful JSON response.
 */
export function apiSuccess<T>(data?: T, status: number = 200, message?: string): NextResponse {
  const body: ApiSuccessResponse<T> = {
    success: true,
    timestamp: new Date().toISOString(),
  };
  if (data !== undefined) body.data = data;
  if (message) body.message = message;
  return NextResponse.json(body, { status });
}

/**
 * Return an error JSON response.
 */
export function apiError(message: string, status: number = 500): NextResponse {
  const body: ApiErrorResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
}

/**
 * Return a Zod validation error response (400).
 * Extracts field-level error details for the client.
 */
export function apiValidationError(zodError: ZodError): NextResponse {
  const issues = zodError.issues || [];
  const details = issues.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  const body: ApiErrorResponse = {
    success: false,
    error: `Validation failed: ${details.map((d) => d.message).join('; ')}`,
    details,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status: 400 });
}

/**
 * Return a 401 Unauthorized response.
 */
export function apiUnauthorized(message: string = 'Authentication required'): NextResponse {
  return apiError(message, 401);
}

/**
 * Return a 404 Not Found response.
 */
export function apiNotFound(message: string = 'Resource not found'): NextResponse {
  return apiError(message, 404);
}
