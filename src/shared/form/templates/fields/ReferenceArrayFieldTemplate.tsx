import { XIcon } from '@phosphor-icons/react';
import React from 'react';

import FieldInfoTooltip from '@/shared/form/FieldInfoTooltip.tsx';
import ReferenceDropdown from '@/shared/form/ReferenceDropdown.tsx';

import { getFieldLayout } from '../layout/FieldLayoutProvider.ts';
import { FieldTemplateProps } from '../types.ts';

export const ReferenceArrayFieldTemplate: React.FC<FieldTemplateProps> = ({
  disabled,
  errors,
  formData,
  label,
  name,
  onChange,
  required,
  schema,
}) => {
  const isSidebarField = schema['x-layout'] === 'sidebar';
  const description = schema.description || label || '';
  const { labelClass, wrapperClass } = getFieldLayout(isSidebarField);

  const catalogKey = name?.slice(1); // Remove the "_" prefix
  const domain = schema.items.properties?.domain?.enum?.[0] || 'reference';
  const fieldValues = formData?.[name!] || [];

  const handleArrayAdd = (value: any) => {
    const newValues = [...fieldValues, value];
    onChange(newValues);
  };

  const handleArrayRemove = (index: number) => {
    const newValues = fieldValues.filter((_: any, i: number) => i !== index);
    onChange(newValues);
  };

  return (
    <div className={wrapperClass}>
      <div className="flex items-center">
        <label className={labelClass}>
          {label}
          {required && ' *'}
        </label>
        <FieldInfoTooltip content={description} />
      </div>

      {fieldValues.length > 0 && (
        <div className="mb-2 space-y-1">
          {fieldValues.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded"
            >
              <span className="text-sm text-gray-900">{item?.title || item?.id}</span>
              {!disabled && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => handleArrayRemove(index)}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!disabled && (
        <ReferenceDropdown
          value={null}
          domain={domain}
          disabled={disabled}
          catalog={catalogKey!}
          placeholder={`Add ${label.toLowerCase()}...`}
          onChange={handleArrayAdd}
        />
      )}

      {errors && <div className="text-red-600 text-sm mt-1">{errors}</div>}
    </div>
  );
};
