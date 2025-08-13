import React from 'react'

import { InputError,InputLabel } from '../common'
import { BaseInputProps } from './types.ts'

interface NumberInputProps extends BaseInputProps {
    value: number | null
    onChange: (value: number | null) => void
    placeholder?: string
    min?: number
    max?: number
    step?: number
}

export const NumberInput: React.FC<NumberInputProps> = ({
                                                            label,
                                                            required,
                                                            disabled,
                                                            error,
                                                            className = '',
                                                            id,
                                                            value,
                                                            onChange,
                                                            placeholder,
                                                            min,
                                                            max,
                                                            step = 0.01
                                                        }) => {
    const inputId = id || `number-input-${Math.random().toString(36).substr(2, 9)}`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (val === '') {
            onChange(null)
        } else {
            const numValue = parseFloat(val)
            onChange(isNaN(numValue) ? null : numValue)
        }
    }

    return (
        <div className={className}>
            {label && <InputLabel htmlFor={inputId} label={label} required={required} />}
            <input
                id={inputId}
                type="number"
                value={value ?? ''}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                className={`input ${error ? 'input-error' : ''}`}
            />
            <InputError error={error} />
        </div>
    )
}