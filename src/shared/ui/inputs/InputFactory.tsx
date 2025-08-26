import {
  TextInput,
  NumberInput,
  DateInput,
  ReferenceInput,
  FileUpload,
  ChipInput,
  BaseInputProps,
} from '.';
import React from 'react';
import { JsonSchemaProperty, JsonSchemaPropertyConfig, PropertyValue } from '@/types';
import { InputType } from '@/shared/ui/inputs/types.ts';

const inputRegistry: Record<InputType, React.FC<BaseInputProps>> = {
  text: TextInput,
  number: NumberInput,
  chip: ChipInput,
  date: DateInput,
  file: FileUpload,
  ref: ReferenceInput,
};

interface InputFactoryProps {
  key: string;
  schema: JsonSchemaProperty & { config: JsonSchemaPropertyConfig };
  value?:PropertyValue;
}

export const InputFactory: React.FC<InputFactoryProps> = ({ key, schema, value }) => {
  const { config, title } = schema;

  const Component = inputRegistry[config.inputType] ?? TextInput;

  return <Component value={value} label={title ?? key} propertyDef={schema} />;
};
