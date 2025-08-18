import { isNumberLike, NumberInput as MantineNumberInput } from '@mantine/core';
import React from 'react';

import { BaseInputProps } from './types.ts';

interface NumberInputProps extends BaseInputProps {
  max?: number;
  min?: number;
  onChange: (value: null | number) => void;
  placeholder?: string;
  step?: number;
  value: null | number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  className = '',
  disabled,
  error,
  id,
  label,
  max,
  min,
  onChange,
  placeholder,
  required,
  step = 0.01,
  value,
}) => {
  const handleChange = (val: number | string) => {
    if (val === '') {
      onChange(null);
    } else {
      const numValue = isNumberLike(val) ? Number(val) : parseFloat(val.toString());
      onChange(isNaN(numValue) ? null : numValue);
    }
  };

  return (
    <MantineNumberInput
      max={max}
      min={min}
      step={step}
      error={error}
      label={label}
      disabled={disabled}
      required={required}
      value={value ?? ''}
      className={className}
      placeholder={placeholder}
      id={id || `text-input-${crypto.randomUUID()}`}
      onChange={handleChange}
    />
  );
};
