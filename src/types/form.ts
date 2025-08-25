import React from 'react';
import { JsonSchema } from '@/types/schema.ts';

type IconComponent = React.ComponentType<{ className?: string }>;

export interface FormConfig {
  disabled?: boolean;
  formData?: object;
  schema: JsonSchema;
  showErrorList?: boolean;
}

export interface SidebarSection {
  content?: React.ReactNode;
  icon?: IconComponent;
  items?: Array<{ label: string; value: string; type?: string }>;
  title: string;
}

export interface CustomSection {
  content: React.ReactNode;
  icon?: IconComponent;
  id: string;
  position: 'after-form' | 'before-form';
  title: string;
}

export interface FormAction {
  disabled?: boolean;
  icon?: IconComponent;
  label: string;
  loading?: boolean;
  onClick: () => void;
}

export interface FormActions {
  additional?: Array<
    FormAction & {
      variant?: 'danger' | 'outline' | 'success';
    }
  >;
  cancel?: FormAction;
  delete?: FormAction;
  edit?: FormAction;
  save?: FormAction;
}

export interface WorkflowTask {
  disabled?: boolean;
  icon?: IconComponent;
  label: string;
  loading?: boolean;
  onClick: () => void;
  requiresConfirmation?: boolean;
  variant?: 'danger' | 'primary' | 'secondary' | 'success';
}

export interface CommonFormProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  // Additional customization
  className?: string;
  customSections?: CustomSection[];

  // Header - Form Actions (edit, save, cancel)
  formActions?: FormActions;
  // Form configuration
  formConfig: FormConfig;
  // Edit mode toggle
  isEditMode?: boolean;

  // Loading states
  isLoading?: boolean;
  isSubmitting?: boolean;

  onEditModeChange?: (editMode: boolean) => void;

  onFormChange: (data: object) => void;

  onFormSubmit: (data: object) => void;
  // Layout customization
  sidebarSections?: SidebarSection[];

  subtitle?: string;
  title: string;

  // Footer - Workflow Tasks (publish, assign, etc.)
  workflowTasks?: WorkflowTask[];
}
