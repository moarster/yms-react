import React from 'react';
import { RenderEditCellProps } from 'react-data-grid';

import { TableRow } from '@/shared/ui/DataGridTable/types';
import { JsonSchemaProperty } from '@/types';

import {
  BooleanEditor,
  DateEditor,
  NumberEditor,
  SelectEditor,
  SwitchEditor,
  TextareaEditor,
  TextEditor,
} from './editors';

export type EditorType = 'boolean' | 'date' | 'number' | 'select' | 'switch' | 'text' | 'textarea';

export interface EditorConfig {
  options?: Array<{ value: number | string; label: string }> | number[] | string[];
  type: EditorType;
}

// Factory to create editor based on schema property
export function createEditor(
  property: JsonSchemaProperty,
): React.FC<RenderEditCellProps<TableRow>> {
  // Check for custom editor hint
  if (property['x-cell-editor']) {
    return createEditorByType(property['x-cell-editor'] as EditorType, property);
  }

  // Determine editor based on property type and format
  switch (property.type) {
    case 'boolean':
      return BooleanEditor;

    case 'integer':
    case 'number':
      return NumberEditor;

    case 'string':
      // Check for enum (select)
      /*if (property.enum && property.enum.length > 0) {
        return (props: RenderEditCellProps<TableRow>) => (
          <SelectEditor {...props} options={property.enum!} />
      );
      }*/

      // Check for date format
      if (property.format === 'date' || property.format === 'date-time') {
        return DateEditor;
      }

      // Check for long text
      if (property.maxLength && property.maxLength > 100) {
        return TextareaEditor;
      }

      // Default to text editor
      return TextEditor;

    case 'array':
      // Could implement a multi-select or tag input here
      return TextEditor;

    case 'object':
      // Could implement a JSON editor here
      return TextEditor;

    default:
      return TextEditor;
  }
}

// Create editor by explicit type
function createEditorByType(
  type: EditorType,
  property: JsonSchemaProperty,
): React.FC<RenderEditCellProps<TableRow>> {
  switch (type) {
    case 'text':
      return TextEditor;
    case 'textarea':
      return TextareaEditor;
    case 'number':
      return NumberEditor;
    case 'boolean':
      return BooleanEditor;
    case 'switch':
      return SwitchEditor;
    /*    case 'select':
      return (props: RenderEditCellProps<TableRow>) => (
        <SelectEditor {...props} options={property.enum || []} />
    );*/
    case 'date':
      return DateEditor;
    default:
      return TextEditor;
  }
}

// Registry object for backward compatibility
export const editorRegistry = {
  boolean: BooleanEditor,
  // Factory method
  create: createEditor,
  date: DateEditor,
  number: NumberEditor,
  select: SelectEditor,
  switch: SwitchEditor,
  text: TextEditor,

  textarea: TextareaEditor,

  /*
  withOptions: (editor: EditorType, options: any[]) => {
    return (props: RenderEditCellProps<TableRow>) => {
      const Editor = editorRegistry[editor] as any;
      return <Editor {...props} options={options} />;
    };
  },*/
};
