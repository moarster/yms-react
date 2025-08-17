import React from 'react';

import { InputError, InputLabel } from '../common';
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
  const inputId = id || `number-input-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(null);
    } else {
      const numValue = parseFloat(val);
      onChange(isNaN(numValue) ? null : numValue);
    }
  };

  return (
    <div className={className}>
      {label && <InputLabel label={label} htmlFor={inputId} required={required} />}
      <input
        max={max}
        min={min}
        step={step}
        id={inputId}
        type="number"
        disabled={disabled}
        value={value ?? ''}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''}`}
        onChange={handleChange}
      />
      <InputError error={error} />
    </div>
  );
};
