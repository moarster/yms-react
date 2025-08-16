import { useCallback, useMemo,useState } from 'react'
import { SortColumn } from 'react-data-grid'

import { BaseTableRow } from '../TabulatorTable/table.types'

interface UseDataGridTableOptions<T extends BaseTableRow> {
    data: T[]
    pageSize?: number
    enablePagination?: boolean
    enableSorting?: boolean
    enableFiltering?: boolean
}

interface UseDataGridTableResult<T extends BaseTableRow> {
    displayData: T[]
    sortColumns: readonly SortColumn[]
    setSortColumns: (columns: readonly SortColumn[]) => void
    filters: Record<string, string>
    setFilters: (filters: Record<string, string>) => void
    currentPage: number
    setCurrentPage: (page: number) => void
    totalPages: number
    pageData: T[]
}

export function useDataGridTable<T extends BaseTableRow>({
                                                             data,
                                                             pageSize = 20,
                                                             enablePagination = true,
                                                             enableSorting = true,
                                                             enableFiltering = true,
                                                         }: UseDataGridTableOptions<T>): UseDataGridTableResult<T> {
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [currentPage, setCurrentPage] = useState(0)

    // Apply sorting
    const sortedData = useMemo(() => {
        if (!enableSorting || sortColumns.length === 0) return data

        return [...data].sort((a, b) => {
            for (const sort of sortColumns) {
                const aValue = a[sort.columnKey as keyof T]
                const bValue = b[sort.columnKey as keyof T]

                // Handle null/undefined
                if (aValue == null && bValue == null) continue
                if (aValue == null) return sort.direction === 'ASC' ? 1 : -1
                if (bValue == null) return sort.direction === 'ASC' ? -1 : 1

                // Compare values
                if (aValue < bValue) return sort.direction === 'ASC' ? -1 : 1
                if (aValue > bValue) return sort.direction === 'ASC' ? 1 : -1
            }
            return 0
        })
    }, [data, sortColumns, enableSorting])

    // Apply filtering
    const filteredData = useMemo(() => {
        if (!enableFiltering || Object.keys(filters).length === 0) return sortedData

        return sortedData.filter(row => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true

                const cellValue = row[key as keyof T]

                // Handle different types
                if (cellValue == null) return false

                // Convert to string for comparison
                const cellStr = String(cellValue).toLowerCase()
                const filterStr = filterValue.toLowerCase()

                return cellStr.includes(filterStr)
            })
        })
    }, [sortedData, filters, enableFiltering])

    // Calculate pagination
    const totalPages = useMemo(() => {
        if (!enablePagination) return 1
        return Math.ceil(filteredData.length / pageSize)
    }, [filteredData.length, pageSize, enablePagination])

    // Get current page data
    const pageData = useMemo(() => {
        if (!enablePagination) return filteredData

        const start = currentPage * pageSize
        const end = start + pageSize
        return filteredData.slice(start, end)
    }, [filteredData, currentPage, pageSize, enablePagination])

    // Reset page when filters change
    const handleSetFilters = useCallback((newFilters: Record<string, string>) => {
        setFilters(newFilters)
        setCurrentPage(0)
    }, [])

    return {
        displayData: filteredData,
        sortColumns,
        setSortColumns,
        filters,
        setFilters: handleSetFilters,
        currentPage,
        setCurrentPage,
        totalPages,
        pageData,
    }
}