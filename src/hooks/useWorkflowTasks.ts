import { useMemo } from 'react'
import { WorkflowTask } from '@/types/form'
import { DocumentStatus, canTransitionTo } from '@/types/workflow'

interface WorkflowTaskConfig {
    action: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
    requiresConfirmation?: boolean
    allowedStatuses: DocumentStatus[]
    requiredPermissions: string[]
}

interface UseWorkflowTasksProps {
    document: any
    userPermissions: string[]
    userRole: string
    taskConfigs: WorkflowTaskConfig[]
    onTaskExecute: (action: string, document: any) => void
}

export const useWorkflowTasks = ({
                                     document,
                                     userPermissions,
                                     userRole,
                                     taskConfigs,
                                     onTaskExecute
                                 }: UseWorkflowTasksProps) => {

    const workflowTasks: WorkflowTask[] = useMemo(() => {
        if (!document) return []

        const currentStatus = document.status as DocumentStatus

        return taskConfigs
            .filter(config => {
                // Check if current status allows this action
                const statusAllowed = config.allowedStatuses.includes(currentStatus)

                // Check if user has required permissions
                const hasPermissions = config.requiredPermissions.every(permission =>
                    userPermissions.includes(permission)
                )

                return statusAllowed && hasPermissions
            })
            .map(config => ({
                label: config.label,
                icon: config.icon,
                variant: config.variant,
                onClick: () => onTaskExecute(config.action, document),
                requiresConfirmation: config.requiresConfirmation
            }))
    }, [document, userPermissions, userRole, taskConfigs, onTaskExecute])

    return { workflowTasks }
}