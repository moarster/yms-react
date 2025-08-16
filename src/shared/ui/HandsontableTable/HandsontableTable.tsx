import 'handsontable/dist/handsontable.full.min.css'
import './handsontable-theme.css'

import { HotTable } from '@handsontable/react'
import Handsontable from 'handsontable'
import { registerAllModules } from 'handsontable/registry'
import { useEffect,useMemo, useRef,useState } from 'react'

import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { BaseTableProps, BaseTableRow } from '@/shared/ui/TabulatorTable/table.types'

import { generateHandsontableColumns } from './columnGenerator'

// Register all Handsontable modules
registerAllModules()

interface HandsontableTableProps<T extends BaseTableRow> extends BaseTableProps<T> {
    enableInlineEdit?: boolean
}

const HandsontableTable = <T extends BaseTableRow>({
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
                                                   }: HandsontableTableProps<T>) => {
    const hotRef = useRef<HotTable>(null)
    const selectedRowsRef = useRef<number[]>([])

    const isSchemaless = !schema

    // Generate columns configuration
    const columns = useMemo(
        () => isSchemaless ? undefined : generateHandsontableColumns(
            schema,
            enableInlineEdit,
            { onEdit, onDelete, onView }
        ),
        [isSchemaless, schema, enableInlineEdit, onEdit, onDelete, onView]
    )

    // Calculate row height based on density
    const rowHeight = useMemo(() => {
        switch (config.density) {
            case 'compact': return 30
            case 'comfortable': return 50
            default: return 40
        }
    }, [config.density])


    const settings: Handsontable.GridSettings = useMemo(() => ({
        data: data as any[],
        columns,
        autoColumnSize: true,
        stretchH: 'all',
        height: config.height ?? '600px',
        licenseKey: 'non-commercial-and-evaluation',

        // Features
        rowHeaders: config.selectable ?? false,
        columnSorting: config.sortable ?? true,
        filters: config.filterable ?? true,
        dropdownMenu: config.filterable ?? true,
        contextMenu: enableInlineEdit ? ['row_above', 'row_below', 'remove_row'] : false,
        manualColumnResize: true,
        manualRowResize: false,

        // Selection
        outsideClickDeselects: false,
        selectionMode: config.selectable ? 'multiple' : 'single',

        // Editing
        readOnly: !enableInlineEdit,

        // Pagination-like behavior with fixed rows
        fixedRowsTop: 0,
        viewportRowRenderingOffset: 10,

        // Styling
        rowHeights: rowHeight,
        className: 'htMiddle htCenter',

        // Performance
        renderAllRows: false,

        // Cell meta
        cells(row, col) {
            const cellProperties: Handsontable.CellMeta = {}

            // Add custom className for status cells
            if (columns && columns[col]?.data === 'status') {
                cellProperties.className = 'status-cell'
            }

            return cellProperties
        },

        // Hooks
        afterSelection: (row, col, row2, col2) => {
            if (row === row2 && col === col2 && onRowClick) {
                const rowData = hotRef.current?.hotInstance?.getDataAtRow(row)
                if (rowData) {
                    onRowClick(rowData as T)
                }
            }
        },

        afterSelectionByProp: (row, prop, row2, prop2) => {
            if (config.selectable && onSelectionChange) {
                const hot = hotRef.current?.hotInstance
                if (hot) {
                    const selected = hot.getSelected() || []
                    const selectedData = selected.map(([row]) =>
                        hot.getDataAtRow(row)
                    ).filter(Boolean) as T[]

                    // Only trigger if selection actually changed
                    const selectedRows = selected.map(([row]) => row)
                    if (JSON.stringify(selectedRows) !== JSON.stringify(selectedRowsRef.current)) {
                        selectedRowsRef.current = selectedRows
                        onSelectionChange(selectedData)
                    }
                }
            }
        },

        afterChange: (changes, source) => {
            if (source === 'edit' && onDataChange && enableInlineEdit) {
                const hot = hotRef.current?.hotInstance
                if (hot) {
                    onDataChange(hot.getData() as T[])
                }
            }
        },

        // Custom text for empty table
        emptyDataMessage: 'No Data Available',
    }), [
        data,
        columns,
        isSchemaless,
        config,
        enableInlineEdit,
        rowHeight,
        onRowClick,
        onSelectionChange,
        onDataChange
    ])

    // Handle checkbox selection for bulk actions
    useEffect(() => {
        if (config.selectable && hotRef.current?.hotInstance) {
            const hot = hotRef.current.hotInstance

            // Add checkbox header
            hot.updateSettings({
                afterGetRowHeader: (row, TH) => {
                    const checkbox = document.createElement('input')
                    checkbox.type = 'checkbox'
                    checkbox.className = 'row-selector'
                    checkbox.checked = selectedRowsRef.current.includes(row)

                    checkbox.addEventListener('change', (e) => {
                        e.stopPropagation()
                        const target = e.target as HTMLInputElement

                        if (target.checked) {
                            hot.selectRows(row)
                        } else {
                            hot.deselectCell()
                        }
                    })

                    TH.innerHTML = ''
                    TH.appendChild(checkbox)
                }
            })
        }
    }, [config.selectable])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" text="Loading data..." />
            </div>
        )
    }

    return (
        <div className={`handsontable-wrapper ${className}`}>
            <HotTable
                ref={hotRef}
                settings={settings}
            />

            {/* Pagination controls - Handsontable doesn't have built-in pagination */}
            {config.pagination && (
                <PaginationControls
                    data={data}
                    pageSize={config.pageSize ?? 20}
                    hotRef={hotRef}
                />
            )}
        </div>
    )
}

// Simple pagination component for Handsontable
const PaginationControls = <T extends BaseTableRow>({
                                                        data,
                                                        pageSize,
                                                        hotRef
                                                    }: {
    data: T[]
    pageSize: number
    hotRef: React.RefObject<HotTable>
}) => {
    const [currentPage, setCurrentPage] = useState(0)
    const totalPages = Math.ceil(data.length / pageSize)

    useEffect(() => {
        if (hotRef.current?.hotInstance) {
            const hot = hotRef.current.hotInstance
            const startRow = currentPage * pageSize
            const endRow = Math.min(startRow + pageSize, data.length)

            // Handsontable doesn't have true pagination, so we'll use row hiding
            hot.updateSettings({
                hiddenRows: {
                    rows: data.map((_, index) => index)
                        .filter(i => i < startRow || i >= endRow)
                }
            })
        }
    }, [currentPage, pageSize, data.length, hotRef])

    return (
        <div className="pagination-controls">
            <div style={{ fontSize: '0.875rem', color: 'rgb(55 65 81)' }}>
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, data.length)} of {data.length} entries
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                        border: '1px solid rgb(209 213 219)',
                        cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 0 ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (currentPage !== 0) {
                            e.currentTarget.style.backgroundColor = 'rgb(243 244 246)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                    }}
                >
                    Previous
                </button>
                <span style={{ fontSize: '0.875rem' }}>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                        border: '1px solid rgb(209 213 219)',
                        cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (currentPage < totalPages - 1) {
                            e.currentTarget.style.backgroundColor = 'rgb(243 244 246)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default HandsontableTable