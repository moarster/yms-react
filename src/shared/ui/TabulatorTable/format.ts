import { Tabulator} from "react-tabulator/lib/types/TabulatorTypes";

import {getStatusColor} from "@/types";
import {formatters} from "@/utils/format.ts";

export const cellFormatters = {
    boolean: (cell: Tabulator.CellComponent) => {
        const value = cell.getValue()
        return value ? '✓' : '✗'
    },
    date: (cell: Tabulator.CellComponent) => {
        const value = cell.getValue()
        if (!value) return ''
        return formatters.date(value)
    },
    reference: (cell: Tabulator.CellComponent) => {
        const value = cell.getValue()
        if (!value) return ''
        return value.title || value.entry.title || value.name || value.id
    },
    array: (cell: Tabulator.CellComponent) => {
        const value = cell.getValue()
        if (!Array.isArray(value)) return ''
        return `[${value.length} items]`
    },
    status: (cell: Tabulator.CellComponent) => {
        const value = cell.getValue()
        const color = getStatusColor(value)
        return `<span class="px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800">${value}</span>`
    }
}