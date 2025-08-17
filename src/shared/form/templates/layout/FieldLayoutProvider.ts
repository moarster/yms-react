import { FieldLayoutConfig } from '../types.ts';

export const getFieldLayout = (isSidebarField: boolean): FieldLayoutConfig => {
  if (isSidebarField) {
    return {
      labelClass: 'block text-sm font-medium text-gray-700 mb-1',
      wrapperClass: 'mb-4',
    };
  }

  return {
    labelClass: 'block text-sm font-medium text-gray-900 mb-2',
    wrapperClass: 'mb-6',
  };
};
