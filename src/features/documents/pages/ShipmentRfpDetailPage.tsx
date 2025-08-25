import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useDocumentFormActions } from '@/features/documents/hooks/useDocumentFormActions.ts';
import { useDocumentWorkflowActions } from '@/features/documents/hooks/useDocumentWorkflowActions.ts';
import { ShipmentRfp } from '@/features/documents/types/shipment-rfp.ts';

import { useShipmentRfpDetail } from '../hooks/useShipmentRfpDetail.ts';
import { useShipmentRfpForm } from '../hooks/useShipmentRfpForm.ts';
import { useShipmentRfpPermissions } from '../hooks/useShipmentRfpPermissions.ts';
import { useShipmentRfpSidebar } from '../hooks/useShipmentRfpSidebar.ts';
import { useShipmentRfpWorkflowTasks } from '../hooks/useShipmentRfpWorkflowTasks.ts';

const ShipmentRfpDetailPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    createMutation,
    formData,
    isCreating,
    isEditMode,
    isLoading,
    rfp,
    schema,
    setFormData,
    setIsEditMode,
    updateMutation,
    user,
  } = useShipmentRfpDetail();

  const { canCancel, canEdit, canPublish } = useShipmentRfpPermissions(rfp!, user, isCreating);

  const handleFormChange = (data: object) => setFormData(data);

  const handleFormSubmit = (data: ShipmentRfp) => {
    if (isCreating) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ data, id: rfp?.id });
    }
  };

  const formActions = useDocumentFormActions({
    canDelete: false,
    canEdit,
    isEditMode,
    isLoading,
    isSaving: createMutation.isPending || updateMutation.isPending,
    onCancel: () => {
      if (isEditMode) {
        setIsEditMode(false);
      } else {
        navigate('/shipment-rfps');
      }
    },
    onEdit: () => setIsEditMode(true),
    onSave: () => {
      // Trigger form submit programmatically
      const formElement = document.getElementById('common-form') as HTMLFormElement;
      if (formElement) {
        formElement.requestSubmit();
      }
    },
  });

  const workflowActions = useDocumentWorkflowActions({
    documentId: rfp?.id || '',
    documentType: 'shipment-rfp',
    onSuccess: (_action) => {
      //console.log(`Workflow action ${action} completed`)
    },
  });

  // Workflow tasks for footer
  const { workflowTasks } = useShipmentRfpWorkflowTasks({
    canAssign: true,
    canCancel,
    canComplete: true,
    canPublish,
    onAssign: () => {
      // You might want to open a carrier selection modal here
      //console.log('Open carrier assignment modal')
    },
    onCancel: workflowActions.cancel,
    onComplete: workflowActions.complete,
    onPublish: workflowActions.publish,
    rfp,
    userRole: user?.roles?.[0]?.name as 'ADMIN' | 'CARRIER' | 'LOGIST',
  });
  const { sidebarSections } = useShipmentRfpSidebar({ rfp });
  const { formConfig, onFormChange, onFormSubmit } = useShipmentRfpForm(
    schema,
    formData,
    handleFormChange,
    handleFormSubmit,
  );
  const commonFormProps = {
    breadcrumbs: [
      { href: '/shipment-rfps', label: 'Shipment RFPs' },
      { label: isCreating ? 'Create New RFP' : rfp?.title || 'RFP Details' },
    ],
    formActions,
    formConfig: formConfig!,
    hideFormActions: true,
    isEditMode,
    isLoading,
    onEditModeChange: canEdit ? setIsEditMode : undefined,
    onFormChange,
    onFormSubmit,
    sidebarSections,
    subtitle: isCreating ? 'Create a new shipment request for proposal' : undefined,
    title: isCreating ? 'Create Shipment RFP' : rfp?.title || 'RFP Details',
    workflowTasks,
  };

  return <div />;
};

export default ShipmentRfpDetailPage;
