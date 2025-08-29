import { Button, Group, Paper, Stack, Text } from '@mantine/core';
import { CheckCircleIcon, TruckIcon, XCircleIcon, FloppyDiskIcon } from '@phosphor-icons/react';
import React from 'react';

import { UserRole } from '@/core/auth/types';
import { ShipmentRfp } from '@/features/documents/types/shipment-rfp';
import { ShipmentRfpStage, WORKFLOW_STAGES } from '../types/workflow-stages';
import { usePermissionCheck, usePermissions } from '@/core/contexts/PermissionContext';

interface RoleBasedActionsProps {
  srfp?: ShipmentRfp | null;
  userRole: UserRole;
  stage: ShipmentRfpStage;
  isUpdating?: boolean;
  onAction: (action: string, data?: Partial<ShipmentRfp>) => Promise<void>;
}

interface ActionConfig {
  action: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  variant: 'filled' | 'outline' | 'light';
  requiresConfirmation?: boolean;
  requiredScope?: 'view' | 'manage' | 'delete' | 'participate';
}

export const RoleBasedActions: React.FC<RoleBasedActionsProps> = ({
  srfp,
  stage,
  userRole,
  isUpdating,
  onAction,
}) => {
  const { isRole } = usePermissions();

  const { data: canManage } = usePermissionCheck('shipment-rfps', 'manage');
  const { data: canBid } = usePermissionCheck('shipment-rfps', 'participate');

  // Define available actions based on stage and role
  const getAvailableActions = (): ActionConfig[] => {
    const actions: ActionConfig[] = [];

    switch (stage) {
      case 'inception':
        if ((isRole('LOGIST') || isRole('ADMIN')) && canManage) {
          actions.push(
            {
              action: 'save',
              label: 'Save',
              icon: FloppyDiskIcon,
              color: 'gray',
              variant: 'outline',
              requiresConfirmation: false,
            },
            {
              action: 'publish',
              label: 'Publish RFP',
              icon: CheckCircleIcon,
              color: 'blue',
              variant: 'filled',
              requiresConfirmation: true,
            },
          );
        }
        break;

      case 'bidding':
        if (isRole('LOGIST') || isRole('ADMIN')) {
          actions.push(
            {
              action: 'assign',
              label: 'Assign Carrier',
              icon: TruckIcon,
              color: 'green',
              variant: 'filled',
            },
            {
              action: 'cancel',
              label: 'Cancel RFP',
              icon: XCircleIcon,
              color: 'red',
              variant: 'outline',
              requiresConfirmation: true,
            },
          );
        } else if (isRole('CARRIER')) {
          actions.push({
            action: 'submit_bid',
            label: 'Submit Bid',
            icon: CheckCircleIcon,
            color: 'blue',
            variant: 'filled',
          });
        }
        break;

      case 'contracting':
        if (isRole('LOGIST') || isRole('ADMIN')) {
          actions.push({
            action: 'complete',
            label: 'Mark Complete',
            icon: CheckCircleIcon,
            color: 'green',
            variant: 'filled',
            requiresConfirmation: true,
          });
        }

        if (isRole('CARRIER')) {
          actions.push({
            action: 'update_delivery',
            label: 'Update Delivery Info',
            icon: TruckIcon,
            color: 'blue',
            variant: 'outline',
          });
        }
        break;
    }

    // Filter by permissions
    return actions.filter((action) => {
      switch (action.requiredScope) {
        case 'manage':
          return canManage;
        case 'participate':
          return canBid;
        case 'view':
        default:
          return true;
      }
    });
  };

  const handleAction = async (actionConfig: ActionConfig) => {
    if (actionConfig.requiresConfirmation) {
      const confirmed = window.confirm(
        `Are you sure you want to ${actionConfig.label.toLowerCase()}?`,
      );
      if (!confirmed) return;
    }

    await onAction(actionConfig.action);
  };

  const availableActions = getAvailableActions();
  const stageConfig = WORKFLOW_STAGES[stage];

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <Paper withBorder p="md" mt="md">
      <Stack gap="md">
        <div>
          <Text fw={500} size="sm" c="dimmed">
            Available Actions - {stageConfig.title}
          </Text>
          <Text size="xs" c="dimmed">
            {stageConfig.description}
          </Text>
        </div>

        <Group gap="sm">
          {availableActions.map((actionConfig) => {
            const IconComponent = actionConfig.icon;

            return (
              <Button
                key={actionConfig.action}
                variant={actionConfig.variant}
                color={actionConfig.color}
                leftSection={<IconComponent size={16} />}
                loading={isUpdating}
                onClick={() => handleAction(actionConfig)}
                disabled={isUpdating}
              >
                {actionConfig.label}
              </Button>
            );
          })}
        </Group>

        {/* Status indicator */}
        {srfp?.status && (
          <Text size="xs" c="dimmed">
            Current status: <strong>{srfp.status}</strong>
          </Text>
        )}
      </Stack>
    </Paper>
  );
};
