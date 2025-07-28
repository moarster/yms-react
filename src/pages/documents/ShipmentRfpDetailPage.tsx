import React from 'react'
import { useNavigate } from 'react-router-dom'
import CommonForm from '@/components/form/CommonForm'
import { useShipmentRfpDetail } from './hooks/useShipmentRfpDetail'
import { useShipmentRfpPermissions } from './hooks/useShipmentRfpPermissions'
import { useShipmentRfpForm } from './hooks/useShipmentRfpForm'
import { useShipmentRfpSidebar } from './hooks/useShipmentRfpSidebar'

const ShipmentRfpDetailPage: React.FC = () => {
    const navigate = useNavigate()

    const {
        isCreating,
        formData,
        setFormData,
        isEditMode,
        setIsEditMode,
        rfp,
        schema,
        isLoading,
        createMutation,
        updateMutation,
        user
    } = useShipmentRfpDetail()

    const { canEdit, canPublish, canCancel } = useShipmentRfpPermissions(rfp!, user, isCreating)

    const handleFormChange = (data: any) => setFormData(data)

    const handleFormSubmit = (data: any) => {
        if (isCreating) {
            createMutation.mutate(data)
        } else {
            updateMutation.mutate({ id: rfp?.id, data })
        }
    }

    const { formConfig ,  onFormChange,  onFormSubmit } = useShipmentRfpForm(schema, formData, handleFormChange, handleFormSubmit)
    const { sidebarSections, actions } = useShipmentRfpSidebar(rfp, canPublish, canCancel)

    const commonFormProps = {
        title: isCreating ? 'Create Shipment RFP' : rfp?.title || 'RFP Details',
        subtitle: isCreating ? 'Create a new shipment request for proposal' : undefined,
        breadcrumbs: [
            { label: 'Shipment RFPs', href: '/shipment-rfps' },
            { label: isCreating ? 'Create New RFP' : rfp?.title || 'RFP Details' }
        ],
        formConfig: formConfig!,
        onFormChange,
        onFormSubmit,
        sidebarSections,
        actions,
        isLoading,
        isEditMode,
        onEditModeChange: canEdit ? setIsEditMode : undefined,
        hideFormActions: true
    }

    return <CommonForm {...commonFormProps} />
}

export default ShipmentRfpDetailPage