import React from 'react';

interface InputLabelProps {
  className?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
}

export const InputLabel: React.FC<InputLabelProps> = ({
  className = 'label',
  htmlFor,
  label,
  required = false,
}) => (
  <label htmlFor={htmlFor} className={className}>
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);
