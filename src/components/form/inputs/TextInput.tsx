import React from 'react'

import { InputError,InputLabel } from '../common'
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
            {label && <InputLabel htmlFor={inputId} label={label} required={required} />}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className={`input ${error ? 'input-error' : ''}`}
            />
            <InputError error={error} />
        </div>
    )
}