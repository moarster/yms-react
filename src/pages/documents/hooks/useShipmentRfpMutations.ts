import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { documentService } from '@/services/documentService.ts'
import { ShipmentRfp, ShipmentRfpData } from '@/types'

export const useShipmentRfpMutations = () => {
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: (data: ShipmentRfpData) => documentService.createShipmentRfp(data),
        onSuccess: () => {
            toast.success('RFP created successfully')
            queryClient.invalidateQueries({ queryKey: ['shipment-rfps'] })
        },
        onError: (error) => {
            toast.error('Error creating RFP')
            console.error('RFP creation error:', error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: ShipmentRfp }) =>
            documentService.updateShipmentRfp(id, data),
        onSuccess: () => {
            toast.success('RFP updated successfully')
            queryClient.invalidateQueries({ queryKey: ['rfp'] })
        }
    })

    return { createMutation, updateMutation }
}