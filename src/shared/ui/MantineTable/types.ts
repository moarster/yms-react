import { Identifiable, JsonSchema } from '@/types';

export interface TableRow extends Record<string, unknown>, Identifiable {
  id?: string;
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
  enableBulkActions?: boolean;
  onSelectionChange?: (selectedRows: TRow[]) => void;
}

// Table configuration
export interface TableConfig {
  density?: 'comfortable' | 'compact' | 'standard';
  enableActions?: boolean;
  filterable?: boolean;
  height?: number | string;
  pageSize?: number;
  pagination?: boolean;
  selectable?: boolean;
  showToolbar?: boolean;
  sortable?: boolean;
}

// Auto table props with proper generics - intersection types instead of spread
export interface TableProps<TRow extends TableRow = TableRow>
  extends TableActions<TRow>,
    TableSelection<TRow> {
  className?: string;
  config?: Partial<TableConfig>;
  data: TRow[];
  editable?: boolean;
  loading?: boolean;
  onDataChange?: (data: TRow[]) => void;
  schema?: JsonSchema;
}
