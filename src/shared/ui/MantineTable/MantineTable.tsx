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
  schema,
}: TableProps<TRow>) => {
  const columns = useMemo(
    () =>
      !schema
        ? generateColumns(undefined, true)
        : generateColumns(schema, true),
    [schema],
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
        mantineTableContainerProps={{
          className: 'rdg-modern',
          style: {
            minHeight: '500px',
          },
        }}
        data={data}
        columns={columns}
        editDisplayMode="row"
        getRowId={(row) => row.id}
        enableEditing
      />
    </div>
  );
};

export default MantineTable;
