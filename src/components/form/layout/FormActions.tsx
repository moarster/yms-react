import React from 'react'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface FormAction {
    label: string
    onClick: () => void
    loading?: boolean
    disabled?: boolean
}

interface AdditionalAction extends FormAction {
    variant?: 'outline' | 'danger' | 'success'
}

interface FormActionsProps {
    primary?: FormAction
    secondary?: FormAction
    additional?: AdditionalAction[]
}

export const FormActions: React.FC<FormActionsProps> = ({
                                                            primary,
                                                            secondary,
                                                            additional = []
                                                        }) => {
    const getButtonClasses = (variant = 'primary') => {
        const baseClasses = "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

        switch (variant) {
            case 'primary':
                return `${baseClasses} border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500`
            case 'secondary':
                return `${baseClasses} border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500`
            case 'outline':
                return `${baseClasses} border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500`
            case 'danger':
                return `${baseClasses} border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`
            case 'success':
                return `${baseClasses} border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`
            default:
                return `${baseClasses} border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500`
        }
    }

    return (
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            {secondary && (
                <button
                    type="button"
                    onClick={secondary.onClick}
                    disabled={secondary.disabled}
                    className={getButtonClasses('secondary')}
                >
                    {secondary.label}
                </button>
            )}

            {additional.map((action, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={getButtonClasses(action.variant)}
                >
                    {action.loading && <LoadingSpinner size="sm" className="mr-2" />}
                    {action.label}
                </button>
            ))}

            {primary && (
                <button
                    type="button"
                    onClick={primary.onClick}
                    disabled={primary.disabled || primary.loading}
                    className={getButtonClasses('primary')}
                >
                    {primary.loading && <LoadingSpinner size="sm" className="mr-2" />}
                    {primary.label}
                </button>
            )}
        </div>
    )
}