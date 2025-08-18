import { TextInput as MantineTextInput } from '@mantine/core';
import React, { HTMLInputTypeAttribute } from 'react';

import { BaseInputProps } from './types.ts';

interface TextInputProps extends BaseInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
  value: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  className,
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
  return (
    <MantineTextInput
      type={type}
      error={error}
      label={label}
      value={value}
      disabled={disabled}
      required={required}
      className={className}
      withAsterisk={required}
      placeholder={placeholder}
      id={id || `text-input-${crypto.randomUUID()}`}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
