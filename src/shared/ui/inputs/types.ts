import { PreparedJsonSchemaProperty, PropertyValue } from '@/types';

export interface BaseInputProps {
  propertyDef: PreparedJsonSchemaProperty;
  className?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  value?: PropertyValue;
  onChange?: (value: PropertyValue) => void;
}

export type InputType = 'text' | 'number' | 'chip' | 'select' | 'ref' | 'textarea';