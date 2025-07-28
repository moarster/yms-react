import { ListLink, ReferenceLink, Attachment,DomainEntity } from '@/types'

export interface ShipmentRfpData {
    _shipmentType: ListLink<'shipment-type'>
    _transportationType: ListLink<'transportation-type'>
    _routeDirection: ReferenceLink<'route-direction'>
    _currency: ListLink<'currency'>
    _candidates?: ReferenceLink<'counter-party'>[]
    _carrier?: ReferenceLink<'counter-party'>
    price?: number
    _requiredVehicleType?: ReferenceLink<'vehicle-type'>
    customRequirements?: string // max 1000 chars
    innerComment?: string
    comment?: string // max 1000 chars
    admittanceComment?: string // max 1000 chars
    refusalComment?: string // max 1000 chars

    route: RoutePoint[]

    express?: boolean

    _shipmentPlanningDepartment?: ReferenceLink<'shipment-planning-department'>
    _vehicle?: ReferenceLink<'vehicle'>
    trailerNumber?: string
    vehicleWeight?: number
    trailerWeight?: number
    permissibleAxleLoad?: string // format: axis1/axis2/.../axisN
    _vehicleAffiliation?: ListLink<'vehicle-affiliation'>
    _driver?: ReferenceLink<'driver'>
    driverContactPhone?: string
    _client?: ReferenceLink<'counter-party'>

    actualCarrier?: ActualCarrier
    _contract?: ReferenceLink<'contract'>
    letterOfAttorney?: LetterOfAttorney
    requestForVehicleDispatch?: Attachment
    _refusalReason?: ReferenceLink<'shipment-rfp-refusal-reason'>

    attachments: Attachment[]
}

export interface RoutePoint {
    address: string // max 255 chars
    contactPhone?: string
    arrival: string // date-time
    departure?: string // date-time
    _counterParty: ReferenceLink<'counter-party'>
    _cargoHandlingType: ListLink<'cargo-handling-type'>
    cargoList: Cargo[]
}

export interface Cargo {
    number: string
    cargoWeight: number // minimum 0, multipleOf 0.01
    cargoVolume: number // minimum 0, multipleOf 0.01
    _cargoNature: ListLink<'cargo-nature'>
}

export interface ActualCarrier {
    name?: string // max 255 chars
    legalAddress?: string // max 255 chars
    taxIdentificationNumber?: string // INN: 10 or 12 digits
    phone?: string
    requestNumber?: string
    requestDate?: string // date format
}

export interface LetterOfAttorney {
    number?: string // max 255 chars
    date?: string // date format
    issuedBy?: string // max 255 chars
    attachment?: Attachment
}


export const validateINN = (inn: string): boolean =>
    /^\d{10}$|^\d{12}$/.test(inn)

export const validateRoutePoint = (point: RoutePoint): string[] => {
    const errors: string[] = []
    if (!point.address?.trim()) errors.push('Address is required')
    if (point.address?.length > 255) errors.push('Address too long (max 255 chars)')
    if (!point.arrival) errors.push('Arrival time is required')
    if (point.cargoList.length === 0) errors.push('At least one cargo item is required')
    return errors
}

export type ShipmentRfp = DomainEntity<ShipmentRfpData>