import { MRT_Cell, MRT_TableInstance } from 'mantine-react-table';
import React from 'react';

import { BaseLink, createLinkDefinition, ReferentLink } from '@/types';

import { TableRow } from '../types.ts';
import { ReferenceInput } from '@/shared/ui/inputs';

interface ReferenceCellEditProps<TRow extends TableRow> {
  catalog: string;
  cell: MRT_Cell<TRow>;
  linkType: 'CATALOG' | 'LIST';
  table: MRT_TableInstance<TRow>;
  onCellChange: (cell: MRT_Cell<TRow>, value: any) => void;
}

export const ReferenceCellEdit: React.FC<ReferenceCellEditProps<TableRow>> = <
  TRow extends TableRow,
>({
  catalog,
  cell,
  linkType,
  table,
  onCellChange,
}: ReferenceCellEditProps<TRow>) => {
  const value = cell.getValue() as ReferentLink | null;
  const handleChange = (selectedEntity: ReferentLink | null) => {
    if (!selectedEntity) {

    } else {
      const newLink: BaseLink = {
        catalog,
        domain: linkType === 'LIST' ? 'lists' : 'reference',
        entity: 'item',
        id: selectedEntity.id!,
        title: selectedEntity.title || selectedEntity.id!,
      };
      onCellChange(cell, newLink);
    }
  };

  // Create a LinkDefinition for the unified component
  const linkDef = createLinkDefinition(
    linkType === 'LIST' ? 'lists' : 'reference',
    'item',
    catalog,
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
        },
      }}
      onBlur={() => table.setEditingCell(null)}
    />
  );
};
