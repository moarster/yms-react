import { BaseEntity } from './base'

export interface BaseLink {
    domain: string
    entity?: string
    catalog?: string
    id: string
    title?: string
    entry?: BaseEntity
}

export interface ListLink<TCatalog extends string = string> extends BaseLink {
    domain: 'lists'
    entity: 'item'
    catalog: TCatalog
}

export interface ReferenceLink<TCatalog extends string = string> extends BaseLink {
    domain: 'reference'
    entity: 'item'
    catalog: TCatalog
}

export interface Attachment {
    filename?: string
    mimetype?: string
    size?: number
    minio_key?: string
}

export const isListLink = (link: BaseLink): link is ListLink =>
    link.domain === 'lists' && link.entity === 'item'

export const isReferenceLink = (link: BaseLink): link is ReferenceLink =>
    link.domain === 'reference' && link.entity === 'item'