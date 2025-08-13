import React from 'react'

interface InputLabelProps {
    htmlFor: string
    label: string
    required?: boolean
    className?: string
}

export const InputLabel: React.FC<InputLabelProps> = ({
                                                          htmlFor,
                                                          label,
                                                          required = false,
                                                          className = "label"
                                                      }) => (
    <label htmlFor={htmlFor} className={className}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
    </label>
)