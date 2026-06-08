export interface ApiResponse<TData> {
  success: true;
  data: TData;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export type NumericString = string;
