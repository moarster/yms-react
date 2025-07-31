import React from "react";

import { ShipmentRfpData } from '@/types'

export interface WizardStep {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    isValid?: (data: any) => boolean
    isOptional?: boolean
}

export interface WizardProps<T> {
    steps: WizardStep[]
    initialData: T
    onSubmit: (data: T) => void | Promise<void>
    onCancel?: () => void
    isSubmitting?: boolean
    className?: string
}

export interface ReferenceListItem {
    id: string
    name: string
    code?: string
    description?: string
}

export interface WizardLists {
    shipmentTypes: ReferenceListItem[]
    transportationTypes: ReferenceListItem[]
    currencies: ReferenceListItem[]
    vehicleTypes: ReferenceListItem[]
    cargoNatures: ReferenceListItem[]
    counterParties: ReferenceListItem[]
    cargoHandlingTypes: ReferenceListItem[]
}

export interface ShipmentRfpWizardProps {
    initialData: Partial<ShipmentRfpData>
    lists: WizardLists
    onSubmit: (data: Partial<ShipmentRfpData>) => void | Promise<void>
    onCancel?: () => void
    isSubmitting?: boolean
}

export interface WizardFormData extends Partial<ShipmentRfpData> {
    // UI-specific fields
    _tempFiles?: File[]
    _validationErrors?: Record<string, string[]>
}