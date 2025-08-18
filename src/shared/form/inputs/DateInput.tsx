import { DatePickerInput, DatePickerType } from '@mantine/dates';
import React from 'react';

import { BaseInputProps } from './types.ts';

interface DateInputProps extends BaseInputProps {
  onChange: (value?: string) => void;
  type?: DatePickerType;
  value?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  className,
  disabled,
  error,
  id,
  label,
  onChange,
  required,
  type = 'default',
  value = undefined,
}) => {
  return (
    <DatePickerInput
      type={type}
      error={error}
      label={label}
      value={value}
      disabled={disabled}
      required={required}
      className={className}
      placeholder="Pick date"
      id={id || `text-input-${crypto.randomUUID()}`}
      onChange={(e) => onChange(e?.toString())}
    />
  );
};
