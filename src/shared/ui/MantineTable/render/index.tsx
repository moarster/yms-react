import { MRT_Cell, MRT_TableInstance } from 'mantine-react-table';

import { CatalogType } from '@/features/catalogs/catalog.types.ts';
import { ReferenceCellEdit } from '@/shared/ui/MantineTable/render/ReferenceCellEdit.tsx';
import { ReferenceCellShow } from '@/shared/ui/MantineTable/render/ReferenceCellShow.tsx';
import { ReferentLink } from '@/types';

import { TableRow } from '../types';

export const createReferenceCell = <T extends TableRow>(
  catalog: string,
  linkType: CatalogType,
  onCellChange?: (cell: MRT_Cell<T>, value: any) => void,
) => ({
  Cell: ({ cell }: { cell: MRT_Cell<T> }) => (
    <ReferenceCellShow
      catalog={catalog}
      linkType={linkType}
      value={cell.getValue() as null | ReferentLink}
    />
  ),
  Edit: ({ cell, table }: { cell: MRT_Cell<T>; table: MRT_TableInstance<T> }) => (
    <ReferenceCellEdit
      cell={cell}
      table={table}
      catalog={catalog}
      linkType={linkType}
      onCellChange={onCellChange || (() => {})}
    />
  ),
});
