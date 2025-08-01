import React from 'react'

interface InputErrorProps {
    error?: string
    className?: string
}

export const InputError: React.FC<InputErrorProps> = ({
                                                          error,
                                                          className = "mt-1 text-sm text-red-600"
                                                      }) => error ? <p className={className}>{error}</p> : null