import React from "react";

import {CatalogItem} from "@/features/catalogs/catalog.types.ts";
import {ShipmentRfpData} from "@/features/documents/types/shipment-rfp.ts";
import {BaseEntity} from '@/types'

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


export interface WizardLists {
    shipmentTypes: BaseEntity[]
    transportationTypes: BaseEntity[]
    currencies: BaseEntity[]
    vehicleTypes: CatalogItem[]
    cargoNatures: BaseEntity[]
    counterParties: CatalogItem[]
    cargoHandlingTypes: BaseEntity[]
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