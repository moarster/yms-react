import {BaseEntity} from "@/types/dataModel.ts";

export interface ApiResponse<T extends BaseEntity> {
    body: T
    success: boolean
    message?: string
    errors?: string[]
}

export interface PaginatedResponse<T extends BaseEntity> {
    content: T[]
    page: Pageable
}

export interface Pageable {
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
    details?: Record<string, any>
    timestamp?: string
    path?: string
}
