import { ListLink, ReferenceLink } from '@/types'

export const createListLink = <TCatalog extends string>(catalog: TCatalog): ListLink<TCatalog> => ({
    domain: 'lists',
    entity: 'item',
    catalog,
    id: '',
    title: ''
})

export const createReferenceLink = <TCatalog extends string>(catalog: TCatalog): ReferenceLink<TCatalog> => ({
    domain: 'reference',
    entity: 'item',
    catalog,
    id: '',
    title: ''
})

export const LinkFactories = {
    // List links
    shipmentType: () => createListLink('shipment-type'),
    transportationType: () => createListLink('transportation-type'),
    currency: () => createListLink('currency'),
    cargoHandlingType: () => createListLink('cargo-handling-type'),
    cargoNature: () => createListLink('cargo-nature'),
    vehicleAffiliation: () => createListLink('vehicle-affiliation'),

    // Reference links
    counterParty: () => createReferenceLink('counter-party'),
    vehicleType: () => createReferenceLink('vehicle-type'),
    routeDirection: () => createReferenceLink('route-direction'),
    shipmentPlanningDepartment: () => createReferenceLink('shipment-planning-department'),
    vehicle: () => createReferenceLink('vehicle'),
    driver: () => createReferenceLink('driver'),
    contract: () => createReferenceLink('contract'),
    refusalReason: () => createReferenceLink('shipment-rfp-refusal-reason'),
} as const


