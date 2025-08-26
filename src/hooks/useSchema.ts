import { useQuery } from '@tanstack/react-query';
import { schemaService } from '@/shared/services/schemaService.ts';

interface UseSchemaParams {
  entityKey: string;
  enabled?: boolean;
}

/**
 * A set of utility functions for retrieving schema.
 */
export const useSchema = ({ entityKey, enabled = true }: UseSchemaParams) => {
  const {
    data: schema,
    isLoading,
    error,
  } = useQuery({
    enabled,
    queryFn: () => schemaService.getAnySchema(entityKey!),
    queryKey: ['any-schema', entityKey],
  });

  return {
    schema,
    isLoading,
    error,
  };
};
