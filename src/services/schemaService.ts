import { merge } from 'allof-merge'

import { JsonSchema } from '@/types'

import {apiClient} from './apiClient'


export interface TableConfig {
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
        const schema= await apiClient.getNaked<JsonSchema>(`/meta/urn:solvo:${key}/schema`)
        const mergedSchema =  merge(schema, {
            mergeRefSibling: false,
            mergeCombinarySibling: false,
            onMergeError: (message, path, values) => {
                console.warn(`Merge conflict at ${path}: ${message}`, values)
                return schema
            }
        }) as JsonSchema
        delete mergedSchema.$schema

        return mergedSchema
    }

}

export const schemaService = new SchemaService()