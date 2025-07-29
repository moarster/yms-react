import React from 'react'

import FieldInfoTooltip from '@/components/form/FieldInfoTooltip'

import { getFieldLayout } from '../layout/FieldLayoutProvider'
import { FieldTemplateProps } from '../types'

export const StandardFieldTemplate: React.FC<FieldTemplateProps> = ({
                                                                        id,
                                                                        label,
                                                                        help,
                                                                        required,
                                                                        errors,
                                                                        children,
                                                                        schema
                                                                    }) => {
    const isSidebarField = schema['x-layout'] === 'sidebar'
    const description = schema.description || label || ""
    const { wrapperClass, labelClass } = getFieldLayout(isSidebarField)

    if (isSidebarField) {
        return (
            <div className={wrapperClass}>
                <div className="flex items-center">
                    <label htmlFor={id} className={labelClass}>
                        {label}{required && ' *'}
                    </label>
                    <FieldInfoTooltip content={description} />
                </div>
                {children}
                {errors && <div className="text-red-600 text-sm mt-1">{errors}</div>}
            </div>
        )
    }

    return (
        <div className={wrapperClass}>
            <div className="flex items-center mb-2">
                <label htmlFor={id} className={labelClass}>
                    {label}{required && ' *'}
                </label>
                <FieldInfoTooltip content={description} />
            </div>
            {children}
            {help && <div className="text-xs text-gray-500 mt-1">{help}</div>}
            {errors && <div className="text-red-600 text-sm mt-1">{errors}</div>}
        </div>
    )
}