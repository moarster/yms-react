import { DataEditor, GridCell, GridCellKind, Item } from '@glideapps/glide-data-grid';
import React, { useMemo } from 'react';

import LoadingSpinner from '../LoadingSpinner';
import { generateColumns } from './columnGenerator';
import { TableProps, TableRow } from './types.ts';

const Table = <TRow extends TableRow>({
  className = '',
  config = {},
  data,
  loading = false,
  schema,
}: TableProps<TRow>) => {
  const columns = useMemo(
    () => (!schema ? generateColumns(undefined) : generateColumns(schema)),
    [schema],
  );
  const getCellContent = React.useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const dataRow = data[row];
      // dumb but simple way to do this
      const indexes = columns.map((c) => c.id.toLowerCase());
      let d = dataRow[indexes[col]];
      if (d === undefined) {
        d = '';
      }
      return {
        allowOverlay: false,
        data: d,
        displayData: d,
        kind: GridCellKind.Text,
      };
    },
    [columns, data],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  const rowHeight = config.density === 'compact' ? 35 : config.density === 'comfortable' ? 60 : 45;

  return (
    <div className={`datagrid-wrapper ${className} ${config.density || 'standard'}`}>
      <DataEditor
        columns={columns}
        headerHeight={40}
        rowMarkers="both"
        rowSelect="multi"
        rows={data.length}
        rowHeight={rowHeight}
        className="rdg-modern"
        getCellContent={getCellContent}
      />
    </div>
  );
};

export default Table;
