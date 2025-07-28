import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { catalogService } from '@/services/catalogService'
import { BaseLink } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

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
                                                                 required = false,
                                                                 error
                                                             }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch options when dropdown opens
    const { data: optionsData, isLoading, refetch } = useQuery({
        queryKey: [domain, catalog, 'items', searchTerm],
        queryFn: async () => {
            if (domain === 'lists') {
                const response = await catalogService.getListItems(catalog, {
                    search: searchTerm,
                    size: 50
                })
                return response.content
            } else {
                const response = await catalogService.getCatalogItems(catalog, {
                    search: searchTerm,
                    size: 50
                })
                return response.content
            }
        },
        enabled: isOpen, // Only fetch when dropdown is open
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const options = optionsData?.map(item => ({
        id: item.id!,
        title: item.title || item?.data?.title,
        domain,
        entity: 'item',
        catalog
    })) || []

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (option: BaseLink) => {
        onChange(option)
        setIsOpen(false)
        setSearchTerm('')
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(null)
    }

    const handleDropdownToggle = () => {
        if (disabled) return

        setIsOpen(!isOpen)
        if (!isOpen) {
            // Refetch data when opening
            refetch()
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main button */}
            <button
                type="button"
                onClick={handleDropdownToggle}
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
                            onClick={handleClear}
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

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {/* Search input */}
                    <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
                        <input
                            type="text"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Search options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="px-3 py-2 text-center">
                            <LoadingSpinner size="sm" />
                        </div>
                    )}

                    {/* Options */}
                    {!isLoading && options.length > 0 && (
                        <div className="max-h-48 overflow-auto">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`
                                        w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                        ${value?.id === option.id ? 'bg-primary-50 text-primary-900' : 'text-gray-900'}
                                    `}
                                    onClick={() => handleSelect(option)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate">{option.title}</span>
                                        {value?.id === option.id && (
                                            <span className="text-primary-600">✓</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No results */}
                    {!isLoading && options.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                            {searchTerm ? 'No matching options found' : 'No options available'}
                        </div>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}

export default ReferenceDropdown