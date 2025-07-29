import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import {documentService} from "@/services/documentService.ts";
import {schemaService} from "@/services/schemaService.ts";
import { useAuthStore } from '@/stores/authStore'
import {ShipmentRfp} from "@/types";

export const useShipmentRfpDetail = () => {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()
    const { user } = useAuthStore()
    const [formData, setFormData] = useState<object>({})
    const [isEditMode, setIsEditMode] = useState(false)
    const isCreating = id === 'new'

    // Queries
    const rfpQuery = useQuery({
        queryKey: ['rfp', id],
        queryFn: () => documentService.getShipmentRfp(id!),
        enabled: !isCreating
    })

    const schemaQuery = useQuery({
        queryKey: ['shipment-rfp-schema'],
        queryFn: () => schemaService.getAnySchema('shipment-rfp')
    })

    // Mutations
    const createMutation = useMutation({
        mutationFn: documentService.createShipmentRfp,
        onSuccess: () => {
            toast.success('RFP created successfully')
            queryClient.invalidateQueries({ queryKey: ['shipment-rfps'] })
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: ShipmentRfp }) =>
            documentService.updateShipmentRfp(id, data),
        onSuccess: () => {
            toast.success('RFP updated successfully')
            queryClient.invalidateQueries({ queryKey: ['rfp', id] })
        }
    })

    return {
        id,
        isCreating,
        formData,
        setFormData,
        isEditMode,
        setIsEditMode,
        rfp: rfpQuery.data,
        schema: schemaQuery.data,
        isLoading: rfpQuery.isLoading || schemaQuery.isLoading,
        createMutation,
        updateMutation,
        user
    }
}