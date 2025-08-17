import React from 'react';

import { SelectEditorProps } from '../../DataGridTable/types.ts';

export const SelectCellEditor: React.FC<SelectEditorProps> = ({
  enumValues,
  onValueChange,
  value,
}) => (
  <select
    value={value || ''}
    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => onValueChange(e.target.value)}
  >
    <option value="">Select...</option>
    {enumValues.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Text editor with proper typing
interface TextEditorProps {
  maxLength?: number;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: null | string;
}

export const TextCellEditor: React.FC<TextEditorProps> = ({
  maxLength,
  onValueChange,
  placeholder,
  value,
}) => (
  <input
    type="text"
    value={value || ''}
    maxLength={maxLength}
    placeholder={placeholder}
    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => onValueChange(e.target.value)}
  />
);

// Number editor with proper typing
interface NumberEditorProps {
  max?: number;
  min?: number;
  onValueChange: (value: null | number) => void;
  step?: number;
  value: null | number;
}

export const NumberCellEditor: React.FC<NumberEditorProps> = ({
  max,
  min,
  onValueChange,
  step = 1,
  value,
}) => (
  <input
    max={max}
    min={min}
    step={step}
    type="number"
    value={value || ''}
    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => {
      const numValue = e.target.value ? Number(e.target.value) : null;
      onValueChange(numValue);
    }}
  />
);

interface DateEditorProps {
  onValueChange: (value: string) => void;
  value: null | string;
}

export const DateCellEditor: React.FC<DateEditorProps> = ({ onValueChange, value }) => (
  <input
    value={value || ''}
    type="datetime-local"
    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => onValueChange(e.target.value)}
  />
);
