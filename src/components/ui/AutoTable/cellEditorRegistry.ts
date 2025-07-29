import {
    DateCellEditor,
    NumberCellEditor,
    SelectCellEditor,
    TextCellEditor,
} from './cellEditors'

export const CELL_EDITORS = {
    select: SelectCellEditor,
    text: TextCellEditor,
    number: NumberCellEditor,
    date: DateCellEditor,
} as const

export type CellEditorType = keyof typeof CELL_EDITORS