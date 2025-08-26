import { useMemo,HTMLInputTypeAttribute } from 'react';

import { createReferenceCell } from '@/shared/ui/MantineTable/render';
import {
  createDummyLink,
  isLinkDefinition,
  isReferentLink,
  JsonSchema,
  JsonSchemaProperty,
} from '@/types';
import { extractReferenceInfo } from '@/utils/referenceUtils.ts';
import { useSchemaUtils } from '@/hooks/useSchemaUtils.ts';

import { TableColumnDef, TableRow } from '../types.ts';
import { MRT_Cell } from 'mantine-react-table';

export function useColumnGenerator<TRow extends TableRow>(
  schema: JsonSchema,
  enableInlineEdit: boolean,
  onCellChange?: (cell: MRT_Cell<TRow>, value: any) => void,
): TableColumnDef<TRow>[] {
  const { getPropertyDefinition } = useSchemaUtils(schema);

  return useMemo(() => {
    const columns: TableColumnDef<TRow>[] = [];

    Object.entries(schema.properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
      if (property['x-table-hidden']) return; // Skip hidden properties
      if (property.properties && !key.startsWith('_')) return; // Skip nested objects

      const columnSchema = getPropertyDefinition(key);
      if (!columnSchema) return;

      // Handle reference columns (starting with '_')
      if (key.startsWith('_')) {
        if (!isLinkDefinition(property)) {
          console.error(`Unexpected link: ${key}`);
          return;
        }
        const link = createDummyLink(property);
        if (!isReferentLink(link)) {
          console.warn('TODO: add support for domain links');
          return;
        }
        const refInfo = extractReferenceInfo(link);
        const referenceCell = createReferenceCell<TRow>(
          refInfo.catalog,
          refInfo.linkType,
          onCellChange,
        );

        columns.push({
          accessorKey: key,
          Cell: referenceCell.Cell,
          Edit: referenceCell.Edit,
          enableEditing: enableInlineEdit && !property['x-table-readonly'],
          header: property.title || property.description || key,
          minSize: 150,
          size: 200,
          schema: columnSchema,
        });
        return;
      }

      // Skip unsupported types
      if (property.type === undefined || property.type === 'object' || property.type === 'array') {
        console.warn('TODO: add support for arrays and objects');
        return;
      }

      // Handle regular columns
      const required = schema.required?.includes(key);
      const column: TableColumnDef<TRow> = {
        accessorKey: key,
        enableEditing: key !== 'id' && enableInlineEdit && !property['x-table-readonly'],
        header: property.title || property.description || key,
        minSize: getDefaultWidth(property),
        schema: columnSchema,
      };

      if (enableInlineEdit) {
        column.mantineEditTextInputProps = {
          required,
          type: getCellEditor(property),
        };
      }

      columns.push(column);
    });

    return columns;
  }, [schema, enableInlineEdit, getPropertyDefinition]);
}

function getDefaultWidth(property: JsonSchemaProperty): number {
  switch (property.type) {
    case 'boolean':
      return 80;
    case 'number':
    case 'integer':
      return 120;
    case 'string':
      if (property.format === 'date' || property.format === 'date-time') return 160;
      if (property.enum) return 140;
      if (property.maxLength && property.maxLength < 50) return 150;
      return 200;
    case 'array':
      return 150;
    case 'object':
      return 200;
    default:
      return 150;
  }
}

function getCellEditor(property: JsonSchemaProperty): HTMLInputTypeAttribute {
  switch (property.type) {
    case 'boolean':
      return 'checkbox';
    case 'string':
      if (property.format === 'date') return 'date';
      return 'text';
    case 'number':
    case 'integer':
      return 'number';
    default:
      return 'text';
  }
}
