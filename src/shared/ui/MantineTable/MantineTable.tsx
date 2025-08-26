import { MantineReactTable, MRT_Cell } from 'mantine-react-table';

import { apiClient } from '@/core/api';

import LoadingSpinner from '../LoadingSpinner';
import { TableProps, TableRow } from './types.ts';
import { useColumnGenerator } from '@/shared/ui/MantineTable/hooks/useColumnGenerator.ts';
import { PropertyValue } from '@/types';

const MantineTable = <TRow extends TableRow>({
  className = '',
  collectionUrl = '/',
  config = {},
  data,
  loading = false,
  onRowClick,
  schema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        title: 'ID',
      },
      title: {
        type: 'string',
        title: 'Title',
      },
    },
  },
}: TableProps<TRow>) => {
  const handleSaveCell = async (cell: MRT_Cell<TRow>, value: PropertyValue) => {
    const updatedRow = {
      data: { ...data[cell.row.index], [cell.column.id]: value },
      title: data[cell.row.index].title as string,
    };
    await apiClient.put(`${collectionUrl}/${cell.row.id}`, updatedRow);
  };
  const columns = useColumnGenerator<TRow>(
    schema,
    config.editable ?? true,
    handleSaveCell,
    onRowClick,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  return (
    <div className={`datagrid-wrapper ${className} ${config.density || 'standard'}`}>
      <MantineReactTable<TRow>
        initialState={{
          density: config.density === 'compact' ? 'xs' : 'md',
        }}
        mantineTableContainerProps={{
          className: 'rdg-modern',
          style: {
            minHeight: '500px',
          },
        }}
        mantineEditTextInputProps={({ cell }) => ({
          onBlur: (event) => {
            handleSaveCell(cell, event.target.value);
          },
        })}
        mantineTableProps={{
          highlightOnHover: true,
          striped: config.density === 'compact',
          withColumnBorders: false,
          withRowBorders: true,
        }}
        data={data}
        columns={columns}
        editDisplayMode="cell"
        getRowId={(row) => row.id}
        enableEditing={config.editable ?? true}
        enableSorting={config.sortable ?? true}
        enablePagination={config.pagination ?? false}
        enableGlobalFilter={config.filterable ?? false}
        enableColumnFilters={config.filterable ?? false}
        mantineTableBodyRowProps={({ row }) => ({
          onClick: () => (onRowClick ? onRowClick(row.original) : {}),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default MantineTable;
