import Handsontable from 'handsontable'
import {BaseRenderer} from "handsontable/renderers";

import { getStatusColor } from '@/types'
import { formatters } from '@/utils/format'

export interface CellRenderers {
    text: BaseRenderer
    date: BaseRenderer
    boolean: BaseRenderer
    status: BaseRenderer
    array: BaseRenderer
    reference: BaseRenderer
}

const statusColors = {
    gray: { bg: 'rgb(243 244 246)', text: 'rgb(55 65 81)' },
    blue: { bg: 'rgb(219 234 254)', text: 'rgb(30 64 175)' },
    green: { bg: 'rgb(220 252 231)', text: 'rgb(22 101 52)' },
    red: { bg: 'rgb(254 226 226)', text: 'rgb(153 27 27)' },
    yellow: { bg: 'rgb(254 240 138)', text: 'rgb(133 77 14)' },
}

export function createCellRenderers(): CellRenderers {
    return {
        text: Handsontable.renderers.TextRenderer,

        date(
            instance: Handsontable.Core,
            td: HTMLTableCellElement,
            row: number,
            col: number,
            prop: string | number,
            value: any,
            cellProperties: Handsontable.CellProperties
        ) {
            if (value) {
                td.innerHTML = formatters.date(value)
            } else {
                td.innerHTML = ''
            }
            td.className = 'htLeft'
            return td
        },

        boolean(
            instance: Handsontable.Core,
            td: HTMLTableCellElement,
            row: number,
            col: number,
            prop: string | number,
            value: any,
            cellProperties: Handsontable.CellProperties
        ) {
            td.innerHTML = value ? '✓' : '✗'
            td.className = 'htCenter'
            return td
        },

        status(
            instance: Handsontable.Core,
            td: HTMLTableCellElement,
            row: number,
            col: number,
            prop: string | number,
            value: any,
            cellProperties: Handsontable.CellProperties
        ) {
            if (value) {
                const colorKey = getStatusColor(value) as keyof typeof statusColors
                const colors = statusColors[colorKey] || statusColors.gray

                // Create span with inline styles instead of Tailwind classes
                td.innerHTML = `<span style="
                    display: inline-flex;
                    align-items: center;
                    padding: 0.125rem 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    border-radius: 9999px;
                    background-color: ${colors.bg};
                    color: ${colors.text};
                ">${value}</span>`
            } else {
                td.innerHTML = ''
            }
            td.className = 'htCenter'
            return td
        },

        array(
            instance: Handsontable.Core,
            td: HTMLTableCellElement,
            row: number,
            col: number,
            prop: string | number,
            value: any,
            cellProperties: Handsontable.CellProperties
        ) {
            if (Array.isArray(value)) {
                td.innerHTML = `<span class="array-badge">[${value.length} items]</span>`
            } else {
                td.innerHTML = ''
            }
            td.className = 'htCenter'
            return td
        },

        reference(
            instance: Handsontable.Core,
            td: HTMLTableCellElement,
            row: number,
            col: number,
            prop: string | number,
            value: any,
            cellProperties: Handsontable.CellProperties
        ) {
            if (value) {
                const displayValue = value.title || value.entry?.title || value.name || value.id || ''
                td.innerHTML = `<span class="reference-link">${displayValue}</span>`
            } else {
                td.innerHTML = ''
            }
            td.className = 'htLeft'
            return td
        }
    }
}