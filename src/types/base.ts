export interface Identifiable {
    id?: string
}

export interface Auditable {
    createdBy?: string
    createdDate?: Date
    lastModifiedBy?: string
    lastModifiedDate?: Date
}

export interface Titled {
    title?: string
    description?: string
}

// Core entity types with clear hierarchy
export interface BaseEntity extends Identifiable, Auditable, Titled {}

export interface DataEntity<TData = Record<string, unknown>> extends BaseEntity {
    data?: TData
}

export interface DomainEntity<TData = Record<string, unknown>> extends DataEntity<TData> {
    status?: string
    process?: string
    meta?: string
}

export interface MetadataEntity extends Identifiable, Auditable {
    schema?: string
    since?: Date
    until?: Date
}

// Utility types for entity operations
export type EntityId = string
export type EntityStatus = string

// Strip audit fields for creation
export type CreatePayload<T extends BaseEntity> = Omit<T, keyof Auditable | 'id'>

// Partial update payload
export type UpdatePayload<T extends BaseEntity> = Partial<CreatePayload<T>>

// Fully persisted entity (all audit fields required)
export type PersistedEntity<T extends BaseEntity> = T & Required<Auditable> & Required<Identifiable>