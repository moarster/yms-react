import 'react-data-grid/lib/styles.css'
import './datagrid-theme.css'

import React, { useCallback, useMemo, useState} from 'react'
import {
    Column, DataGrid, RenderRowProps, Row,
    SortColumn
} from 'react-data-grid'

import LoadingSpinner from '@/shared/ui/LoadingSpinner'

import { BaseTableProps, BaseTableRow } from '../TabulatorTable/table.types'
import { generateDataGridColumns } from './columnGenerator'

interface DataGridTableProps<T extends BaseTableRow> extends BaseTableProps<T> {
    enableInlineEdit?: boolean
}

const DataGridTable = <T extends BaseTableRow>({
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
                                               }: DataGridTableProps<T>) => {
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
    const [selectedRows, setSelectedRows] = useState(new Set<string>())
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [hoveredRow, setHoveredRow] = useState<{id?: string, pos?: number} | null>(null);

    const isSchemaless = !schema

    const columns = useMemo(
        () => isSchemaless
            ? generateDataGridColumns<T>(undefined, enableInlineEdit, { onEdit, onDelete, onView })
            : generateDataGridColumns<T>(schema, enableInlineEdit, { onEdit, onDelete, onView }),
        [isSchemaless, schema, enableInlineEdit, onEdit, onDelete, onView]
    )

    // Apply sorting
    const sortedRows = useMemo(() => {
        if (sortColumns.length === 0) return data

        return [...data].sort((a, b) => {
            for (const sort of sortColumns) {
                const aValue = a[sort.columnKey as keyof T]
                const bValue = b[sort.columnKey as keyof T]

                if (aValue < bValue) return sort.direction === 'ASC' ? -1 : 1
                if (aValue > bValue) return sort.direction === 'ASC' ? 1 : -1
            }
            return 0
        })
    }, [data, sortColumns])

    // Apply filtering
    const filteredRows = useMemo(() => {
        if (Object.keys(filters).length === 0) return sortedRows

        return sortedRows.filter(row => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true
                const cellValue = String(row[key as keyof T] || '')
                return cellValue.toLowerCase().includes(filterValue.toLowerCase())
            })
        })
    }, [sortedRows, filters])

    const handleSelectionChange = useCallback((newSelectedRows: Set<string>) => {
        setSelectedRows(newSelectedRows)
        if (onSelectionChange) {
            const selected = data.filter(row => newSelectedRows.has(row.id || ''))
            onSelectionChange(selected)
        }
    }, [data, onSelectionChange])

    const handleRowClick = useCallback((row: T, column: Column<T>) => {
        if (column.key === 'selection' || column.key === 'actions') return
        if (onRowClick) {
            onRowClick(row)
        }
    }, [onRowClick])

    const handleRowsChange = useCallback((rows: T[]) => {
        if (onDataChange && enableInlineEdit) {
            onDataChange(rows)
        }
    }, [onDataChange, enableInlineEdit])

    const TableRow = React.memo(function TableRow<T, SR>(props: RenderRowProps<T, SR>) {
        const { onMouseEnter, onMouseLeave, className, ...rest } = props;
        return (
            <Row
                {...rest}
                className={className}
                onMouseEnter={(e) => {
                    onMouseEnter?.(e);
                    setHoveredRow({id:props.key?.toString(), pos: props.rowIdx})
                }}
                onMouseLeave={(e) => {
                    onMouseLeave?.(e);
                    setHoveredRow({})
                }}
            />
        );
    });

    const renderRow = React.useCallback(
        (key: React.Key, props: RenderRowProps<T>) => <TableRow key={key} {...props} />,
        []
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" text="Loading data..." />
            </div>
        )
    }

    const gridHeight = config.height || '600px'
    const rowHeight = config.density === 'compact' ? 35 : config.density === 'comfortable' ? 60 : 45

    const handleDelete = async (id: string|undefined) => {
        try {
            await fetch(`/api/items/${id}`, { method: 'DELETE' });
            setRows(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className={`datagrid-wrapper ${className} ${config.density || 'standard'}`}>
            <DataGrid
                columns={columns}
                rows={filteredRows}
                rowKeyGetter={row => row.id || ''}
                selectedRows={config.selectable ? selectedRows : undefined}
                onSelectedRowsChange={config.selectable ? handleSelectionChange : undefined}
                sortColumns={sortColumns}
                onSortColumnsChange={setSortColumns}
                onRowClick={handleRowClick}
                onRowsChange={handleRowsChange}
                rowHeight={rowHeight}
                rowClass={() => 'my-row'}
                headerRowHeight={40}
                className="rdg-modern"
                style={{ height: gridHeight }}
                renderers={{
                    renderRow,
                    noRowsFallback:
                        <div className="no-rows-fallback">
                            <div className="text-gray-400 text-lg">No Data Available</div>
                        </div>

                }}
            />
            {hoveredRow?.pos !== undefined && (
                <button
                    style={{
                        position: 'absolute',
                        left: -30,
                        top: 40 + (hoveredRow.pos) * rowHeight + rowHeight / 2   , // center icon vertically
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none'
                    }}
                    onClick={() => onDelete}
                    className="action-btn delete"
                    title="Delete"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default DataGridTable