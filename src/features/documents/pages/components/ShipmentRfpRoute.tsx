import {
  Badge,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { MapPinIcon, PackageIcon } from '@phosphor-icons/react';
import React from 'react';

import { ShipmentRfp } from '@/features/documents/types/shipment-rfp';
import { formatters } from '@/utils/format';

interface ShipmentRfpRouteProps {
  rfp: ShipmentRfp | null;
}

export const ShipmentRfpRoute: React.FC<ShipmentRfpRouteProps> = ({ rfp }) => {
  const route = rfp?.data?.route || [];

  if (route.length === 0) {
    return (
      <Paper bg="gray.0" p="xl">
        <Group justify="center">
          <Stack align="center" gap="sm">
            <MapPinIcon size={48} color="var(--mantine-color-gray-5)" />
            <Text c="dimmed">No route information available</Text>
          </Stack>
        </Group>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      {route.map((point, index) => (
        <Paper key={index} withBorder p="md">
          <Stack gap="md">
            {/* Route Point Header */}
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <MapPinIcon size={20} color="var(--mantine-color-blue-6)" />
                <Text fw={500} size="lg">
                  Point {index + 1}
                </Text>
              </Group>
              <Badge variant="light" color="blue">
                {point._cargoHandlingType?.title || 'Loading/Unloading'}
              </Badge>
            </Group>

            {/* Route Point Details */}
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Address"
                  value={point.address || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <TextInput
                  label="Counterparty"
                  value={point._counterParty?.title || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <TextInput
                  label="Contact Phone"
                  value={point.contactPhone || '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <TextInput
                  label="Arrival Time"
                  value={point.arrival ? new Date(point.arrival).toLocaleString() : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <TextInput
                  label="Departure Time"
                  value={point.departure ? new Date(point.departure).toLocaleString() : '-'}
                  readOnly
                  variant="filled"
                />
              </Grid.Col>
            </Grid>

            {/* Cargo Information */}
            {point.cargoList && point.cargoList.length > 0 && (
              <>
                <Divider />
                <Group gap="sm">
                  <PackageIcon size={16} color="var(--mantine-color-green-6)" />
                  <Text fw={500} size="sm">Cargo Information</Text>
                </Group>

                <Stack gap="sm">
                  {point.cargoList.map((cargo, cargoIndex) => (
                    <Paper key={cargoIndex} bg="gray.0" p="sm">
                      <Grid>
                        <Grid.Col span={3}>
                          <TextInput
                            label="Number"
                            value={cargo.number || '-'}
                            readOnly
                            size="sm"
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <TextInput
                            label="Weight (kg)"
                            value={cargo.cargoWeight ? formatters.weight(cargo.cargoWeight) : '-'}
                            readOnly
                            size="sm"
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <TextInput
                            label="Volume (m³)"
                            value={cargo.cargoVolume ? formatters.volume(cargo.cargoVolume) : '-'}
                            readOnly
                            size="sm"
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <TextInput
                            label="Nature"
                            value={cargo._cargoNature?.title || '-'}
                            readOnly
                            size="sm"
                          />
                        </Grid.Col>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};