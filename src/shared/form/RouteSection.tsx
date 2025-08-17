import { MapPinIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import React from 'react';

import { RoutePoint } from '@/types';

interface RouteSectionProps {
  disabled?: boolean;
  onChange: (routePoints: RoutePoint[]) => void;
  routePoints: RoutePoint[];
}

const RouteSection: React.FC<RouteSectionProps> = ({ disabled, onChange, routePoints }) => {
  const addRoutePoint = () => {
    const newPoint: RoutePoint = {
      _cargoHandlingType: {
        catalog: 'cargo-handling-type',
        domain: 'lists',
        entity: 'item',
        id: '',
      },
      _counterParty: {
        catalog: 'counter-party',
        domain: 'reference',
        entity: 'item',
        id: '',
      },
      address: '',
      arrival: '',
      cargoList: [],
    };
    onChange([...routePoints, newPoint]);
  };

  const removeRoutePoint = (index: number) => {
    onChange(routePoints.filter((_, i) => i !== index));
  };

  const updateRoutePoint = (index: number, field: string, value: RoutePoint) => {
    const updated = [...routePoints];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Route Points</h3>
        </div>
        {!disabled && (
          <button type="button" className="btn-outline btn-sm" onClick={addRoutePoint}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Point
          </button>
        )}
      </div>

      {routePoints.length === 0 && !disabled && (
        <div className="text-center py-8 text-gray-500">
          <MapPinIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No route points added yet</p>
          <button type="button" className="btn-primary mt-4" onClick={addRoutePoint}>
            Add First Route Point
          </button>
        </div>
      )}

      {routePoints.map((point, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Route Point {index + 1}</h4>
            {!disabled && routePoints.length > 1 && (
              <button
                type="button"
                className="text-red-600 hover:text-red-800"
                onClick={() => removeRoutePoint(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                className="input"
                disabled={disabled}
                placeholder="Enter address"
                value={point.address || ''}
                onChange={(e) => updateRoutePoint(index, 'address', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                className="input"
                disabled={disabled}
                placeholder="Phone number"
                value={point.contactPhone || ''}
                onChange={(e) => updateRoutePoint(index, 'contactPhone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time *</label>
              <input
                className="input"
                disabled={disabled}
                type="datetime-local"
                value={point.arrival || ''}
                onChange={(e) => updateRoutePoint(index, 'arrival', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
              <input
                className="input"
                disabled={disabled}
                type="datetime-local"
                value={point.departure || ''}
                onChange={(e) => updateRoutePoint(index, 'departure', e.target.value)}
              />
            </div>
          </div>

          {/* Counter Party and Cargo Handling Type dropdowns would go here */}
          {/* For now, keeping it simple with text inputs */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Counter Party *
              </label>
              <input
                type="text"
                className="input"
                disabled={disabled}
                placeholder="Select counter party"
                value={point._counterParty?.title || ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo Handling Type *
              </label>
              <input
                type="text"
                className="input"
                disabled={disabled}
                placeholder="Select handling type"
                value={point._cargoHandlingType?.title || ''}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteSection;
