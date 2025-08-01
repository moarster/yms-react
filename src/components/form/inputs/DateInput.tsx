import React from 'react'

import { BaseInputProps } from './types'

interface DateInputProps extends BaseInputProps {
    value: string
    onChange: (value: string) => void
    type?: 'date' | 'datetime-local' | 'time'
}

export const DateInput: React.FC<DateInputProps> = ({
                                                        label,
                                                        required,
                                                        disabled,
                                                        error,
                                                        className = '',
                                                        id,
                                                        value,
                                                        onChange,
                                                        type = 'datetime-local'
                                                    }) => {
    const inputId = id || `date-input-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div className={className}>
            {label && (
                <label htmlFor={inputId} className="label">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`input ${error ? 'input-error' : ''}`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}