import { PencilIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import React from 'react';

import LoadingSpinner from '@/shared/ui/LoadingSpinner.tsx';
import { FormActions as FormActionsType } from '@/types';

interface Breadcrumb {
  href?: string;
  label: string;
}

interface FormHeaderProps {
  breadcrumbs?: Breadcrumb[];
  className?: string;
  formActions?: FormActionsType;
  isEditMode?: boolean;
  subtitle?: string;
  title: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  breadcrumbs,
  className = '',
  formActions,
  isEditMode = true,
  subtitle,
  title,
}) => {
  const getActionClasses = (variant?: string) => {
    const base =
      'inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';

    switch (variant) {
      case 'danger':
        return `${base} border-transparent text-white bg-red-600 hover:bg-red-700`;
      case 'success':
        return `${base} border-transparent text-white bg-green-600 hover:bg-green-700`;
      case 'outline':
        return `${base} border-gray-300 text-gray-700 bg-white hover:bg-gray-50`;
      default:
        return `${base} border-gray-300 text-gray-700 bg-white hover:bg-gray-50`;
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center">
                  {idx > 0 && <span className="mx-2 text-gray-400">/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="text-blue-600 hover:text-blue-800">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>

          {/* Form Actions */}
          {formActions && (
            <div className="flex items-center space-x-3">
              {/* Additional actions */}
              {formActions.additional?.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={getActionClasses(action.variant)}
                  disabled={action.disabled || action.loading}
                  onClick={action.onClick}
                >
                  {action.loading && <LoadingSpinner size="sm" className="mr-2" />}
                  {action.icon && <action.icon className="h-4 w-4 mr-1" />}
                  {action.label}
                </button>
              ))}

              {/* Cancel */}
              {formActions.cancel && (
                <button
                  type="button"
                  className={getActionClasses()}
                  disabled={formActions.cancel.disabled}
                  onClick={formActions.cancel.onClick}
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  {formActions.cancel.label}
                </button>
              )}

              {/* Edit/Save toggle */}
              {isEditMode
                ? formActions.save && (
                    <button
                      type="button"
                      disabled={formActions.save.disabled || formActions.save.loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      onClick={formActions.save.onClick}
                    >
                      {formActions.save.loading && <LoadingSpinner size="sm" className="mr-2" />}
                      {formActions.save.icon && <formActions.save.icon className="h-4 w-4 mr-1" />}
                      {formActions.save.label}
                    </button>
                  )
                : formActions.edit && (
                    <button
                      type="button"
                      className={getActionClasses()}
                      disabled={formActions.edit.disabled}
                      onClick={formActions.edit.onClick}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      {formActions.edit.label}
                    </button>
                  )}

              {/* Delete */}
              {formActions.delete && (
                <button
                  type="button"
                  className={getActionClasses('danger')}
                  disabled={formActions.delete.disabled || formActions.delete.loading}
                  onClick={formActions.delete.onClick}
                >
                  {formActions.delete.loading && <LoadingSpinner size="sm" className="mr-2" />}
                  <TrashIcon className="h-4 w-4 mr-1" />
                  {formActions.delete.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
