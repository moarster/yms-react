import { Column, RenderCellProps, RenderEditCellProps } from 'react-data-grid'

import { JsonSchema, JsonSchemaProperty } from '@/types'

import { cellEditors } from './render/cellEditorRegistry.ts'
import { cellRenderers } from './render/cellRenderers.tsx'
import { BaseTableRow } from './table.types.ts'

export function generateDataGridColumns<T extends BaseTableRow>(
    schema: JsonSchema | undefined,
    enableInlineEdit: boolean,
    selectable?: boolean
): Column<T>[] {
    const columns: Column<T>[] = []

    if (selectable) {
        columns.push({
            key: 'selection',
            name: '',
            width: 0,
            minWidth: 0,
            maxWidth: 0,
            resizable: false,
            sortable: false,
            frozen: true,
            renderCell: (props: RenderCellProps<T>) => {
                const rowId = props.row.id || ''
                const isSelected = props.isRowSelected || false

                return (
                    <div className="selection-cell-container">
                        <button
                            className={`selection-circle ${isSelected ? 'selected' : 'unselected'}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (props.onRowSelectionChange) {
                                    props.onRowSelectionChange({
                                        row: props.row,
                                        checked: !isSelected,
                                        isShiftClick: e.shiftKey
                                    })
                                }
                            }}
                            title={isSelected ? 'Deselect row' : 'Select row'}
                        />
                    </div>
                )
            },
            renderHeaderCell: () => <div className="w-0 h-0 overflow-hidden" />
        })
    }


    if (schema?.properties) {
        // Schema-based columns
        Object.entries(schema.properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
            if (property['x-table-hidden']) return
            if (property.type === 'object' && !key.startsWith('_')) return

            const column: Column<T> = {
                key,
                name: property.title || key,
                width: property['x-table-width'] || getDefaultWidth(property),
                resizable: true,
                sortable: property['x-table-sortable'] !== false,
                editable: enableInlineEdit && !property['x-table-readonly'],
                renderCell: getCellRenderer(key, property),
                renderEditCell: getCellEditor(property)
            }

            columns.push(column)
        })
    } else {
        // Schemaless columns - generate from data
        const sampleRow = (schema as any)?.[0]
        if (sampleRow && typeof sampleRow === 'object') {
            Object.keys(sampleRow).forEach(key => {
                if (key === 'id') return

                columns.push({
                    key,
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    width: 150,
                    resizable: true,
                    sortable: true,
                    editable: enableInlineEdit,
                    renderCell: (props: RenderCellProps<T>) => {
                        const value = props.row[key as keyof T]
                        return cellRenderers.auto(value)
                    }
                })
            })
        }
    }

    return columns
}

function getDefaultWidth(property: JsonSchemaProperty): number {
    switch (property.type) {
        case 'boolean': return 80
        case 'number':
        case 'integer': return 120
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') return 160
            if (property.enum) return 140
            if (property.maxLength && property.maxLength < 50) return 150
            return 200
        case 'array': return 150
        case 'object': return 200
        default: return 150
    }
}

function getCellRenderer(key: string, property: JsonSchemaProperty) {
    return (props: RenderCellProps<any>) => {
        const value = props.row[key]

        // Handle special cases
        if (key === 'status' || key.toLowerCase().includes('status')) {
            return cellRenderers.status(value)
        }

        // Type-based rendering
        switch (property.type) {
            case 'boolean':
                return cellRenderers.boolean(value)
            case 'string':
                if (property.format === 'date' || property.format === 'date-time') {
                    return cellRenderers.date(value)
                }
                if (property.enum) {
                    return cellRenderers.status(value)
                }
                return cellRenderers.text(value)
            case 'number':
            case 'integer':
                return cellRenderers.number(value)
            case 'array':
                return cellRenderers.array(value)
            case 'object':
                return cellRenderers.reference(value)
            default:
                return cellRenderers.text(value)
        }
    }
}

function getCellEditor<T extends BaseTableRow>(property: JsonSchemaProperty) {
    return (props: RenderEditCellProps<T>) => {
        switch (property.type) {
            case 'boolean':
                return cellEditors.boolean(props)
            case 'string':
                if (property.enum) {
                    return cellEditors.select(props, property.enum)
                }
                if (property.format === 'date') {
                    return cellEditors.date(props)
                }
                return cellEditors.text(props)
            case 'number':
            case 'integer':
                return cellEditors.number(props)
            default:
                return cellEditors.text(props)
        }
    }
}

