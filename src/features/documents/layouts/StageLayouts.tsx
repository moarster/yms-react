import { Grid, Container } from '@mantine/core';
import React from 'react';

import { ShipmentRfpStage } from '../types/workflow-stages';
import { UserRole } from '@/core/auth/types';
import { usePermissions } from '@/core/contexts/PermissionContext';

interface StageLayoutProps {
  children: React.ReactNode;
  stage: ShipmentRfpStage;
  userRole: UserRole;
}

// Base layout wrapper
const BaseStageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container size="xl" py="md">
    {children}
  </Container>
);

// Inception Stage (NEW, DRAFT) - Two-column: General + Route
export const InceptionStageLayout: React.FC<StageLayoutProps> = ({ children }) => {
  const { isRole } = usePermissions();

  if (!isRole('LOGIST') && !isRole('ADMIN')) {
    return (
      <BaseStageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Access denied. Only logists can view drafts.</p>
        </div>
      </BaseStageLayout>
    );
  }

  return (
    <BaseStageLayout>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          {/* General Section Slot */}
          {React.Children.toArray(children).find((child: any) =>
            child?.props?.slot === 'general'
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          {/* Route Section Slot */}
          {React.Children.toArray(children).find((child: any) =>
            child?.props?.slot === 'route'
          )}
        </Grid.Col>
      </Grid>
    </BaseStageLayout>
  );
};

// Bidding Stage (PUBLISHED, ASSIGNED) - Role-based layouts
export const BiddingStageLayout: React.FC<StageLayoutProps> = ({ children, userRole }) => {
  const { isRole } = usePermissions();

  if (isRole('LOGIST') || isRole('ADMIN')) {
    // Three-column layout for logists: General + Route + Bidding
    return (
      <BaseStageLayout>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            {React.Children.toArray(children).find((child: any) =>
              child?.props?.slot === 'general'
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            {React.Children.toArray(children).find((child: any) =>
              child?.props?.slot === 'route'
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            {React.Children.toArray(children).find((child: any) =>
              child?.props?.slot === 'bidding'
            )}
          </Grid.Col>
        </Grid>
      </BaseStageLayout>
    );
  }

  if (isRole('CARRIER')) {
    // Two-column layout for carriers: Summary + Bid Form
    return (
      <BaseStageLayout>
        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            {/* Summary sections */}
            <Grid>
              <Grid.Col span={6}>
                {React.Children.toArray(children).find((child: any) =>
                  child?.props?.slot === 'general'
                )}
              </Grid.Col>
              <Grid.Col span={6}>
                {React.Children.toArray(children).find((child: any) =>
                  child?.props?.slot === 'route'
                )}
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            {React.Children.toArray(children).find((child: any) =>
              child?.props?.slot === 'bidding'
            )}
          </Grid.Col>
        </Grid>
      </BaseStageLayout>
    );
  }

  return (
    <BaseStageLayout>
      <div className="text-center py-12">
        <p className="text-gray-500">Access denied.</p>
      </div>
    </BaseStageLayout>
  );
};

// Contracting Stage (ASSIGNED, COMPLETED) - Contract-focused
export const ContractingStageLayout: React.FC<StageLayoutProps> = ({ children }) => {
  return (
    <BaseStageLayout>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          {/* Primary Contract Section */}
          {React.Children.toArray(children).find((child: any) =>
            child?.props?.slot === 'contract'
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          {/* Reference sidebar with general/route summary */}
          <div className="space-y-4">
            {React.Children.toArray(children).find((child: any) =>
              child?.props?.slot === 'general'
            )}
            {React.Children.toArray(children).find((child: any) =>
              child?.props?.slot === 'route'
            )}
            {React.Children.toArray(children).find((child: any) =>
              child?.props?.slot === 'bidding'
            )}
          </div>
        </Grid.Col>
      </Grid>
    </BaseStageLayout>
  );
};

// Layout selector function
export const getLayoutForStage = (stage: ShipmentRfpStage): React.FC<StageLayoutProps> => {
  switch (stage) {
    case 'inception':
      return InceptionStageLayout;
    case 'bidding':
      return BiddingStageLayout;
    case 'contracting':
      return ContractingStageLayout;
    default:
      return InceptionStageLayout;
  }
};