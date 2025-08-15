import React from "react";

import { AutoTableConfig,TableActions, TableRow } from '@/shared/ui/AutoTable/types.ts'
import { JsonSchema } from '@/types'

export enum TableMode {
    EDITABLE = 'editable',
    READONLY = 'readonly',
    CLICKABLE = 'clickable'
}

export interface TablePageConfig<TRow extends TableRow = TableRow> {
    mode: TableMode
    enableBulkActions?: boolean
    enableExport?: boolean
    enableCreate?: boolean
    height?: string | number
    emptyStateMessage?: string
    emptyStateIcon?: React.ComponentType<{ className?: string }>
    tableConfig?: Partial<AutoTableConfig>
}

export interface DataFetchConfig {
    queryKey: string[]
    fetchFn: () => Promise<any>
    transformData?: (data: any) => any[]
    enabled?: boolean
}

export interface SchemaConfig {
    queryKey: string[]
    fetchFn: () => Promise<JsonSchema>
    enabled?: boolean
}

export interface TablePageHookConfig<TRow extends TableRow = TableRow> {
    dataFetch: DataFetchConfig
    schemaFetch?: SchemaConfig
    pageConfig: TablePageConfig<TRow>
    actions?: TableActions<TRow>
}

export interface UseTablePageResult<TRow extends TableRow = TableRow> {
    data: TRow[]
    schema?: JsonSchema
    loading: boolean
    error: Error
    selectedItems: TRow[]
    setSelectedItems: (items: TRow[]) => void
    tableProps: {
        data: TRow[]
        schema?: JsonSchema
        loading: boolean
        onRowClick?: (row: TRow) => void
        onSelectionChange?: (rows: TRow[]) => void
        enableBulkActions?: boolean
        height?: string | number
        config?: Partial<AutoTableConfig>
        onEdit?: (row: TRow) => void
        onDelete?: (row: TRow) => void
        onView?: (row: TRow) => void
    }
}