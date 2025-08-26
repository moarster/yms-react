import { Grid, Paper, Stack } from '@mantine/core';
import React from 'react';

import { ShipmentRfp } from '@/features/documents/types/shipment-rfp';
import { InputLayout } from '@/features/documents/pages/components/types.ts';
import { InputFactory } from '@/shared/ui/inputs/InputFactory.tsx';
import { JsonSchema } from '@/types';
import { useSchemaUtils } from '@/hooks/useSchemaUtils.ts';

interface ShipmentRfpInfoProps {
  rfp: ShipmentRfp | null;
  schema: JsonSchema;
}

const GridProperties: InputLayout[] = [
  {
    property: '_shipmentType',
    span: 6,
  },
  {
    property: '_transportationType',
    span: 6,
  },
  {
    property: 'express',
    span: 6,
  },
  {
    property: 'price',
    span: 6,
  },
  {
    property: 'customRequirements',
    span: 12,
  },
];

export const ShipmentRfpInfo: React.FC<ShipmentRfpInfoProps> = ({ rfp, schema }) => {
  const data = rfp?.data;
  const { getPropertyDefinition } = useSchemaUtils(schema);

  return (
    <Paper withBorder p="md">
      <Stack gap="md">
        <Grid>
          {GridProperties.map((input) => {
            const propertySchema = getPropertyDefinition(input.property);
            if (!propertySchema) {
              return null;
            }
            return (
              <Grid.Col span={input.span}>
                <InputFactory
                  value={data ? data[input.property] : undefined}
                  key={input.property}
                  schema={propertySchema}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>
    </Paper>
  );
};
