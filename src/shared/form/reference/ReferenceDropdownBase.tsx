import { CaretDownIcon, XIcon } from '@phosphor-icons/react';
import React from 'react';

import { BaseLink } from '@/types';

interface ReferenceDropdownBaseProps {
  disabled?: boolean;
  error?: string;
  isOpen: boolean;
  onClear: () => void;
  onToggle: () => void;
  placeholder?: string;
  value?: BaseLink | null;
}
const getButtonClasses = (error?: string, disabled?: boolean) => {
  const baseClasses =
    'relative w-full bg-white border rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
  const errorClasses = error ? 'border-red-300' : 'border-gray-300';
  const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400';

  return `${baseClasses} ${errorClasses} ${disabledClasses}`;
};

const getTextClasses = (hasValue: boolean) =>
  `block truncate ${hasValue ? 'text-gray-900' : 'text-gray-500'}`;

const ClearButton: React.FC<{ onClear: () => void }> = ({ onClear }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClear();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Still need this for the dropdown
    onClear();
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label="Clear selection"
      className="p-1 rounded-full hover:bg-gray-100 mr-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <XIcon className="h-4 w-4 text-gray-400" />
    </div>
  );
};

export const ReferenceDropdownBase: React.FC<ReferenceDropdownBaseProps> = ({
  disabled = false,
  error,
  isOpen,
  onClear,
  onToggle,
  placeholder = 'Select option...',
  value,
}) => {
  const showClearButton = value && !disabled;

  return (
    <button
      type="button"
      disabled={disabled}
      className={getButtonClasses(error, disabled)}
      onClick={onToggle}
    >
      <span className={getTextClasses(!!value)}>{value?.title || placeholder}</span>

      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
        {showClearButton && <ClearButton onClear={onClear} />}
        <CaretDownIcon
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </span>
    </button>
  );
};
