import { BaseEntity, isDataEntity } from '@/types';

/**
 * A set of utility functions for working with entities.
 */
export const useEntity = () => {
  const getTitle = (entity: BaseEntity): string => {
    return entity.title ?? (isDataEntity(entity) ? ((entity.data?.title as string) ?? '') : '');
  };

  return {
    getTitle,
  };
};
