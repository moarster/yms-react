// Updated types based on JSON Schema
export interface ShipmentRfpData  {
    type: 'shipment-rfp'
    // Required fields from schema
    _shipmentType: ListLink<'shipment-type'>
    _transportationType: ListLink<'transportation-type'>
    _routeDirection: ReferenceLink<'route-direction'>
    _currency: ListLink<'currency'>

    // Optional core fields
    _candidates?: ReferenceLink<'counter-party'>[]
    _carrier?: ReferenceLink<'counter-party'>
    price?: number
    _requiredVehicleType?: ReferenceLink<'vehicle-type'>

    // Text fields
    customRequirements?: string // max 1000 chars
    innerComment?: string // max 1000 chars, logist only
    comment?: string // max 1000 chars
    admittanceComment?: string // max 1000 chars
    refusalComment?: string // max 1000 chars

    // Route with cargo
    route: RoutePoint[]

    // Express shipment flag
    express?: boolean

    // Additional entities
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

    // Actual carrier info
    actualCarrier?: ActualCarrier
    _contract?: ReferenceLink<'contract'>
    letterOfAttorney?: LetterOfAttorney
    requestForVehicleDispatch?: Attachment
    _refusalReason?: ReferenceLink<'shipment-rfp-refusal-reason'>

    // Attachments
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

// Reference system types
export interface AnyLink {
    domain: string // pattern: ^[A-Za-z\-]{2,256}$
    entity?: string // pattern: ^[A-Za-z\-]{2,256}$
    catalog?: string // pattern: ^[A-Za-z\-]{2,256}$
    id: string // uuid format
    title?: string // pattern: \w+
}

export interface ListLink<T extends string = string> extends AnyLink {
    domain: 'lists'
    entity: 'item'
    catalog: T
}

export interface ReferenceLink<T extends string = string> extends AnyLink {
    domain: 'reference'
    entity: 'item'
    catalog: T
}

export interface Attachment {
    filename?: string
    mimetype?: string
    size?: number
    minio_key?: string
}

// Updated PaginatedResponse to match API structure

