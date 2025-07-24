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
    | 'NEW'
    | 'ASSIGNED'
    | 'COMPLETED'
    | 'CANCELLED'

export interface DocumentActions {
    processInstanceKey: number
    entity: string
    tasks: DocumentTask[]
    timestamp: number
}

export interface DocumentTask {
    name: string
    elementId: string
    jobId: string
    assignee?: string
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

