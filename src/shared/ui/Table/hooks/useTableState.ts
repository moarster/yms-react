import { useCallback, useMemo, useState } from 'react';
import { SortColumn } from 'react-data-grid';

import { TableRow, TableSelection } from '../types.ts';

interface UseTableStateProps<TRow extends TableRow> {
  data: TRow[];
  selection: TableSelection<TRow>;
}

export function useTableState<TRow extends TableRow>({
  data,
  selection,
}: UseTableStateProps<TRow>) {
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const processedData = useMemo(() => {
    return data.map((row, index) => ({
      ...row,
      id: row.id || `row-${index}`,
    }));
  }, [data]);

  const handleSelectionChange = useCallback(
    (newSelection: Set<number | string>) => {
      setSelectedRows(newSelection);

      if (selection.onSelectionChange) {
        const selectedRows = data.filter((row) => row.id && newSelection.has(row.id));
        selection.onSelectionChange(selectedRows);
      }
    },
    [data, selection],
  );

  const handleRowClick = useCallback((_params: { row: TRow }) => {
    // onRowClick is handled at the AutoTable level, not here
    // This is just for potential future expansion
  }, []);

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return processedData;

    return processedData.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;

        const cellValue = row[key as keyof TRow];

        if (cellValue == null) return false;

        const cellStr = String(cellValue).toLowerCase();
        const filterStr = filterValue.toLowerCase();

        return cellStr.includes(filterStr);
      });
    });
  }, [processedData, filters]);
  const sortedData = useMemo(() => {
    if (sortColumns.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sort of sortColumns) {
        const aValue = a[sort.columnKey as keyof TRow];
        const bValue = b[sort.columnKey as keyof TRow];

        // Handle null/undefined
        if (aValue == null && bValue == null) continue;
        if (aValue == null) return sort.direction === 'ASC' ? 1 : -1;
        if (bValue == null) return sort.direction === 'ASC' ? -1 : 1;

        // Compare values
        if (aValue < bValue) return sort.direction === 'ASC' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'ASC' ? 1 : -1;
      }
      return 0;
    });
  }, [sortColumns, filteredData]);

  return {
    displayData: sortedData,
    filters,
    handleRowClick,
    handleSelectionChange,
    selectedRows,
    setFilters,
    setSortColumns,
    sortColumns,
  };
}
