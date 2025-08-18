import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { catalogService } from '@/features/catalogs/catalogService.ts';
import { createShipmentRfpData, ShipmentRfpData } from '@/features/documents/types/shipment-rfp.ts';
import ShipmentRfpWizard from '@/features/documents/wizards/ShipmentRfpWizard.tsx';

import { useShipmentRfpMutations } from '../hooks/useShipmentRfpMutations.ts';

const ShipmentRfpWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { createMutation } = useShipmentRfpMutations();

  const [formData] = useState<Partial<ShipmentRfpData>>(createShipmentRfpData());

  // Fetch all required reference data
  const { data: lists, isLoading: listsLoading } = useQuery({
    queryFn: async () => {
      const {
        cargoHandlingTypes,
        cargoNatures,
        counterParties,
        currencies,
        shipmentTypes,
        transportationTypes,
        vehicleTypes,
      } = await catalogService.getWizardLists();

      return {
        cargoHandlingTypes,
        cargoNatures,
        counterParties,
        currencies,
        shipmentTypes,
        transportationTypes,
        vehicleTypes,
      };
    },
    queryKey: ['rfp-wizard-lists'],
  });

  const handleSubmit = async (finalData: ShipmentRfpData) => {
    try {
      await createMutation.mutateAsync(finalData);
      toast.success('Заявка создана успешно!');
      navigate('/shipment-rfps');
    } catch (error) {
      toast.error('Ошибка при создании заявки');
      console.error('RFP creation error:', error);
    }
  };

  if (listsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <ShipmentRfpWizard
      lists={lists!}
      initialData={formData}
      isSubmitting={createMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/shipment-rfps')}
    />
  );
};

export default ShipmentRfpWizardPage;
