import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

import { CatalogType } from '@/features/catalogs/catalog.types.ts';
import { catalogService } from '@/features/catalogs/catalogService.ts';
import { catalogCacheService } from '@/shared/cache/catalogCacheService.ts';
import { ReferentLink } from '@/types';
import { useEntity } from '@/hooks/useEntity.ts';

interface UseReferenceParams {
  catalog: string;
  linkType: CatalogType;
  value: ReferentLink | null;
  searchable?: boolean;
  onChange?: (value: ReferentLink | null) => void;
  enabled?: boolean;
}

export const useReference = ({
  catalog,
  enabled = true,
  linkType,
  onChange = () => {},
  searchable = true,
  value,
}: UseReferenceParams) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getTitle } = useEntity();

  const {
    data: options = [],
    error,
    isLoading,
  } = useQuery({
    enabled,
    queryFn: async (): Promise<ReferentLink[]> => {
      // Check cache first
      const cached = catalogCacheService.get<ReferentLink[]>(catalog, linkType);
      if (cached) {
        return cached;
      }

      // Fetch from API
      const result = await catalogService.getListItems(catalog, linkType);
      const entities = result.content.map((item): ReferentLink => {
        return {
          domain: linkType === 'LIST' ? 'lists' : 'reference',
          catalog,
          id: item.id,
          title: item.title,
        }
      });

      // Cache the result
      catalogCacheService.set(catalog, linkType, entities);

      return entities;
    },
    queryKey: ['catalog-options', catalog, linkType],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const optionsMap = useMemo(
    () => new Map(options.map((option) => [option.id!, option])),
    [options],
  );

  const getOptionById = (id: string) => optionsMap.get(id);
  const getOptionTitleById = (id: string): string => {
    const option = getOptionById(id);
    return option ? getTitle(option) : 'Unknown';
  };

  const displayValue = value ? getTitle(value) : '';
  const shouldFilterOptions = searchable && searchTerm && searchTerm !== displayValue;

  const filteredOptions = shouldFilterOptions
    ? options.filter((option) =>
        getTitle(option).toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
    : options;

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find((option) => getTitle(option) === selectedValue);
    if (selectedOption) {
      onChange(selectedOption);
      setSearchTerm(selectedValue);
    }
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
  };

  const resetSearch = () => {
    setSearchTerm(displayValue);
  };

  const comboboxOptions = useMemo(
    () =>
      filteredOptions.map((option) => ({
        active: value?.id === option.id,
        key: option.id,
        label: getTitle(option),
        option,
        value: getTitle(option),
      })),
    [filteredOptions, value?.id, getTitle],
  );

  return {
    // Data
    options,
    filteredOptions,
    comboboxOptions,
    isLoading,
    error,

    // State
    searchTerm,
    displayValue,

    // Handlers
    handleSelect,
    handleClear,
    handleSearchChange,
    resetSearch,

    // Utilities
    getOptionById,
    getOptionTitleById,
  };
};
