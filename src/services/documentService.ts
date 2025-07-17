import { apiClient } from './apiClient'
import {
    ShipmentRfp,
    DocumentAction,
    ApiResponse,
    PaginatedResponse,
    TableFilter,
    TableSort
} from '@/types'

interface DocumentQuery {
    page?: number
    size?: number
    search?: string
    filters?: TableFilter[]
    sort?: TableSort[]
    status?: string[]
}

class DocumentService {
    // Shipment RFP operations
    async getShipmentRfps(query?: DocumentQuery): Promise<ApiResponse<PaginatedResponse<ShipmentRfp>>> {
        const params = this.buildQueryParams(query)
        return apiClient.post<PaginatedResponse<ShipmentRfp>>('/domain/shipment-rfp/shipment-rfp/search',params)
    }

    async getShipmentRfp(id: string): Promise<ApiResponse<ShipmentRfp>> {
        return apiClient.get<ShipmentRfp>(`/domain/shipment-rfp/shipment-rfp/${id}`)
    }

    async createShipmentRfp(data: Omit<ShipmentRfp, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<ApiResponse<ShipmentRfp>> {
        return apiClient.post<ShipmentRfp>('/domain/shipment-rfp/shipment-rfp', data)
    }

    async updateShipmentRfp(id: string, data: Partial<ShipmentRfp>): Promise<ApiResponse<ShipmentRfp>> {
        return apiClient.put<ShipmentRfp>(`/domain/shipment-rfp/shipment-rfp/${id}`, data)
    }


    // Document actions (workflow)
    async getAvailableActions(service: string, entity: string, id: string): Promise<ApiResponse<DocumentAction[]>> {
        return apiClient.get<DocumentAction[]>(`/domain/${service}/${entity}/${id}/actions`)
    }

    async executeAction(
        service: string,
        entity: string,
        id: string,
        action: string,
        data?: any
    ): Promise<ApiResponse<any>> {
        return apiClient.post(`/domain/${service}/${entity}/${id}/${action}`, data)
    }

    async sendMessage(
        service: string,
        entity: string,
        id: string,
        message: string,
        data?: any
    ): Promise<ApiResponse<any>> {
        return apiClient.patch(`/domain/${service}/${entity}/${id}/${message}`, data)
    }


    async downloadAttachment(
        service: string,
        entity: string,
        id: string,
        attachmentId: string,
        filename?: string
    ): Promise<void> {
        return apiClient.downloadFile(
            `/domain/${service}/${entity}/${id}/attachments/${attachmentId}/download`,
            filename
        )
    }

    // Specific RFP actions
    async publishRfp(id: string): Promise<ApiResponse<ShipmentRfp>> {
        return this.executeAction('shipment-rfp', 'shipment-rfp', id, 'publish')
    }

    async cancelRfp(id: string, reason?: string): Promise<ApiResponse<ShipmentRfp>> {
        return this.executeAction('shipment-rfp', 'shipment-rfp', id, 'cancel', { reason })
    }

    async confirmRfp(id: string, data?: any): Promise<ApiResponse<ShipmentRfp>> {
        return this.executeAction('shipment-rfp', 'shipment-rfp', id, 'confirm', data)
    }

    async completeRfp(id: string, data?: any): Promise<ApiResponse<ShipmentRfp>> {
        return this.executeAction('shipment-rfp', 'shipment-rfp', id, 'complete', data)
    }

    // RFP rates management
    async submitRate(rfpId: string, rateData: any): Promise<ApiResponse<any>> {
        return apiClient.post(`/domain/shipment-rfp/shipment-rfp/${rfpId}/rates`, rateData)
    }

    async updateRate(rfpId: string, rateId: string, rateData: any): Promise<ApiResponse<any>> {
        return apiClient.put(`/domain/shipment-rfp/shipment-rfp/${rfpId}/rates/${rateId}`, rateData)
    }

    async deleteRate(rfpId: string, rateId: string): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`/domain/shipment-rfp/shipment-rfp/${rfpId}/rates/${rateId}`)
    }

    // Document history and audit
    async getDocumentHistory(service: string, entity: string, id: string): Promise<ApiResponse<any[]>> {
        return apiClient.get<any[]>(`/domain/${service}/${entity}/${id}/history`)
    }

    async getDocumentAuditLog(service: string, entity: string, id: string): Promise<ApiResponse<any[]>> {
        return apiClient.get<any[]>(`/domain/${service}/${entity}/${id}/audit`)
    }

    // Document templates and schemas
    async getDocumentSchema(service: string, entity: string): Promise<ApiResponse<any>> {
        return apiClient.get<any>(`/domain/${service}/${entity}/schema`)
    }

    async getDocumentTemplate(service: string, entity: string, templateName: string): Promise<ApiResponse<any>> {
        return apiClient.get<any>(`/domain/${service}/${entity}/templates/${templateName}`)
    }

    private buildQueryParams(query?: DocumentQuery): Record<string, any> {
        if (!query) return {}

        const params: Record<string, any> = {}

        if (query.page !== undefined) params.page = query.page
        if (query.size !== undefined) params.size = query.size
        if (query.search) params.search = query.search

        if (query.status && query.status.length > 0) {
            params.status = query.status.join(',')
        }

        if (query.filters && query.filters.length > 0) {
            params.filters = JSON.stringify(query.filters)
        }

        if (query.sort && query.sort.length > 0) {
            params.sort = query.sort.map(s => `${s.field},${s.direction}`).join(';')
        }

        return params
    }
}

export const documentService = new DocumentService()