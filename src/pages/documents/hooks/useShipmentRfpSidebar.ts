import { useMemo } from 'react'
import { UsersIcon } from '@heroicons/react/24/outline'
import type { SidebarSection } from '@/types/form'

interface UseShipmentRfpSidebarProps {
    rfp: any
}

export const useShipmentRfpSidebar = ({ rfp }: UseShipmentRfpSidebarProps) => {

    const sidebarSections: SidebarSection[] = useMemo(() => {
        if (!rfp) return []

        const sections: SidebarSection[] = [
            {
                title: 'Status',
                items: [
                    {
                        label: 'Current Status',
                        value: rfp.status,
                        type: 'status'
                    }
                ]
            }
        ]

        if (rfp.data?._carrier) {
            sections.push({
                title: 'Assignment',
                icon: UsersIcon,
                items: [
                    {
                        label: 'Assigned Carrier',
                        value: rfp.data._carrier.name
                    }
                ]
            })
        }

        if (rfp.createdBy) {
            sections.push({
                title: 'Created By',
                items: [
                    {
                        label: 'Creator',
                        value: rfp.createdBy.name || rfp.createdBy.email
                    },
                    {
                        label: 'Created At',
                        value: new Date(rfp.createdAt).toLocaleDateString()
                    }
                ]
            })
        }

        // Add rates if any
        if (rfp.rates && rfp.rates.length > 0) {
            sections.push({
                title: 'Submitted Rates',
                items: rfp.rates.map((rate: any, idx: number) => ({
                    label: `Rate ${idx + 1}`,
                    value: `${rate.amount} ${rate.currency}`
                }))
            })
        }

        return sections
    }, [rfp])

    return { sidebarSections }
}

