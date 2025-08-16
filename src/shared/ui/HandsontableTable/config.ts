import Handsontable from 'handsontable'

/**
 * Advanced Handsontable configuration options
 * These can be used to enhance the table with additional features
 */
export const advancedFeatures: Partial<Handsontable.GridSettings> = {
    // Excel-like features
    formulas: true,
    dragToScroll: true,
    fragmentSelection: true,

    // Copy/Paste enhancements
    copyPaste: {
        columnsLimit: 1000,
        rowsLimit: 10000,
        pasteMode: 'overwrite',
        uiContainer: document.body,
    },

    // Undo/Redo
    undo: true,

    // Comments (notes on cells)
    comments: true,

    // Cell meta
    cell: [],

    // Custom borders
    customBorders: true,

    // Merge cells capability
    mergeCells: false, // Can be enabled if needed

    // Auto fill (drag down to copy)
    fillHandle: true,

    // Multi-column sorting
    multiColumnSorting: true,

    // Column summary (totals, averages, etc.)
    columnSummary: [],

    // Nested headers
    nestedHeaders: false, // Can be enabled with proper structure

    // Collapsible columns
    collapsibleColumns: false,

    // Trim whitespace
    trimWhitespace: true,

    // Allow invalid values (don't block on validation)
    allowInvalid: true,

    // Allow removing rows/columns
    allowRemoveRow: true,
    allowRemoveColumn: false,

    // Auto wrap row
    autoWrapRow: true,
    autoWrapCol: true,

    // Performance optimizations
    viewportColumnRenderingOffset: 'auto',
    viewportRowRenderingOffset: 'auto',

    // Search capability
    search: true,

    // Bind rows with headers (for sorting/filtering)
    bindRowsWithHeaders: true,
}

/**
 * Context menu configuration
 */
export const contextMenuConfig = {
    items: {
        'row_above': {
            name: 'Insert row above'
        },
        'row_below': {
            name: 'Insert row below'
        },
        'col_left': {
            name: 'Insert column left'
        },
        'col_right': {
            name: 'Insert column right'
        },
        'separator1': '---------',
        'remove_row': {
            name: 'Remove row'
        },
        'remove_col': {
            name: 'Remove column'
        },
        'separator2': '---------',
        'undo': {
            name: 'Undo'
        },
        'redo': {
            name: 'Redo'
        },
        'separator3': '---------',
        'make_read_only': {
            name: 'Read only'
        },
        'clear_column': {
            name: 'Clear column'
        },
        'separator4': '---------',
        'alignment': {
            name: 'Alignment'
        },
        'copy': {
            name: 'Copy'
        },
        'cut': {
            name: 'Cut'
        },
    }
}

/**
 * Custom validators for Handsontable
 */
export const customValidators = {
    email: (value: any, callback: (valid: boolean) => void) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        callback(emailRegex.test(value))
    },

    phone: (value: any, callback: (valid: boolean) => void) => {
        const phoneRegex = /^\+?[\d\s-()]+$/
        callback(phoneRegex.test(value))
    },

    url: (value: any, callback: (valid: boolean) => void) => {
        try {
            new URL(value)
            callback(true)
        } catch {
            callback(false)
        }
    },

    positiveNumber: (value: any, callback: (valid: boolean) => void) => {
        const num = parseFloat(value)
        callback(!isNaN(num) && num > 0)
    },
}

/**
 * Export formats configuration
 */
export const exportConfig = {
    csv: {
        columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        rowDelimiter: '\r\n',
        rowHeaders: false,
    },

    excel: {
        // Would require additional library like SheetJS
        filename: 'export',
        columnHeaders: true,
        rowHeaders: false,
    }
}

/**
 * Performance settings for large datasets
 */
export const performanceSettings: Partial<Handsontable.GridSettings> = {
    // Virtual rendering
    renderAllRows: false,
    renderAllColumns: false,

    // Viewport settings
    viewportColumnRenderingOffset: 10,
    viewportRowRenderingOffset: 10,

    // Disable some features for better performance
    columnSorting: {
        indicator: true,
        headerAction: true,
        sortEmptyCells: false,
        compareFunctionFactory: function compareFunctionFactory(sortOrder, columnMeta) {
            return function(value1: any, value2: any) {
                if (value1 === value2) return 0
                if (value1 === null || value1 === '') return sortOrder === 'asc' ? 1 : -1
                if (value2 === null || value2 === '') return sortOrder === 'asc' ? -1 : 1

                if (typeof value1 === 'string') {
                    return sortOrder === 'asc'
                        ? value1.localeCompare(value2)
                        : value2.localeCompare(value1)
                }

                return sortOrder === 'asc'
                    ? value1 < value2 ? -1 : 1
                    : value1 > value2 ? -1 : 1
            }
        }
    },

    // Batch rendering
    observeDOMVisibility: true,

    // Disable animations for better performance
    animateScrolling: false,
}