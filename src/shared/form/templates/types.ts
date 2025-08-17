import { JsonSchema } from '@/services/schemaService.ts';

export interface FieldTemplateProps {
  children: React.ReactNode;
  disabled?: boolean;
  errors?: string;
  formData?: object;
  help?: string;
  id: string;
  label: string;
  name?: string;
  onChange: (value: object) => void;
  required?: boolean;
  schema: JsonSchema;
}

export interface FieldLayoutConfig {
  labelClass: string;
  wrapperClass: string;
}
