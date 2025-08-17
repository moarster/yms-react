import {
  ArrayCellRenderer,
  BooleanCellRenderer,
  DateCellRenderer,
  ReferenceCellRenderer,
  StatusCellRenderer,
  TextCellRenderer,
} from './cellRenderers.tsx';

export const CELL_RENDERERS = {
  array: ArrayCellRenderer,
  boolean: BooleanCellRenderer,
  date: DateCellRenderer,
  reference: ReferenceCellRenderer,
  status: StatusCellRenderer,
  text: TextCellRenderer,
} as const;

export type CellRendererType = keyof typeof CELL_RENDERERS;
