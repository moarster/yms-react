import React from 'react';

import LoadingSpinner from '@/shared/ui/LoadingSpinner.tsx';
import { WorkflowTask } from '@/types/form.ts';

interface WorkflowTasksFooterProps {
  className?: string;
  tasks?: WorkflowTask[];
}

export const WorkflowTasksFooter: React.FC<WorkflowTasksFooterProps> = ({
  className = '',
  tasks = [],
}) => {
  if (!tasks.length) return null;

  const getTaskClasses = (variant?: string) => {
    const base =
      'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';

    switch (variant) {
      case 'primary':
        return `${base} border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
      case 'danger':
        return `${base} border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;
      case 'success':
        return `${base} border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`;
      case 'secondary':
      default:
        return `${base} border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500`;
    }
  };

  const handleTaskClick = (task: WorkflowTask) => {
    task.onClick();
  };

  return (
    <>
      <div className={`bg-gray-50 border-t border-gray-200 px-6 py-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Available workflow actions</div>
          <div className="flex items-center space-x-3">
            {tasks.map((task, idx) => (
              <button
                key={idx}
                type="button"
                className={getTaskClasses(task.variant)}
                disabled={task.disabled || task.loading}
                onClick={() => handleTaskClick(task)}
              >
                {task.loading && <LoadingSpinner size="sm" className="mr-2" />}
                {task.icon && <task.icon className="h-4 w-4 mr-1" />}
                {task.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
