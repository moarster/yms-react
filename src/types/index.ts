import {ShipmentRfpData} from "./schemas/shipmentRfpData.ts";
import {BaseEntity, DataEntity, DomainEntity, RichList} from "@/types/dataModel.ts";
import {AnyData} from "@/types/schemas/schemaModel.ts";

export type CatalogItem = DataEntity<AnyData>
export type ListItem = BaseEntity

export type CatalogInfo = RichList

export * from './auth'

export * from './api'

export * from './ui'

export * from './app'



export type ShipmentRfp = DomainEntity<ShipmentRfpData>


export type DocumentStatus =
    | 'DRAFT'
    | 'ASSIGNED'
    | 'COMPLETED'
    | 'CANCELLED'

export interface DocumentAction {
    key: string
    label: string
    description: string
    roles: string[]
    availableInStatuses: DocumentStatus[]
    confirmationRequired: boolean
}


export interface ApiError {
    message: string
    code: string
    details?: Record<string, any>
}


export interface Notification {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: string
    read: boolean
    actions?: NotificationAction[]
}

export interface NotificationAction {
    label: string
    action: () => void
}

