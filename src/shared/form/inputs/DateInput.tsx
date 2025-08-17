import React from 'react';

import { BaseInputProps } from './types.ts';
import { DatePickerInput } from '@mantine/dates';
import { DatePickerType } from '@mantine/dates/lib/types/DatePickerValue';

interface DateInputProps extends BaseInputProps {
  onChange: (value: string) => void;
  type: DatePickerType;
  value: string;
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
  value,
}) => {
  return (
    <DatePickerInput
      required={required}
      type={type}
      label={label}
      placeholder="Pick date"
      value={value}
      className={className || `input ${error ? 'input-error' : ''}`}
      disabled={disabled}
      id={id}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    />
  );
};
