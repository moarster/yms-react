import { LinkDefinition } from '@/types/schema.ts';

import { BaseEntity, BaseProperty, PropertyValue } from './base';
import { isBaseEntity } from '@/types/guards.ts';

export interface BaseLink extends BaseProperty {
  readonly id: string;
  readonly domain: string;
  readonly entity: string;
  readonly catalog?: string;
  title?: string;
}

export interface ListLink<TCatalog extends string = string> extends BaseLink {
  readonly domain: 'lists';
  readonly entity: 'item';
  readonly catalog: TCatalog;
}

export interface CatalogLink<TCatalog extends string = string> extends BaseLink {
  readonly domain: 'reference';
  readonly entity: 'item';
  readonly catalog: TCatalog;
}

export type ReferentLink = CatalogLink | ListLink;

export interface CustomLink extends BaseLink {
  readonly domain: string;
  readonly entity: string;
  readonly catalog?: string;
}
export interface ResolvedLink extends BaseLink {
  entry: BaseEntity;
  resolvedAt?: Date;
}
export interface Attachment extends BaseProperty {
  filename?: string;
  mimetype?: string;
  minio_key?: string;
  size?: number;
}

export const isBaseLink = (value: unknown): value is BaseLink => {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    obj.id.length > 0 &&
    typeof obj.domain === 'string' &&
    obj.domain.length > 0 &&
    (obj.entity === undefined || typeof obj.entity === 'string') /*&&
    (obj.catalog === undefined || typeof obj.catalog === 'string') &&
    (obj.title === undefined || typeof obj.title === 'string')*/
  );
};
export const isListLink = (link: BaseLink): link is ListLink =>
  isBaseLink(link) && link.domain === 'lists' && link.entity === 'item';

export const isCatalogLink = (link: BaseLink): link is CatalogLink =>
  isBaseLink(link) && link.domain === 'reference' && link.entity === 'item';

export const isReferentLink = (link: PropertyValue): link is ReferentLink =>
  isBaseLink(link) && (isListLink(link) || isCatalogLink(link));

export const isResolvedLink = (link: PropertyValue): link is ResolvedLink =>
  isBaseLink(link) && isBaseEntity(link.entry);


// Validation helper for link creation
export const validateLinkStructure = (link: Partial<BaseLink>): string[] => {
  const errors: string[] = [];

  if (!link.id || typeof link.id !== 'string' || link.id.trim() === '') {
    errors.push('id is required and must be a non-empty string');
  }

  if (!link.domain || typeof link.domain !== 'string' || link.domain.trim() === '') {
    errors.push('domain is required and must be a non-empty string');
  }

  if (link.domain === 'lists' || link.domain === 'reference') {
    if (!link.entity || link.entity !== 'item') {
      errors.push(`entity must be 'item' for domain '${link.domain}'`);
    }
    if (!link.catalog || typeof link.catalog !== 'string' || link.catalog.trim() === '') {
      errors.push(`catalog is required for domain '${link.domain}'`);
    }
  }

  return errors;
};

export const createDummyLink = (def: LinkDefinition): BaseLink => ({
  catalog: def.properties.catalog.const,
  domain: def.properties.domain.const,
  entity: def.properties.entity.const,
  id: '-',
});

// Factory functions for type-safe link creation
export const createListLink = (params: {
  id: string;
  catalog: string;
  title?: string;
}): ListLink => ({
  ...params,
  domain: 'lists' as const,
  entity: 'item' as const,
});

export const createCatalogLink = (params: {
  id: string;
  catalog: string;
  title?: string;
}): CatalogLink => ({
  ...params,
  domain: 'reference' as const,
  entity: 'item' as const,
});

// Helper for working with link collections
export const partitionLinks = (links: BaseLink[]) => {
  const lists: ListLink[] = [];
  const catalogs: CatalogLink[] = [];
  const custom: CustomLink[] = [];

  for (const link of links) {
    if (isListLink(link)) {
      lists.push(link);
    } else if (isCatalogLink(link)) {
      catalogs.push(link);
    } else {
      custom.push(link as CustomLink);
    }
  }

  return { catalogs, custom, lists };
};
