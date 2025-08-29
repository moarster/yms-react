import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { useAuthStore } from '@/core/store/authStore';
import { documentService } from '@/features/documents/documentService';
import { ShipmentRfp } from '@/features/documents/types/shipment-rfp';
import { DocumentStatus } from '@/types/workflow';
import { schemaService } from '@/shared/services/schemaService';
import { useAsyncPermissions, usePermissionCheck } from '@/core/contexts/PermissionContext';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import ErrorMessage from '@/shared/ui/ErrorMessage';

import { ShipmentRfpPresentation } from './ShipmentRfpPresentation';
import { getShipmentRfpStage } from '@/features/documents/types/workflow-stages.ts';

interface ShipmentRfpWorkflowContainerProps {
  srfpId: string;
}

export const ShipmentRfpWorkflowContainer: React.FC<ShipmentRfpWorkflowContainerProps> = ({
                                                                                            srfpId
                                                                                          }) => {
  const { user } = useAuthStore();
  const { checkPermission } = useAsyncPermissions();
  const queryClient = useQueryClient();

  const { data: canView, isLoading: permissionLoading } = usePermissionCheck(
    'shipment-rfps',
    'view',
  );

  // Fetch SRFP data
  const {
    data: srfp,
    isLoading: srfpLoading,
    error: srfpError
  } = useQuery({
    queryKey: ['srfp', srfpId],
    queryFn: () => documentService.getShipmentRfp(srfpId),
    enabled: !!srfpId && srfpId !== 'new'
  });

  // Fetch schema
  const {
    data: schema,
    isLoading: schemaLoading
  } = useQuery({
    queryKey: ['shipment-rfp-schema'],
    queryFn: () => schemaService.getAnySchema('shipment-rfp')
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: async ({ action, data }: { action: string; data?: Partial<ShipmentRfp> }) => {
      return documentService.executeAction(srfpId, action, data || {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['srfp', srfpId] });
    }
  });

  // Handle status changes
  const handleStatusUpdate = async (action: string, data?: Partial<ShipmentRfp>) => {
    try {
      await statusMutation.mutateAsync({ action, data });
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    }
  };

  // Determine workflow stage
  const workflowStage = srfp?.status
    ? getShipmentRfpStage(srfp.status as DocumentStatus)
    : 'inception';
  const userRole = user?.roles?.[0]?.name || 'CARRIER';

  // Loading state
  if (permissionLoading || srfpLoading || schemaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading workflow..." />
      </div>
    );
  }

  // Permission denied
  if (!canView) {
    return (
      <ErrorMessage message="You don't have permission to view this document" />
    );
  }
  // Error state
  if (srfpError) {
    return (
      <ErrorMessage
        message="Failed to load shipment RFP"
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['srfp', srfpId] })}
      />
    );
  }


  return (
    <ShipmentRfpPresentation
      srfp={srfp}
      schema={schema}
      userRole={userRole}
      stage={workflowStage}
      isUpdating={statusMutation.isPending}
      onStatusChange={handleStatusUpdate}
    />
  );
};