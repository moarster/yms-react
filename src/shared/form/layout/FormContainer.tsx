import Form from '@aokiapp/rjsf-mantine-theme';
import validator from '@rjsf/validator-ajv8';
import React from 'react';

import { BaseEntity } from '@/types';
import { FormConfig } from '@/types/form.ts';

import { createFieldTemplate } from '../templates/FieldTemplates.tsx';

interface FormContainerProps {
  formConfig: FormConfig;
  hideFormActions?: boolean;
  isEditMode: boolean;
  isSubmitting?: boolean;
  onFormChange: (data: BaseEntity) => void;
  onFormSubmit: (data: BaseEntity) => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  formConfig,
  isEditMode,
  isSubmitting = false,
  onFormChange,
  onFormSubmit,
}) => {
  const FieldTemplate = createFieldTemplate();

  const handleSubmit = (data: BaseEntity) => {
    if (!isSubmitting) {
      onFormSubmit(data);
    }
  };

  return (
    <>
      {formConfig.schema && (
        <Form
          templates={{
            FieldTemplate,
          }}
          id="common-form"
          validator={validator}
          schema={formConfig.schema}
          formData={formConfig.formData}
          uiSchema={formConfig.uiSchema}
          disabled={formConfig.disabled || !isEditMode || isSubmitting}
          onSubmit={handleSubmit}
          onChange={(e) => onFormChange(e.formData)}
        >
          {/* Always hide form's default submit button since we use header/footer */}
          <div style={{ display: 'none' }}>
            <button type="submit" />
          </div>
        </Form>
      )}
    </>
  );
};
