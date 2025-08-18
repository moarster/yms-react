import { CloseButton, Combobox, InputBase, useCombobox } from '@mantine/core';
import React, { useState } from 'react';

import { BaseEntity, isDataEntity } from '@/types';

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
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [searchTerm, setSearchTerm] = useState('');

  const getOptionTitle = (option: BaseEntity): string => {
    return option.title ?? (isDataEntity(option) ? ((option.data?.title as string) ?? '') : '');
  };
  const displayValue = value ? getOptionTitle(value) : '';
  const shouldFilterOptions = searchable && searchTerm && searchTerm !== displayValue;
  // Filter options based on search
  const filteredOptions = shouldFilterOptions
    ? options.filter((option) =>
        getOptionTitle(option).toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
    : options;

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find((option) => getOptionTitle(option) === selectedValue);
    if (selectedOption) {
      onChange(selectedOption);
      setSearchTerm(selectedValue);
      combobox.closeDropdown();
    }
  };

  const handleClear = () => {
    onChange(emptyFactory ? emptyFactory() : null);
    setSearchTerm('');
    combobox.closeDropdown();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.currentTarget.value;
    setSearchTerm(newSearch);

    if (searchable) {
      combobox.openDropdown();
      combobox.updateSelectedOptionIndex();
    }
  };

  const handleBlur = () => {
    combobox.closeDropdown();
    // Reset search to current value or empty
    setSearchTerm(displayValue);
  };

  const rightSection = (
    <>
      {value?.id && !disabled && (
        <CloseButton size="sm" aria-label="Clear selection" onClick={handleClear} />
      )}
      <Combobox.Chevron />
    </>
  );
  const comboboxOptions = filteredOptions.map((option) => (
    <Combobox.Option
      key={option.id}
      value={getOptionTitle(option)}
      active={value?.id === option.id}
    >
      {getOptionTitle(option)}
    </Combobox.Option>
  ));
  return (
    <Combobox store={combobox} disabled={disabled} onOptionSubmit={handleSelect}>
      <Combobox.Target>
        <InputBase
          styles={{
            input: {
              cursor: disabled ? 'not-allowed' : searchable ? 'text' : 'pointer',
            },
          }}
          label={label}
          error={!!error}
          disabled={disabled}
          required={required}
          className={className}
          readOnly={!searchable}
          placeholder={placeholder}
          rightSection={rightSection}
          rightSectionPointerEvents="auto"
          value={searchTerm || displayValue}
          id={id || `text-input-${crypto.randomUUID()}`}
          onBlur={handleBlur}
          onClick={() => !disabled && combobox.openDropdown()} //{() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => !disabled && combobox.openDropdown()}
          onChange={searchable ? handleSearchChange : undefined}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {comboboxOptions.length > 0 ? (
            comboboxOptions
          ) : (
            <Combobox.Empty>No options found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
