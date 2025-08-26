import { CloseButton, Combobox, InputBase, useCombobox } from '@mantine/core';
import React from 'react';

import { useReference } from '@/shared/ui/hooks/useReference.ts';
import { extractLinkConstants, isLinkDefinition, isReferentLink, LinkDefinition, ReferentLink } from '@/types';

import { BaseInputProps } from './types.ts';

export const ReferenceInput: React.FC<BaseInputProps> = ({
  className = '',
  disabled,
  error,
  id,
  label,
  propertyDef,
  onChange,
  value,

}) => {
  const variant = 'form';
  const onBlur = propertyDef.config.onBlur;
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      if (variant === 'table' && onBlur) {
        // Small delay to allow option selection in table mode
        setTimeout(() => {
          if (!combobox.dropdownOpened) {
            onBlur();
          }
        }, 100);
      }
    },
  });

  if (!isLinkDefinition(propertyDef)) return null;

  const { catalog, domain } = extractLinkConstants(propertyDef);
  const linkType = domain === 'lists' ? 'LIST' : 'CATALOG';

  const validatedValue = isReferentLink(value) ? value : null;
  const {
    comboboxOptions,
    displayValue,
    isLoading,
    handleClear,
    handleSearchChange,
    handleSelect,
    searchTerm,
  } = useReference({
    catalog,
    linkType,
    value:validatedValue,
    searchable: true,
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

    if (true) {
      combobox.openDropdown();
      combobox.updateSelectedOptionIndex();
    }
  };

  const rightSection = (
    <>
      {validatedValue?.id && !disabled && (
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
          styles={{ input: {
            cursor: disabled ? 'not-allowed' : true ? 'text' : 'pointer',
          }}}
          label={label}
          error={!!error}
          disabled={disabled}
          required={propertyDef.config.required}
          className={className}
          readOnly={false}
          rightSection={rightSection}
          rightSectionPointerEvents="auto"
          value={effectiveDisplayValue}
          id={id || `text-input-${crypto.randomUUID()}`}
          onBlur={onBlur}
          onClick={() => !disabled && combobox.openDropdown()}
          onFocus={() => !disabled && combobox.openDropdown()}
          onChange={true ? handleInputChange : undefined}
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
