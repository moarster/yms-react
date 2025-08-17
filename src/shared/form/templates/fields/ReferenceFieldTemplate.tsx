import React from 'react';

import FieldInfoTooltip from '@/shared/form/FieldInfoTooltip.tsx';
import ReferenceDropdown from '@/shared/form/ReferenceDropdown.tsx';

import { getFieldLayout } from '../layout/FieldLayoutProvider.ts';
import { FieldTemplateProps } from '../types.ts';

export const ReferenceFieldTemplate: React.FC<FieldTemplateProps> = ({
  disabled,
  errors,
  formData,
  id,
  label,
  onChange,
  required,
  schema,
}) => {
  const isSidebarField = schema['x-layout'] === 'sidebar';
  const description = schema.description || label || '';
  const { labelClass, wrapperClass } = getFieldLayout(isSidebarField);

  const domain = formData?.domain || 'reference';
  const fieldValue = formData?.id;
  const catalogKey = formData?.catalog;

  return (
    <div className={wrapperClass}>
      <div className="flex items-center">
        <label htmlFor={id} className={labelClass}>
          {label}
          {required && ' *'}
        </label>
        <FieldInfoTooltip content={description} />
      </div>
      <ReferenceDropdown
        error={errors}
        domain={domain}
        value={fieldValue}
        disabled={disabled}
        required={required}
        catalog={catalogKey}
        placeholder={`Select ${label.toLowerCase()}...`}
        onChange={onChange}
      />
    </div>
  );
};
