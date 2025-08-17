import { merge } from 'allof-merge';

import { apiClient } from '@/core/api';
import { JsonSchema } from '@/types';

export interface TableConfig {
  enableEditing?: boolean;
  enableFiltering?: boolean;
  enableSelection?: boolean;
  enableSorting?: boolean;
  headerHeight?: number;
  pageSize?: number;
  pagination?: boolean;
  rowHeight?: number;
}

class SchemaService {
  async getAnySchema(key: string): Promise<JsonSchema> {
    const schema = await apiClient.getAny<JsonSchema>(`/meta/urn:solvo:${key}/schema`);
    const mergedSchema = merge(schema, {
      mergeCombinarySibling: false,
      mergeRefSibling: false,
      onMergeError: (message, path, values) => {
        console.warn(`Merge conflict at ${path}: ${message}`, values);
        return schema;
      },
    }) as JsonSchema;
    delete mergedSchema.$schema;

    return mergedSchema;
  }
}

export const schemaService = new SchemaService();
