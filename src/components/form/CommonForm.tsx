import React from 'react'
import { CommonFormProps } from '@/types/form'
import { FormHeader } from './layout/FormHeader'
import { FormSidebar } from './layout/FormSidebar'
import { FormActions } from './layout/FormActions'
import { CustomSections } from './layout/CustomSections'
import { FormContainer } from './layout/FormContainer'
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
                                                   isEditMode = true,
                                                   onEditModeChange,
                                                   className = '',
                                                   hideFormActions = false
                                               }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    const hasSidebar = sidebarSections.length > 0

    return (
        <div className={`space-y-6 ${className}`}>
            <FormHeader
                title={title}
                subtitle={subtitle}
                breadcrumbs={breadcrumbs}
                isEditMode={isEditMode}
                onEditModeChange={onEditModeChange}
                canEdit={!!onEditModeChange}
            />

            <CustomSections sections={customSections} position="before-form" />

            <div className={`grid ${hasSidebar ? 'grid-cols-1 gap-6 lg:grid-cols-4' : 'grid-cols-1'}`}>
                <FormContainer
                    formConfig={formConfig}
                    onFormChange={onFormChange}
                    onFormSubmit={onFormSubmit}
                    isEditMode={isEditMode}
                    hideFormActions={hideFormActions}
                    hasSidebar={hasSidebar}
                />

                {hasSidebar && (
                    <div className="lg:col-span-1">
                        <FormSidebar sections={sidebarSections} />
                    </div>
                )}
            </div>

            <CustomSections sections={customSections} position="after-form" />

            {actions && !hideFormActions && <FormActions {...actions} />}
        </div>
    )
}

export default CommonForm