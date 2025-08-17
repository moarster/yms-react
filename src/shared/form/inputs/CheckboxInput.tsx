import React from 'react';

import { InputError } from '../common';
import { BaseInputProps } from './types.ts';

interface CheckboxInputProps extends BaseInputProps {
  onChange: (value: boolean) => void;
  text?: string;
  value: boolean;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  className = '',
  disabled,
  error,
  id,
  label,
  onChange,
  required,
  text,
  value,
}) => {
  const inputId = id || `checkbox-input-${Math.random().toString(36).substr(2, 9)}`;
  const displayText = text || label;

  return (
    <div className={className}>
      <div className="flex items-center">
        <input
          id={inputId}
          checked={value}
          type="checkbox"
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          onChange={(e) => onChange(e.target.checked)}
        />
        {displayText && (
          <label htmlFor={inputId} className="ml-2 text-sm text-gray-700">
            {displayText}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      <InputError error={error} />
    </div>
  );
};
