import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo,useState } from 'react'
import toast from 'react-hot-toast'

import { BaseTableRow } from './table.types.ts'

interface UseTableDataOptions<T extends BaseTableRow> {
    queryKey: string | string[]
    fetchFn: () => Promise<any>
    deleteFn?: (ids: (string | number)[]) => Promise<void>
    transformData?: (data: any) => T[]
    onRowClick?: (row: T) => void
    onEdit?: (row: T) => void
}

export function useTableData<T extends BaseTableRow>({
                                                         queryKey,
                                                         fetchFn,
                                                         deleteFn,
                                                         transformData,
                                                         onRowClick,
                                                         onEdit
                                                     }: UseTableDataOptions<T>) {
    const queryClient = useQueryClient()
    const [selectedRows, setSelectedRows] = useState<T[]>([])

    // Fetch data
    const { data: rawData, isLoading, error } = useQuery({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn: fetchFn,
    })

    // Transform data if transformer provided
    const data = useMemo(() => {
        if (!rawData) return []
        if (transformData) return transformData(rawData)

        // Default transformation for paged responses
        if (rawData.content && Array.isArray(rawData.content)) {
            return rawData.content.map((item: any) => ({
                ...item.data,
                id: item.id,
                status: item.status,
            }))
        }

        return Array.isArray(rawData) ? rawData : []
    }, [rawData, transformData])

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (ids: (string | number)[]) => {
            if (!deleteFn) throw new Error('Delete function not provided')
            await deleteFn(ids)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: Array.isArray(queryKey) ? queryKey : [queryKey]
            })
            toast.success(`${selectedRows.length > 1 ? 'Items' : 'Item'} deleted successfully`)
            setSelectedRows([])
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete items')
        },
    })

    // Handlers
    const handleSelectionChange = useCallback((rows: T[]) => {
        setSelectedRows(rows)
    }, [])

    const handleDelete = useCallback((row: T) => {
        if (!deleteFn) return

        if (confirm('Are you sure you want to delete this item?')) {
            deleteMutation.mutate([row.id])
        }
    }, [deleteMutation, deleteFn])

    const handleBulkDelete = useCallback(() => {
        if (!deleteFn || selectedRows.length === 0) return

        if (confirm(`Are you sure you want to delete ${selectedRows.length} items?`)) {
            deleteMutation.mutate(selectedRows.map(row => row.id))
        }
    }, [deleteMutation, deleteFn, selectedRows])

    const handleRowClick = useCallback((row: T) => {
        if (onRowClick) {
            onRowClick(row)
        }
    }, [onRowClick])

    const handleEdit = useCallback((row: T) => {
        if (onEdit) {
            onEdit(row)
        }
    }, [onEdit])

    // Calculate statistics
    const stats = useMemo(() => {
        if (!rawData) return null

        // For paged responses
        if (rawData.page) {
            return {
                total: rawData.page.totalElements || 0,
                pageSize: rawData.page.size || 20,
                currentPage: rawData.page.number || 0,
                totalPages: rawData.page.totalPages || 0,
            }
        }

        // For array responses
        return {
            total: data.length,
            pageSize: data.length,
            currentPage: 0,
            totalPages: 1,
        }
    }, [rawData, data])

    return {
        // Data
        data,
        rawData,
        stats,

        // Loading states
        isLoading,
        error,
        isDeleting: deleteMutation.isPending,

        // Selection
        selectedRows,
        handleSelectionChange,

        // Actions
        handleRowClick,
        handleEdit,
        handleDelete,
        handleBulkDelete,

        // Mutations
        deleteMutation,
    }
}