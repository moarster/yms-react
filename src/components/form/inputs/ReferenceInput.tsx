import {ChevronDownIcon} from '@heroicons/react/24/outline'
import React, {useEffect, useRef, useState} from 'react'

import {BaseEntity} from "@/types";

import {BaseInputProps} from './types'

interface ReferenceInputProps extends BaseInputProps {
    value: BaseEntity | null
    onChange: (value: BaseEntity | null) => void
    options: BaseEntity[]
    placeholder?: string
    searchable?: boolean
    emptyFactory?: () => BaseEntity
}

export const ReferenceInput: React.FC<ReferenceInputProps> = ({
                                                                  label,
                                                                  required,
                                                                  disabled,
                                                                  error,
                                                                  className = '',
                                                                  id,
                                                                  value,
                                                                  onChange,
                                                                  options,
                                                                  placeholder = 'Choose option',
                                                                  searchable = true,
                                                                  emptyFactory
                                                              }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputId = id || `reference-input-${Math.random().toString(36).substr(2, 9)}`

    // Filter options based on search
    const filteredOptions = searchable && searchTerm
        ? options.filter(option =>
            option.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options

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

    const handleSelect = (option: BaseEntity) => {
        onChange(option)
        setIsOpen(false)
        setSearchTerm('')
    }

    const handleClear = () => {
        onChange(emptyFactory ? emptyFactory() : null)
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <div className={className}>
            {label && (
                <label htmlFor={inputId} className="label">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative" ref={dropdownRef}>
                <button
                    id={inputId}
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`input text-left flex items-center justify-between pr-20 ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleClear()
                                }}
                                className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                                title="Clear selection"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                        {/* Dropdown arrow */}
                        <ChevronDownIcon
                            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </div>
                </div>

                {isOpen && (
                    <div
                        className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                        {searchable && (
                            <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
                                <input
                                    type="text"
                                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search options..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}

                        <div className="max-h-48 overflow-y-auto">

                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    No options found
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                                            value?.id === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                        }`}
                                    >
                                        {option.title}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}