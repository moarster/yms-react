import { useQuery } from '@tanstack/react-query';
import { schemaService } from '@/services/schemaService.ts';
import { isLinkDefinition, JsonSchemaProperty, LinkDefinition } from '@/types';

interface UseSchemaParams {
  entityKey: string;
  enabled?: boolean;
}

/**
 * A set of utility functions for working with schemas.
 */
export const useSchema = ({ entityKey, enabled = true }: UseSchemaParams) => {
  const {
    data: schema,
    isLoading,
    error,
  } = useQuery({
    enabled,
    queryFn: () => schemaService.getAnySchema(entityKey!),
    queryKey: ['catalog-schema', entityKey],
  });

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
    isLoading,
    error,
  };
};
