import { apiClient } from './apiClient'
import { PaginatedResponse, ShipmentRfp, DocumentStatus, DocumentActions,DocumentTask } from '@/types'

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
    async getShipmentRfps(filters?: DocumentFilters): Promise<PaginatedResponse<ShipmentRfp>> {
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

        return await apiClient.getMany<ShipmentRfp>(
            `/domain/shipment-rfp/shipment-rfp?${params.toString()}`
        )
    }

    async getShipmentRfp(id: string): Promise<ShipmentRfp> {
        return await apiClient.get<ShipmentRfp>(`/domain/shipment-rfp/shipment-rfp/${id}`)
    }

    async createShipmentRfp(data: Partial<ShipmentRfp>): Promise<ShipmentRfp> {
        const response = await apiClient.post<ShipmentRfp>('/domain/shipment-rfp/shipment-rfp', data)
        return response.data
    }

    async updateShipmentRfp(id: string, data: Partial<ShipmentRfp>): Promise<ShipmentRfp> {
        const response = await apiClient.put<ShipmentRfp>(`/domain/shipment-rfp/shipment-rfp/${id}`, data)
        return response.data
    }


    async executeAction(documentId: string, action: string, parameters?: Record<string, any>): Promise<ShipmentRfp> {
        const response = await apiClient.patch<ShipmentRfp>(
            `/domain/shipment-rfp/shipment-rfp/${documentId}/${action}`,
            parameters || {}
        )
        return response.data
    }

    async getAvailableActions(documentId: string): Promise<DocumentTask[]> {
        const response = await apiClient.getAny<DocumentActions>(
            `/domain/shipment-rfp/shipment-rfp/${documentId}/tasks`
        )
        return response.tasks
    }

    // Upload attachment
    async uploadAttachment(documentId: string, file: File, description?: string): Promise<{
        id: string
        filename: string
        size: number
        contentType: string
        uploadedAt: string
    }> {
        const formData = new FormData()
        formData.append('file', file)
        if (description) {
            formData.append('description', description)
        }

        const response = await apiClient.post<{
            id: string
            filename: string
            size: number
            contentType: string
            uploadedAt: string
        }>(
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


}

export const documentService = new DocumentService()