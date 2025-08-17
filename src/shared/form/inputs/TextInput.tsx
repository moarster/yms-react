import React, { HTMLInputTypeAttribute } from 'react';

import { BaseInputProps } from './types.ts';
import { TextInput as MantineTextInput } from '@mantine/core';

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
      label={label}
      placeholder={placeholder}
      type={type}
      required={required}
      withAsterisk={required}
      id={id || `text-input-${crypto.randomUUID()}`}
      value={value}
      error={error}
      disabled={disabled}
      className={className}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
