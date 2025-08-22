import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { documentService } from '@/features/documents/documentService.ts';

interface UseDocumentWorkflowActionsProps {
  documentId: string;
  documentType: string;
  onSuccess?: (action: string) => void;
}

export const useDocumentWorkflowActions = ({
  documentId,
  documentType,
  onSuccess,
}: UseDocumentWorkflowActionsProps) => {
  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: () => documentService.publishDocument(documentId),
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message || 'Failed to publish document',
      });
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: 'Document published successfully',
      });
      queryClient.invalidateQueries({ queryKey: [documentType, documentId] });
      onSuccess?.('publish');
    },
  });

  const assignMutation = useMutation({
    mutationFn: (carrierId: string) => documentService.assignCarrier(documentId, carrierId),
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message || 'Failed to assign carrier',
      });
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: 'Carrier assigned successfully',
      });
      queryClient.invalidateQueries({ queryKey: [documentType, documentId] });
      onSuccess?.('assign');
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => documentService.completeDocument(documentId),
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message || 'Failed to complete document',
      });
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: 'Document completed successfully',
      });
      queryClient.invalidateQueries({ queryKey: [documentType, documentId] });
      onSuccess?.('complete');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => documentService.executeAction(documentId, 'cancel'),
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message || 'Failed to cancel document',
      });
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: 'Document cancelled successfully',
      });
      queryClient.invalidateQueries({ queryKey: [documentType, documentId] });
      onSuccess?.('cancel');
    },
  });

  return {
    assign: assignMutation.mutate,
    cancel: cancelMutation.mutate,
    complete: completeMutation.mutate,
    isAssigning: assignMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isCompleting: completeMutation.isPending,
    isPublishing: publishMutation.isPending,
    publish: publishMutation.mutate,
  };
};
