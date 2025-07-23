// services/documentService.ts
import { apiClient } from './apiClient'
import { ApiResponse, PaginatedResponse, ShipmentRfp, DocumentStatus, DocumentAction } from '@/types'

export interface DocumentFilters {
    status?: DocumentStatus[]
    search?: string
    dateFrom?: string
    dateTo?: string
    carrierId?: string
    clientId?: string
    page?: number
    size?: number
    sort?: string
    direction?: 'asc' | 'desc'
}

export interface BulkActionRequest {
    action: string
    documentIds: string[]
    parameters?: Record<string, any>
}

class DocumentService {
    // Get shipment RFPs with filters
    async getShipmentRfps(filters?: DocumentFilters): Promise<ApiResponse<PaginatedResponse<ShipmentRfp>>> {
        const params = new URLSearchParams()

        if (filters?.status?.length) {
            filters.status.forEach(status => params.append('status', status))
        }
        if (filters?.search) params.append('search', filters.search)
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
        if (filters?.dateTo) params.append('dateTo', filters.dateTo)
        if (filters?.carrierId) params.append('carrierId', filters.carrierId)
        if (filters?.clientId) params.append('clientId', filters.clientId)
        if (filters?.page !== undefined) params.append('page', filters.page.toString())
        if (filters?.size !== undefined) params.append('size', filters.size.toString())
        if (filters?.sort) params.append('sort', filters.sort)
        if (filters?.direction) params.append('direction', filters.direction)

        const response = await apiClient.get<ApiResponse<PaginatedResponse<ShipmentRfp>>>(
            `/domain/shipment-rfp/shipment-rfp?${params.toString()}`
        )
        return response.data
    }

    async getShipmentRfp(id: string): Promise<ApiResponse<ShipmentRfp>> {
        const response = await apiClient.get<ApiResponse<ShipmentRfp>>(`/domain/shipment-rfp/shipment-rfp/${id}`)
        return response.data
    }

    async createShipmentRfp(data: Partial<ShipmentRfp>): Promise<ApiResponse<ShipmentRfp>> {
        const response = await apiClient.post<ApiResponse<ShipmentRfp>>('/domain/shipment-rfp/shipment-rfp', data)
        return response.data
    }

    async updateShipmentRfp(id: string, data: Partial<ShipmentRfp>): Promise<ApiResponse<ShipmentRfp>> {
        const response = await apiClient.put<ApiResponse<ShipmentRfp>>(`/domain/shipment-rfp/shipment-rfp/${id}`, data)
        return response.data
    }


    async executeAction(documentId: string, action: string, parameters?: Record<string, any>): Promise<ApiResponse<ShipmentRfp>> {
        const response = await apiClient.patch<ApiResponse<ShipmentRfp>>(
            `/domain/shipment-rfp/shipment-rfp/${documentId}/${action}`,
            parameters || {}
        )
        return response.data
    }

    async getAvailableActions(documentId: string): Promise<ApiResponse<DocumentAction[]>> {
        const response = await apiClient.get<ApiResponse<DocumentAction[]>>(
            `/domain/shipment-rfp/shipment-rfp/${documentId}/tasks`
        )
        return response.data
    }

    // Bulk execute actions
    async executeBulkAction(request: BulkActionRequest): Promise<ApiResponse<{
        successful: string[]
        failed: Array<{ id: string; error: string }>
    }>> {
        const response = await apiClient.post<ApiResponse<{
            successful: string[]
            failed: Array<{ id: string; error: string }>
        }>>('/domain/shipment-rfp/bulk-actions', request)
        return response.data
    }

    // Upload attachment
    async uploadAttachment(documentId: string, file: File, description?: string): Promise<ApiResponse<{
        id: string
        filename: string
        size: number
        contentType: string
        uploadedAt: string
    }>> {
        const formData = new FormData()
        formData.append('file', file)
        if (description) {
            formData.append('description', description)
        }

        const response = await apiClient.post<ApiResponse<{
            id: string
            filename: string
            size: number
            contentType: string
            uploadedAt: string
        }>>(
            `/domain/shipment-rfp/${documentId}/attachments`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    }

    // Download attachment
    async downloadAttachment(documentId: string, attachmentId: string): Promise<Blob> {
        const response = await apiClient.get(
            `/domain/shipment-rfp/${documentId}/attachments/${attachmentId}/download`,
            { responseType: 'blob' }
        )
        return response.data
    }

    // Delete attachment
    async deleteAttachment(documentId: string, attachmentId: string): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(
            `/domain/shipment-rfp/${documentId}/attachments/${attachmentId}`
        )
        return response.data
    }

    // Export documents
    async exportShipmentRfps(filters?: DocumentFilters): Promise<Blob> {
        const params = new URLSearchParams()

        if (filters?.status?.length) {
            filters.status.forEach(status => params.append('status', status))
        }
        if (filters?.search) params.append('search', filters.search)
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
        if (filters?.dateTo) params.append('dateTo', filters.dateTo)
        if (filters?.carrierId) params.append('carrierId', filters.carrierId)
        if (filters?.clientId) params.append('clientId', filters.clientId)

        const response = await apiClient.get(
            `/domain/shipment-rfp/export?${params.toString()}`,
            { responseType: 'blob' }
        )
        return response.data
    }

    // Get document statistics
    async getStatistics(filters?: Pick<DocumentFilters, 'dateFrom' | 'dateTo' | 'carrierId' | 'clientId'>): Promise<ApiResponse<{
        totalCount: number
        statusCounts: Record<DocumentStatus, number>
        recentActivity: Array<{
            documentId: string
            action: string
            timestamp: string
            userId: string
        }>
    }>> {
        const params = new URLSearchParams()

        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
        if (filters?.dateTo) params.append('dateTo', filters.dateTo)
        if (filters?.carrierId) params.append('carrierId', filters.carrierId)
        if (filters?.clientId) params.append('clientId', filters.clientId)

        const response = await apiClient.get<ApiResponse<{
            totalCount: number
            statusCounts: Record<DocumentStatus, number>
            recentActivity: Array<{
                documentId: string
                action: string
                timestamp: string
                userId: string
            }>
        }>>(`/domain/shipment-rfp/statistics?${params.toString()}`)
        return response.data
    }

    // Validate document data
    async validateDocument(data: Partial<ShipmentRfp>): Promise<ApiResponse<{
        valid: boolean
        errors: Array<{
            field: string
            message: string
            code: string
        }>
        warnings: Array<{
            field: string
            message: string
            code: string
        }>
    }>> {
        const response = await apiClient.post<ApiResponse<{
            valid: boolean
            errors: Array<{
                field: string
                message: string
                code: string
            }>
            warnings: Array<{
                field: string
                message: string
                code: string
            }>
        }>>('/domain/shipment-rfp/validate', data)
        return response.data
    }

    // Duplicate document
    async duplicateShipmentRfp(id: string, modifications?: Partial<ShipmentRfp>): Promise<ApiResponse<ShipmentRfp>> {
        const response = await apiClient.post<ApiResponse<ShipmentRfp>>(
            `/domain/shipment-rfp/${id}/duplicate`,
            modifications || {}
        )
        return response.data
    }

    // Get document history/audit trail
    async getDocumentHistory(id: string): Promise<ApiResponse<Array<{
        timestamp: string
        action: string
        userId: string
        userName: string
        changes: Record<string, { oldValue: any; newValue: any }>
        comment?: string
    }>>> {
        const response = await apiClient.get<ApiResponse<Array<{
            timestamp: string
            action: string
            userId: string
            userName: string
            changes: Record<string, { oldValue: any; newValue: any }>
            comment?: string
        }>>>(`/domain/shipment-rfp/${id}/history`)
        return response.data
    }
}

export const documentService = new DocumentService()