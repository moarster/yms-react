import { Attachment, DomainEntity, EntityData, ListLink, ReferenceLink } from '@/types';
import { LinkFactories } from '@/types/factories/linkFactory.ts';

export interface ShipmentRfpData extends EntityData {
  _candidates?: ReferenceLink<'counter-party'>[];
  _carrier?: ReferenceLink<'counter-party'>;
  _client?: ReferenceLink<'counter-party'>;
  _contract?: ReferenceLink<'contract'>;
  _currency?: ListLink<'currency'>;
  _driver?: ReferenceLink<'driver'>;
  _refusalReason?: ReferenceLink<'shipment-rfp-refusal-reason'>;
  _requiredVehicleType?: ReferenceLink<'vehicle-type'>;
  _routeDirection?: ReferenceLink<'route-direction'>;
  _shipmentPlanningDepartment?: ReferenceLink<'shipment-planning-department'>;
  _shipmentType?: ListLink<'shipment-type'>;
  _transportationType?: ListLink<'transportation-type'>;
  _vehicle?: ReferenceLink<'vehicle'>;

  _vehicleAffiliation?: ListLink<'vehicle-affiliation'>;

  actualCarrier?: ActualCarrier;

  admittanceComment?: string;
  attachments?: Attachment[];
  comment?: string;
  customRequirements?: string;
  driverContactPhone?: string;
  express?: boolean;
  innerComment?: string;
  letterOfAttorney?: LetterOfAttorney;
  permissibleAxleLoad?: string;
  price?: number;

  refusalComment?: string;
  requestForVehicleDispatch?: Attachment;
  route?: RoutePoint[];
  trailerNumber?: string;
  trailerWeight?: number;

  vehicleWeight?: number;
}

export interface RoutePoint extends EntityData {
  _cargoHandlingType: ListLink<'cargo-handling-type'>;
  _counterParty: ReferenceLink<'counter-party'>;
  address: string; // max 255 chars
  arrival: string; // date-time
  cargoList: Cargo[];
  contactPhone?: string;
  departure?: string; // date-time
}

export interface Cargo extends EntityData {
  _cargoNature: ListLink<'cargo-nature'>;
  cargoVolume: number; // minimum 0, multipleOf 0.01
  cargoWeight: number; // minimum 0, multipleOf 0.01
  number: string;
}

export interface ActualCarrier extends EntityData {
  legalAddress?: string; // max 255 chars
  name?: string; // max 255 chars
  phone?: string;
  requestDate?: string; // date format
  requestNumber?: string;
  taxIdentificationNumber?: string; // INN: 10 or 12 digits
}

export interface LetterOfAttorney extends EntityData {
  attachment?: Attachment;
  date?: string; // date format
  issuedBy?: string; // max 255 chars
  number?: string; // max 255 chars
}

export const validateINN = (inn: string): boolean => /^\d{10}$|^\d{12}$/.test(inn);

export const validateRoutePoint = (point: RoutePoint): string[] => {
  const errors: string[] = [];
  if (!point.address?.trim()) errors.push('Address is required');
  if (point.address?.length > 255) errors.push('Address too long (max 255 chars)');
  if (!point.arrival) errors.push('Arrival time is required');
  if (point.cargoList.length === 0) errors.push('At least one cargo item is required');
  return errors;
};

export interface ShipmentRfp extends DomainEntity<ShipmentRfpData> {
  bids?: object[];
}

export const createShipmentRfpData = (): Partial<ShipmentRfpData> => ({
  _currency: LinkFactories.currency(),
  _requiredVehicleType: LinkFactories.vehicleType(),
  _shipmentType: LinkFactories.shipmentType(),
  _transportationType: LinkFactories.transportationType(),
  attachments: [],
  comment: '',
  customRequirements: '',
  express: false,
  innerComment: '',
  route: [createRoutePoint()],
});

export const createRoutePoint = (): RoutePoint => ({
  _cargoHandlingType: LinkFactories.cargoHandlingType(),
  _counterParty: LinkFactories.counterParty(),
  address: '',
  arrival: '',
  cargoList: [createCargo()],
  contactPhone: '',
  departure: '',
});

export const createCargo = (): Cargo => ({
  _cargoNature: LinkFactories.cargoNature(),
  cargoVolume: 0,
  cargoWeight: 0,
  number: '',
});
