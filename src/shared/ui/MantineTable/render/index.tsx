import { MRT_Cell, MRT_TableInstance } from 'mantine-react-table';

import { CatalogItemRow, CatalogType } from '@/features/catalogs/catalog.types.ts';
import { ReferenceCellEdit } from '@/shared/ui/MantineTable/render/ReferenceCellEdit.tsx';
import { ReferenceCellShow } from '@/shared/ui/MantineTable/render/ReferenceCellShow.tsx';
import { ReferentLink } from '@/types';

import { TableRow } from '../types';

export const createReferenceCell = (catalog: string, linkType: CatalogType) => ({
  Cell: ({ cell }: { cell: MRT_Cell<CatalogItemRow> }) => (
    <ReferenceCellShow
      catalog={catalog}
      linkType={linkType}
      value={cell.getValue() as null | ReferentLink}
    />
  ),
  Edit: ({ cell, table }: { cell: MRT_Cell<TableRow>; table: MRT_TableInstance<TableRow> }) => (
    <ReferenceCellEdit cell={cell} table={table} catalog={catalog} linkType={linkType} />
  ),
});
