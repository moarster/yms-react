import React from 'react';

import { TableActions, TableConfig, TableRow } from '@/shared/ui/DataGridTable/types.ts';
import { JsonSchema } from '@/types';

export enum TableMode {
  CLICKABLE = 'clickable',
  EDITABLE = 'editable',
  READONLY = 'readonly',
}

export interface TablePageConfig<TRow extends TableRow = TableRow> {
  emptyStateIcon?: React.ComponentType<{ className?: string }>;
  emptyStateMessage?: string;
  enableBulkActions?: boolean;
  enableCreate?: boolean;
  enableExport?: boolean;
  height?: number | string;
  mode: TableMode;
  tableConfig?: Partial<TableConfig>;
}

export interface DataFetchConfig {
  enabled?: boolean;
  fetchFn: () => Promise<any>;
  queryKey: string[];
  transformData?: (data: any) => any[];
}

export interface SchemaConfig {
  enabled?: boolean;
  fetchFn: () => Promise<JsonSchema>;
  queryKey: string[];
}

export interface TablePageHookConfig<TRow extends TableRow = TableRow> {
  actions?: TableActions<TRow>;
  dataFetch: DataFetchConfig;
  pageConfig: TablePageConfig<TRow>;
  schemaFetch?: SchemaConfig;
}

export interface UseTablePageResult<TRow extends TableRow = TableRow> {
  data: TRow[];
  error: Error;
  loading: boolean;
  schema?: JsonSchema;
  selectedItems: TRow[];
  setSelectedItems: (items: TRow[]) => void;
  tableProps: {
    data: TRow[];
    schema?: JsonSchema;
    loading: boolean;
    onRowClick?: (row: TRow) => void;
    onSelectionChange?: (rows: TRow[]) => void;
    enableBulkActions?: boolean;
    height?: number | string;
    config?: Partial<TableConfig>;
    onEdit?: (row: TRow) => void;
    onDelete?: (row: TRow) => void;
    onView?: (row: TRow) => void;
  };
}
