import {  Select } from '@mantine/core';
import { MRT_Cell, MRT_TableInstance } from 'mantine-react-table';
import React, { useMemo } from 'react';

import { BaseLink } from '@/types';

import { TableRow } from '../types.ts';
import { useReference } from '@/shared/ui/hooks/useReference.ts';

interface ReferenceCellEditProps {
  catalog: string;
  cell: MRT_Cell<TableRow>;
  linkType: 'CATALOG' | 'LIST';
  table: MRT_TableInstance<TableRow>;
}

export const ReferenceCellEdit: React.FC<ReferenceCellEditProps> = ({
  catalog,
  cell,
  linkType,
  table,
}) => {
  const value = cell.getValue() as BaseLink | null;

  const { handleSelect, handleClear, comboboxOptions, isLoading, options } = useReference({
    catalog,
    linkType,
    value,
    searchable: true,
    onChange: (value) => {
      if (!value) {
        cell.row.original[cell.column.id as keyof TableRow] = null;
      } else {
        const newLink: BaseLink = {
          catalog,
          domain: linkType === 'LIST' ? 'lists' : 'reference',
          entity: 'item',
          id: value.id!,
          title: value.title || value.id!,
        };
        cell.row.original[cell.column.id as keyof TableRow] = newLink as BaseLink;
      }
      table.setEditingCell(null);
    },
  });
  const selectData = useMemo(
    () =>
      comboboxOptions.map(({ option, label }) => ({
        label,
        value: option.id!,
      })),
    [comboboxOptions],
  );

  const handleChange = (selectedId: string | null) => {
    if (!selectedId) {
      handleClear();
      return;
    }

    const selectedOption = options.find((opt) => opt.id === selectedId);
    if (selectedOption) {
      handleSelect(selectedOption.title || selectedOption.id!);
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
      data={selectData}
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
