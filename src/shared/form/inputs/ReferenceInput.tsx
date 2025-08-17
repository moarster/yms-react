import { CaretDownIcon } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';

import { BaseEntity, isDataEntity } from '@/types';

import { InputError, InputLabel } from '../common';
import { BaseInputProps } from './types.ts';

interface ReferenceInputProps extends BaseInputProps {
  emptyFactory?: () => BaseEntity;
  onChange: (value: BaseEntity | null) => void;
  options: BaseEntity[];
  placeholder?: string;
  searchable?: boolean;
  value: BaseEntity | null;
}

export const ReferenceInput: React.FC<ReferenceInputProps> = ({
  className = '',
  disabled,
  emptyFactory,
  error,
  id,
  label,
  onChange,
  options,
  placeholder = 'Choose option',
  required,
  searchable = true,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputId = id || `reference-input-${Math.random().toString(36).substr(2, 9)}`;

  // Filter options based on search
  const filteredOptions =
    searchable && searchTerm
      ? options.filter((option) =>
          (option.title ?? (isDataEntity(option) ? ((option.data?.title as string) ?? '') : ''))
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        )
      : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: BaseEntity) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(emptyFactory ? emptyFactory() : null);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={className}>
      {label && <InputLabel label={label} htmlFor={inputId} required={required} />}

      <div ref={dropdownRef} className="relative">
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          className={`input text-left flex items-center justify-between pr-20 ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={value?.title ? 'text-gray-900' : 'text-gray-400'}>
            {value?.title || placeholder}
          </span>
        </button>

        {/* Right side controls */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <div className="flex items-center space-x-1 pointer-events-auto">
            {/* Clear button - only show when there's a value */}
            {value?.id && !disabled && (
              <button
                type="button"
                title="Clear selection"
                className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <svg fill="none" className="w-3 h-3" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Dropdown arrow */}
            <CaretDownIcon
              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search options..."
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                      value?.id === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                    type="button"
                    key={option.id}
                    onClick={() => handleSelect(option)}
                  >
                    {option.title}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <InputError error={error} />
    </div>
  );
};
