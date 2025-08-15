import { BaseEntity, DataEntity } from '@/types'

export type CatalogType = 'CATALOG' | 'LIST'

export interface CatalogBase extends BaseEntity {
    referenceKey: string
    type: CatalogType
}

export interface Catalog extends CatalogBase {
    type: 'CATALOG'
    meta?: string
}

export interface SimpleList extends CatalogBase {
    type: 'LIST'
}


export type CatalogItem = DataEntity
export type ListItem = BaseEntity


export const isCatalog = (obj: CatalogBase): obj is Catalog => obj.type === 'CATALOG'
export const isSimpleList = (obj: CatalogBase): obj is SimpleList => obj.type === 'LIST'