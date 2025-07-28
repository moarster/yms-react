import {AnyData} from "@/types/schemas/schemaModel.ts";

interface Auditable {
    id?: string;
    createdBy?: string;
    createdDate?: Date;
    lastModifiedBy?: string;
    lastModifiedDate?: Date;
}

interface TitledEntity {
    title: string
    description?: string
}

export interface BaseEntity extends Auditable, TitledEntity {

}

export interface DataEntity<T extends AnyData> extends BaseEntity {
    data?: T;
}


export interface DomainEntity<T extends AnyData> extends DataEntity<T> {
    status?: string;
    process?: string;
    meta?: string;
}

export interface MetadataEntity extends Auditable{
    schema?: string;
    since?: Date;
    until?: Date;
}
export interface List extends BaseEntity {
    referenceKey: string;
    type: 'CATALOG'|'LIST';
}
export interface RichList extends List {
    meta?: string;
    type: 'CATALOG';
}
export interface SimpleList extends List {
    type: 'LIST';
}

export type RichListItem = DataEntity<AnyData>
export type SimpleListItem = BaseEntity

export const isBaseEntity = (obj: any): obj is BaseEntity => {
    return obj && typeof obj === 'object' ;
};

export const isDomainEntity = (obj: any): obj is DomainEntity<AnyData> => {
    return isBaseEntity(obj) && ('data' in obj || 'status' in obj || 'process' in obj);
};

export const isMetadataEntity = (obj: any): obj is MetadataEntity => {
    return obj && typeof obj === 'object' && 'schema' in obj && 'getSchemaAsJson' in obj;
};

// Utility types for common patterns
export type EntityId = string;
export type UserId = string;
export type EntityStatus = string;
export type ProcessName = string;
export type ReferenceKey = string;

// Common entity creation payload (excludes audit fields)
export type CreateEntityPayload<T extends BaseEntity> = Omit<T,
    'id' | 'createdBy' | 'createdDate' | 'lastModifiedBy' | 'lastModifiedDate' | 'isNew'
>;

// Update entity payload (excludes audit fields and id)
export type UpdateEntityPayload<T extends BaseEntity> = Partial<Omit<T,
    'id' | 'createdBy' | 'createdDate' | 'lastModifiedBy' | 'lastModifiedDate' | 'isNew'
>>;

// Entity with required audit fields (for responses from backend)
export type PersistedEntity<T extends BaseEntity> = T & {
    id: string;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
};