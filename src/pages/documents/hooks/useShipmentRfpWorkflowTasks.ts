import {
    DocumentCheckIcon,
    PaperAirplaneIcon,
    UserGroupIcon,
    XCircleIcon} from '@heroicons/react/24/outline'
import { useMemo } from 'react'

import {ShipmentRfp} from "@/types";
import { WorkflowTask } from '@/types/form'
import { DocumentStatus } from '@/types/workflow'

interface UseShipmentRfpWorkflowTasksProps {
    rfp: ShipmentRfp
    canPublish: boolean
    canAssign: boolean
    canComplete: boolean
    canCancel: boolean
    userRole: 'LOGIST' | 'CARRIER' | 'ADMIN'
    onPublish: () => void
    onAssign: () => void
    onComplete: () => void
    onCancel: () => void
}

export const useShipmentRfpWorkflowTasks = ({
                                                rfp,
                                                canPublish,
                                                canAssign,
                                                canComplete,
                                                canCancel,
                                                userRole,
                                                onPublish,
                                                onAssign,
                                                onComplete,
                                                onCancel
                                            }: UseShipmentRfpWorkflowTasksProps) => {

    const workflowTasks: WorkflowTask[] = useMemo(() => {
        if (!rfp) return []

        const tasks: WorkflowTask[] = []
        const status = rfp.status as DocumentStatus

        // Tasks based on document status and user permissions
        if (status === 'NEW' && canPublish) {
            tasks.push({
                label: 'Publish RFP',
                icon: PaperAirplaneIcon,
                variant: 'primary',
                onClick: onPublish,
                requiresConfirmation: true
            })
        }

        if ((status === 'NEW' || status === 'PUBLISHED') && canAssign) {
            tasks.push({
                label: 'Assign Carrier',
                icon: UserGroupIcon,
                variant: 'secondary',
                onClick: onAssign
            })
        }

        if (status === 'ASSIGNED' && canComplete && userRole === 'LOGIST') {
            tasks.push({
                label: 'Mark Complete',
                icon: DocumentCheckIcon,
                variant: 'success',
                onClick: onComplete,
                requiresConfirmation: true
            })
        }

        // Cancel is available for most statuses (but not terminal ones)
        if ((status === 'NEW' || status === 'PUBLISHED' || status === 'ASSIGNED') && canCancel) {
            tasks.push({
                label: 'Cancel RFP',
                icon: XCircleIcon,
                variant: 'danger',
                onClick: onCancel,
                requiresConfirmation: true
            })
        }

        return tasks
    }, [rfp, canPublish, canAssign, canComplete, canCancel, userRole, onPublish, onAssign, onComplete, onCancel])

    return { workflowTasks }
}