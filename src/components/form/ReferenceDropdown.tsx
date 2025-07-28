import React from 'react'
import { BaseLink } from '@/types'
import { ReferenceDropdownBase } from './reference/ReferenceDropdownBase'
import { DropdownSearch } from './reference/DropdownSearch'
import { DropdownOptions } from './reference/DropdownOptions'
import { useReferenceDropdown } from './reference/hooks/useReferenceDropdown'

interface ReferenceDropdownProps {
    value?: BaseLink | null
    onChange: (value: BaseLink | null) => void
    catalog: string
    domain: 'lists' | 'catalogs'
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: string
}

const ReferenceDropdown: React.FC<ReferenceDropdownProps> = ({
                                                                 value,
                                                                 onChange,
                                                                 catalog,
                                                                 domain,
                                                                 placeholder = "Select option...",
                                                                 disabled = false,
                                                                 error
                                                             }) => {
    const {
        isOpen,
        searchTerm,
        setSearchTerm,
        options,
        isLoading,
        dropdownRef,
        handleSelect,
        handleClear,
        handleToggle
    } = useReferenceDropdown({ catalog, domain, onChange })

    if (disabled) {
        return (
            <div className="relative">
                <ReferenceDropdownBase
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    error={error}
                    isOpen={false}
                    onToggle={() => {}}
                    onClear={() => {}}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <ReferenceDropdownBase
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                error={error}
                isOpen={isOpen}
                onToggle={handleToggle}
                onClear={handleClear}
            />

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <DropdownSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
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
    )
}

export default ReferenceDropdown