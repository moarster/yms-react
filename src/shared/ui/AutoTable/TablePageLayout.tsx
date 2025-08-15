import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'

import { AutoTable } from '@/shared/ui/AutoTable'
import ErrorMessage from '@/shared/ui/ErrorMessage'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

interface TablePageLayoutProps {
    title: string
    subtitle?: string
    backLink?: { to: string; label: string }
    actions?: React.ReactNode
    children?: React.ReactNode
    tableProps: any
    emptyState?: {
        message: string
        icon?: React.ComponentType<{ className?: string }>
        action?: React.ReactNode
    }
    loading?: boolean
    error?: any
}

export const TablePageLayout: React.FC<TablePageLayoutProps> = ({
                                                                    title,
                                                                    subtitle,
                                                                    backLink,
                                                                    actions,
                                                                    children,
                                                                    tableProps,
                                                                    emptyState,
                                                                    loading,
                                                                    error
                                                                }) => {
    if (loading && !tableProps.data?.length) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return <ErrorMessage error={error} />
    }

    const isEmpty = !loading && tableProps.data?.length === 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {backLink && (
                        <Link
                            to={backLink.to}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ChevronLeftIcon className="h-4 w-4 mr-1" />
                            {backLink.label}
                        </Link>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex items-center space-x-3">
                        {actions}
                    </div>
                )}
            </div>

            {/* Additional content (filters, etc.) */}
            {children}

            {/* Table or Empty State */}
            {isEmpty && emptyState ? (
                <div className="card p-12">
                    <div className="text-center">
                        {emptyState.icon && (
                            <emptyState.icon className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {emptyState.message}
                        </h3>
                        {emptyState.action && (
                            <div className="mt-4">{emptyState.action}</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden">
                    <AutoTable {...tableProps} />
                </div>
            )}
        </div>
    )
}