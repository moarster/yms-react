import React from 'react'

import { SelectEditorProps } from '../types.ts'

export const SelectCellEditor: React.FC<SelectEditorProps> = ({
                                                                  value,
                                                                  onValueChange,
                                                                  enumValues
                                                              }) => (
    <select
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">Select...</option>
        {enumValues.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
)

// Text editor with proper typing
interface TextEditorProps {
    value: string | null
    onValueChange: (value: string) => void
    placeholder?: string
    maxLength?: number
}

export const TextCellEditor: React.FC<TextEditorProps> = ({
                                                              value,
                                                              onValueChange,
                                                              placeholder,
                                                              maxLength
                                                          }) => (
    <input
        type="text"
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
)

// Number editor with proper typing
interface NumberEditorProps {
    value: number | null
    onValueChange: (value: number | null) => void
    min?: number
    max?: number
    step?: number
}

export const NumberCellEditor: React.FC<NumberEditorProps> = ({
                                                                  value,
                                                                  onValueChange,
                                                                  min,
                                                                  max,
                                                                  step = 1
                                                              }) => (
    <input
        type="number"
        value={value || ''}
        onChange={(e) => {
            const numValue = e.target.value ? Number(e.target.value) : null
            onValueChange(numValue)
        }}
        min={min}
        max={max}
        step={step}
        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
)

interface DateEditorProps {
    value: string | null
    onValueChange: (value: string) => void
}

export const DateCellEditor: React.FC<DateEditorProps> = ({
                                                              value,
                                                              onValueChange
                                                          }) => (
    <input
        type="datetime-local"
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
)

