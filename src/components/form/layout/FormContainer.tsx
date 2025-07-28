import React from 'react'
import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'
import { FormConfig } from '@/types/form'
import { createFieldTemplate } from '../templates/FieldTemplates'

interface FormContainerProps {
    formConfig: FormConfig
    onFormChange: (data: any) => void
    onFormSubmit: (data: any) => void
    isEditMode: boolean
    hideFormActions?: boolean
    hasSidebar: boolean
}

export const FormContainer: React.FC<FormContainerProps> = ({
                                                                formConfig,
                                                                onFormChange,
                                                                onFormSubmit,
                                                                isEditMode,
                                                                hideFormActions = false,
                                                                hasSidebar
                                                            }) => {
    const FieldTemplate = createFieldTemplate()

    return (
        <div className={`${hasSidebar ? "lg:col-span-3" : ""}`}>
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
                    }}
                >
                    {hideFormActions && (
                        <div style={{ display: 'none' }}>
                            <button type="submit" />
                        </div>
                    )}
                </Form>
            )}
        </div>
    )
}