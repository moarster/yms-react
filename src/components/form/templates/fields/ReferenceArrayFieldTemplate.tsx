import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'

import FieldInfoTooltip from '@/components/form/FieldInfoTooltip'
import ReferenceDropdown from '@/components/form/ReferenceDropdown'

import { getFieldLayout } from '../layout/FieldLayoutProvider'
import { FieldTemplateProps } from '../types'

export const ReferenceArrayFieldTemplate: React.FC<FieldTemplateProps> = ({
                                                                              label,
                                                                              required,
                                                                              errors,
                                                                              schema,
                                                                              formData,
                                                                              onChange,
                                                                              name,
                                                                              disabled
                                                                          }) => {
    const isSidebarField = schema['x-layout'] === 'sidebar'
    const description = schema.description || label || ""
    const { wrapperClass, labelClass } = getFieldLayout(isSidebarField)

    const catalogKey = name?.slice(1) // Remove the "_" prefix
    const domain = schema.items.properties?.domain?.enum?.[0] || 'reference'
    const fieldValues = formData?.[name!] || []

    const handleArrayAdd = (value: any) => {
        const newValues = [...fieldValues, value]
        onChange(newValues)
    }

    const handleArrayRemove = (index: number) => {
        const newValues = fieldValues.filter((_: any, i: number) => i !== index)
        onChange(newValues)
    }

    return (
        <div className={wrapperClass}>
            <div className="flex items-center">
                <label className={labelClass}>
                    {label}{required && ' *'}
                </label>
                <FieldInfoTooltip content={description} />
            </div>

            {fieldValues.length > 0 && (
                <div className="mb-2 space-y-1">
                    {fieldValues.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded">
                            <span className="text-sm text-gray-900">{item?.title || item?.id}</span>
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove(index)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {!disabled && (
                <ReferenceDropdown
                    value={null}
                    onChange={handleArrayAdd}
                    catalog={catalogKey!}
                    domain={domain}
                    placeholder={`Add ${label.toLowerCase()}...`}
                    disabled={disabled}
                />
            )}

            {errors && <div className="text-red-600 text-sm mt-1">{errors}</div>}
        </div>
    )
}