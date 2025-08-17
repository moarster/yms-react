import { WarningIcon } from '@phosphor-icons/react';
import React from 'react';

interface ErrorMessageProps {
  className?: string;
  message: string;
  onRetry?: () => void;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className,
  message,
  onRetry,
  title = 'Error',
}) => {
  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <WarningIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                className="btn bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500"
                onClick={onRetry}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
