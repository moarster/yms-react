import { MRT_ColumnDef } from 'mantine-react-table';
import { HTMLInputTypeAttribute } from 'react';

import { createReferenceCell } from '@/shared/ui/MantineTable/render/referenceCells.tsx';
import {
  createDummyLink,
  isLinkDefinition,
  isReferentLink,
  JsonSchema,
  JsonSchemaProperty,
} from '@/types';
import { extractReferenceInfo } from '@/utils/referenceUtils.ts';

import { TableRow } from './types.ts';

export function generateColumns<TRow extends TableRow>(
  schema: JsonSchema | undefined,
  enableInlineEdit: boolean,
): MRT_ColumnDef<TRow>[] {
  const columns: MRT_ColumnDef<TRow>[] = [];

  if (schema?.properties) {
    Object.entries(schema.properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
      if (property['x-table-hidden'] || property.items) return;
      if (property.properties && !key.startsWith('_')) return;

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
        const referenceCell = createReferenceCell(refInfo.catalog, refInfo.linkType);

        columns.push({
          accessorKey: key,
          Cell: referenceCell.Cell,
          Edit: referenceCell.Edit,
          enableEditing: enableInlineEdit && !property['x-table-readonly'],
          header: property.title || property.description || key,
          minSize: 150,
          size: 200,
        });
        return;
      }

      if (property.type === undefined || property.type === 'object' || property.type === 'array') {
        console.warn('TODO: add support for arrays and objects');
        return;
      }

      const required = schema.required?.includes(key);
      const column: MRT_ColumnDef<TRow> = {
        accessorKey: key,
        enableEditing: enableInlineEdit && !property['x-table-readonly'],
        header: property.title || property.description || key,
        minSize: getDefaultWidth(property),
      };

      if (enableInlineEdit) {
        column.mantineEditTextInputProps = {
          required,
          type: getCellEditor(property),
        };
      }

      columns.push(column);
    });
  } else {
    columns.push({ accessorKey: 'id', header: 'ID', size: 50 });
    columns.push({
      accessorKey: 'title',
      enableEditing: enableInlineEdit,
      header: 'Наименование',
      size: 300,
    });
  }
  return columns;
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
