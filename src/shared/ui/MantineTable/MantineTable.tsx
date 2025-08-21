import { MantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';

import LoadingSpinner from '../LoadingSpinner';
import { generateColumns } from './columnGenerator';
import { TableProps, TableRow } from './types.ts';

const MantineTable = <TRow extends TableRow>({
  className = '',
  config = {},
  data,
  loading = false,
  schema = { properties: { id: { type: 'string' }, title: { type: 'string' } }, type: 'object' },
}: TableProps<TRow>) => {


  const columns = useMemo(
    () => generateColumns(schema, config.editable ?? true),
    [schema, config.editable],
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
      <MantineReactTable
        initialState={{
          density: config.density === 'compact' ? 'xs' : 'md',
        }}
        mantineTableContainerProps={{
          className: 'rdg-modern',
          style: {
            minHeight: '500px',
          },
        }}
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
      />
    </div>
  );
};

export default MantineTable;
