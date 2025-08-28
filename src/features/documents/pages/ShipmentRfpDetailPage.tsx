import React from 'react';
import { useParams } from 'react-router-dom';

import { ShipmentRfpWorkflowContainer } from '@/features/documents/containers/ShipmentRfpWorkflowContainer';
import ErrorMessage from '@/shared/ui/ErrorMessage';

const ShipmentRfpDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <ErrorMessage message="Invalid document ID" />;
  }

  return <ShipmentRfpWorkflowContainer srfpId={id} />;
};

export default ShipmentRfpDetailPage;