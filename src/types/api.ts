import {BaseEntity} from "@/types/dataModel.ts";

export interface ApiResponse<T extends BaseEntity> {
    body: T
    success: boolean
    message?: string
    errors?: string[]
}

export interface PaginatedResponse<T extends BaseEntity> {
    content: T[]
    page: {
        number: number
        size: number
        totalElements: number
        totalPages: number
        first: boolean
        last: boolean
        numberOfElements: number
        empty: boolean
    }
}


export interface ApiError {
    message: string
    code: string
    details?: Record<string, any>
    timestamp?: string
    path?: string
}

export interface ValidationError {
    field: string
    message: string
    code: string
    rejectedValue?: any
}

export interface BulkOperationResult<T = string> {
    successful: T[]
    failed: Array<{
        id: T
        error: string
        code?: string
    }>
    totalProcessed: number
    successCount: number
    failureCount: number
}

export interface UploadResult {
    id: string
    filename: string
    originalName: string
    size: number
    contentType: string
    uploadedAt: string
    url?: string
}

export interface ImportResult {
    imported: number
    skipped: number
    errors: Array<{
        row: number
        field?: string
        message: string
        data?: Record<string, any>
    }>
    warnings: Array<{
        row: number
        field?: string
        message: string
        data?: Record<string, any>
    }>
}