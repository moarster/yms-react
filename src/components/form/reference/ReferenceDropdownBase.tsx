import React from 'react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BaseLink } from '@/types'

interface ReferenceDropdownBaseProps {
    value?: BaseLink | null
    placeholder?: string
    disabled?: boolean
    error?: string
    isOpen: boolean
    onToggle: () => void
    onClear: (e: React.MouseEvent) => void
}

export const ReferenceDropdownBase: React.FC<ReferenceDropdownBaseProps> = ({
                                                                                value,
                                                                                placeholder = "Select option...",
                                                                                disabled = false,
                                                                                error,
                                                                                isOpen,
                                                                                onToggle,
                                                                                onClear
                                                                            }) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={`
        relative w-full bg-white border rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm
        ${error ? 'border-red-300' : 'border-gray-300'}
        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
      `}
        >
      <span className={`block truncate ${!value ? 'text-gray-500' : 'text-gray-900'}`}>
        {value?.title || placeholder}
      </span>

            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
        {value && !disabled && (
            <button
                type="button"
                onClick={onClear}
                className="p-1 rounded-full hover:bg-gray-100 mr-1"
            >
                <XMarkIcon className="h-4 w-4 text-gray-400" />
            </button>
        )}
                <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
      </span>
        </button>
    )
}