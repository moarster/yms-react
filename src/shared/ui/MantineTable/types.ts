import { MRT_ColumnDef, MRT_RowData } from 'mantine-react-table';

import { BaseProperty, JsonSchema, JsonSchemaProperty, PropertyValue } from '@/types';

export interface TableRow extends MRT_RowData, BaseProperty {
  id: string;
}

// Action callbacks with proper typing
export interface TableActions<TRow extends TableRow = TableRow> {
  onDelete?: (row: TRow) => void;
  onEdit?: (row: TRow) => void;
  onRowClick?: (row: TRow) => void;
  onView?: (row: TRow) => void;
}

// Selection handling
export interface TableSelection<TRow extends TableRow = TableRow> {
  onSelectionChange?: (selectedRows: TRow[]) => void;
  selectedRows?: Set<number | string>;
}

// Table configuration
export interface TableConfig {
  density?: 'comfortable' | 'compact' | 'standard';
  editable?: boolean;
  filterable?: boolean;
  height?: number | string;
  pageSize?: number;
  pagination?: boolean;
  selectable?: boolean;
  sortable?: boolean;
}

export interface TableProps<TRow extends TableRow> {
  className?: string;
  config?: TableConfig;
  data: TRow[];
  loading?: boolean;
  onDataChange?: (data: TRow[]) => void;
  schema: JsonSchema;
  collectionUrl?: string;
  onCellChange?: (rowId: string, columnId: string, value: PropertyValue) => void;
  onRowClick?: (row: TRow) => void;
}

export interface TableColumnDef<TRow extends TableRow> extends MRT_ColumnDef<TRow> {
  schema: JsonSchemaProperty;
}