import React from 'react'

import FieldInfoTooltip from '@/shared/form/FieldInfoTooltip.tsx'
import ReferenceDropdown from '@/shared/form/ReferenceDropdown.tsx'

import { getFieldLayout } from '../layout/FieldLayoutProvider.ts'
import { FieldTemplateProps } from '../types.ts'

export const ReferenceFieldTemplate: React.FC<FieldTemplateProps> = ({
                                                                         id,
                                                                         label,
                                                                         required,
                                                                         errors,
                                                                         schema,
                                                                         formData,
                                                                         onChange,
                                                                         disabled
                                                                     }) => {
    const isSidebarField = schema['x-layout'] === 'sidebar'
    const description = schema.description || label || ""
    const { wrapperClass, labelClass } = getFieldLayout(isSidebarField)

    const domain = formData?.domain || 'reference'
    const fieldValue = formData?.id
    const catalogKey = formData?.catalog

    return (
        <div className={wrapperClass}>
            <div className="flex items-center">
                <label htmlFor={id} className={labelClass}>
                    {label}{required && ' *'}
                </label>
                <FieldInfoTooltip content={description} />
            </div>
            <ReferenceDropdown
                value={fieldValue}
                onChange={onChange}
                catalog={catalogKey}
                domain={domain}
                placeholder={`Select ${label.toLowerCase()}...`}
                disabled={disabled}
                required={required}
                error={errors}
            />
        </div>
    )
}