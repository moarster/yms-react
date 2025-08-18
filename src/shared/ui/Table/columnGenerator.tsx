import { GridColumn } from '@glideapps/glide-data-grid';

import { JsonSchema, JsonSchemaProperty } from '@/types';

export function generateColumns(schema: JsonSchema | undefined): GridColumn[] {
  const columns: GridColumn[] = [];

  if (schema?.properties) {
    // Schema-based columns
    Object.entries(schema.properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
      if (property['x-table-hidden']) return;
      if (property.type === 'object' && !key.startsWith('_')) return;

      const column: GridColumn = {
        id: key,
        title: property.title || property.description || key,
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
          id: key,
          title: key.charAt(0).toUpperCase() + key.slice(1),
        });
      });
    }
  }

  return columns;
}
