import { TextInput as MantineTextInput } from '@mantine/core';
import React from 'react';

import { BaseInputProps } from './types.ts';

export const TextInput: React.FC<BaseInputProps> = ({
  className,
  disabled = false,
  error,
  id,
  label,
  onChange,
  value,
  propertyDef,
}) => {
  const required = !!propertyDef?.config?.required;
  return (
    <MantineTextInput
      type={'text'}
      error={error}
      label={label}
      value={typeof value === 'string' ? value : undefined}
      disabled={disabled}
      required={required}
      className={className}
      withAsterisk={required}
      placeholder={'...'}
      id={id || `text-input-${crypto.randomUUID()}`}
      onChange={(e) => (onChange ? onChange(e.target.value) : {})}
    />
  );
};
