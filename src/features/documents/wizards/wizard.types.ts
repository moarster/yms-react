import React from 'react';

import { ShipmentRfpData } from '@/features/documents/types/shipment-rfp.ts';
import { Attachment } from '@/types';

export interface WizardStep {
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  id: string;
  isOptional?: boolean;
  isValid?: (data: any) => boolean;
  title: string;
}

export interface WizardProps<T> {
  className?: string;
  initialData: T;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (data: T) => Promise<void> | void;
  steps: WizardStep[];
}


export interface ShipmentRfpWizardProps {
  initialData: Partial<ShipmentRfpData>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (data: Partial<ShipmentRfpData>) => Promise<void> | void;
}

export interface WizardFormData extends Partial<ShipmentRfpData> {
  // UI-specific fields
  _tempFiles?: Attachment[];
  _validationErrors?: Record<string, string[]>;
}
