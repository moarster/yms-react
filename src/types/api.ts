import { BaseEntity } from './base'

export interface ApiResponse<T> {
    body: T
    success: boolean
    message?: string
    errors?: string[]
}

export interface PaginatedResponse<T extends BaseEntity> {
    content: T[]
    page: PageInfo
}

export interface PageInfo {
    number: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
    numberOfElements: number
    empty: boolean
}

export interface ApiError {
    message: string
    code: string
    details?: Record<string, unknown>
    timestamp?: string
    path?: string
}


export interface PaginationParams {
    page?: number
    size?: number
    sort?: string
    direction?: 'asc' | 'desc'
}

export type UIFilterOperand =
    | 'EQ'
    | 'LIKE'
    | 'IN'
    | 'GT'
    | 'LT'
    | 'BETWEEN';

export interface FilterDescription {
    fieldName: string;
    value: string[];
    operand: UIFilterOperand;
}

export interface SearchParams extends PaginationParams {
    filters?: FilterDescription[];
}

// Response type helpers
export type SuccessResponse<T> = ApiResponse<T> & { success: true }
export type ErrorResponse = ApiResponse<never> & { success: false; message: string }

// Type guard for API responses
export const isApiError = (response: unknown): response is ApiError =>
    typeof response === 'object' &&
    response !== null &&
    'message' in response &&
    'code' in response