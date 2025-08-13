import {  useQuery} from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuthStore } from '@/core/store/authStore.ts'
import {documentService} from "@/features/documents/documentService.ts";
import {useShipmentRfpMutations} from "@/features/documents/hooks/useShipmentRfpMutations.ts";
import {schemaService} from "@/services/schemaService.ts";


export const useShipmentRfpDetail = () => {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuthStore()
    const [formData, setFormData] = useState<object>({})
    const [isEditMode, setIsEditMode] = useState(false)
    const isCreating = id === 'new'

    const { createMutation, updateMutation } = useShipmentRfpMutations()
    
    const rfpQuery = useQuery({
        queryKey: ['rfp', id],
        queryFn: () => documentService.getShipmentRfp(id!),
        enabled: !isCreating
    })

    const schemaQuery = useQuery({
        queryKey: ['shipment-rfp-schema'],
        queryFn: () => schemaService.getAnySchema('shipment-rfp')
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