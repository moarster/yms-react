import { notifications } from '@mantine/notifications';
import { Stack } from '@mantine/core';
import React from 'react';

import { UserRole } from '@/core/auth/types';
import { ShipmentRfp } from '@/features/documents/types/shipment-rfp';
import { ShipmentRfpStage } from '../types/workflow-stages';
import { JsonSchema } from '@/types';
import { WorkflowNavigation } from '@/features/documents/components/WorkflowNavigation';
import { getLayoutForStage } from '@/features/documents/layouts/StageLayouts';

import { ShipmentRfpInfo } from '../components/ShipmentRfpInfo.tsx';
import { ShipmentRfpRoute } from '../components/ShipmentRfpRoute.tsx';
import { ShipmentRfpCarrier } from '@/features/documents/components';
import { RoleBasedActions } from '../components/RoleBasedActions';

interface ShipmentRfpPresentationProps {
  srfp?: ShipmentRfp | null;
  schema?: JsonSchema | null;
  userRole: UserRole;
  stage: ShipmentRfpStage;
  isUpdating?: boolean;
  onStatusChange: (action: string, data?: Partial<ShipmentRfp>) => Promise<void>;
}

export const ShipmentRfpPresentation: React.FC<ShipmentRfpPresentationProps> = ({
                                                                                  srfp,
                                                                                  schema,
                                                                                  userRole,
                                                                                  stage,
                                                                                  isUpdating = false,
                                                                                  onStatusChange
                                                                                }) => {
  const LayoutComponent = getLayoutForStage(stage);

  const handleStatusUpdate = async (action: string, data?: Partial<ShipmentRfp>) => {
    try {
      await onStatusChange(action, data);
      notifications.show({
        color: 'green',
        message: `Action "${action}" completed successfully`,
      });
    } catch (error) {
      notifications.show({
        color: 'red',
        message: error instanceof Error ? error.message : 'Action failed',
      });
    }
  };

  if (!schema) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Schema loading...</p>
      </div>
    );
  }

  return (
    <Stack gap={0}>
      {/* Workflow Navigation */}
      <WorkflowNavigation
        currentStage={stage}
        status={srfp?.status as any}
      />

      {/* Stage-specific Layout */}
      <LayoutComponent stage={stage} userRole={userRole}>
        {/* General Section */}
        <div slot="general">
          <ShipmentRfpInfo
            rfp={srfp}
            schema={schema}
          />
        </div>

        {/* Route Section */}
        <div slot="route">
          <ShipmentRfpRoute rfp={srfp} />
        </div>

        {/* Bidding Section - shown in bidding stage */}
        {stage === 'bidding' && (
          <div slot="bidding">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">
                {userRole === 'CARRIER' ? 'Submit Bid' : 'Manage Bids'}
              </h3>
              {userRole === 'CARRIER' ? (
                <p className="text-gray-500">Bid submission form would go here</p>
              ) : (
                <p className="text-gray-500">Bid management interface would go here</p>
              )}
            </div>
          </div>
        )}

        {/* Contract Section - shown in contracting stage */}
        {stage === 'contracting' && (
          <div slot="contract">
            <ShipmentRfpCarrier rfp={srfp} />
          </div>
        )}
      </LayoutComponent>

      {/* Role-based Actions */}
      <RoleBasedActions
        srfp={srfp}
        userRole={userRole}
        stage={stage}
        isUpdating={isUpdating}
        onAction={handleStatusUpdate}
      />
    </Stack>
  );
};