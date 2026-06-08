import type { ApiErrorResponse, ApiResponse } from '@/types/api';
import { getApiBaseUrl } from './config';

class ApiRequestError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
  }
}

export { ApiRequestError };

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(errorBody: ApiErrorResponse | null): string {
  return (
    (errorBody as any)?.error?.message ||   // ✅ backend format (your case)
    (errorBody as any)?.message ||          // fallback
    'Request failed.'
  );
}

async function parseApiResponse<TData>(response: Response): Promise<TData> {
  const body = await safeJson(response);

  // ❌ HANDLE ERROR
  if (!response.ok) {
    const message = extractErrorMessage(body);
    throw new ApiRequestError(message, response.status);
  }

  // ✅ HANDLE SUCCESS (STANDARD FORMAT)
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    'data' in body
  ) {
    return (body as ApiResponse<TData>).data;
  }

  // ✅ HANDLE LEGACY BACKEND FORMAT
  return (body?.data ??
          body?.investment ??
          body?.investments ??
          body) as TData;
}

function getNetworkErrorMessage(baseUrl: string): string {
  return `Backend not reachable at ${baseUrl}. Please start server.`;
}

export async function apiFetch<TData>(
  path: string,
  init?: RequestInit,
): Promise<TData> {
  const baseUrl = getApiBaseUrl();

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiRequestError(getNetworkErrorMessage(baseUrl), 503);
  }

  return parseApiResponse<TData>(response);
}

export async function apiRequest<TData>(
  path: string,
  init?: Omit<RequestInit, 'body'> & { body?: unknown },
): Promise<TData> {
  const baseUrl = getApiBaseUrl();

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiRequestError(getNetworkErrorMessage(baseUrl), 503);
  }

  return parseApiResponse<TData>(response);
}

// ---------------- HELPERS ----------------

export async function post<TData>(
  path: string,
  body?: unknown,
  tokenOrInit?: string | RequestInit,
): Promise<TData> {
  const init =
    typeof tokenOrInit === 'string'
      ? { headers: { Authorization: `Bearer ${tokenOrInit}` } }
      : tokenOrInit;

  return apiRequest<TData>(path, {
    ...init,
    method: 'POST',
    body,
  });
}

export async function get<TData>(
  path: string,
  tokenOrInit?: string | RequestInit,
): Promise<TData> {
  const init =
    typeof tokenOrInit === 'string'
      ? { headers: { Authorization: `Bearer ${tokenOrInit}` } }
      : tokenOrInit;

  return apiFetch<TData>(path, {
    ...init,
    method: 'GET',
  });
}