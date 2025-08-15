// noinspection D

import 'react-tabulator/lib/styles.css'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap4.min.css'

import  { useCallback,useEffect, useMemo, useRef } from 'react'
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator'

import LoadingSpinner from '@/shared/ui/LoadingSpinner'

import { generateTabulatorColumns } from './columnGenerator'
import { BaseTableProps, BaseTableRow } from './table.types'

interface TabulatorTableProps<T extends BaseTableRow> extends BaseTableProps<T> {
    enableInlineEdit?: boolean
}

const TabulatorTable = <T extends BaseTableRow>({
                                                    data,
                                                    schema,
                                                    config = {},
                                                    loading = false,
                                                    className = '',
                                                    enableInlineEdit = true,
                                                    onRowClick,
                                                    onEdit,
                                                    onDelete,
                                                    onView,
                                                    onSelectionChange,
                                                    onDataChange,
                                                }: TabulatorTableProps<T>) => {
    const tableRef = useRef<any>(null)
    const isSchemaless = !schema
    const columns =  useMemo(
        () => isSchemaless?[]: generateTabulatorColumns(
            schema,
            enableInlineEdit
        ),
        [isSchemaless, schema, enableInlineEdit]
    )

    const options: ReactTabulatorOptions = useMemo(() => ({
        layout: 'fitColumns',
        responsiveLayout: 'hide',
        pagination: config.pagination ?? true,
        paginationSize: config.pageSize ?? 20,
        paginationSizeSelector: [10, 20, 50, 100],
        movableColumns: true,
        autoColumns: isSchemaless,
        resizableRows: true,
        selectable: config.selectable ?? false,
        selectableRangeMode: 'click',
        height: config.height ?? '600px',
        placeholder: 'No Data Available',
        // Sorting
        initialSort: [],
        headerSort: config.sortable ?? true,
        // Filtering
        headerFilter: config.filterable ?? true,
        headerFilterPlaceholder: 'Filter...',
        // Editing
        history: enableInlineEdit,
        // Styling based on density
        rowHeight: config.density === 'compact' ? 30 : config.density === 'comfortable' ? 50 : 40,
    }), [config, enableInlineEdit])

    // Event handlers
    const handleRowClick = useCallback((e: any, row: any) => {
        if (onRowClick) {
            onRowClick(row.getData())
        }
    }, [onRowClick])

    const handleRowSelectionChanged = useCallback((rows: any[]) => {
        if (onSelectionChange) {
            const selectedData = rows.map(row => row.getData())
            onSelectionChange(selectedData)
        }
    }, [onSelectionChange])

    const handleDataEdited = useCallback((data: any) => {
        if (onDataChange && enableInlineEdit) {
            onDataChange(data)
        }
    }, [onDataChange, enableInlineEdit])

    // Setup event listeners
    useEffect(() => {
        if (!tableRef.current) return

        const table = tableRef.current.table

        // Add event listeners
        table.on('rowClick', handleRowClick)
        table.on('rowSelectionChanged', handleRowSelectionChanged)

        if (enableInlineEdit) {
            table.on('dataEdited', handleDataEdited)
        }

        // Cleanup
        return () => {
            table.off('rowClick', handleRowClick)
            table.off('rowSelectionChanged', handleRowSelectionChanged)
            if (enableInlineEdit) {
                table.off('dataEdited', handleDataEdited)
            }
        }
    }, [handleRowClick, handleRowSelectionChanged, handleDataEdited, enableInlineEdit])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" text="Loading data..." />
            </div>
        )
    }

    return (
        <div className={`tabulator-wrapper ${className}`}>
            <ReactTabulator
                ref={tableRef}
                data={data}
                columns={!isSchemaless ? columns : undefined}
                options={options}
                layout="fitData"
            />
        </div>
    )
}

export default TabulatorTable