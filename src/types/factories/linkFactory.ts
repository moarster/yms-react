import { ListLink, ReferenceLink } from '@/types';

export const createListLink = <TCatalog extends string>(catalog: TCatalog): ListLink<TCatalog> => ({
  catalog,
  domain: 'lists',
  entity: 'item',
  id: '',
  title: '',
});

export const createReferenceLink = <TCatalog extends string>(
  catalog: TCatalog,
): ReferenceLink<TCatalog> => ({
  catalog,
  domain: 'reference',
  entity: 'item',
  id: '',
  title: '',
});

export const LinkFactories = {
  cargoHandlingType: () => createListLink('cargo-handling-type'),
  cargoNature: () => createListLink('cargo-nature'),
  contract: () => createReferenceLink('contract'),
  // Reference links
  counterParty: () => createReferenceLink('counter-party'),
  currency: () => createListLink('currency'),
  driver: () => createReferenceLink('driver'),

  refusalReason: () => createReferenceLink('shipment-rfp-refusal-reason'),
  routeDirection: () => createReferenceLink('route-direction'),
  shipmentPlanningDepartment: () => createReferenceLink('shipment-planning-department'),
  // List links
  shipmentType: () => createListLink('shipment-type'),
  transportationType: () => createListLink('transportation-type'),
  vehicle: () => createReferenceLink('vehicle'),
  vehicleAffiliation: () => createListLink('vehicle-affiliation'),
  vehicleType: () => createReferenceLink('vehicle-type'),
} as const;
