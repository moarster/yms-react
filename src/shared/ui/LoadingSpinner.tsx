import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'lg' | 'md' | 'sm' | 'xl';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size = 'md', text }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'h-12 w-12';
      case 'sm':
        return 'h-4 w-4';
      case 'xl':
        return 'h-16 w-16';
      default:
        return 'h-8 w-8';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${getSizeClasses()}`}
      />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
