import { BaseEntity } from '@/types';

export interface ApiResponse<T> {
  body: T;
  errors?: string[];
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T extends BaseEntity> extends PageInfo{
  content: T[];
}

export interface PageInfo {
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

export interface ApiError {
  code: string;
  details?: Record<string, unknown>;
  message: string;
  path?: string;
  timestamp?: string;
}

export interface PaginationParams {
  direction?: 'asc' | 'desc';
  page?: number;
  size?: number;
  sort?: string;
}

export type UIFilterOperand = 'BETWEEN' | 'EQ' | 'GT' | 'IN' | 'LIKE' | 'LT';

export interface FilterDescription {
  fieldName: string;
  operand: UIFilterOperand;
  value: string[];
}

export interface SearchParams extends PaginationParams {
  filters?: FilterDescription[];
}

// Response type helpers
export type SuccessResponse<T> = ApiResponse<T> & { success: true };
export type ErrorResponse = ApiResponse<never> & { success: false; message: string };

export const isApiError = (response: unknown): response is ApiError =>
  typeof response === 'object' && response !== null && 'message' in response && 'code' in response;
