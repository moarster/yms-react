import {
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { TruckIcon } from '@phosphor-icons/react';
import React from 'react';

import { ShipmentRfp } from '@/features/documents/types/shipment-rfp';
import { formatters } from '@/utils/format';

interface ShipmentRfpCarrierProps {
  rfp: ShipmentRfp | null;
}

export const ShipmentRfpCarrier: React.FC<ShipmentRfpCarrierProps> = ({ rfp }) => {
  const data = rfp?.data;
  const actualCarrier = data?.actualCarrier;
  const letterOfAttorney = data?.letterOfAttorney;

  if (!data?._carrier && !actualCarrier) {
    return (
      <Paper bg="gray.0" p="xl">
        <Group justify="center">
          <Stack align="center" gap="sm">
            <TruckIcon size={48} color="var(--mantine-color-gray-5)" />
            <Text c="dimmed">No carrier information available</Text>
          </Stack>
        </Group>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      {/* Assigned Carrier */}
      {data._carrier && (
        <Paper withBorder p="md">
          <Stack gap="md">
            <Text fw={500} size="lg">Assigned Carrier</Text>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Carrier Name"
                  value={data._carrier.title || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Driver"
                  value={data._driver?.title || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Vehicle"
                  value={data._vehicle?.title || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Driver Phone"
                  value={data.driverContactPhone ? formatters.phone(data.driverContactPhone) : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Trailer Number"
                  value={data.trailerNumber || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      )}

      {/* Actual Carrier Details */}
      {actualCarrier && (
        <Paper withBorder p="md">
          <Stack gap="md">
            <Text fw={500} size="lg">Actual Carrier</Text>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Name"
                  value={actualCarrier.name || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="INN"
                  value={actualCarrier.taxIdentificationNumber || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Phone"
                  value={actualCarrier.phone ? formatters.phone(actualCarrier.phone) : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Request Number"
                  value={actualCarrier.requestNumber || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Request Date"
                  value={actualCarrier.requestDate ? formatters.date(actualCarrier.requestDate) : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TextInput
                  label="Legal Address"
                  value={actualCarrier.legalAddress || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      )}

      {/* Letter of Attorney */}
      {letterOfAttorney && (
        <Paper withBorder p="md">
          <Stack gap="md">
            <Text fw={500} size="lg">Letter of Attorney</Text>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Number"
                  value={letterOfAttorney.number || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Date"
                  value={letterOfAttorney.date ? formatters.date(letterOfAttorney.date) : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 12, md: 8, lg: 6, xl: 4.8 }}>
                <TextInput
                  label="Issued By"
                  value={letterOfAttorney.issuedBy || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      )}

      {/* Vehicle Details */}
      {(data?.vehicleWeight || data?.trailerWeight) && (
        <Paper withBorder p="md">
          <Stack gap="md">
            <Text fw={500} size="lg">Vehicle Details</Text>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Vehicle Weight (kg)"
                  value={data.vehicleWeight ? formatters.weight(data.vehicleWeight) : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Trailer Weight (kg)"
                  value={data.trailerWeight ? formatters.weight(data.trailerWeight) : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Vehicle Affiliation"
                  value={data._vehicleAffiliation?.title || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <TextInput
                  label="Axle Load"
                  value={data.permissibleAxleLoad || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};