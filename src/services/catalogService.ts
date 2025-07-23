import {apiClient} from './apiClient'
import {ApiResponse, CatalogInfo, CatalogItem, ListItem, PaginatedResponse} from '@/types'

export interface CatalogFilters {
    search?: string
    status?: string[]
    page?: number
    size?: number
    sort?: string
    direction?: 'asc' | 'desc'
}

class CatalogService {
    // Get all available catalogs
    async getCatalogs(): Promise<CatalogInfo[]> {
        const response = await apiClient.getMany<CatalogInfo>('/reference')
        return response.content
    }


    // Get catalog info
    async getCatalogInfo(catalogKey: string): Promise<CatalogInfo> {
        return await apiClient.get<CatalogInfo>(`/reference/${catalogKey}/info`)
    }

    // Get list info
    async getListInfo(listKey: string): Promise<ApiResponse<CatalogInfo>> {
        const response = await apiClient.get<ApiResponse<CatalogInfo>>(`/lists/${listKey}`)
        return response.data
    }

    // Get catalog items with filters
    async getCatalogItems(
        catalogKey: string,
        filters?: CatalogFilters
    ): Promise<CatalogItem[]> {
        const params = new URLSearchParams()

        if (filters?.search) params.append('search', filters.search)
        if (filters?.page !== undefined) params.append('page', filters.page.toString())
        if (filters?.size !== undefined) params.append('size', filters.size.toString())
        if (filters?.sort) params.append('sort', filters.sort)
        if (filters?.direction) params.append('direction', filters.direction)
        if (filters?.status?.length) {
            filters.status.forEach(status => params.append('status', status))
        }

        const response = await apiClient.getMany<CatalogItem>(
            `/reference/${catalogKey}?${params.toString()}`
        )
        return response.content
    }

    // Get list items with filters
    async getListItems(
        listKey: string,
        filters?: CatalogFilters
    ): Promise<ApiResponse<PaginatedResponse<ListItem>>> {
        const params = new URLSearchParams()

        if (filters?.search) params.append('search', filters.search)
        if (filters?.page !== undefined) params.append('page', filters.page.toString())
        if (filters?.size !== undefined) params.append('size', filters.size.toString())
        if (filters?.sort) params.append('sort', filters.sort)
        if (filters?.direction) params.append('direction', filters.direction)

        const response = await apiClient.get<ApiResponse<PaginatedResponse<ListItem>>>(
            `/lists/${listKey}/item?${params.toString()}`
        )
        return response.data
    }

    // Create catalog item
    async createCatalogItem(catalogKey: string, data: Partial<CatalogItem>): Promise<ApiResponse<CatalogItem>> {
        const response = await apiClient.post<ApiResponse<CatalogItem>>(
            `/catalogs/${catalogKey}/items`,
            data
        )
        return response.data
    }

    // Create list item
    async createListItem(listKey: string, data: Partial<ListItem>): Promise<ApiResponse<ListItem>> {
        const response = await apiClient.post<ApiResponse<ListItem>>(
            `/lists/${listKey}/items`,
            data
        )
        return response.data
    }

    // Update catalog item
    async updateCatalogItem(
        catalogKey: string,
        itemId: string,
        data: Partial<CatalogItem>
    ): Promise<ApiResponse<CatalogItem>> {
        const response = await apiClient.put<ApiResponse<CatalogItem>>(
            `/catalogs/${catalogKey}/items/${itemId}`,
            data
        )
        return response.data
    }

    // Update list item
    async updateListItem(
        listKey: string,
        itemId: string,
        data: Partial<ListItem>
    ): Promise<ApiResponse<ListItem>> {
        const response = await apiClient.put<ApiResponse<ListItem>>(
            `/lists/${listKey}/items/${itemId}`,
            data
        )
        return response.data
    }

    // Delete catalog item
    async deleteCatalogItem(catalogKey: string, itemId: string): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(
            `/catalogs/${catalogKey}/items/${itemId}`
        )
        return response.data
    }

    // Delete list item
    async deleteListItem(listKey: string, itemId: string): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(
            `/lists/${listKey}/items/${itemId}`
        )
        return response.data
    }

    // Bulk delete catalog items
    async bulkDeleteCatalogItems(catalogKey: string, itemIds: string[]): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(
            `/catalogs/${catalogKey}/items/bulk`,
            {data: {ids: itemIds}}
        )
        return response.data
    }

    // Bulk delete list items
    async bulkDeleteListItems(listKey: string, itemIds: string[]): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(
            `/lists/${listKey}/items/bulk`,
            {data: {ids: itemIds}}
        )
        return response.data
    }

    // Export catalog items to Excel
    async exportCatalogItems(catalogKey: string, filters?: CatalogFilters): Promise<Blob> {
        const params = new URLSearchParams()

        if (filters?.search) params.append('search', filters.search)
        if (filters?.status?.length) {
            filters.status.forEach(status => params.append('status', status))
        }

        const response = await apiClient.get(
            `/catalogs/${catalogKey}/export?${params.toString()}`,
            {responseType: 'blob'}
        )
        return response.data
    }

    // Export list items to Excel
    async exportListItems(listKey: string, filters?: CatalogFilters): Promise<Blob> {
        const params = new URLSearchParams()

        if (filters?.search) params.append('search', filters.search)

        const response = await apiClient.get(
            `/lists/${listKey}/export?${params.toString()}`,
            {responseType: 'blob'}
        )
        return response.data
    }

    // Import catalog items from Excel
    async importCatalogItems(catalogKey: string, file: File): Promise<ApiResponse<{
        imported: number
        errors: Array<{ row: number; message: string }>
    }>> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post<ApiResponse<{
            imported: number
            errors: Array<{ row: number; message: string }>
        }>>(
            `/catalogs/${catalogKey}/import`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    }

    // Import list items from Excel
    async importListItems(listKey: string, file: File): Promise<ApiResponse<{
        imported: number
        errors: Array<{ row: number; message: string }>
    }>> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post<ApiResponse<{
            imported: number
            errors: Array<{ row: number; message: string }>
        }>>(
            `/lists/${listKey}/import`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    }

    // Get catalog item by id
    async getCatalogItem(catalogKey: string, itemId: string): Promise<ApiResponse<CatalogItem>> {
        const response = await apiClient.get<ApiResponse<CatalogItem>>(
            `/catalogs/${catalogKey}/items/${itemId}`
        )
        return response.data
    }

    // Get list item by id
    async getListItem(listKey: string, itemId: string): Promise<ApiResponse<ListItem>> {
        const response = await apiClient.get<ApiResponse<ListItem>>(
            `/lists/${listKey}/items/${itemId}`
        )
        return response.data
    }

    // Search across all catalogs
    async searchAllCatalogs(query: string): Promise<ApiResponse<{
        catalogs: Array<{ catalogKey: string; title: string; items: CatalogItem[] }>
        lists: Array<{ listKey: string; title: string; items: ListItem[] }>
    }>> {
        const response = await apiClient.get<ApiResponse<{
            catalogs: Array<{ catalogKey: string; title: string; items: CatalogItem[] }>
            lists: Array<{ listKey: string; title: string; items: ListItem[] }>
        }>>(`/search?q=${encodeURIComponent(query)}`)
        return response.data
    }
}

export const catalogService = new CatalogService()