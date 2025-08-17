import { Identifiable, JsonSchema, JsonSchemaProperty } from '@/types';

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

// Cell renderer props with proper typing
export interface CellRendererProps<TValue = unknown> extends GridRenderCellParams {
  value: TValue;
}

// Cell editor props with specific typing
export interface SelectEditorProps {
  enumValues: Array<{ value: number | string; label: string }>;
  onValueChange: (value: null | number | string) => void;
  value: null | number | string;
}

// Column configuration
export interface ColumnConfig {
  editable?: boolean;
  field: string;
  filterable?: boolean;
  headerName: string;
  property: JsonSchemaProperty;
  sortable?: boolean;
  width?: number;
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
export interface DataGridTableProps<TRow extends TableRow = TableRow>
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
