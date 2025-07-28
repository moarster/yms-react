import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ReferenceDropdown from '@/components/form/ReferenceDropdown'
import FieldInfoTooltip from '@/components/form/FieldInfoTooltip'

export const createFieldTemplate = () => (props: any) => {
    const { id, label, help, required, errors, children, schema, formData, onChange, name } = props
    const description = schema.description || label || ""
    const isReferenceField = id.startsWith('root__')
    const isSidebarField = schema['x-layout'] === 'sidebar'

    // Handle reference fields with custom dropdown
    if (isReferenceField && schema.type === 'object') {
        const domain = formData?.domain || 'reference'
        const fieldValue = formData?.id
        const catalogKey = formData?.catalog

        const wrapperClass = isSidebarField ? "mb-4" : "mb-6"
        const labelClass = isSidebarField
            ? "block text-sm font-medium text-gray-700 mb-1"
            : "block text-sm font-medium text-gray-900 mb-2"

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
                    disabled={props.disabled}
                    required={required}
                    error={errors}
                />
            </div>
        )
    }

    // Handle array of reference fields (like _candidates)
    if (isReferenceField && schema.type === 'array' && schema.items?.type === 'object') {
        const catalogKey = name.slice(1) // Remove the "_" prefix
        const domain = schema.items.properties?.domain?.enum?.[0] || 'reference'
        const fieldValues = formData?.[name] || []

        const handleArrayAdd = (value: any) => {
            const newValues = [...fieldValues, value]
            onChange(newValues)
        }

        const handleArrayRemove = (index: number) => {
            const newValues = fieldValues.filter((_: any, i: number) => i !== index)
            onChange(newValues)
        }

        const wrapperClass = isSidebarField ? "mb-4" : "mb-6"
        const labelClass = isSidebarField
            ? "block text-sm font-medium text-gray-700 mb-1"
            : "block text-sm font-medium text-gray-900 mb-2"

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
                                {!props.disabled && (
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

                {!props.disabled && (
                    <ReferenceDropdown
                        value={null}
                        onChange={handleArrayAdd}
                        catalog={catalogKey}
                        domain={domain}
                        placeholder={`Add ${label.toLowerCase()}...`}
                        disabled={props.disabled}
                    />
                )}

                {errors && <div className="text-red-600 text-sm mt-1">{errors}</div>}
            </div>
        )
    }

    // Standard field rendering
    if (isSidebarField) {
        return (
            <div className="mb-4">
                <div className="flex items-center">
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
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
        <div className="mb-6">
            <div className="flex items-center mb-2">
                <label htmlFor={id} className="block text-sm font-medium text-gray-900">
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

export const createObjectFieldTemplate = () => (props: any) => {
    const { title, properties, schema, formData, onChange } = props
    const [isExpanded, setIsExpanded] = useState(true)

    // Check if this is an accordion section
    const isAccordion = schema['x-layout'] === 'accordion'

    // Convert properties object to array of React elements
    const renderProperties = () => {
        if (Array.isArray(properties)) {
            return properties
        }

        // If properties is an object, convert to array of elements
        if (properties && typeof properties === 'object') {
            return Object.keys(properties).map(key => {
                const prop = properties[key]
                if (React.isValidElement(prop)) {
                    return React.cloneElement(prop, { key })
                }
                return prop
            })
        }

        return properties
    }

    // Handle route points array specially
    if (props.name === 'route' && schema.type === 'array') {
        const routePoints = formData?.route || []

        const addRoutePoint = () => {
            const newPoint = {
                address: '',
                arrival: '',
                _counterParty: null,
                _cargoHandlingType: null,
                cargoList: []
            }
            onChange([...routePoints, newPoint])
        }

        const removeRoutePoint = (index: number) => {
            onChange(routePoints.filter((_: any, i: number) => i !== index))
        }

        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{title || 'Route Points'}</h3>
                    {!props.disabled && (
                        <button
                            type="button"
                            onClick={addRoutePoint}
                            className="btn-outline btn-sm"
                        >
                            Add Point
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    {renderProperties()}
                </div>
            </div>
        )
    }

    if (isAccordion) {
        return (
            <div className="border border-gray-200 rounded-lg mb-6">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-t-lg"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
                    </div>
                </button>
                {isExpanded && (
                    <div className="p-4">
                        {renderProperties()}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="mb-6">
            {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
            {renderProperties()}
        </div>
    )
}