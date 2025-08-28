import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createShipmentRfpData, ShipmentRfpData } from '@/features/documents/types/shipment-rfp.ts';
import ShipmentRfpWizard from '@/features/documents/components/ShipmentRfpWizard.tsx';

import { useShipmentRfpMutations } from '../hooks/useShipmentRfpMutations.ts';

const ShipmentRfpWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { createMutation } = useShipmentRfpMutations();

  const [formData] = useState<Partial<ShipmentRfpData>>(createShipmentRfpData());

  const handleSubmit = async (finalData: ShipmentRfpData) => {
    try {
      await createMutation.mutateAsync(finalData);
      notifications.show({
        color: 'green',
        message: 'Заявка создана успешно!',
      });
      navigate('/shipment-rfps');
    } catch (error) {
      notifications.show({
        color: 'red',
        message: 'Ошибка при создании заявки',
      });
      console.error('RFP creation error:', error);
    }
  };


  return (
    <ShipmentRfpWizard
      initialData={formData}
      isSubmitting={createMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/shipment-rfps')}
    />
  );
};

export default ShipmentRfpWizardPage;
