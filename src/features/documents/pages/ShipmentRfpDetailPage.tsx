import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tabs,
} from '@mantine/core';
import { ArrowLeftIcon, MapPinIcon, TruckIcon } from '@phosphor-icons/react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { useShipmentRfpDetail } from '../hooks/useShipmentRfpDetail.ts';
import { ShipmentRfpInfo } from './components/ShipmentRfpInfo';
import { ShipmentRfpRoute } from './components/ShipmentRfpRoute';
import { ShipmentRfpCarrier } from './components/ShipmentRfpCarrier';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import ErrorMessage from '@/shared/ui/ErrorMessage';
import { useSchema } from '@/hooks/useSchema.ts';

const ShipmentRfpDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { rfp, isLoading, isCreating } = useShipmentRfpDetail();
  const { schema } = useSchema({ entityKey: 'shipment-rfp' });

  if (isLoading) {
    return (
      <Container size="xl" py="md">
        <LoadingSpinner size="lg" text="Loading RFP details..." />
      </Container>
    );
  }

  if (!rfp && !isCreating) {
    return (
      <Container size="xl" py="md">
        <ErrorMessage message="RFP not found" />
      </Container>
    );
  }
  if (!schema) {
    return (
      <Container size="xl" py="md">
        <ErrorMessage message="Ошибка получения схемы" />
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'gray';
      case 'ASSIGNED': return 'blue';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Box mb="xl">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Group gap="sm">
              <Button
                component={Link}
                to="/shipment-rfps"
                variant="subtle"
                leftSection={<ArrowLeftIcon size={16} />}
                size="sm"
              >
                Back to RFPs
              </Button>
              {rfp?.status && (
                <Badge color={getStatusColor(rfp.status)} variant="light">
                  {rfp.status}
                </Badge>
              )}
            </Group>
            <Title order={1} size="h2">
              RFP #{rfp?.id || id}
            </Title>
            <Text c="dimmed">
              Created: {rfp?.createdDate ? new Date(rfp.createdDate).toLocaleDateString() : 'Unknown'}
            </Text>
          </Stack>

          <Group gap="sm">
            <Button variant="outline">Edit</Button>
            <Button>Actions</Button>
          </Group>
        </Group>
      </Box>

      {/* Main Content */}
      <Grid>
        {/* Info Section - Left Side */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <ShipmentRfpInfo rfp={rfp} schema={schema} />
        </Grid.Col>

        {/* Details Section - Right Side */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Tabs defaultValue="route">
            <Tabs.List>
              <Tabs.Tab value="route" leftSection={<MapPinIcon size={16} />}>
                Маршрут
              </Tabs.Tab>
              <Tabs.Tab value="carrier" leftSection={ <TruckIcon size={16} />}>
                Данные перевозчика
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="route">
              <ShipmentRfpRoute rfp={rfp} />
            </Tabs.Panel>

            <Tabs.Panel value="carrier">
              {/*<ShipmentRfpCarrier rfp={rfp} />*/}
            </Tabs.Panel>

          </Tabs>
        </Grid.Col>

        {/* Footer Section */}
        <Grid.Col span={{ base: 12, lg: 12 }}>
          <Paper withBorder p="md" bg="gray.0">
            <Group justify="center">
              <Text c="dimmed" size="sm">
                Footer section - Reserved for future functionality
              </Text>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

    </Container>
  );
};

export default ShipmentRfpDetailPage;