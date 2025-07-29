import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'
import React from 'react'

import {BaseEntity} from "@/types";
import { FormConfig } from '@/types/form'

import { createFieldTemplate } from '../templates/FieldTemplates'

interface FormContainerProps {
    formConfig: FormConfig
    onFormChange: (data: BaseEntity) => void
    onFormSubmit: (data: BaseEntity) => void
    isEditMode: boolean
    isSubmitting?: boolean
    hideFormActions?: boolean
}

export const FormContainer: React.FC<FormContainerProps> = ({
                                                                formConfig,
                                                                onFormChange,
                                                                onFormSubmit,
                                                                isEditMode,
                                                                isSubmitting = false
                                                            }) => {
    const FieldTemplate = createFieldTemplate()

    const handleSubmit = (data: BaseEntity) => {
        if (!isSubmitting) {
            onFormSubmit(data)
        }
    }

    return (
        <>
            {formConfig.schema && (
                <Form
                    id="common-form"
                    schema={formConfig.schema}
                    uiSchema={formConfig.uiSchema}
                    formData={formConfig.formData}
                    onChange={(e) => onFormChange(e.formData)}
                    onSubmit={handleSubmit}
                    validator={validator}
                    disabled={formConfig.disabled || !isEditMode || isSubmitting}
                    templates={{
                        FieldTemplate,
                    }}
                >
                    {/* Always hide form's default submit button since we use header/footer */}
                    <div style={{ display: 'none' }}>
                        <button type="submit" />
                    </div>
                </Form>
            )}
        </>
    )
}