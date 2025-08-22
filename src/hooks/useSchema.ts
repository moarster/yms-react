import { useQuery } from '@tanstack/react-query';
import { schemaService } from '@/services/schemaService.ts';
import { JsonSchemaProperty } from '@/types';

interface UseSchemaParams {
  entityKey: string;
  refetch?: boolean;
}

/**
 * A set of utility functions for working with schemas.
 */
export const useSchema = ({ entityKey, refetch = true }: UseSchemaParams) => {
  const { data: schema } = useQuery({
    enabled: refetch,
    queryFn: () => schemaService.getAnySchema(entityKey!),
    queryKey: ['catalog-schema', entityKey],
  });


  const getPropertyDefinition = (propertyKey: string): JsonSchemaProperty | undefined => {
    if (propertyKey.search('/') < 1) return schema!.properties?.[propertyKey];

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

  return {
    schema,
    getPropertyDefinition,
  };
};
