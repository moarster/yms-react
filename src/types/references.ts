import { BaseEntity, EntityData } from './base';

export interface BaseLink extends EntityData {
  catalog?: string;
  domain: string;
  entity?: string;
  entry?: BaseEntity;
  id: string;
  title?: string;
}

export interface ListLink<TCatalog extends string = string> extends BaseLink {
  catalog: TCatalog;
  domain: 'lists';
  entity: 'item';
}

export interface ReferenceLink<TCatalog extends string = string> extends BaseLink {
  catalog: TCatalog;
  domain: 'reference';
  entity: 'item';
}

export interface Attachment extends EntityData {
  filename?: string;
  mimetype?: string;
  minio_key?: string;
  size?: number;
}

export const isListLink = (link: BaseLink): link is ListLink =>
  link.domain === 'lists' && link.entity === 'item';

export const isReferenceLink = (link: BaseLink): link is ReferenceLink =>
  link.domain === 'reference' && link.entity === 'item';
