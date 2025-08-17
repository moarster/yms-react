import React from 'react';

interface InputErrorProps {
  className?: string;
  error?: string;
}

export const InputError: React.FC<InputErrorProps> = ({
  className = 'mt-1 text-sm text-red-600',
  error,
}) => (error ? <p className={className}>{error}</p> : null);
