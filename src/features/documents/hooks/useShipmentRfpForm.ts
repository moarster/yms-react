import { useMemo } from 'react'

import {FormConfig,JsonSchema} from "@/types";

export const useShipmentRfpForm = (
    schema: JsonSchema,
    formData: object,
    onFormChange: (data: object) => void,
    onFormSubmit: (data: object) => void
) => {
    const formConfig = useMemo(() => {
        if (!schema) return null
        return {
            schema,
            uiSchema: {
                title: { 'ui:widget': 'text', 'ui:options': { className: 'text-xl font-semibold' } },
                description: { 'ui:widget': 'textarea', 'ui:options': { rows: 4 } },
                pickupLocation: { 'ui:title': 'Pickup Location', 'ui:layout': 'accordion' },
                deliveryLocation: { 'ui:title': 'Delivery Location', 'ui:layout': 'accordion' },
                cargoDetails: { 'ui:title': 'Cargo Details', 'ui:layout': 'accordion' },
            },
            formData
        } as FormConfig
    }, [schema, formData])

    return {
        formConfig,
        onFormChange,
        onFormSubmit
    }
}