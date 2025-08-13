export { default as AutoTable } from './AutoTable.tsx'
export { CELL_EDITORS, type CellEditorType } from './editing/cellEditorRegistry.ts'
export {
    DateCellEditor,
    NumberCellEditor,
    SelectCellEditor,
    TextCellEditor,
} from './editing/cellEditors.tsx'
export { CELL_RENDERERS, type CellRendererType } from './rendering/cellRendererRegistry.ts'
export {
    ArrayCellRenderer,
    BooleanCellRenderer,
    DateCellRenderer,
    ReferenceCellRenderer,
    StatusCellRenderer,
    TextCellRenderer,
} from './rendering/cellRenderers.tsx'
export type {
    AutoTableConfig,
    AutoTableProps,
    CellRendererProps,
    ColumnConfig,
    SelectEditorProps,
    TableActions,
    TableRow,
    TableSelection,
} from './types.ts'

// Column generation
export {
    generateColumns,
    generateSchemaBasedColumns,
    generateSchemalessColumns,
} from './columnGenerator.ts'

// Theme
export { autoTableTheme, tableStyles } from './theme.ts'

// Overlays
export { EmptyOverlay, LoadingOverlay } from './overlays.tsx'

// Hooks
export { useTableState } from './hooks/useTableState.ts'