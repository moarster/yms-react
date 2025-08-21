import { CatalogType } from '@/features/catalogs/catalog.types.ts';
import {  ReferentLink } from '@/types';

export interface ReferenceFieldInfo {
  catalog: string;
  isValid: boolean;
  linkType: CatalogType;
}

export const extractReferenceInfo = (
  reference: ReferentLink,
):ReferenceFieldInfo => {

  const linkType = reference.domain === 'reference' ? 'CATALOG' : 'LIST';

  return {
    catalog: reference.catalog,
    isValid: true,
    linkType,
  };
};

