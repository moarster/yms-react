import { MRT_ColumnDef } from 'mantine-react-table';
import { HTMLInputTypeAttribute } from 'react';

import { catalogService } from '@/features/catalogs/catalogService.ts';
import { ReferenceInput } from '@/shared/form/inputs';
import { BaseEntity, BaseLink, JsonSchema, JsonSchemaProperty } from '@/types';
import { createDummyLink } from '@/types/factories/linkFactory.ts';

import { TableRow } from './types.ts';

export async function generateColumnsWithOptions(
  schema: JsonSchema | undefined,
  enableInlineEdit: boolean,
): Promise<MRT_ColumnDef<TableRow>[]> {
  if (!schema?.properties) {
    return generateColumns(schema, enableInlineEdit);
  }

  const referenceFields = new Map<string, any>();

  Object.entries(schema.properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
    if (property['x-table-hidden']) return;
    if (!key.startsWith('_')) return;
    if (!property.properties) return;
    if (
      !(typeof property.properties['domain']['const'] === 'string') ||
      !(typeof property.properties['catalog']['const'] === 'string')
    )
      return;

    const linkType = property.properties['domain']['const'] === 'reference' ? 'CATALOG' : 'LIST';
    const catalog = String(property.properties['catalog']['const']);
    referenceFields.set(key, { catalog, key, linkType });
  });

  // Fetch all options in parallel
  const optionsMap = new Map<string, BaseEntity[]>();

  if (referenceFields.size > 0) {
    const optionsPromises = Array.from(referenceFields.values()).map(
      async ({ catalog, key, linkType }) => {
        try {
          const result = await catalogService.getListItems(catalog, linkType);
          return { key, options: result.content };
        } catch (error) {
          console.error(`Failed to load options for ${catalog}:`, error);
          return { key, options: [] };
        }
      },
    );

    const results = await Promise.all(optionsPromises);
    results.forEach(({ key, options }) => {
      optionsMap.set(key, options);
    });
  }

  return generateColumns(schema, enableInlineEdit, optionsMap);
}

export function generateColumns(
  schema: JsonSchema | undefined,
  enableInlineEdit: boolean,
  optionsMap?: Map<string, any[]>,
): MRT_ColumnDef<TableRow>[] {
  const columns: MRT_ColumnDef<TableRow>[] = [];

  if (schema?.properties) {
    // Schema-based columns
    Object.entries(schema.properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
      if (property['x-table-hidden'] || property.items) return;
      if (property.properties && !key.startsWith('_')) return;
      if (property.type === undefined || property.type === 'object' || property.type === 'array')
        return;

      const required = schema.required?.includes(key);
      const column: MRT_ColumnDef<TableRow> = {
        accessorKey: key,

        enableEditing: enableInlineEdit && !property['x-table-readonly'],
        header: property.title || property.description || key,
        mantineEditTextInputProps: {
              required,
              type: getCellEditor(property),
            },


        minSize: getDefaultWidth(property),
      };

      columns.push(column);
    });
  } else {
    // Schemaless columns - generate from data
    const sampleRow = (schema as any)?.[0];
    if (sampleRow && typeof sampleRow === 'object') {
      Object.keys(sampleRow).forEach((key) => {
        if (key === 'id') return;

        columns.push({
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
        });
      });
    }
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
      if (property.format === 'date') {
        return 'date';
      }
      return 'text';
    case 'number':
    case 'integer':
      return 'number';
    default:
      return 'text';
  }
}
