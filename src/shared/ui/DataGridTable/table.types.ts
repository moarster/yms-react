import { JsonSchema } from '@/types'

export interface BaseTableRow {
    id?: string
    [key: string]: unknown
}

export interface TableConfig {
    editable?: boolean
    selectable?: boolean
    pagination?: boolean
    pageSize?: number
    sortable?: boolean
    filterable?: boolean
    height?: string | number
    density?: 'compact' | 'standard' | 'comfortable'
}

export interface TableActions<T = BaseTableRow> {
    onRowClick?: (row: T) => void
    onEdit?: (row: T) => void
    onDelete?: (row: T) => void
    onView?: (row: T) => void
    onSelectionChange?: (rows: T[]) => void
    onDataChange?: (data: T[]) => void
}

export interface BaseTableProps<T = BaseTableRow> extends TableActions<T> {
    data: T[]
    schema?: JsonSchema
    config?: TableConfig
    loading?: boolean
    className?: string
}

export type ColumnType =
    | 'text'
    | 'number'
    | 'boolean'
    | 'date'
    | 'select'
    | 'reference'
    | 'array'
    | 'actions'

