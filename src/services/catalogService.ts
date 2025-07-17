import { apiClient } from './apiClient'
import {
    CatalogInfo,
    ListItem,
    CatalogItem,
    ApiResponse,
    PaginatedResponse,
    TableFilter,
    TableSort
} from '@/types'

interface CatalogQuery {
    page?: number
    size?: number
    search?: string
    filters?: TableFilter[]
    sort?: TableSort[]
}

class CatalogService {
    // Get available catalogs/lists
    async getCatalogs(): Promise<ApiResponse<CatalogInfo[]>> {
        return apiClient.get<CatalogInfo[]>('/catalogs')
    }

    async getCatalogInfo(key: string): Promise<ApiResponse<CatalogInfo>> {
        return apiClient.get<CatalogInfo>(`/catalogs/${key}`)
    }

    // List operations
    async getListItems(
        listKey: string,
        query?: CatalogQuery
    ): Promise<ApiResponse<PaginatedResponse<ListItem>>> {
        const params = this.buildQueryParams(query)
        return apiClient.get<PaginatedResponse<ListItem>>(`/lists/${listKey}`, { params })
    }

    async getListItem(listKey: string, id: string): Promise<ApiResponse<ListItem>> {
        return apiClient.get<ListItem>(`/lists/${listKey}/${id}`)
    }

    async createListItem(listKey: string, data: Omit<ListItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ListItem>> {
        return apiClient.post<ListItem>(`/lists/${listKey}`, data)
    }

    async updateListItem(listKey: string, id: string, data: Partial<ListItem>): Promise<ApiResponse<ListItem>> {
        return apiClient.put<ListItem>(`/lists/${listKey}/${id}`, data)
    }

    async deleteListItem(listKey: string, id: string): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`/lists/${listKey}/${id}`)
    }

    // Catalog operations
    async getCatalogItems(
        catalogKey: string,
        query?: CatalogQuery
    ): Promise<ApiResponse<PaginatedResponse<CatalogItem>>> {
        const params = this.buildQueryParams(query)
        return apiClient.get<PaginatedResponse<CatalogItem>>(`/catalog/${catalogKey}`, { params })
    }

    async getCatalogItem(catalogKey: string, id: string): Promise<ApiResponse<CatalogItem>> {
        return apiClient.get<CatalogItem>(`/catalog/${catalogKey}/${id}`)
    }

    async createCatalogItem(
        catalogKey: string,
        data: Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<ApiResponse<CatalogItem>> {
        return apiClient.post<CatalogItem>(`/catalog/${catalogKey}`, data)
    }

    async updateCatalogItem(
        catalogKey: string,
        id: string,
        data: Partial<CatalogItem>
    ): Promise<ApiResponse<CatalogItem>> {
        return apiClient.put<CatalogItem>(`/catalog/${catalogKey}/${id}`, data)
    }

    async deleteCatalogItem(catalogKey: string, id: string): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`/catalog/${catalogKey}/${id}`)
    }

    // Bulk operations
    async bulkCreateListItems(listKey: string, items: Omit<ListItem, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<ListItem[]>> {
        return apiClient.post<ListItem[]>(`/lists/${listKey}/bulk`, { items })
    }

    async bulkDeleteListItems(listKey: string, ids: string[]): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`/lists/${listKey}/bulk`, { data: { ids } })
    }

    async bulkCreateCatalogItems(
        catalogKey: string,
        items: Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'>[]
    ): Promise<ApiResponse<CatalogItem[]>> {
        return apiClient.post<CatalogItem[]>(`/catalog/${catalogKey}/bulk`, { items })
    }

    async bulkDeleteCatalogItems(catalogKey: string, ids: string[]): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`/catalog/${catalogKey}/bulk`, { data: { ids } })
    }

    // Import/Export
    async exportCatalog(catalogKey: string, format: 'csv' | 'xlsx' = 'xlsx'): Promise<void> {
        return apiClient.downloadFile(`/catalog/${catalogKey}/export?format=${format}`, `${catalogKey}.${format}`)
    }

    async importCatalog(catalogKey: string, file: File): Promise<ApiResponse<{ created: number; updated: number; errors: string[] }>> {
        return apiClient.uploadFile(`/catalog/${catalogKey}/import`, file)
    }

    private buildQueryParams(query?: CatalogQuery): Record<string, any> {
        if (!query) return {}

        const params: Record<string, any> = {}

        if (query.page !== undefined) params.page = query.page
        if (query.size !== undefined) params.size = query.size
        if (query.search) params.search = query.search

        if (query.filters && query.filters.length > 0) {
            params.filters = JSON.stringify(query.filters)
        }

        if (query.sort && query.sort.length > 0) {
            params.sort = query.sort.map(s => `${s.field},${s.direction}`).join(';')
        }

        return params
    }
}

export const catalogService = new CatalogService()