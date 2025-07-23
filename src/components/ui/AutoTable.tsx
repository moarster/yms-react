import React, { useMemo, useCallback, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
    ColDef,
    GridReadyEvent,
    RowClickedEvent,
    SelectionChangedEvent,
    GridApi
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { JsonSchema, JsonSchemaProperty, TableConfig } from '@/services/schemaService'
import { format } from 'date-fns'
import clsx from 'clsx'

interface AutoTableProps {
    data: any[]
    schema: JsonSchema
    config?: Partial<TableConfig>
    loading?: boolean
    onRowClick?: (data: any) => void
    onSelectionChange?: (selectedRows: any[]) => void
    onDataChange?: (data: any[]) => void
    className?: string
    height?: number | string
    enableBulkActions?: boolean
}

// Cell renderers
const StatusCellRenderer = (params: any) => {
    const status = params.value
    if (!status) return ''

    const statusColors = {
        DRAFT: 'bg-gray-100 text-gray-800',
        ASSIGNED: 'bg-blue-100 text-blue-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800'
    }

    return (
        <span className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
        )}>
      {status}
    </span>
    )
}

const DateCellRenderer = (params: any) => {
    if (!params.value) return ''
    try {
        return format(new Date(params.value), 'dd.MM.yyyy HH:mm')
    } catch {
        return params.value
    }
}

const ReferenceCellRenderer = (params: any) => {
    const ref = params.value
    if (!ref) return ''
    if (typeof ref === 'object' && ref.title) {
        return ref.title
    }
    return ref.toString()
}

const ArrayCellRenderer = (params: any) => {
    const arr = params.value
    if (!Array.isArray(arr)) return ''
    if (arr.length === 0) return ''

    if (arr.length === 1) {
        const item = arr[0]
        return typeof item === 'object' && item.title ? item.title : item.toString()
    }

    return `${arr.length} items`
}

// Cell editors
const SelectCellEditor = (props: any) => {
    const { value, onValueChange, enumValues } = props

    return (
        <select
            value={value || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Select...</option>
            {enumValues?.map((option: any) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

// Schema to column definition generator
const generateColumnDefs = (schema: JsonSchema): ColDef[] => {
    const columns: ColDef[] = []

    // Add selection column if needed
    const selectionCol: ColDef = {
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        pinned: 'left',
        lockPosition: true,
        suppressMovable: true
    }

    Object.entries(schema.properties).forEach(([key, property]) => {
        // Skip hidden fields
        if (property['x-table-hidden']) return

        const colDef: ColDef = {
            field: key,
            headerName: property.title || key,
            sortable: property['x-table-sortable'] !== false,
            filter: property['x-table-filterable'] !== false,
            editable: property['x-table-editable'] === true,
            width: property['x-table-width'] || getDefaultWidth(property),
            resizable: true,
            ...getColumnConfig(property)
        }

        columns.push(colDef)
    })

    return [selectionCol, ...columns]
}

const getDefaultWidth = (property: JsonSchemaProperty): number => {
    switch (property.type) {
        case 'boolean': return 80
        case 'number':
        case 'integer': return 120
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') return 160
            if (property.maxLength && property.maxLength < 50) return 150
            return 200
        default: return 200
    }
}

const getColumnConfig = (property: JsonSchemaProperty): Partial<ColDef> => {
    const config: Partial<ColDef> = {}

    // Set cell renderer based on type/format
    switch (property.type) {
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') {
                config.cellRenderer = DateCellRenderer
            } else if (property.enum) {
                config.cellRenderer = StatusCellRenderer
            }
            break
        case 'object':
            config.cellRenderer = ReferenceCellRenderer
            break
        case 'array':
            config.cellRenderer = ArrayCellRenderer
            config.sortable = false
            break
        case 'boolean':
            config.cellRenderer = (params: any) => params.value ? '✓' : '✗'
            break
    }

    // Set cell editor for editable fields
    if (property.enum) {
        config.cellEditor = SelectCellEditor
        config.cellEditorParams = {
            enumValues: property.enum.map(val => ({ value: val, label: val }))
        }
    }

    // Set filter type
    switch (property.type) {
        case 'number':
        case 'integer':
            config.filter = 'agNumberColumnFilter'
            break
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') {
                config.filter = 'agDateColumnFilter'
            } else {
                config.filter = 'agTextColumnFilter'
            }
            break
        case 'boolean':
            config.filter = 'agSetColumnFilter'
            config.filterParams = {
                values: ['true', 'false']
            }
            break
    }

    return config
}

const AutoTable: React.FC<AutoTableProps> = ({
                                                 data,
                                                 schema,
                                                 config = {},
                                                 loading = false,
                                                 onRowClick,
                                                 onSelectionChange,
                                                 onDataChange,
                                                 className,
                                                 height = '600px',
                                                 enableBulkActions = false
                                             }) => {
    const [gridApi, setGridApi] = useState<GridApi | null>(null)
    const [selectedRows, setSelectedRows] = useState<any[]>([])

    const columnDefs = useMemo(() => {
        const cols = generateColumnDefs(schema)
        // Remove selection column if bulk actions are disabled
        if (!enableBulkActions) {
            return cols.filter(col => !col.checkboxSelection)
        }
        return cols
    }, [schema, enableBulkActions])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 100,
        ...config.defaultColDef
    }), [config.defaultColDef])

    const gridOptions = useMemo(() => ({
        pagination: config.pagination !== false,
        paginationPageSize: config.pageSize || 20,
        rowSelection: enableBulkActions ? 'multiple' : 'single',
        suppressRowClickSelection: !enableBulkActions,
        rowHeight: config.rowHeight || 40,
        headerHeight: config.headerHeight || 40,
        animateRows: true,
        enableCellTextSelection: true,
        suppressColumnMoveAnimation: true,
        suppressLoadingOverlay: false,
        suppressNoRowsOverlay: false,
        loadingOverlayComponent: () => 'Loading...',
        noRowsOverlayComponent: () => 'No data to display'
    }), [config, enableBulkActions])

    const onGridReady = useCallback((params: GridReadyEvent) => {
        setGridApi(params.api)
        if (loading) {
            params.api.showLoadingOverlay()
        } else {
            params.api.hideOverlay()
        }
    }, [loading])

    const onRowClicked = useCallback((event: RowClickedEvent) => {
        if (onRowClick && !enableBulkActions) {
            onRowClick(event.data)
        }
    }, [onRowClick, enableBulkActions])

    const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
        const selected = event.api.getSelectedRows()
        setSelectedRows(selected)
        if (onSelectionChange) {
            onSelectionChange(selected)
        }
    }, [onSelectionChange])

    // Update loading state when prop changes
    React.useEffect(() => {
        if (gridApi) {
            if (loading) {
                gridApi.showLoadingOverlay()
            } else {
                gridApi.hideOverlay()
            }
        }
    }, [loading, gridApi])

    return (
        <div className={clsx('ag-theme-alpine', className)} style={{ height }}>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={data}
                defaultColDef={defaultColDef}
                gridOptions={gridOptions}
                onGridReady={onGridReady}
                onRowClicked={onRowClicked}
                onSelectionChanged={onSelectionChanged}
                suppressMenuHide={true}
                enableRangeSelection={true}
            />
        </div>
    )
}

export default AutoTable