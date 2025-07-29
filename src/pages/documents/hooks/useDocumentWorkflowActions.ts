import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { documentService } from '@/services/documentService'

interface UseDocumentWorkflowActionsProps {
    documentId: string
    documentType: string
    onSuccess?: (action: string) => void
}

export const useDocumentWorkflowActions = ({
                                               documentId,
                                               documentType,
                                               onSuccess
                                           }: UseDocumentWorkflowActionsProps) => {
    const queryClient = useQueryClient()

    const publishMutation = useMutation({
        mutationFn: () => documentService.publishDocument(documentId),
        onSuccess: () => {
            toast.success('Document published successfully')
            queryClient.invalidateQueries({ queryKey: [documentType, documentId] })
            onSuccess?.('publish')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to publish document')
        }
    })

    const assignMutation = useMutation({
        mutationFn: (carrierId: string) => documentService.assignCarrier(documentId, carrierId),
        onSuccess: () => {
            toast.success('Carrier assigned successfully')
            queryClient.invalidateQueries({ queryKey: [documentType, documentId] })
            onSuccess?.('assign')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to assign carrier')
        }
    })

    const completeMutation = useMutation({
        mutationFn: () => documentService.completeDocument(documentId),
        onSuccess: () => {
            toast.success('Document completed successfully')
            queryClient.invalidateQueries({ queryKey: [documentType, documentId] })
            onSuccess?.('complete')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to complete document')
        }
    })

    const cancelMutation = useMutation({
        mutationFn: () => documentService.executeAction(documentId, 'cancel'),
        onSuccess: () => {
            toast.success('Document cancelled successfully')
            queryClient.invalidateQueries({ queryKey: [documentType, documentId] })
            onSuccess?.('cancel')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to cancel document')
        }
    })

    return {
        publish: publishMutation.mutate,
        assign: assignMutation.mutate,
        complete: completeMutation.mutate,
        cancel: cancelMutation.mutate,
        isPublishing: publishMutation.isPending,
        isAssigning: assignMutation.isPending,
        isCompleting: completeMutation.isPending,
        isCancelling: cancelMutation.isPending
    }
}