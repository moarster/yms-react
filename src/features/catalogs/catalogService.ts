import { apiClient, PaginatedResponse } from '@/core/api';

import { Catalog, CatalogItem, CatalogType, ListItem, SimpleList } from './catalog.types';

export interface CatalogFilters {
  direction?: 'asc' | 'desc';
  page?: number;
  search?: string;
  size?: number;
  sort?: string;
  status?: string[];
}

class CatalogService {
  // Get all available catalogs
  async getCatalogs(): Promise<Catalog[]> {
    const response = await apiClient.getMany<Catalog>('/catalogs');
    return response.content;
  }

  async getLists(): Promise<SimpleList[]> {
    const response = await apiClient.getMany<SimpleList>('/lists');
    return response.content;
  }

  // Get catalog info
  async getCatalogInfo(catalogKey: string): Promise<Catalog> {
    return await apiClient.get<Catalog>(`/catalogs/${catalogKey}/info`);
  }

  async getListInfo(catalogKey: string): Promise<SimpleList> {
    return await apiClient.get<SimpleList>(`/lists/${catalogKey}/info`);
  }

  async getCatalogItems(
    catalogKey: string,
    filters?: CatalogFilters,
  ): Promise<PaginatedResponse<CatalogItem>> {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.direction) params.append('direction', filters.direction);
    if (filters?.status?.length) {
      filters.status.forEach((status) => params.append('status', status));
    }

    return await apiClient.getMany<CatalogItem>(`/reference/${catalogKey}?${params.toString()}`);
  }

  // Get list items with filters
  async getListItems(
    listKey: string,
    listType: CatalogType,
    filters?: CatalogFilters,
  ): Promise<PaginatedResponse<ListItem>> {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.direction) params.append('direction', filters.direction);

    const response = await apiClient.getMany<ListItem>(
      listType === 'LIST'
        ? `/lists/${listKey}?${params.toString()}`
        : `/catalogs/${listKey}?${params.toString()}`,
    );
    return response;
  }

  // Delete catalog item
  async deleteCatalogItem(catalogKey: string, itemId: string): Promise<void> {
    return await apiClient.delete(`/reference/${catalogKey}/items/${itemId}`);
  }

  // Update catalog item
  async updateCatalogItem(
    catalogKey: string,
    itemId: string,
    data: Partial<CatalogItem>,
  ): Promise<CatalogItem> {
    return await apiClient.put(`/reference/${catalogKey}/items/${itemId}`, data);
  }

  // Update list item
  async updateListItem(
    listKey: string,
    itemId: string,
    data: Partial<ListItem>,
  ): Promise<ListItem> {
    return await apiClient.put(`/lists/${listKey}/items/${itemId}`, data);
  }
}

export const catalogService = new CatalogService();
