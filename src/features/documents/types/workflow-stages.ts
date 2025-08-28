import { UserRole } from '@/core/auth/types';
import { DocumentStatus } from '@/types/workflow';

export type ShipmentRfpStage = 'inception' | 'bidding' | 'contracting';

export interface ShipmentRfpStageConfig {
  stage: ShipmentRfpStage;
  statuses: DocumentStatus[];
  title: string;
  description: string;
  allowedRoles: UserRole[];
  sections: string[];
  primaryActions: string[];
}

export const WORKFLOW_STAGES: Record<ShipmentRfpStage, ShipmentRfpStageConfig> = {
  inception: {
    stage: 'inception',
    statuses: ['NEW', 'DRAFT'],
    title: 'Inception',
    description: 'Create and prepare shipment request',
    allowedRoles: ['LOGIST', 'ADMIN'],
    sections: ['general', 'route'],
    primaryActions: ['save', 'publish', 'delete']
  },
  bidding: {
    stage: 'bidding',
    statuses: ['PUBLISHED', 'ASSIGNED'],
    title: 'Bidding',
    description: 'Collect and evaluate carrier bids',
    allowedRoles: ['LOGIST', 'CARRIER', 'ADMIN'],
    sections: ['general', 'route', 'bidding'],
    primaryActions: ['assign', 'cancel', 'bid']
  },
  contracting: {
    stage: 'contracting',
    statuses: ['ASSIGNED', 'COMPLETED'],
    title: 'Contracting',
    description: 'Finalize contract and delivery',
    allowedRoles: ['LOGIST', 'CARRIER', 'ADMIN'],
    sections: ['general', 'route', 'contract'],
    primaryActions: ['complete', 'modify', 'close']
  }
};

export const getShipmentRfpStage = (status: DocumentStatus): ShipmentRfpStage => {
  for (const [stage, config] of Object.entries(WORKFLOW_STAGES)) {
    if (config.statuses.includes(status)) {
      return stage as ShipmentRfpStage;
    }
  }
  return 'inception'; // default
};

export const getStageProgress = (currentStage: ShipmentRfpStage): number => {
  const stages = Object.keys(WORKFLOW_STAGES);
  const currentIndex = stages.indexOf(currentStage);
  return ((currentIndex + 1) / stages.length) * 100;
};