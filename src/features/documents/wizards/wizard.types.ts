import React from 'react';

import { CatalogItem } from '@/features/catalogs/catalog.types.ts';
import { ShipmentRfpData } from '@/features/documents/types/shipment-rfp.ts';
import { BaseEntity } from '@/types';

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

export interface WizardLists {
  cargoHandlingTypes: BaseEntity[];
  cargoNatures: BaseEntity[];
  counterParties: CatalogItem[];
  currencies: BaseEntity[];
  shipmentTypes: BaseEntity[];
  transportationTypes: BaseEntity[];
  vehicleTypes: CatalogItem[];
}

export interface ShipmentRfpWizardProps {
  initialData: Partial<ShipmentRfpData>;
  isSubmitting?: boolean;
  lists: WizardLists;
  onCancel?: () => void;
  onSubmit: (data: Partial<ShipmentRfpData>) => Promise<void> | void;
}

export interface WizardFormData extends Partial<ShipmentRfpData> {
  // UI-specific fields
  _tempFiles?: File[];
  _validationErrors?: Record<string, string[]>;
}
