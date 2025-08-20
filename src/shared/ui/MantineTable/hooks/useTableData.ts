import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { TableRow } from '@/shared/ui/DataGridTable/types.ts';

interface UseTableDataOptions<T extends TableRow> {
  deleteFn?: (ids: (number | string)[]) => Promise<void>;
  fetchFn: () => Promise<any>;
  onEdit?: (row: T) => void;
  onRowClick?: (row: T) => void;
  queryKey: string | string[];
  transformData?: (data: any) => T[];
}

export function useTableData<T extends TableRow>({
  deleteFn,
  fetchFn,
  onEdit,
  onRowClick,
  queryKey,
  transformData,
}: UseTableDataOptions<T>) {
  const queryClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Fetch data
  const {
    data: rawData,
    error,
    isLoading,
  } = useQuery({
    queryFn: fetchFn,
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
  });

  // Transform data if transformer provided
  const data = useMemo(() => {
    if (!rawData) return [];
    if (transformData) return transformData(rawData);

    // Default transformation for paged responses
    if (rawData.content && Array.isArray(rawData.content)) {
      return rawData.content.map((item: any) => ({
        ...item.data,
        id: item.id,
        status: item.status,
      }));
    }

    return Array.isArray(rawData) ? rawData : [];
  }, [rawData, transformData]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (ids: (number | string)[]) => {
      if (!deleteFn) throw new Error('Delete function not provided');
      await deleteFn(ids);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete items');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      });
      toast.success(`${selectedRows.length > 1 ? 'Items' : 'Item'} deleted successfully`);
      setSelectedRows([]);
    },
  });

  // Handlers
  const handleSelectionChange = useCallback((rows: T[]) => {
    setSelectedRows(rows);
  }, []);

  const handleDelete = useCallback(
    (row: T) => {
      if (!deleteFn) return;

      if (confirm('Are you sure you want to delete this item?')) {
        deleteMutation.mutate([row.id]);
      }
    },
    [deleteMutation, deleteFn],
  );

  const handleBulkDelete = useCallback(() => {
    if (!deleteFn || selectedRows.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedRows.length} items?`)) {
      deleteMutation.mutate(selectedRows.map((row) => row.id));
    }
  }, [deleteMutation, deleteFn, selectedRows]);

  const handleRowClick = useCallback(
    (row: T) => {
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick],
  );

  const handleEdit = useCallback(
    (row: T) => {
      if (onEdit) {
        onEdit(row);
      }
    },
    [onEdit],
  );

  // Calculate statistics
  const stats = useMemo(() => {
    if (!rawData) return null;

    // For paged responses
    if (rawData.page) {
      return {
        currentPage: rawData.page.number || 0,
        pageSize: rawData.page.size || 20,
        total: rawData.page.totalElements || 0,
        totalPages: rawData.page.totalPages || 0,
      };
    }

    // For array responses
    return {
      currentPage: 0,
      pageSize: data.length,
      total: data.length,
      totalPages: 1,
    };
  }, [rawData, data]);

  return {
    // Data
    data,
    // Mutations
    deleteMutation,
    error,

    handleBulkDelete,
    handleDelete,
    handleEdit,

    // Actions
    handleRowClick,
    handleSelectionChange,

    isDeleting: deleteMutation.isPending,
    // Loading states
    isLoading,
    rawData,
    // Selection
    selectedRows,

    stats,
  };
}
