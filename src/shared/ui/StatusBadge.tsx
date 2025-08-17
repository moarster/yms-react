import clsx from 'clsx';
import React from 'react';

interface StatusBadgeProps {
  size?: 'lg' | 'md' | 'sm';
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ size = 'md', status }) => {
  const statusConfig = {
    ASSIGNED: {
      className: 'status-assigned',
      label: 'Assigned',
    },
    CANCELLED: {
      className: 'status-cancelled',
      label: 'Cancelled',
    },
    COMPLETED: {
      className: 'status-completed',
      label: 'Completed',
    },
    DRAFT: {
      className: 'status-draft',
      label: 'NEW',
    },
  };

  const sizeClasses = {
    lg: 'px-3 py-1 text-sm',
    md: 'px-2.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
  };

  const config = statusConfig[status];
  if (!config) {
    return null;
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        config.className,
        sizeClasses[size],
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
