import {BaseEntity} from "@/types/dataModel.ts";

export interface AnyLink {
    domain: string
    entity?: string
    catalog?: string
    id: string
    title?: string
    entry?: BaseEntity
}

export interface ListLink<T extends string = string> extends AnyLink {
    domain: 'lists'
    entity: 'item'
    catalog: T
}

export interface ReferenceLink<T extends string = string> extends AnyLink {
    domain: 'reference'
    entity: 'item'
    catalog: T
}

export interface Attachment {
    filename?: string
    mimetype?: string
    size?: number
    minio_key?: string
}

export type AnyData = object