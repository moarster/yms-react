import { Chip } from '@mantine/core';
import React from 'react';

import { BaseInputProps } from './types.ts';

export const ChipInput: React.FC<BaseInputProps> = ({
  className = '',
  disabled,
  id,
  label,
  onChange,
  propertyDef,
  value,
}) => {
  return (
    <Chip
      color="blue"
      checked={value ? !!value : undefined}
      disabled={disabled}
      required={propertyDef.config.required}
      className={className}
      id={id || `text-input-${crypto.randomUUID()}`}
      onChange={onChange ? () => onChange(!value) : undefined}
    >
      {label}
    </Chip>
  );
};
