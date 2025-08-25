import {  Select } from '@mantine/core';
import { MRT_Cell, MRT_TableInstance } from 'mantine-react-table';
import React, { useMemo } from 'react';

import { BaseEntity, BaseLink, createLinkDefinition, ReferentLink } from '@/types';

import { TableRow } from '../types.ts';
import { useReference } from '@/shared/ui/hooks/useReference.ts';
import { ReferenceInput } from '@/shared/ui/inputs';

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
  const value = cell.getValue() as ReferentLink | null;
  const handleChange = (selectedEntity: ReferentLink | null) => {
    if (!selectedEntity) {
      table.setEditingRow({
        ...table.getState().editingRow,
        [cell.row.id]: {
          ...table.getState().editingRow?.[cell.row.id],
          [cell.column.id]: null,
        },
      });
    } else {
      const newLink: BaseLink = {
        catalog,
        domain: linkType === 'LIST' ? 'lists' : 'reference',
        entity: 'item',
        id: selectedEntity.id!,
        title: selectedEntity.title || selectedEntity.id!,
      };

      table.setEditingRow({
        ...table.getState().editingRow,
        [cell.row.id]: {
          ...table.getState().editingRow?.[cell.row.id],
          [cell.column.id]: newLink,
        },
      });
    }
  };

  // Create a LinkDefinition for the unified component
  const linkDef = createLinkDefinition(
    linkType === 'LIST' ? 'lists' : 'reference',
    'item',
    catalog
  );

  return (
    <ReferenceInput
      variant="table"
      linkDef={linkDef}
      value={value}
      onChange={handleChange}
      placeholder="Select option"
      styles={{
        input: {
          border: 'none',
          height: '100%',
          minHeight: 'auto',
          padding: '0 8px',
          fontSize: '12px',
        },
        wrapper: {
          height: '100%',
        },
        section: {
          width: '16px',
        }
      }}
      onBlur={() => table.setEditingCell(null)}
    />
  );
};
