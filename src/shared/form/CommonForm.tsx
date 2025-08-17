import React from 'react';

import { WorkflowTasksFooter } from '@/shared/form/layout/WorkflowTasksFooter.tsx';
import LoadingSpinner from '@/shared/ui/LoadingSpinner.tsx';
import { CommonFormProps } from '@/types/form.ts';

import { CustomSections } from './layout/CustomSections.tsx';
import { FormContainer } from './layout/FormContainer.tsx';
import { FormHeader } from './layout/FormHeader.tsx';
import { FormSidebar } from './layout/FormSidebar.tsx';

const CommonForm: React.FC<CommonFormProps> = ({
  breadcrumbs,
  className = '',
  customSections = [],
  formActions,
  formConfig,
  isEditMode = true,
  isLoading = false,
  isSubmitting = false,
  onFormChange,
  onFormSubmit,
  sidebarSections = [],
  subtitle,
  title,
  workflowTasks = [],
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasSidebar = sidebarSections.length > 0;

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <FormHeader
        title={title}
        subtitle={subtitle}
        isEditMode={isEditMode}
        breadcrumbs={breadcrumbs}
        formActions={formActions}
      />

      <CustomSections position="before-form" sections={customSections} />

      <div className="flex-1 flex">
        {/* Main Form Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <FormContainer
                hideFormActions={true} // Always hide since we use header/footer
                formConfig={formConfig}
                isEditMode={isEditMode}
                isSubmitting={isSubmitting}
                onFormChange={onFormChange}
                onFormSubmit={onFormSubmit}
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

      <CustomSections position="after-form" sections={customSections} />

      <WorkflowTasksFooter tasks={workflowTasks} />
    </div>
  );
};

export default CommonForm;
