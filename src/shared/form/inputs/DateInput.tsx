import React from 'react';

import { BaseInputProps } from './types.ts';
import { DatePickerInput, DatePickerType } from '@mantine/dates';

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
      required={required}
      type={type}
      label={label}
      placeholder="Pick date"
      value={value}
      className={className}
      disabled={disabled}
      id={id}
      onChange={(e) => onChange(e?.toString())}
      error={error}
    />
  );
};
