import  { useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table'
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface DataTableProps<T> {
    data: T[]
    columns: ColumnDef<T>[]
    loading?: boolean
    searchPlaceholder?: string
    onRowClick?: (row: T) => void
    className?: string
    enableSearch?: boolean
    enableFilters?: boolean
    enablePagination?: boolean
    pageSize?: number
}

function DataTable<T>({
                          data,
                          columns,
                          loading = false,
                          searchPlaceholder = 'Search...',
                          onRowClick,
                          className,
                          enableSearch = true,
                          enableFilters = false,
                          enablePagination = true,
                          pageSize = 10,
                      }: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize,
            },
        },
    })

    return (
        <div className={clsx('space-y-4', className)}>
            {/* Search and filters */}
            {(enableSearch || enableFilters) && (
                <div className="flex items-center justify-between">
                    {enableSearch && (
                        <div className="relative max-w-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="input pl-10"
                                placeholder={searchPlaceholder}
                            />
                        </div>
                    )}

                    {enableFilters && (
                        <button className="btn-outline">
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="table-header">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={clsx(
                                            'table-header-cell',
                                            header.column.getCanSort() && 'cursor-pointer select-none'
                                        )}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center space-x-1">
                        <span>
                          {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                        </span>
                                            {header.column.getCanSort() && (
                                                <span className="flex-shrink-0">
                            {{
                                asc: <ChevronUpIcon className="h-4 w-4" />,
                                desc: <ChevronDownIcon className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                                <div className="h-4 w-4" />
                            )}
                          </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-sm text-gray-500"
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-primary-600" />
                                        <span className="ml-2">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-sm text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className={clsx(
                                        onRowClick && 'cursor-pointer hover:bg-gray-50',
                                        'transition-colors duration-150'
                                    )}
                                    onClick={() => onRowClick?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="table-cell">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {enablePagination && !loading && table.getRowModel().rows.length > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing{' '}
                    <span className="font-medium">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{' '}
                    to{' '}
                    <span className="font-medium">
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}
                  </span>{' '}
                    of{' '}
                    <span className="font-medium">
                    {table.getFilteredRowModel().rows.length}
                  </span>{' '}
                    results
                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDoubleLeftIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">Page</span>
                                    <input
                                        type="number"
                                        value={table.getState().pagination.pageIndex + 1}
                                        onChange={(e) => {
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                                            table.setPageIndex(page)
                                        }}
                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        min={1}
                                        max={table.getPageCount()}
                                    />
                                    <span className="text-sm text-gray-700">
                    of {table.getPageCount()}
                  </span>
                                </div>

                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDoubleRightIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DataTable