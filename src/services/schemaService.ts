import {apiClient} from './apiClient'

export interface JsonSchema {
    $schema?: string
    $id?: string
    title?: string
    description?: string
    type: string
    properties?: Record<string, JsonSchemaProperty>
    allOf?: JsonSchema[]
    required?: string[]
    additionalProperties?: boolean
}

export interface JsonSchemaProperty {
    type: string
    title?: string
    description?: string
    format?: string
    pattern?: string
    minimum?: number
    maximum?: number
    minLength?: number
    maxLength?: number
    enum?: (string | number)[]
    items?: JsonSchemaProperty
    properties?: Record<string, JsonSchemaProperty>
    required?: string[]
    default?: any
    examples?: any[]
    // UI hints for table generation
    'x-table-width'?: number
    'x-table-sortable'?: boolean
    'x-table-filterable'?: boolean
    'x-table-editable'?: boolean
    'x-table-hidden'?: boolean
    'x-cell-renderer'?: string
    'x-cell-editor'?: string
}

export interface TableConfig {
    defaultColDef?: any
    pagination?: boolean
    pageSize?: number
    enableSorting?: boolean
    enableFiltering?: boolean
    enableSelection?: boolean
    enableEditing?: boolean
    rowHeight?: number
    headerHeight?: number
}

class SchemaService {
    async getAnySchema(key: string): Promise<JsonSchema> {
        return await apiClient.getNaked<JsonSchema>(`/meta/urn:solvo:${key}/schema`)
    }

}

export const schemaService = new SchemaService()