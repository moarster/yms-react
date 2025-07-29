import {  GridRenderCellParams } from '@mui/x-data-grid'

import { JsonSchema, JsonSchemaProperty } from '@/types'

// Base row entity - no more any!
export interface TableRow extends Record<string, unknown> {
    id?: string
}

// Action callbacks with proper typing
export interface TableActions<TRow extends TableRow = TableRow> {
    onView?: (row: TRow) => void
    onEdit?: (row: TRow) => void
    onDelete?: (row: TRow) => void
    onRowClick?: (row: TRow) => void
}

// Selection handling
export interface TableSelection<TRow extends TableRow = TableRow> {
    onSelectionChange?: (selectedRows: TRow[]) => void
    enableBulkActions?: boolean
}

// Cell renderer props with proper typing
export interface CellRendererProps<TValue = unknown> extends GridRenderCellParams {
    value: TValue
}

// Cell editor props with specific typing
export interface SelectEditorProps {
    value: string | number | null
    onValueChange: (value: string | number | null) => void
    enumValues: Array<{ value: string | number; label: string }>
}

// Column configuration
export interface ColumnConfig {
    property: JsonSchemaProperty
    field: string
    headerName: string
    width?: number
    sortable?: boolean
    filterable?: boolean
    editable?: boolean
}

// Table configuration
export interface AutoTableConfig {
    pagination?: boolean
    pageSize?: number
    enableSorting?: boolean
    enableFiltering?: boolean
    enableSelection?: boolean
    enableEditing?: boolean
    enableActions?: boolean
    showToolbar?: boolean
    density?: 'compact' | 'standard' | 'comfortable'
    height?: number | string
}

// Auto table props with proper generics - intersection types instead of spread
export interface AutoTableProps<TRow extends TableRow = TableRow>
    extends TableActions<TRow>, TableSelection<TRow> {
    data: TRow[]
    schema?: JsonSchema
    config?: Partial<AutoTableConfig>
    loading?: boolean
    className?: string
    height?: number | string
    enableActions?: boolean
    showToolbar?: boolean
    density?: 'compact' | 'standard' | 'comfortable'
    // Data changes
    onDataChange?: (data: TRow[]) => void
}