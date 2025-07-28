import { useMemo } from 'react'
import { UsersIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import type { SidebarSection } from '@/types/form'

export const useShipmentRfpSidebar = (rfp: any, canPublish: boolean, canCancel: boolean) => {
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

        return sections
    }, [rfp])

    const actions = useMemo(() => {
        const actionList = []

        if (canPublish) {
            actionList.push({
                label: 'Publish RFP',
                icon: CheckCircleIcon,
                variant: 'primary' as const,
                onClick: () => {/* publish logic */}
            })
        }

        if (canCancel) {
            actionList.push({
                label: 'Cancel RFP',
                icon: XCircleIcon,
                variant: 'danger' as const,
                onClick: () => {/* cancel logic */}
            })
        }

        return actionList
    }, [canPublish, canCancel])

    return { sidebarSections, actions }
}