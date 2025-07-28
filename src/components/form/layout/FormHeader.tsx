import React from 'react'
import { Link } from 'react-router-dom'
import {  PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Breadcrumb {
    label: string
    href?: string
}

interface FormHeaderProps {
    title: string
    subtitle?: string
    breadcrumbs?: Breadcrumb[]
    isEditMode?: boolean
    onEditModeChange?: (editMode: boolean) => void
    canEdit?: boolean
}

export const FormHeader: React.FC<FormHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          breadcrumbs,
                                                          isEditMode,
                                                          onEditModeChange,
                                                          canEdit = true
                                                      }) => {
    return (
        <div className="mb-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center">
                                {index > 0 && <span className="text-gray-500 mx-2">/</span>}
                                {crumb.href ? (
                                    <Link to={crumb.href} className="text-primary-600 hover:text-primary-500">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900">{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            {/* Title and Edit Toggle */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
                </div>

                {canEdit && onEditModeChange && (
                    <button
                        onClick={() => onEditModeChange(!isEditMode)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {isEditMode ? (
                            <>
                                <XMarkIcon className="h-4 w-4 mr-1" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}