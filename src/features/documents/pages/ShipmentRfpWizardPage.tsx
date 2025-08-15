import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import {catalogService} from "@/features/catalogs/catalogService.ts";
import {createShipmentRfpData, ShipmentRfpData} from "@/features/documents/types/shipment-rfp.ts";
import ShipmentRfpWizard from '@/features/documents/wizards/ShipmentRfpWizard.tsx'

import { useShipmentRfpMutations } from '../hooks/useShipmentRfpMutations.ts'

const ShipmentRfpWizardPage: React.FC = () => {
    const navigate = useNavigate()
    const { createMutation } = useShipmentRfpMutations()

    const [formData] = useState<Partial<ShipmentRfpData>>(createShipmentRfpData())

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


    const handleSubmit = async (finalData: ShipmentRfpData) => {
        try {


            await createMutation.mutateAsync(finalData)
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