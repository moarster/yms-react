import {
  AirplaneTakeoffIcon,
  UserCircleCheckIcon,
  UsersIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import { useMemo } from 'react';

import { ShipmentRfp } from '@/features/documents/types/shipment-rfp.ts';
import { WorkflowTask } from '@/types/form.ts';
import { DocumentStatus } from '@/types/workflow.ts';

interface UseShipmentRfpWorkflowTasksProps {
  canAssign: boolean;
  canCancel: boolean;
  canComplete: boolean;
  canPublish: boolean;
  onAssign: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onPublish: () => void;
  rfp: ShipmentRfp;
  userRole: 'ADMIN' | 'CARRIER' | 'LOGIST';
}

export const useShipmentRfpWorkflowTasks = ({
  canAssign,
  canCancel,
  canComplete,
  canPublish,
  onAssign,
  onCancel,
  onComplete,
  onPublish,
  rfp,
  userRole,
}: UseShipmentRfpWorkflowTasksProps) => {
  const workflowTasks: WorkflowTask[] = useMemo(() => {
    if (!rfp) return [];

    const tasks: WorkflowTask[] = [];
    const status = rfp.status as DocumentStatus;

    // Tasks based on document status and user permissions
    if (status === 'NEW' && canPublish) {
      tasks.push({
        icon: AirplaneTakeoffIcon,
        label: 'Publish RFP',
        onClick: onPublish,
        requiresConfirmation: true,
        variant: 'primary',
      });
    }

    if ((status === 'NEW' || status === 'PUBLISHED') && canAssign) {
      tasks.push({
        icon: UsersIcon,
        label: 'Assign Carrier',
        onClick: onAssign,
        variant: 'secondary',
      });
    }

    if (status === 'ASSIGNED' && canComplete && userRole === 'LOGIST') {
      tasks.push({
        icon: UserCircleCheckIcon,
        label: 'Mark Complete',
        onClick: onComplete,
        requiresConfirmation: true,
        variant: 'success',
      });
    }

    // Cancel is available for most statuses (but not terminal ones)
    if ((status === 'NEW' || status === 'PUBLISHED' || status === 'ASSIGNED') && canCancel) {
      tasks.push({
        icon: XCircleIcon,
        label: 'Cancel RFP',
        onClick: onCancel,
        requiresConfirmation: true,
        variant: 'danger',
      });
    }

    return tasks;
  }, [
    rfp,
    canPublish,
    canAssign,
    canComplete,
    canCancel,
    userRole,
    onPublish,
    onAssign,
    onComplete,
    onCancel,
  ]);

  return { workflowTasks };
};
