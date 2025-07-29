import {MapPinIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline'
import React from 'react'

import { RoutePoint} from "@/types";

interface RouteSectionProps {
    routePoints: RoutePoint[]
    onChange: (routePoints: RoutePoint[]) => void
    disabled?: boolean
}

const RouteSection: React.FC<RouteSectionProps> = ({routePoints, onChange, disabled}) => {
    const addRoutePoint = () => {
        const newPoint: RoutePoint = {
            address: '',
            arrival: '',
            _counterParty: {
                id: '',
                domain: 'reference',
                entity: 'item',
                catalog: 'counter-party'
            },
            _cargoHandlingType: {
                id: '',
                domain: 'lists',
                entity: 'item',
                catalog: 'cargo-handling-type'
            },
            cargoList: []
        }
        onChange([...routePoints, newPoint])
    }

    const removeRoutePoint = (index: number) => {
        onChange(routePoints.filter((_, i) => i !== index))
    }

    const updateRoutePoint = (index: number, field: string, value: RoutePoint) => {
        const updated = [...routePoints]
        updated[index] = {...updated[index], [field]: value}
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400"/>
                    <h3 className="text-lg font-medium text-gray-900">Route Points</h3>
                </div>
                {!disabled && (
                    <button
                        type="button"
                        onClick={addRoutePoint}
                        className="btn-outline btn-sm"
                    >
                        <PlusIcon className="h-4 w-4 mr-2"/>
                        Add Point
                    </button>
                )}
            </div>

            {routePoints.length === 0 && !disabled && (
                <div className="text-center py-8 text-gray-500">
                    <MapPinIcon className="h-12 w-12 mx-auto mb-4 text-gray-300"/>
                    <p>No route points added yet</p>
                    <button
                        type="button"
                        onClick={addRoutePoint}
                        className="btn-primary mt-4"
                    >
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
                                onClick={() => removeRoutePoint(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-4 w-4"/>
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address *
                            </label>
                            <input
                                type="text"
                                value={point.address || ''}
                                onChange={(e) => updateRoutePoint(index, 'address', e.target.value)}
                                disabled={disabled}
                                className="input"
                                placeholder="Enter address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                value={point.contactPhone || ''}
                                onChange={(e) => updateRoutePoint(index, 'contactPhone', e.target.value)}
                                disabled={disabled}
                                className="input"
                                placeholder="Phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Arrival Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={point.arrival || ''}
                                onChange={(e) => updateRoutePoint(index, 'arrival', e.target.value)}
                                disabled={disabled}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departure Time
                            </label>
                            <input
                                type="datetime-local"
                                value={point.departure || ''}
                                onChange={(e) => updateRoutePoint(index, 'departure', e.target.value)}
                                disabled={disabled}
                                className="input"
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
                                value={point._counterParty?.title || ''}
                                disabled={disabled}
                                className="input"
                                placeholder="Select counter party"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cargo Handling Type *
                            </label>
                            <input
                                type="text"
                                value={point._cargoHandlingType?.title || ''}
                                disabled={disabled}
                                className="input"
                                placeholder="Select handling type"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RouteSection