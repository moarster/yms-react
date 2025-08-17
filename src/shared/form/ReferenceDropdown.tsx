import React from 'react';

import { BaseLink } from '@/types';

import { DropdownOptions } from './reference/DropdownOptions.tsx';
import { DropdownSearch } from './reference/DropdownSearch.tsx';
import { useReferenceDropdown } from './reference/hooks/useReferenceDropdown.ts';
import { ReferenceDropdownBase } from './reference/ReferenceDropdownBase.tsx';

interface ReferenceDropdownProps {
  catalog: string;
  disabled?: boolean;
  domain: 'catalogs' | 'lists';
  error?: string;
  onChange: (value: BaseLink | null) => void;
  placeholder?: string;
  required?: boolean;
  value?: BaseLink | null;
}

const ReferenceDropdown: React.FC<ReferenceDropdownProps> = ({
  catalog,
  disabled = false,
  domain,
  error,
  onChange,
  placeholder = 'Select option...',
  value,
}) => {
  const {
    dropdownRef,
    handleClear,
    handleSelect,
    handleToggle,
    isLoading,
    isOpen,
    options,
    searchTerm,
    setSearchTerm,
  } = useReferenceDropdown({ catalog, domain, onChange });

  if (disabled) {
    return (
      <div className="relative">
        <ReferenceDropdownBase
          error={error}
          value={value}
          isOpen={false}
          disabled={disabled}
          placeholder={placeholder}
          onClear={() => {}}
          onToggle={() => {}}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <ReferenceDropdownBase
        error={error}
        value={value}
        isOpen={isOpen}
        disabled={disabled}
        placeholder={placeholder}
        onClear={handleClear}
        onToggle={handleToggle}
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <DropdownSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <DropdownOptions
            options={options}
            isLoading={isLoading}
            selectedValue={value}
            searchTerm={searchTerm}
            onSelect={handleSelect}
          />
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ReferenceDropdown;
