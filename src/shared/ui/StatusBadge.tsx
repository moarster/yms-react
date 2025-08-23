import React from 'react';

interface StatusBadgeProps {
  size?: 'lg' | 'md' | 'sm';
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ size = 'md', status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'ASSIGNED': return 'status-assigned';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      case 'DRAFT': return 'status-draft';
      default: return '';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'ASSIGNED': return 'Assigned';
      case 'CANCELLED': return 'Cancelled';
      case 'COMPLETED': return 'Completed';
      case 'DRAFT': return 'NEW';
      default: return status;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'lg': return 'px-3 py-1 text-sm';
      case 'sm': return 'px-2 py-0.5 text-xs';
      default: return 'px-2.5 py-0.5 text-xs';
    }
  };

  if (!getStatusClasses()) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${getStatusClasses()} ${getSizeClasses()}`}
    >
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;