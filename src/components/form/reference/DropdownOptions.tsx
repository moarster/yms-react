import React from 'react'

import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { BaseLink } from '@/types'

interface DropdownOptionsProps {
    options: BaseLink[]
    isLoading: boolean
    selectedValue?: BaseLink | null
    searchTerm: string
    onSelect: (option: BaseLink) => void
}

export const DropdownOptions: React.FC<DropdownOptionsProps> = ({
                                                                    options,
                                                                    isLoading,
                                                                    selectedValue,
                                                                    searchTerm,
                                                                    onSelect
                                                                }) => {
    if (isLoading) {
        return (
            <div className="px-3 py-2 text-center">
                <LoadingSpinner size="sm" />
            </div>
        )
    }

    if (options.length === 0) {
        return (
            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {searchTerm ? 'No matching options found' : 'No options available'}
            </div>
        )
    }

    return (
        <div className="max-h-48 overflow-auto">
            {options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    className={`
            w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100
            ${selectedValue?.id === option.id ? 'bg-primary-50 text-primary-900' : 'text-gray-900'}
          `}
                    onClick={() => onSelect(option)}
                >
                    <div className="flex items-center justify-between">
                        <span className="truncate">{option.title}</span>
                        {selectedValue?.id === option.id && (
                            <span className="text-primary-600">✓</span>
                        )}
                    </div>
                </button>
            ))}
        </div>
    )
}