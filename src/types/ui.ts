export type NotificationType = 'error' | 'info' | 'success' | 'warning';
export type ButtonVariant = 'danger' | 'ghost' | 'outline' | 'primary' | 'secondary';
export type InputVariant = 'default' | 'error' | 'success';

export interface NotificationAction {
  action: () => void;
  label: string;
  variant?: ButtonVariant;
}

export interface Notification {
  actions?: NotificationAction[];
  data?: Record<string, unknown>;
  duration?: number;
  id: string;
  message: string;
  persistent?: boolean;
  read: boolean;
  timestamp: string;
  title: string;
  type: NotificationType;
}

// Table types
export interface TableColumn<T = unknown> {
  align?: 'center' | 'left' | 'right';
  key: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  title: string;
  width?: string;
}

export interface TableAction<T = unknown> {
  action: (item: T) => void;
  condition?: (item: T) => boolean;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: ButtonVariant;
}

// Form types
export interface FormField {
  disabled?: boolean;
  label: string;
  name: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  type: 'date' | 'email' | 'file' | 'multiselect' | 'password' | 'select' | 'text' | 'textarea';
  validation?: Record<string, unknown>;
}

// Modal types
export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'full' | 'lg' | 'md' | 'sm' | 'xl';
  title?: string;
}
