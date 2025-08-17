import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { documentService } from '@/features/documents/documentService.ts';
import { ShipmentRfp, ShipmentRfpData } from '@/features/documents/types/shipment-rfp.ts';

export const useShipmentRfpMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ShipmentRfpData) => documentService.createShipmentRfp(data),
    onError: (error) => {
      toast.error('Error creating RFP');
      console.error('RFP creation error:', error);
    },
    onSuccess: () => {
      toast.success('RFP created successfully');
      queryClient.invalidateQueries({ queryKey: ['shipment-rfps'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { id: string; data: ShipmentRfp }) =>
      documentService.updateShipmentRfp(id, data),
    onSuccess: () => {
      toast.success('RFP updated successfully');
      queryClient.invalidateQueries({ queryKey: ['rfp'] });
    },
  });

  return { createMutation, updateMutation };
};
