import {ColumnDefinition} from "react-tabulator";

import {cellFormatters} from "@/shared/ui/TabulatorTable/format.ts";
import {JsonSchema, JsonSchemaProperty} from '@/types'

function generateFromSchema(
    schema: JsonSchema,
    enableInlineEdit: boolean
): ColumnDefinition[] {
    const columns: ColumnDefinition[] = []
    const properties = schema.properties || {}

    Object.entries(properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
        // Skip hidden fields
        if (property['x-table-hidden']) return

        // Skip complex nested objects
        if (property.type === 'object' && !key.startsWith('_')) return

        const column: ColumnDefinition = {
            field: key,
            title: property.title || key,
            width: property['x-table-width'],
            minWidth: property['x-table-width'] ? undefined : 100,
            sorter: 'string',

            editable: true// enableInlineEdit && !property['x-table-readonly'],
        }

        // Set type-specific properties
        switch (property.type) {
            case 'boolean':
                column.formatter = cellFormatters.boolean
                column.editor = 'tickCross'
                break

            case 'number':
            case 'integer':
                column.editor = enableInlineEdit ? 'number' : false
                column.validator = enableInlineEdit ? ['numeric'] : undefined
                break

            case 'string':
                if (property.enum) {
                    column.editor = enableInlineEdit ? 'select' : false
                    column.enumValues = property.enum.map(val => ({
                        value: val,
                        label: val
                    }))
                } else if (property.format === 'date' || property.format === 'date-time') {
                    column.formatter = cellFormatters.date
                    column.editor = enableInlineEdit ? 'date' : false
                } else {
                    column.editor = 'input'
                    if (property.maxLength) {
                        //column.validator = [`maxLength:${property.maxLength}`]
                    }
                }
                break

            case 'array':
                column.formatter = cellFormatters.array
                column.editable = true
                break

            case 'object':
                column.formatter = cellFormatters.reference
                column.editable = true
                break
        }

        // Check for status field
        if (key === 'status' || key.toLowerCase().includes('status')) {
            column.formatter = cellFormatters.status
        }

        columns.push(column)
    })

    return columns
}

export function generateTabulatorColumns(
    schema: JsonSchema,
    enableInlineEdit: boolean,
): ColumnDefinition[] {

    let columns: ColumnDefinition[] = []


    if (schema?.properties) {
        columns = [...columns, ...generateFromSchema(schema, enableInlineEdit)]
    } else {
        return []
    }


    return columns
}