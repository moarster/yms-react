import { CloseButton, Combobox, InputBase, useCombobox } from '@mantine/core';
import React from 'react';

import { useReference } from '@/shared/hooks/useReference.ts';
import { BaseEntity,  extractLinkConstants, LinkDefinition, ReferentLink } from '@/types';

import { BaseInputProps } from './types.ts';

interface ReferenceInputProps extends BaseInputProps {
  emptyFactory?: () => BaseEntity;
  onChange: (value: BaseEntity | null) => void;
  linkDef: LinkDefinition;
  placeholder?: string;
  searchable?: boolean;
  value: ReferentLink | null;
}

export const ReferenceInput: React.FC<ReferenceInputProps> = ({
  className = '',
  disabled,
  error,
  id,
  label,
  linkDef,
  onChange,
  placeholder = 'Choose option',
  required,
  searchable = true,
  value,
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { catalog, domain } = extractLinkConstants(linkDef);
  const linkType = domain === 'lists' ? 'LIST' : 'CATALOG';

  const {
    comboboxOptions,
    displayValue,
    isLoading,
    handleClear,
    handleSearchChange,
    handleSelect,
    resetSearch,
    searchTerm,
  } = useReference({
    catalog,
    linkType,
    value,
    searchable,
    onChange,
    enabled: !!catalog,
  });

  const handleSelectWithClose = (selectedValue: string) => {
    handleSelect(selectedValue);
    combobox.closeDropdown();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.currentTarget.value;
    handleSearchChange(newSearch);

    if (searchable) {
      combobox.openDropdown();
      combobox.updateSelectedOptionIndex();
    }
  };
  const handleBlur = () => {
    combobox.closeDropdown();
    resetSearch();
  };

  const rightSection = (
    <>
      {value?.id && !disabled && (
        <CloseButton size="sm" aria-label="Clear selection" onClick={handleClear} />
      )}
      <Combobox.Chevron />
    </>
  );
  const effectiveDisplayValue = isLoading ? 'Loading...' : searchTerm || displayValue;
  return (
    <Combobox store={combobox} disabled={disabled} onOptionSubmit={handleSelectWithClose}>
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
          value={effectiveDisplayValue}
          id={id || `text-input-${crypto.randomUUID()}`}
          onBlur={handleBlur}
          onClick={() => !disabled && combobox.openDropdown()}
          onFocus={() => !disabled && combobox.openDropdown()}
          onChange={searchable ? handleInputChange : undefined}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {comboboxOptions.length > 0 ? (
            comboboxOptions.map(({ active, key, label, value: optionValue }) => (
              <Combobox.Option key={key} active={active} value={optionValue}>
                {label}
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>
              {' '}
              {isLoading ? 'Loading options...' : 'No options found'}
            </Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
