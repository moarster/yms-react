import { BaseEntity, DataEntity, DomainEntity, MetadataEntity } from './base'

export const isBaseEntity = (obj: unknown): obj is BaseEntity =>
    typeof obj === 'object' &&
    obj !== null &&
    'title' in obj &&
    typeof (obj as BaseEntity).title === 'string'

export const isDataEntity = (obj: unknown): obj is DataEntity =>
    isBaseEntity(obj) && 'data' in obj

export const isDomainEntity = (obj: unknown): obj is DomainEntity =>
    isDataEntity(obj) &&
    ('status' in obj || 'process' in obj || 'meta' in obj)

export const isMetadataEntity = (obj: unknown): obj is MetadataEntity =>
    typeof obj === 'object' &&
    obj !== null &&
    'schema' in obj

// Utility type predicates
export const hasId = <T>(obj: T): obj is T & { id: string } =>
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as T & { id: unknown }).id === 'string'

export const isPersistedEntity = <T extends BaseEntity>(obj: T): obj is T & Required<Pick<T, 'id' | 'createdBy' | 'createdDate'>> =>
    hasId(obj) &&
    'createdBy' in obj &&
    'createdDate' in obj &&
    typeof obj.createdBy === 'string' &&
    obj.createdDate instanceof Date

// Array type guards
export const isArrayOf = <T>(
    arr: unknown[],
    guard: (item: unknown) => item is T
): arr is T[] =>
    Array.isArray(arr) && arr.every(guard)

// Generic object validation
export const hasRequiredFields = <T extends Record<string, unknown>>(
    obj: unknown,
    fields: (keyof T)[]
): obj is T =>
    typeof obj === 'object' &&
    obj !== null &&
    fields.every(field => field in obj)