import clsx from 'clsx'
import React from 'react'

interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'md' | 'lg'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const statusConfig = {
        DRAFT: {
            label: 'NEW',
            className: 'status-draft',
        },
        ASSIGNED: {
            label: 'Assigned',
            className: 'status-assigned',
        },
        COMPLETED: {
            label: 'Completed',
            className: 'status-completed',
        },
        CANCELLED: {
            label: 'Cancelled',
            className: 'status-cancelled',
        },
    }

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
    }

    const config = statusConfig[status]
    if (!config) {
        return null
    }

    return (
        <span
            className={clsx(
                'inline-flex items-center font-medium rounded-full',
                config.className,
                sizeClasses[size]
            )}
        >
      {config.label}
    </span>
    )
}

export default StatusBadge