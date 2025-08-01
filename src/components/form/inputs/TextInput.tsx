import React from 'react'

import {BaseInputProps} from './types'

interface TextInputProps extends BaseInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: 'text' | 'tel' | 'email' | 'password'
}

export const TextInput: React.FC<TextInputProps> = ({
                                                        label,
                                                        required,
                                                        disabled,
                                                        error,
                                                        className = '',
                                                        id,
                                                        value,
                                                        onChange,
                                                        placeholder,
                                                        type = 'text'
                                                    }) => {
    const inputId = id || `text-input-${Math.random().toString(36).substr(2, 9)}`

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
                placeholder={placeholder}
                className={`input ${error ? 'input-error' : ''}`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}