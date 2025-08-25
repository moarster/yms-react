import { Chip } from '@mantine/core';
import React from 'react';

import { BaseInputProps } from './types.ts';

interface ChipInputProps extends BaseInputProps {
  onChange: (value: boolean) => void;
  value: boolean;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  className = '',
  disabled,
  id,
  label,
  onChange,
  required,
  value,
}) => {
  return (
    <Chip
      color="blue"
      checked={value}
      disabled={disabled}
      required={required}
      className={className}
      id={id || `text-input-${crypto.randomUUID()}`}
      onChange={() => onChange(!value)}
    >
      {label}
    </Chip>
  );
};
