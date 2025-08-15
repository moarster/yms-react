import React from 'react'
import { useNavigate } from 'react-router-dom'

import {useDocumentFormActions} from "@/features/documents/hooks/useDocumentFormActions.ts";
import {useDocumentWorkflowActions} from "@/features/documents/hooks/useDocumentWorkflowActions.ts";
import {ShipmentRfp} from "@/features/documents/types/shipment-rfp.ts";
import CommonForm from '@/shared/form/CommonForm.tsx'

import { useShipmentRfpDetail } from '../hooks/useShipmentRfpDetail.ts'
import { useShipmentRfpForm } from '../hooks/useShipmentRfpForm.ts'
import { useShipmentRfpPermissions } from '../hooks/useShipmentRfpPermissions.ts'
import { useShipmentRfpSidebar } from '../hooks/useShipmentRfpSidebar.ts'
import { useShipmentRfpWorkflowTasks } from '../hooks/useShipmentRfpWorkflowTasks.ts'


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

    const handleFormChange = (data: object) => setFormData(data)

    const handleFormSubmit = (data: ShipmentRfp) => {
        if (isCreating) {
            createMutation.mutate(data)
        } else {
            updateMutation.mutate({ id: rfp?.id, data })
        }
    }

    const formActions = useDocumentFormActions({
        isEditMode,
        isLoading,
        isSaving: createMutation.isPending || updateMutation.isPending,
        canEdit,
        canDelete: false,
        onEdit: () => setIsEditMode(true),
        onSave: () => {
            // Trigger form submit programmatically
            const formElement = document.getElementById('common-form') as HTMLFormElement
            if (formElement) {
                formElement.requestSubmit()
            }
        },
        onCancel: () => {
            if (isEditMode) {
                setIsEditMode(false)
            } else {
                navigate('/shipment-rfps')
            }
        }
    })



    const workflowActions = useDocumentWorkflowActions({
        documentId: rfp?.id || '',
        documentType: 'shipment-rfp',
        onSuccess: (_action) => {
            //console.log(`Workflow action ${action} completed`)
        }
    })

    // Workflow tasks for footer
    const { workflowTasks } = useShipmentRfpWorkflowTasks({
        rfp,
        canPublish,
        canAssign:true,
        canComplete:true,
        canCancel,
        userRole: user?.roles?.[0]?.name as 'LOGIST' | 'CARRIER' | 'ADMIN',
        onPublish: workflowActions.publish,
        onAssign: () => {
            // You might want to open a carrier selection modal here
            //console.log('Open carrier assignment modal')
        },
        onComplete: workflowActions.complete,
        onCancel: workflowActions.cancel
    })
    const { sidebarSections } = useShipmentRfpSidebar({ rfp })
    const { formConfig, onFormChange, onFormSubmit } = useShipmentRfpForm(
        schema,
        formData,
        handleFormChange,
        handleFormSubmit
    )
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
        formActions,
        workflowTasks,
        isLoading,
        isEditMode,
        onEditModeChange: canEdit ? setIsEditMode : undefined,
        hideFormActions: true
    }

    return <CommonForm {...commonFormProps} />
}

export default ShipmentRfpDetailPage