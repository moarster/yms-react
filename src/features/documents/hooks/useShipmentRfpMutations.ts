import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { documentService } from '@/features/documents/documentService.ts';
import { ShipmentRfp, ShipmentRfpData } from '@/features/documents/types/shipment-rfp.ts';

export const useShipmentRfpMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ShipmentRfpData) => documentService.createShipmentRfp(data),
    onError: (error) => {
      notifications.show({
        color: 'red',
        message: 'Error creating RFP',
      });
      console.error('RFP creation error:', error);
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: 'RFP created successfully',
      });

      queryClient.invalidateQueries({ queryKey: ['shipment-rfps'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { id: string; data: ShipmentRfp }) =>
      documentService.updateShipmentRfp(id, data),
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: 'RFP updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['rfp'] });
    },
  });

  return { createMutation, updateMutation };
};
