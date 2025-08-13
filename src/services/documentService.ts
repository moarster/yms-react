import {
    DocumentStatus, DomainEntity,
    PaginatedResponse, PaginationParams,
    ShipmentRfp,
    ShipmentRfpData,
    UserTask,
    UserTasks,
} from '@/types'

import { apiClient } from '../core/api/client.ts'

export interface ShipmentRfpSearchParams extends PaginationParams {
    status?: DocumentStatus[]
}

class DocumentService {
    async getShipmentRfps(searchParams?: ShipmentRfpSearchParams): Promise<PaginatedResponse<ShipmentRfp>> {
        const params = new URLSearchParams()
        if (searchParams?.status?.length) {
            searchParams.status.forEach(status => params.append('status', status))
        }
        if (searchParams?.page !== undefined) params.append('page', searchParams.page.toString())
        if (searchParams?.size !== undefined) params.append('size', searchParams.size.toString())
        if (searchParams?.sort) params.append('sort', searchParams.sort)
        if (searchParams?.direction) params.append('direction', searchParams.direction)

        return await apiClient.getMany<ShipmentRfp>(
            `/domain/shipment-rfp/shipment-rfp?${params.toString()}`
        )
    }

    async getShipmentRfp(id: string): Promise<ShipmentRfp> {
        return await apiClient.get<ShipmentRfp>(`/domain/shipment-rfp/shipment-rfp/${id}`)
    }

    async createShipmentRfp(data: ShipmentRfpData): Promise<ShipmentRfp> {
        const response = await apiClient.post<DomainEntity<ShipmentRfpData>>('/domain/shipment-rfp/shipment-rfp', {data})
        return response
    }

    async updateShipmentRfp(id: string, data: ShipmentRfp): Promise<ShipmentRfp> {
        const response = await apiClient.put<ShipmentRfp>(`/domain/shipment-rfp/shipment-rfp/${id}`, data)
        return response
    }


    async executeAction(documentId: string, action: string, data: Partial<ShipmentRfp>): Promise<ShipmentRfp> {
        const response = await apiClient.patch<ShipmentRfp>(
            `/domain/shipment-rfp/shipment-rfp/${documentId}/${action}`,data
        )
        return response
    }

    async getAvailableActions(documentId: string): Promise<UserTask[]> {
        const response = await apiClient.getAny<UserTasks>(
            `/domain/shipment-rfp/shipment-rfp/${documentId}/tasks`
        )
        return response.tasks
    }

    async createShipmentRfpFromWizard(data: Partial<ShipmentRfpData>): Promise<ShipmentRfp> {
        // Transform wizard data to API format
        const transformedData = this.transformWizardData(data)
        return await this.createShipmentRfp( transformedData)
    }

    private transformWizardData(wizardData: Partial<ShipmentRfpData>): ShipmentRfpData {
        return {
            ...wizardData,
            // Ensure all required fields are present with defaults
            _shipmentType: wizardData._shipmentType || { id: '', name: '' },
            _transportationType: wizardData._transportationType || { id: '', name: '' },
            _currency: wizardData._currency || { id: '', name: '' },
            route: wizardData.route || [],
            attachments: wizardData.attachments || [],
            express: wizardData.express || false
        } as ShipmentRfpData
    }

}

export const documentService = new DocumentService()