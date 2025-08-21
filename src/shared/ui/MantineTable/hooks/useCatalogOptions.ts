import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { catalogService } from '@/features/catalogs/catalogService';
import { catalogCacheService } from '@/shared/cache/catalogCacheService';
import { BaseEntity } from '@/types';

interface UseCatalogOptionsParams {
  catalog: string;
  enabled?: boolean;
  linkType: 'CATALOG' | 'LIST';
}

export const useCatalogOptions = ({
  catalog,
  enabled = true,
  linkType,
}: UseCatalogOptionsParams) => {
  const queryKey = ['catalog-options', catalog, linkType];

  const {
    data: options = [],
    error,
    isLoading,
  } = useQuery({
    enabled,
    queryFn: async (): Promise<BaseEntity[]> => {
      // Check cache first
      const cached = catalogCacheService.get<BaseEntity[]>(catalog, linkType);
      if (cached) {
        return cached;
      }

      // Fetch from API
      const result = await catalogService.getListItems(catalog, linkType);
      const entities = result.content;

      // Cache the result
      catalogCacheService.set(catalog, linkType, entities);

      return entities;
    },
    queryKey,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const optionsMap = useMemo(
    () => new Map(options.map((option) => [option.id!, option])),
    [options],
  );

  const getOptionById = (id: string) => optionsMap.get(id);

  const getOptionTitle = (id: string) => {
    const option = getOptionById(id);
    return option?.title || option?.id || 'Unknown';
  };

  return {
    error,
    getOptionById,
    getOptionTitle,
    isLoading,
    options,
    optionsMap,
  };
};
