import { UsersIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';

import type { SidebarSection } from '@/types/form.ts';

import { ShipmentRfp } from '@/features/documents/types/shipment-rfp.ts';

interface UseShipmentRfpSidebarProps {
  rfp: ShipmentRfp;
}

export const useShipmentRfpSidebar = ({ rfp }: UseShipmentRfpSidebarProps) => {
  const sidebarSections: SidebarSection[] = useMemo(() => {
    if (!rfp) return [];

    const sections: SidebarSection[] = [
      {
        items: [
          {
            label: 'Current Status',
            type: 'status',
            value: rfp.status,
          },
        ],
        title: 'Status',
      },
    ];

    if (rfp.data?._carrier) {
      sections.push({
        icon: UsersIcon,
        items: [
          {
            label: 'Assigned Carrier',
            value: rfp.data._carrier.name,
          },
        ],
        title: 'Assignment',
      });
    }

    if (rfp.createdBy) {
      sections.push({
        items: [
          {
            label: 'Creator',
            value: rfp.createdBy.name || rfp.createdBy.email,
          },
          {
            label: 'Created At',
            value: new Date(rfp.createdAt).toLocaleDateString(),
          },
        ],
        title: 'Created By',
      });
    }

    // Add rates if any
    if (rfp.bids && rfp.bids.length > 0) {
      sections.push({
        items: rfp.bids.map((rate: object, idx: number) => ({
          label: `Rate ${idx + 1}`,
          value: `${rate.amount} ${rate.currency}`,
        })),
        title: 'Submitted Rates',
      });
    }

    return sections;
  }, [rfp]);

  return { sidebarSections };
};
