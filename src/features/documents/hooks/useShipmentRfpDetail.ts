import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthStore } from '@/core/store/authStore.ts';
import { documentService } from '@/features/documents/documentService.ts';
import { useShipmentRfpMutations } from '@/features/documents/hooks/useShipmentRfpMutations.ts';
import { schemaService } from '@/shared/services/schemaService.ts';

export const useShipmentRfpDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<object>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const isCreating = id === 'new';

  const { createMutation, updateMutation } = useShipmentRfpMutations();

  const rfpQuery = useQuery({
    enabled: !isCreating,
    queryFn: () => documentService.getShipmentRfp(id!),
    queryKey: ['rfp', id],
  });

  const schemaQuery = useQuery({
    queryFn: () => schemaService.getAnySchema('shipment-rfp'),
    queryKey: ['shipment-rfp-schema'],
  });

  return {
    createMutation,
    formData,
    id,
    isCreating,
    isEditMode,
    isLoading: rfpQuery.isLoading || schemaQuery.isLoading,
    rfp: rfpQuery.data,
    schema: schemaQuery.data,
    setFormData,
    setIsEditMode,
    updateMutation,
    user,
  };
};
