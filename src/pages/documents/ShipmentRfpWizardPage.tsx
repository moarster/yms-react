import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import ShipmentRfpWizard from '@/components/wizards/ShipmentRfpWizard'
import {catalogService} from "@/services/catalogService.ts";
import { ShipmentRfpData } from '@/types'

import { useShipmentRfpDetail } from './hooks/useShipmentRfpDetail'

const ShipmentRfpWizardPage: React.FC = () => {
    const navigate = useNavigate()
    const { createMutation } = useShipmentRfpDetail()

    // Fetch all required reference data
    const { data: lists, isLoading: listsLoading } = useQuery({
        queryKey: ['rfp-wizard-lists'],
        queryFn: async () => {
            const {
                shipmentTypes,
                transportationTypes,
                currencies,
                vehicleTypes,
                cargoNatures,
                counterParties,
                cargoHandlingTypes
            } = await catalogService.getWizardLists()

            return {
                shipmentTypes,
                transportationTypes,
                currencies,
                vehicleTypes,
                cargoNatures,
                counterParties,
                cargoHandlingTypes
            }
        }
    })

    const [formData, setFormData] = useState<Partial<ShipmentRfpData>>({
        _shipmentType: { id: '', title: '' },
        _transportationType: { id: '', title: '' },
        _currency: { id: '', title: '' },
        express: false,
        route: [{
            address: '',
            contactPhone: '',
            arrival: '',
            departure: '',
            _counterParty: { id: '', title: '' },
            _cargoHandlingType: { id: '', title: '' },
            cargoList: [{
                number: '',
                cargoWeight: 0,
                cargoVolume: 0,
                _cargoNature: { id: '', title: '' }
            }]
        }],
        _requiredVehicleType: { id: '', title: '' },
        customRequirements: '',
        comment: '',
        innerComment: '',
        attachments: []
    })

    const handleSubmit = async (finalData: Partial<ShipmentRfpData>) => {
        try {
            // Transform data to match API format
            const submitData = {
                ...finalData,
                // Convert UI format to API format
                _shipmentType: { id: finalData._shipmentType?.id },
                _transportationType: { id: finalData._transportationType?.id },
                _currency: { id: finalData._currency?.id },
                _requiredVehicleType: { id: finalData._requiredVehicleType?.id },
                route: finalData.route?.map(point => ({
                    ...point,
                    _counterParty: { id: point._counterParty?.id },
                    _cargoHandlingType: { id: point._cargoHandlingType?.id },
                    cargoList: point.cargoList?.map(cargo => ({
                        ...cargo,
                        _cargoNature: { id: cargo._cargoNature?.id }
                    }))
                }))
            }

            await createMutation.mutateAsync(submitData as ShipmentRfpData)
            toast.success('Заявка создана успешно!')
            navigate('/shipment-rfps')
        } catch (error) {
            toast.error('Ошибка при создании заявки')
            console.error('RFP creation error:', error)
        }
    }

    if (listsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <ShipmentRfpWizard
            initialData={formData}
            lists={lists!}
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
            onCancel={() => navigate('/shipment-rfps')}
        />
    )
}

export default ShipmentRfpWizardPage