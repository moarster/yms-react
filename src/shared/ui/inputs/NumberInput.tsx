import { isNumberLike, NumberInput as MantineNumberInput } from '@mantine/core';
import React from 'react';

import { BaseInputProps } from './types.ts';

export const NumberInput: React.FC<BaseInputProps> = ({
  className = '',
  disabled,
  error,
  id,
  label,
  onChange,
  propertyDef,

  value,
}) => {
  const handleChange = onChange
    ? (val: number | string) => {
        if (val === '') {
          onChange(null);
        } else {
          const numValue = isNumberLike(val) ? Number(val) : parseFloat(val.toString());
          onChange(isNaN(numValue) ? null : numValue);
        }
      }
    : undefined;

  const effectiveValue = value
    ? isNumberLike(value)
      ? Number(value)
      : parseFloat(value.toString())
    : '';

  return (
    <MantineNumberInput
      max={propertyDef.maximum}
      min={propertyDef.minimum}
      step={100}
      error={error}
      label={label}
      disabled={disabled}
      required={propertyDef.config.required}
      value={effectiveValue}
      className={className}
      id={id || `text-input-${crypto.randomUUID()}`}
      onChange={handleChange}
    />
  );
};
