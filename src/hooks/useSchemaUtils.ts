import { isLinkDefinition, JsonSchema, JsonSchemaProperty, LinkDefinition } from '@/types';


/**
 * A set of utility functions for working with schemas.
 */
export const useSchemaUtils = (schema: JsonSchema) => {
  const getPropertyDefinition = (propertyKey: string): JsonSchemaProperty | undefined => {
    if (!schema) return undefined;
    if (propertyKey.search(/\//) < 0) return schema!.properties?.[propertyKey];

    return propertyKey
      .split('/')
      .slice(1)
      .reduce<JsonSchemaProperty | undefined>((acc, key) => {
        if (!acc) return undefined;
        if (acc.properties) return acc.properties[key];
        if (acc.items?.properties) return acc.items.properties[key];
        return undefined;
      }, schema as JsonSchemaProperty);
  };

  const getLinkDefinition = (propertyKey: string): LinkDefinition | undefined => {
    const linkDef = getPropertyDefinition(propertyKey);
    if (!linkDef || !isLinkDefinition(linkDef)) return undefined;
    return linkDef;
  }

  return {
    schema,
    getPropertyDefinition,
    getLinkDefinition,
  };
};
