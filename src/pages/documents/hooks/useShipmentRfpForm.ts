import { useMemo } from 'react'
import {FormConfig} from "@/types";

export const useShipmentRfpForm = (
    schema: any,
    formData: any,
    onFormChange: (data: any) => void,
    onFormSubmit: (data: any) => void
) => {
    const formConfig = useMemo(() => {
        if (!schema) return null
        return {
            schema: schema.schema,
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