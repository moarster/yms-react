import React from 'react'
import { Link } from 'react-router-dom'
import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'
import { ChevronLeftIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CommonFormProps } from '@/types/form'
import { createFieldTemplate, createObjectFieldTemplate } from './templates/FieldTemplates'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const CommonForm: React.FC<CommonFormProps> = ({
                                                   title,
                                                   subtitle,
                                                   breadcrumbs,
                                                   formConfig,
                                                   onFormChange,
                                                   onFormSubmit,
                                                   sidebarSections = [],
                                                   customSections = [],
                                                   actions,
                                                   isLoading = false,
                                                   isSubmitting = false,
                                                   isEditMode = true,
                                                   onEditModeChange,
                                                   className = '',
                                                   hideFormActions = false
                                               }) => {
    const FieldTemplate = createFieldTemplate()
    const ObjectFieldTemplate = createObjectFieldTemplate()

    // Filter sections by position
    const beforeFormSections = customSections.filter(s => s.position === 'before-form')
    const afterFormSections = customSections.filter(s => s.position === 'after-form')

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center">
                                {index > 0 && <span className="text-gray-500 mx-2">/</span>}
                                {crumb.href ? (
                                    <Link to={crumb.href} className="text-gray-400 hover:text-gray-500">
                                        {index === 0 && <ChevronLeftIcon className="h-5 w-5 inline mr-1" />}
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                </div>

                {/* Header Actions */}
                {actions && (
                    <div className="flex items-center space-x-3">
                        {actions.additional?.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className={`btn-${action.variant || 'outline'}`}
                            >
                                {action.label}
                            </button>
                        ))}

                        {onEditModeChange && (
                            <button
                                onClick={() => onEditModeChange(!isEditMode)}
                                className={isEditMode ? 'btn-outline' : 'btn-primary'}
                            >
                                {isEditMode ? (
                                    <>
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Cancel Edit
                                    </>
                                ) : (
                                    <>
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        Edit
                                    </>
                                )}
                            </button>
                        )}

                        {actions.secondary && (
                            <button
                                onClick={actions.secondary.onClick}
                                disabled={actions.secondary.disabled}
                                className="btn-outline"
                            >
                                {actions.secondary.label}
                            </button>
                        )}

                        {actions.primary && (
                            <button
                                onClick={actions.primary.onClick}
                                disabled={actions.primary.disabled || actions.primary.loading}
                                className="btn-primary"
                            >
                                {actions.primary.loading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        <span className="ml-2">{actions.primary.label}</span>
                                    </>
                                ) : (
                                    actions.primary.label
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Sections - Before Form */}
            {beforeFormSections.map((section) => (
                <div key={section.id} className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            {section.icon && <section.icon className="h-5 w-5 text-gray-400" />}
                            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        </div>
                    </div>
                    <div className="p-6">{section.content}</div>
                </div>
            ))}

            {/* Main Content Layout */}
            <div className={sidebarSections.length > 0 ? "lg:grid lg:grid-cols-4 lg:gap-6" : ""}>
                {/* Sidebar */}
                {sidebarSections.length > 0 && (
                    <div className="lg:col-span-1 space-y-6">
                        {sidebarSections.map((section, index) => (
                            <div key={index} className="card">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        {section.icon && <section.icon className="h-5 w-5 text-gray-400" />}
                                        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6">{section.content}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Form */}
                <div className={sidebarSections.length > 0 ? "lg:col-span-3" : ""}>
                    {formConfig.schema && (
                        <Form
                            id="common-form"
                            schema={formConfig.schema}
                            uiSchema={formConfig.uiSchema}
                            formData={formConfig.formData}
                            onChange={(e) => onFormChange(e.formData)}
                            onSubmit={onFormSubmit}
                            validator={validator}
                            disabled={formConfig.disabled || !isEditMode}
                            templates={{
                                FieldTemplate,
                                ObjectFieldTemplate,
                            }}
                            showErrorList={formConfig.showErrorList || false}
                        >
                            {/* Hide default submit button */}
                            {hideFormActions && (
                                <div style={{ display: 'none' }}>
                                    <button type="submit" />
                                </div>
                            )}
                        </Form>
                    )}
                </div>
            </div>

            {/* Custom Sections - After Form */}
            {afterFormSections.map((section) => (
                <div key={section.id} className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            {section.icon && <section.icon className="h-5 w-5 text-gray-400" />}
                            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        </div>
                    </div>
                    <div className="p-6">{section.content}</div>
                </div>
            ))}
        </div>
    )
}

export default CommonForm