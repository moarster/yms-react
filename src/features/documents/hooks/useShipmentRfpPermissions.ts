import { useMemo } from 'react';

import { User, userHasRole } from '@/core/auth/types.ts';
import { ShipmentRfp } from '@/features/documents/types/shipment-rfp.ts';

export const useShipmentRfpPermissions = (
  rfp: null | ShipmentRfp,
  user: null | User,
  isCreating: boolean,
) => {
  const canEdit = useMemo(() => {
    if (!rfp || !user) return isCreating;
    if (userHasRole(user, 'ADMIN')) return true;

    switch (rfp.status) {
      case 'DRAFT':
        return rfp.createdBy === user.id;
      case 'ASSIGNED':
        return (
          userHasRole(user, 'LOGIST') ||
          (userHasRole(user, 'CARRIER') && rfp?.data?._carrier?.id === user?.organization?.id)
        );
      default:
        return false;
    }
  }, [rfp, user, isCreating]);

  const canPublish = useMemo(() => {
    return rfp?.status === 'DRAFT' && userHasRole(user, 'LOGIST');
  }, [rfp, user]);

  const canCancel = useMemo(() => {
    return ['NEW', 'ASSIGNED'].includes(<string>rfp?.status) && userHasRole(user, 'LOGIST');
  }, [rfp, user]);

  return { canCancel, canEdit, canPublish };
};
