import {
    ArrayCellRenderer,
    BooleanCellRenderer,
    DateCellRenderer,
    ReferenceCellRenderer,
    StatusCellRenderer,
    TextCellRenderer,
} from './cellRenderers'

export const CELL_RENDERERS = {
    status: StatusCellRenderer,
    date: DateCellRenderer,
    reference: ReferenceCellRenderer,
    array: ArrayCellRenderer,
    boolean: BooleanCellRenderer,
    text: TextCellRenderer,
} as const

export type CellRendererType = keyof typeof CELL_RENDERERS