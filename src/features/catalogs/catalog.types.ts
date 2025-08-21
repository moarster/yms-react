import { BaseEntity, DataEntity } from '@/types';
import { TableRow } from '@/shared/ui/MantineTable/types.ts';

export type CatalogType = 'CATALOG' | 'LIST';

export interface CatalogBase extends BaseEntity {
  referenceKey: string;
  type: CatalogType;
}

export interface Catalog extends CatalogBase {
  meta?: string;
  type: 'CATALOG';
}

export interface SimpleList extends CatalogBase {
  type: 'LIST';
}

export type CatalogItem = DataEntity;
export type ListItem = BaseEntity;
export type CatalogItemRow = TableRow & CatalogItem;

export const isCatalog = (obj: CatalogBase): obj is Catalog => obj.type === 'CATALOG';
export const isSimpleList = (obj: CatalogBase): obj is SimpleList => obj.type === 'LIST';
