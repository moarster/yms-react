// noinspection t

import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon
} from '@mui/icons-material'
import { GridActionsCellItem, GridColDef, GridRowParams} from '@mui/x-data-grid'
import React from "react";

import { JsonSchema, JsonSchemaProperty } from '@/types'

import { CELL_RENDERERS } from './rendering/cellRendererRegistry.ts'
import { TableActions, TableRow } from './types.ts'

const getDefaultWidth = (property: JsonSchemaProperty): number => {
    switch (property.type) {
        case 'boolean':
            return 80
        case 'number':
        case 'integer':
            return 120
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') return 160
            if (property.maxLength && property.maxLength < 50) return 150
            return 200
        default:
            return 200
    }
}

const getColumnConfig = (property: JsonSchemaProperty): Partial<GridColDef> => {
    const config: Partial<GridColDef> = {}

    switch (property.type) {
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') {
                config.renderCell = (params) => React.createElement(CELL_RENDERERS.date, params)
                config.type = 'date'
                if (!property['x-table-readonly']) {
                    config.renderEditCell = (params) => React.createElement(CELL_EDITORS.date, {
                        value: params.value,
                        onValueChange: params.api.setEditCellValue,
                    })
                }
            } else if (property.enum) {
                config.renderCell = (params) => React.createElement(CELL_RENDERERS.status, params)
                config.type = 'singleSelect'
                config.valueOptions = property.enum
                if (!property['x-table-readonly']) {
                    config.renderEditCell = (params) => React.createElement(CELL_EDITORS.select, {
                        value: params.value,
                        onValueChange: (value) => params.api.setEditCellValue({ id: params.id, field: params.field, value }),
                        enumValues: property.enum.map(val => ({ value: val, label: String(val) }))
                    })
                }
            } else {
                config.renderCell = (params) => React.createElement(CELL_RENDERERS.text, params)
                config.type = 'string'
                if (!property['x-table-readonly']) {
                    config.renderEditCell = (params) => React.createElement(CELL_EDITORS.text, {
                        value: params.value,
                        onValueChange: (value) => params.api.setEditCellValue({ id: params.id, field: params.field, value }),
                        placeholder: property.title,
                        maxLength: property.maxLength
                    })
                }
            }
            break
        case 'object':
            config.renderCell = (params) => React.createElement(CELL_RENDERERS.reference, params)
            config.sortable = false
            break
        case 'array':
            config.renderCell = (params) => React.createElement(CELL_RENDERERS.array, params)
            config.sortable = false
            config.filterable = false
            break
        case 'boolean':
            config.renderCell = (params) => React.createElement(CELL_RENDERERS.boolean, params)
            config.type = 'boolean'
            break
        case 'number':
        case 'integer':
            config.renderCell = (params) => React.createElement(CELL_RENDERERS.text, params)
            config.type = 'number'
            if (!property['x-table-readonly']) {
                config.renderEditCell = (params) => React.createElement(CELL_EDITORS.number, {
                    value: params.value,
                    onValueChange: (value) => params.api.setEditCellValue({ id: params.id, field: params.field, value }),
                    min: property.minimum,
                    max: property.maximum,
                    step: property.type === 'integer' ? 1 : 0.01
                })
            }
            break
        default:
            config.renderCell = (params) => React.createElement(CELL_RENDERERS.text, params)
    }

    return config
}

export const generateSchemaBasedColumns = <TRow extends TableRow>(
    properties: Record<string, JsonSchemaProperty>,
    actions: TableActions<TRow>,
    enableActions = false
): GridColDef[] => {
    const columns: GridColDef[] = []

    // Generate property columns
    Object.entries(properties || {}).forEach(([key, property]) => {
        // Skip hidden fields
        if (property['x-table-hidden']) return

        // Skip complex objects (nested properties) but keep references
        if (property.type === 'object' && !key.startsWith('_')) return

        const colDef: GridColDef = {
            field: key,
            headerName: property.title || key,
            sortable: property['x-table-sortable'] !== false,
            filterable: property['x-table-filterable'] !== false,
            editable: property['x-table-editable'] === true,
            width: property['x-table-width'] || getDefaultWidth(property),
            flex: property['x-table-width'] ? 0 : 1,
            minWidth: 100,
            ...getColumnConfig(property)
        }

        columns.push(colDef)
    })

    // Add actions column if enabled
    if (enableActions && (actions.onEdit || actions.onDelete || actions.onView)) {
        columns.push(createActionsColumn(actions))
    }

    return columns
}

export const generateSchemalessColumns = <TRow extends TableRow>(
    data: TRow[],
    actions: TableActions<TRow>,
    enableActions = false
): GridColDef[] => {
    const columns: GridColDef[] = []

    if (!data || data.length === 0) {
        return [{ field: 'id', headerName: 'ID', width: 100 }]
    }

    // Get all unique keys from the data
    const allKeys = new Set<string>()
    data.forEach(row => {
        if (row && typeof row === 'object') {
            Object.keys(row).forEach(key => allKeys.add(key))
        }
    })

    // Create columns for each key
    allKeys.forEach(key => {
        if (key === 'id') return // Skip id as it's handled by DataGrid

        const colDef: GridColDef = {
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
            flex: 1,
            renderCell: (params) => {
                const { value } = params

                // Handle objects with title property
                if (value && typeof value === 'object' && 'title' in value) {
                    return React.createElement(CELL_RENDERERS.reference, { ...params, value })
                }

                // Handle arrays
                if (Array.isArray(value)) {
                    return React.createElement(CELL_RENDERERS.array, { ...params, value })
                }

                // Default text renderer
                return React.createElement(CELL_RENDERERS.text, { ...params, value })
            }
        }

        columns.push(colDef)
    })

    // Add actions column if enabled
    if (enableActions && (actions.onEdit || actions.onDelete || actions.onView)) {
        columns.push(createActionsColumn(actions))
    }

    return columns
}


const createActionsColumn = <TRow extends TableRow>(
    actions: TableActions<TRow>
): GridColDef => ({
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 120,
    cellClassName: 'actions',
    getActions: (params: GridRowParams<TRow>) => {
        const actionItems = []

        if (actions.onView) {
            actionItems.push(
                React.createElement(GridActionsCellItem, {
                    key: 'view',
                    icon:  React.createElement(ViewIcon),
                    label: 'View',
                    onClick: () => actions.onView!(params.row)
                })
            )
        }
        if (actions.onEdit) {
            actionItems.push(
                React.createElement(GridActionsCellItem, {
                    key: 'edit',
                    icon: React.createElement(EditIcon),
                    label: 'Edit',
                    onClick: () => actions.onEdit!(params.row)
                })
            )
        }

        if (actions.onDelete) {
            actionItems.push(
                React.createElement(GridActionsCellItem, {
                    key: 'delete',
                    icon: React.createElement(DeleteIcon),
                    label: 'Delete',
                    onClick: () => actions.onDelete!(params.row)
                })
            )
        }
        return actionItems
    },
})

export const generateColumns = <TRow extends TableRow>(
    schema: JsonSchema | undefined,
    data: TRow[],
    actions: TableActions<TRow>,
    enableActions = false
): GridColDef[] => {
    // Try schema-based generation first
    if (schema?.properties) {
        return generateSchemaBasedColumns(schema.properties, actions, enableActions)
    }

    // Handle allOf schemas
    if (schema?.allOf?.[0]?.properties) {
        return generateSchemaBasedColumns(schema.allOf[0].properties, actions, enableActions)
    }

    // Fallback to schemaless generation
    return generateSchemalessColumns(data, actions, enableActions)
}

