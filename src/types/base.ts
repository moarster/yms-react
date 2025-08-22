export interface Identifiable {
  id?: string;
}

export interface Auditable {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export interface Titled {
  description?: string;
  title?: string;
}

export interface BaseEntity extends Identifiable, Auditable, Titled {}

export interface DataEntity<TData = BaseProperty> extends BaseEntity {
  data: TData | undefined;
}

export interface DomainEntity<TData = BaseProperty> extends DataEntity<TData> {
  meta?: string;
  process?: string;
  status?: string;
}

export interface MetadataEntity extends Identifiable, Auditable {
  schema?: string;
  since?: Date;
  until?: Date;
}
export type PropertyValue =
  | BaseEntity
  | BaseProperty
  | boolean
  | Date
  | null
  | number
  | PropertyValue[]
  | string
  | undefined;

export interface BaseProperty {
  [key: string]: PropertyValue;
}

// Strip audit fields for creation
export type CreatePayload<T extends BaseEntity> = Omit<T, 'id' | keyof Auditable>;

// Partial update payload
export type UpdatePayload<T extends BaseEntity> = Partial<CreatePayload<T>>;

// Fully persisted entity (all audit fields required)
export type PersistedEntity<T extends BaseEntity> = T &
  Required<Auditable> &
  Required<Identifiable>;
