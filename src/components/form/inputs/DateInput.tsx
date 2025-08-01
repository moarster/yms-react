import React from 'react'

import { InputError,InputLabel } from '../common'
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
            {label && <InputLabel htmlFor={inputId} label={label} required={required} />}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`input ${error ? 'input-error' : ''}`}
            />
            <InputError error={error} />
        </div>
    )
}