import {
    XCircleIcon,
    PaperAirplaneIcon,
    UserGroupIcon,
    DocumentCheckIcon,
    UsersIcon
} from '@heroicons/react/24/outline'

export const SHIPMENT_RFP_WORKFLOW_TASKS = [
    {
        action: 'publish',
        label: 'Publish RFP',
        icon: PaperAirplaneIcon,
        variant: 'primary' as const,
        requiresConfirmation: true,
        allowedStatuses: ['NEW' as const],
        requiredPermissions: ['RFP_PUBLISH']
    },
    {
        action: 'assign',
        label: 'Assign Carrier',
        icon: UserGroupIcon,
        variant: 'secondary' as const,
        allowedStatuses: ['NEW' as const, 'PUBLISHED' as const],
        requiredPermissions: ['RFP_ASSIGN']
    },
    {
        action: 'complete',
        label: 'Mark Complete',
        icon: DocumentCheckIcon,
        variant: 'success' as const,
        requiresConfirmation: true,
        allowedStatuses: ['ASSIGNED' as const],
        requiredPermissions: ['RFP_COMPLETE']
    },
    {
        action: 'cancel',
        label: 'Cancel RFP',
        icon: XCircleIcon,
        variant: 'danger' as const,
        requiresConfirmation: true,
        allowedStatuses: ['NEW' as const, 'PUBLISHED' as const, 'ASSIGNED' as const],
        requiredPermissions: ['RFP_CANCEL']
    }
]

export const SHIPMENT_RFP_SIDEBAR_SECTIONS = [
    {
        title: 'Status',
        fields: [
            { key: 'status', label: 'Current Status', type: 'status' as const }
        ]
    },
    {
        title: 'Assignment',
        icon: UsersIcon,
        fields: [
            { key: 'data._carrier.name', label: 'Assigned Carrier' }
        ],
        condition: (doc: any) => !!doc.data?._carrier
    },
    {
        title: 'Created By',
        fields: [
            { key: 'createdBy', label: 'Creator', type: 'user' as const },
            { key: 'createdAt', label: 'Created At', type: 'date' as const }
        ],
        condition: (doc: any) => !!doc.createdBy
    },
    {
        title: 'Rates',
        fields: [
            { key: 'rates.length', label: 'Submitted Rates' }
        ],
        condition: (doc: any) => doc.rates && doc.rates.length > 0
    }
]