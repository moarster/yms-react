import {
  DateCellEditor,
  NumberCellEditor,
  SelectCellEditor,
  TextCellEditor,
} from './cellEditors.tsx';

export const CELL_EDITORS = {
  date: DateCellEditor,
  number: NumberCellEditor,
  select: SelectCellEditor,
  text: TextCellEditor,
} as const;

export type CellEditorType = keyof typeof CELL_EDITORS;
