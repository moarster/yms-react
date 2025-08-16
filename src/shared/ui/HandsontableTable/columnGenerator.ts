import Handsontable from 'handsontable'
import {BaseRenderer} from "handsontable/renderers";

import { BaseTableRow } from '@/shared/ui/TabulatorTable/table.types'
import { JsonSchema, JsonSchemaProperty } from '@/types'

import { createCellRenderers } from './cellRenderers'

interface ColumnGeneratorOptions<T extends BaseTableRow> {
    onEdit?: (row: T) => void
    onDelete?: (row: T) => void
    onView?: (row: T) => void
}

function generateFromSchema<T extends BaseTableRow>(
    schema: JsonSchema,
    enableInlineEdit: boolean,
    actions?: ColumnGeneratorOptions<T>
): Handsontable.ColumnSettings[] {
    const columns: Handsontable.ColumnSettings[] = []
    const properties = schema.properties || {}
    const renderers = createCellRenderers<T>()

    Object.entries(properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
        // Skip hidden fields
        if (property['x-table-hidden']) return

        // Skip complex nested objects
        if (property.type === 'object' && !key.startsWith('_')) return

        const column: Handsontable.ColumnSettings = {
            data: key,
            title: property.title || key,
            width: property['x-table-width'] || undefined,
            readOnly: !enableInlineEdit || property['x-table-readonly'],
        }

        // Set type-specific properties
        switch (property.type) {
            case 'boolean':
                column.type = 'checkbox'
                column.className = 'htCenter'
                break

            case 'number':
            case 'integer':
                column.type = 'numeric'
                column.numericFormat = {
                    pattern: property.type === 'integer' ? '0' : '0.00'
                }
                if (property.minimum !== undefined) {
                    column.validator = function(value, callback) {
                        callback(value >= property.minimum!)
                    }
                }
                break

            case 'string':
                if (property.enum) {
                    column.type = 'dropdown'
                    column.source = property.enum as string[]
                    column.strict = true
                    column.filter = false
                } else if (property.format === 'date' || property.format === 'date-time') {
                    column.type = 'date'
                    column.dateFormat = property.format === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
                    column.correctFormat = true
                    column.renderer = renderers.date
                } else {
                    column.type = 'text'
                    if (property.maxLength) {
                        column.validator = function(value, callback) {
                            callback(!value || value.toString().length <= property.maxLength!)
                        }
                    }
                }
                break

            case 'array':
                column.renderer = renderers.array
                column.readOnly = true // Arrays are always read-only in table view
                break

            case 'object':
                column.renderer = renderers.reference
                column.readOnly = true // References are always read-only in table view
                break
        }

        // Special handling for status fields
        if (key === 'status' || key.toLowerCase().includes('status')) {
            column.renderer = renderers.status
            if (property.enum) {
                column.type = 'dropdown'
                column.source = property.enum as string[]
            }
        }

        columns.push(column)
    })

    // Add actions column if any actions are defined
    if (actions && (actions.onEdit || actions.onDelete || actions.onView)) {
        columns.push({
            data: null,
            title: 'Actions',
            width: 120,
            readOnly: true,
            renderer: createActionsRenderer(actions),
            className: 'htCenter'
        })
    }

    return columns
}

function createActionsRenderer<T extends BaseTableRow>(
    actions: ColumnGeneratorOptions<T>
): BaseRenderer {
    return function(
        instance: Handsontable.Core,
        td: HTMLTableCellElement,
        row: number,
        col: number,
        prop: string | number,
        value: any,
        cellProperties: Handsontable.CellProperties
    ) {
        td.innerHTML = ''
        td.className = 'actions-cell htCenter'

        const buttonContainer = document.createElement('div')
        buttonContainer.className = 'flex items-center justify-center space-x-1'

        const rowData = instance.getDataAtRow(row) as unknown as T

        if (actions.onView) {
            const viewBtn = createActionButton('👁', 'View', () => actions.onView!(rowData))
            buttonContainer.appendChild(viewBtn)
        }

        if (actions.onEdit) {
            const editBtn = createActionButton('✏️', 'Edit', () => actions.onEdit!(rowData))
            buttonContainer.appendChild(editBtn)
        }

        if (actions.onDelete) {
            const deleteBtn = createActionButton('🗑', 'Delete', () => actions.onDelete!(rowData))
            buttonContainer.appendChild(deleteBtn)
        }

        td.appendChild(buttonContainer)

        return td
    }
}

function createActionButton(icon: string, title: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button')
    button.innerHTML = icon
    button.title = title
    button.className = 'action-btn p-1 rounded hover:bg-gray-100'
    button.onclick = (e) => {
        e.stopPropagation()
        onClick()
    }
    return button
}

export function generateHandsontableColumns<T extends BaseTableRow>(
    schema: JsonSchema,
    enableInlineEdit: boolean,
    actions?: ColumnGeneratorOptions<T>
): Handsontable.ColumnSettings[] {
    let columns: Handsontable.ColumnSettings[] = []

    if (schema?.properties) {
        columns = [...columns, ...generateFromSchema(schema, enableInlineEdit, actions)]
    } else {
        // Return empty array for schemaless mode - Handsontable will auto-generate
        return []
    }

    return columns
}