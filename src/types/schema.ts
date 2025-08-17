export interface JsonSchema {
  $id?: string;
  $schema?: string;
  additionalProperties?: boolean;
  allOf?: JsonSchema[];
  description?: string;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  title?: string;
  type: string;
}

export interface JsonSchemaProperty {
  description?: string;
  enum?: (number | string)[];
  examples?: object[];
  format?: string;
  items?: JsonSchemaProperty;
  maximum?: number;
  maxLength?: number;
  minimum?: number;
  minLength?: number;
  pattern?: string;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  title?: string;
  type: string;
  'x-cell-editor'?: string;
  'x-cell-renderer'?: string;
  'x-table-editable'?: boolean;
  'x-table-filterable'?: boolean;
  'x-table-hidden'?: boolean;
  'x-table-readonly'?: boolean;
  'x-table-sortable'?: boolean;
  // UI hints for table generation
  'x-table-width'?: number;
}
