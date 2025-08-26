import {
  isLinkDefinition,
  JsonSchema,
  JsonSchemaProperty,
  LinkDefinition,
  PreparedJsonSchemaProperty,
} from '@/types';
import { InputType } from '@/shared/ui/inputs/types.ts';

/**
 * A set of utility functions for working with schemas.
 */
export const useSchemaUtils = (schema: JsonSchema) => {
  const getPropertyDefinition = (
    propertyKey: string,
  ): PreparedJsonSchemaProperty | undefined => {
    if (!schema) return undefined;

    const preparedPropertyDef =
      propertyKey.search(/\//) < 0
        ? schema!.properties?.[propertyKey]
        : propertyKey
            .split('/')
            .slice(1)
            .reduce<JsonSchemaProperty | undefined>((acc, key) => {
              if (!acc) return undefined;
              if (acc.properties) return acc.properties[key];
              if (acc.items?.properties) return acc.items.properties[key];
              return undefined;
            }, schema as JsonSchemaProperty);

    if (preparedPropertyDef) {
      preparedPropertyDef.config = {
        pointer: propertyKey,
        inputType: getInputType(preparedPropertyDef),
      };
      return preparedPropertyDef as PreparedJsonSchemaProperty;
    }
    return undefined;
  };

  const getLinkDefinition = (propertyKey: string): LinkDefinition | undefined => {
    const linkDef = getPropertyDefinition(propertyKey);
    if (!linkDef || !isLinkDefinition(linkDef)) return undefined;
    return linkDef;
  };

  const getInputType = (propertyDef: JsonSchemaProperty): InputType => {
    switch (propertyDef.type) {
      case 'string':
        return propertyDef.enum ? 'select' : 'text';
      case 'number':
        return 'number';
      case 'boolean':
        return 'chip';
      case 'object':
        if (isLinkDefinition(propertyDef)) return 'ref';
      default:
        return 'text';
    }
  }

  return {
    schema,
    getPropertyDefinition,
    getLinkDefinition,
  };
};
