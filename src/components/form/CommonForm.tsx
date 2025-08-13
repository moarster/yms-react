import React from 'react'

import {WorkflowTasksFooter} from "@/components/form/layout/WorkflowTasksFooter.tsx";
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { CommonFormProps } from '@/types/form'

import { CustomSections } from './layout/CustomSections'
import { FormContainer } from './layout/FormContainer'
import { FormHeader } from './layout/FormHeader'
import { FormSidebar } from './layout/FormSidebar'

const CommonForm: React.FC<CommonFormProps> = ({
                                                   title,
                                                   subtitle,
                                                   breadcrumbs,
                                                   formConfig,
                                                   onFormChange,
                                                   onFormSubmit,
                                                   sidebarSections = [],
                                                   customSections = [],
                                                   formActions,
                                                   workflowTasks = [],
                                                   isLoading = false,
                                                   isSubmitting = false,
                                                   isEditMode = true,
                                                   className = ''
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
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            <FormHeader
                title={title}
                subtitle={subtitle}
                breadcrumbs={breadcrumbs}
                isEditMode={isEditMode}
                formActions={formActions}
            />

            <CustomSections sections={customSections} position="before-form" />

            <div className="flex-1 flex">
                {/* Main Form Area */}
                <div className="flex-1 p-6">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <FormContainer
                                formConfig={formConfig}
                                onFormChange={onFormChange}
                                onFormSubmit={onFormSubmit}
                                isEditMode={isEditMode}
                                isSubmitting={isSubmitting}
                                hideFormActions={true} // Always hide since we use header/footer
                            />
                        </div>
                    </div>
                </div>


                {hasSidebar && (
                    <div className="w-80 p-6">
                        <FormSidebar sections={sidebarSections} />
                    </div>
                )}
            </div>

            <CustomSections sections={customSections} position="after-form" />

            <WorkflowTasksFooter tasks={workflowTasks} />
        </div>
    )
}

export default CommonForm