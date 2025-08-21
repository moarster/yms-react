import { ComboboxData, Select } from '@mantine/core';
import { MRT_Cell, MRT_TableInstance } from 'mantine-react-table';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CatalogItemRow, CatalogType } from '@/features/catalogs/catalog.types.ts';
import { BaseLink, ReferentLink } from '@/types';

import { useCatalogOptions } from '../hooks/useCatalogOptions';
import { TableRow } from '../types';

interface ReferenceCellDisplayProps {
  value: ReferentLink | null;
  catalog: string;
  linkType: 'CATALOG' | 'LIST';
}

export const ReferenceCellDisplay: React.FC<ReferenceCellDisplayProps> = ({
  catalog,
  linkType,
  value,
}) => {
  const { getOptionTitle } = useCatalogOptions({ catalog, linkType });
  const navigate = useNavigate();
  if (!value) {
    return <span className="text-gray-400">-</span>;
  }
  const title = value.title || getOptionTitle(value.id);
  if (!title) {
    return <span className="text-gray-400">?</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        onClick={() => {
          navigate(`/${linkType}s/${value.id}`);
        }}
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      <span className="truncate font-medium text-blue-600">{title}</span>
    </div>
  );
};

interface ReferenceEditCellProps {
  catalog: string;
  cell: MRT_Cell<TableRow>;
  linkType: 'CATALOG' | 'LIST';
  table: MRT_TableInstance<TableRow>;
}

export const ReferenceEditCell: React.FC<ReferenceEditCellProps> = ({
  catalog,
  cell,
  linkType,
  table,
}) => {
  const value = cell.getValue() as BaseLink | null;
  const { isLoading, options } = useCatalogOptions({ catalog, linkType });

  const comboboxData: ComboboxData = useMemo(
    () =>
      options.map((option) => ({
        label: option.title || option.id || 'Untitled',
        value: option.id!,
      })),
    [options],
  );

  const handleChange = (selectedId: null | string) => {
    if (!selectedId) {
      cell.row.original[cell.column.id as keyof TableRow] = null as any;
      table.setEditingCell(null);
      return;
    }

    const selectedOption = options.find((opt) => opt.id === selectedId);
    if (selectedOption) {
      const newLink: BaseLink = {
        catalog,
        domain: linkType === 'LIST' ? 'lists' : 'reference',
        entity: 'item',
        id: selectedOption.id!,
        title: selectedOption.title || selectedOption.id!,
      };

      cell.row.original[cell.column.id as keyof TableRow] = newLink as any;
      table.setEditingCell(null);
    }
  };

  return (
    <Select
      styles={{
        input: {
          border: 'none',
          height: '100%',
          minHeight: 'auto',
          padding: '0 8px',
        },
        wrapper: {
          height: '100%',
        },
      }}
      size="xs"
      variant="unstyled"
      data={comboboxData}
      disabled={isLoading}
      value={value?.id || null}
      placeholder={isLoading ? 'Loading...' : 'Select option'}
      clearable
      searchable
      onChange={handleChange}
      onBlur={() => table.setEditingCell(null)}
    />
  );
};

// Utility function to create reference cell config
export const createReferenceCell = (catalog: string, linkType: CatalogType) => ({
  Cell: ({ cell }: { cell: MRT_Cell<CatalogItemRow> }) => (
    <ReferenceCellDisplay
      value={cell.getValue() as ReferentLink | null}
      catalog={catalog}
      linkType={linkType}
    />
  ),
  Edit: ({ cell, table }: { cell: MRT_Cell<TableRow>; table: MRT_TableInstance<TableRow> }) => (
    <ReferenceEditCell cell={cell} table={table} catalog={catalog} linkType={linkType} />
  ),
});
