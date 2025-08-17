import React from 'react';

import { InputError, InputLabel } from '../common';
import { BaseInputProps } from './types.ts';

interface TextInputProps extends BaseInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'email' | 'password' | 'tel' | 'text';
  value: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  className = '',
  disabled,
  error,
  id,
  label,
  onChange,
  placeholder,
  required,
  type = 'text',
  value,
}) => {
  const inputId = id || `text-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      {label && <InputLabel label={label} htmlFor={inputId} required={required} />}
      <input
        type={type}
        id={inputId}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''}`}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputError error={error} />
    </div>
  );
};
