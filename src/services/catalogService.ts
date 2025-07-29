import {Catalog, CatalogItem, ListItem, PaginatedResponse,SimpleList} from '@/types'

import {apiClient} from './apiClient'

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
    async getCatalogs(): Promise<Catalog[]> {
        const response = await apiClient.getMany<Catalog>('/catalogs')
        return response.content
    }

    async getLists(): Promise<SimpleList[]> {
        const response = await apiClient.getMany<SimpleList>('/lists')
        return response.content
    }


    // Get catalog info
    async getCatalogInfo(catalogKey: string): Promise<Catalog> {
        return await apiClient.get<Catalog>(`/catalogs/${catalogKey}/info`)
    }

    async getListInfo(catalogKey: string): Promise<SimpleList> {
        return await apiClient.get<SimpleList>(`/lists/api/${catalogKey}/info`)
    }


    async getCatalogItems(
        catalogKey: string,
        filters?: CatalogFilters
    ): Promise<PaginatedResponse<CatalogItem>> {
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
        return response
    }

    // Get list items with filters
    async getListItems(
        listKey: string,
        listType: `list` | `catalog`,
        filters?: CatalogFilters
    ): Promise<PaginatedResponse<ListItem>> {
        const params = new URLSearchParams()

        if (filters?.search) params.append('search', filters.search)
        if (filters?.page !== undefined) params.append('page', filters.page.toString())
        if (filters?.size !== undefined) params.append('size', filters.size.toString())
        if (filters?.sort) params.append('sort', filters.sort)
        if (filters?.direction) params.append('direction', filters.direction)

        return await apiClient.getMany<ListItem>(
            listType==='list'?`/lists/api/${listKey}?${params.toString()}`:`/catalogs/${listKey}?${params.toString()}`
        )

    }


    // Delete catalog item
    async deleteCatalogItem(catalogKey: string, itemId: string): Promise<void> {
        return await apiClient.delete(
            `/reference/${catalogKey}/items/${itemId}`
        )
    }

}

export const catalogService = new CatalogService()