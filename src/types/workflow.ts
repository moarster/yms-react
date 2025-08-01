export type DocumentStatus = 'NEW' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED' | 'PUBLISHED'

export interface UserTask {
    name: string
    elementId: string
    jobId: string
    assignee?: string
}

export interface UserTasks {
    processInstanceKey: number
    entity: string
    tasks: UserTask[]
    timestamp: number
}

export const getStatusColor = (status: DocumentStatus): string => {
    switch (status) {
        case 'NEW': return 'gray'
        case 'ASSIGNED': return 'blue'
        case 'COMPLETED': return 'green'
        case 'CANCELLED': return 'red'
        default: return 'gray'
    }
}

export const isTerminalStatus = (status: DocumentStatus): boolean =>
    status === 'COMPLETED' || status === 'CANCELLED'

export const canTransitionTo = (from: DocumentStatus, to: DocumentStatus): boolean => {
    const transitions: Record<DocumentStatus, DocumentStatus[]> = {
        NEW: ['ASSIGNED', 'CANCELLED', 'PUBLISHED'],
        ASSIGNED: ['COMPLETED', 'CANCELLED'],
        COMPLETED: [],
        CANCELLED: [],
        PUBLISHED: []
    }
    return transitions[from]?.includes(to) ?? false
}