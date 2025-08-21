import { BaseLink } from '@/types/references.ts';

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

export interface LinkDefinition extends JsonSchemaProperty {
  readonly type: 'object';
  readonly properties: LinkDefinitionProperties;
}
export interface LinkDefinitionProperties extends Record<keyof BaseLink, JsonSchemaProperty>{
  readonly domain: StringConstantPropertyDefinition;
  readonly entity: StringConstantPropertyDefinition;
  readonly catalog: StringConstantPropertyDefinition;
}

export type StringConstantPropertyDefinition = JsonSchemaProperty & {
  readonly type: 'string';
  readonly const: string;
}

export function isStringConstantPropertyDefinition(
  property: JsonSchemaProperty
): property is StringConstantPropertyDefinition {
  return (
    property.type === 'string' &&
    'const' in property &&
    typeof property.const === 'string'
  );
}

export function isLinkDefinitionProperties(
  properties: Record<string, JsonSchemaProperty>
): properties is LinkDefinitionProperties {
  const requiredKeys: (keyof BaseLink)[] = ['domain', 'entity', 'catalog'];

  return requiredKeys.every(key =>
    key in properties && isStringConstantPropertyDefinition(properties[key])
  );
}

export function isLinkDefinition(
  property: JsonSchemaProperty
): property is LinkDefinition {
  return (
    property.type === 'object' &&
    'properties' in property &&
    property.properties !== undefined &&
    isLinkDefinitionProperties(property.properties)
  );
}

export function createLinkDefinition(
  domain: string,
  entity: string,
  catalog: string,
  additionalProps?: Partial<Omit<LinkDefinition, 'type' | 'properties'>>
): LinkDefinition {
  return {
    type: 'object',
    properties: {
      domain: { type: 'string', const: domain },
      entity: { type: 'string', const: entity },
      catalog: { type: 'string', const: catalog },
    },
    ...additionalProps,
  } as const;
}



export function extractLinkConstants(
  linkDef: LinkDefinition
): { domain: string; entity: string; catalog: string } {
  return {
    domain: linkDef.properties.domain.const,
    entity: linkDef.properties.entity.const,
    catalog: linkDef.properties.catalog.const,
  };
}

// Type-safe property checker
export function hasLinkProperty(
  schema: JsonSchema,
  propertyName: string
): boolean {
  return (
    schema.properties?.[propertyName] !== undefined &&
    isLinkDefinition(schema.properties[propertyName])
  );
}

// Find all link definitions in a schema
export function findLinkDefinitions(
  schema: JsonSchema
): Record<string, LinkDefinition> {
  if (!schema.properties) return {};

  return Object.fromEntries(
    Object.entries(schema.properties).filter(([_, property]) =>
      isLinkDefinition(property)
    )
  ) as Record<string, LinkDefinition>;
}
