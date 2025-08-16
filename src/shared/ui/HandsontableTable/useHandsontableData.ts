import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback,useState } from 'react'
import toast from 'react-hot-toast'

import { BaseTableRow } from '@/shared/ui/TabulatorTable/table.types'

interface UseHandsontableDataOptions<T extends BaseTableRow> {
    queryKey: string[]
    fetchFn: () => Promise<any>
    deleteFn?: (ids: string[]) => Promise<void>
    transformData?: (data: any) => T[]
    onRowClick?: (row: T) => void
}

export function useHandsontableData<T extends BaseTableRow>({
                                                                queryKey,
                                                                fetchFn,
                                                                deleteFn,
                                                                transformData,
                                                                onRowClick,
                                                            }: UseHandsontableDataOptions<T>) {
    const queryClient = useQueryClient()
    const [selectedRows, setSelectedRows] = useState<T[]>([])

    // Fetch data
    const { data: rawData, isLoading, error } = useQuery({
        queryKey,
        queryFn: fetchFn,
    })

    // Transform data
    const data = transformData ? transformData(rawData) : (rawData as T[]) || []

    // Handle selection change
    const handleSelectionChange = useCallback((rows: T[]) => {
        setSelectedRows(rows)
    }, [])

    // Handle delete
    const handleDelete = useCallback(async (row: T) => {
        if (!deleteFn || !row.id) return

        try {
            await deleteFn([row.id.toString()])
            await queryClient.invalidateQueries({ queryKey })
            toast.success('Item deleted successfully')
        } catch (error) {
            toast.error('Failed to delete item')
            console.error('Delete error:', error)
        }
    }, [deleteFn, queryClient, queryKey])

    // Handle bulk delete
    const handleBulkDelete = useCallback(async () => {
        if (!deleteFn || selectedRows.length === 0) return

        const ids = selectedRows.map(row => row.id?.toString()).filter(Boolean) as string[]

        try {
            await deleteFn(ids)
            await queryClient.invalidateQueries({ queryKey })
            setSelectedRows([])
            toast.success(`Deleted ${ids.length} items`)
        } catch (error) {
            toast.error('Failed to delete items')
            console.error('Bulk delete error:', error)
        }
    }, [deleteFn, selectedRows, queryClient, queryKey])

    // Handle data changes (for inline editing)
    const handleDataChange = useCallback(async (updatedData: T[]) => {
        // This would typically save changes to the backend
        // For now, just update the cache optimistically
        queryClient.setQueryData(queryKey, updatedData)
    }, [queryClient, queryKey])

    return {
        data,
        isLoading,
        error,
        selectedRows,
        handleSelectionChange,
        handleDelete,
        handleBulkDelete,
        handleDataChange,
        onRowClick,
    }
}