import 'react-data-grid/lib/styles.css';
import './datagrid-theme.css';

import React, { useCallback, useMemo, useState } from 'react';
import { DataGrid, RenderRowProps, Row } from 'react-data-grid';

import { useTableState } from '@/shared/ui/DataGridTable/hooks/useTableState.ts';
import { DataGridTableProps, TableRow } from '@/shared/ui/DataGridTable/types.ts';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

import { generateDataGridColumns } from './columnGenerator';

const DataGridTable = <TRow extends TableRow>({
  className = '',
  config = {},
  data,
  editable = false,
  enableBulkActions = false,
  loading = false,
  onDataChange,
  onDelete,
  onEdit,
  onRowClick,
  onSelectionChange,
  onView,
  schema,
}: DataGridTableProps<TRow>) => {
  const actions = useMemo(
    () => ({
      onDelete,
      onEdit,
      onRowClick,
      onView,
    }),
    [onEdit, onDelete, onView, onRowClick],
  );

  const selection = useMemo(
    () => ({
      enableBulkActions,
      onSelectionChange,
    }),
    [onSelectionChange, enableBulkActions],
  );

  const {
    displayData,
    filters,
    handleSelectionChange,
    selectedRows,
    setFilters,
    setSortColumns,
    sortColumns,
  } = useTableState({ data, selection });
  const [hoveredRow, setHoveredRow] = useState<null | { id?: string; pos?: number }>(null);

  const isSchemaless = !schema;

  const columns = useMemo(
    () =>
      isSchemaless
        ? generateDataGridColumns<TRow>(undefined, editable)
        : generateDataGridColumns<TRow>(schema, editable, true),
    [isSchemaless, schema, editable],
  );

  const handleRowClick = useCallback(
    (params: RenderRowProps<TRow>) => {
      if (onRowClick) {
        onRowClick(params.row);
      }
    },
    [onRowClick],
  );
  const handleRowsChange = useCallback(
    (rows: TRow[]) => {
      if (onDataChange && editable) {
        onDataChange(rows);
      }
    },
    [onDataChange, editable],
  );

  const TableRow = React.memo(function TableRow<TRow, SR>(props: RenderRowProps<TRow, SR>) {
    const { className, onMouseEnter, onMouseLeave, ...rest } = props;
    const rowId = props.row?.id || '';

    return (
      <Row
        {...rest}
        className={className}
        onMouseLeave={(e) => {
          onMouseLeave?.(e);
          setHoveredRow(null);
        }}
        onMouseEnter={(e) => {
          onMouseEnter?.(e);
          setHoveredRow({ id: rowId, pos: props.rowIdx });
        }}
      />
    );
  });

  const renderRow = React.useCallback(
    (key: React.Key, props: RenderRowProps<TRow>) => <TableRow key={key} {...props} />,
    [TableRow],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  const gridHeight = config.height || '600px';
  const rowHeight = config.density === 'compact' ? 35 : config.density === 'comfortable' ? 60 : 45;

  return (
    <div className={`datagrid-wrapper ${className} ${config.density || 'standard'}`}>
      <DataGrid<TRow>

        renderers={{
          noRowsFallback: (
            <div className="no-rows-fallback">
              <div className="text-gray-400 text-lg">No Data Available</div>
            </div>
          ),
          renderRow,
        }}
        columns={columns}
        rows={displayData}
        headerRowHeight={40}
        rowHeight={rowHeight}
        className="rdg-modern"
        rowClass={() => 'my-row'}
        sortColumns={sortColumns}
        selectedRows={selectedRows}
        style={{ height: gridHeight }}
        rowKeyGetter={(row) => row.id || ''}
        onRowsChange={handleRowsChange}
        onSortColumnsChange={setSortColumns}
      />
      {hoveredRow?.pos !== undefined && (
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            left: -30,
            position: 'absolute',
            top: 40 + hoveredRow.pos * rowHeight + rowHeight / 2, // center icon vertically
          }}
          title="Delete"
          className="action-btn delete"
          onClick={() => onDelete}
        >
          <svg fill="none" className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default DataGridTable;
