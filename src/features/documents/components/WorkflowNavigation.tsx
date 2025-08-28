import { Badge, Progress, Group, Text, Stack } from '@mantine/core';
import { FileTextIcon, TruckIcon, HandshakeIcon } from '@phosphor-icons/react';
import React from 'react';

import { ShipmentRfpStage, WORKFLOW_STAGES, getStageProgress } from '../types/workflow-stages';
import { DocumentStatus } from '@/types/workflow';

interface WorkflowNavigationProps {
  currentStage: ShipmentRfpStage;
  status: DocumentStatus;
  className?: string;
}

const STAGE_ICONS = {
  inception: FileTextIcon,
  bidding: TruckIcon,
  contracting: HandshakeIcon,
};

const STAGE_COLORS = {
  inception: 'gray',
  bidding: 'blue',
  contracting: 'green',
};

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentStage,
  status,
  className = '',
}) => {
  const progress = getStageProgress(currentStage);
  const stageConfig = WORKFLOW_STAGES[currentStage];

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <Stack gap="md">
        {/* Stage Progress */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="dimmed">
              Workflow Progress
            </Text>
            <Badge color={STAGE_COLORS[currentStage]} variant="light">
              {status}
            </Badge>
          </Group>

          <Progress value={progress} color={STAGE_COLORS[currentStage]} size="sm" radius="md" />
        </div>

        {/* Stage Indicators */}
        <Group justify="space-between">
          {Object.entries(WORKFLOW_STAGES).map(([stage, config]) => {
            const StageIcon = STAGE_ICONS[stage as ShipmentRfpStage];
            const isActive = stage === currentStage;
            const isPassed =
              Object.keys(WORKFLOW_STAGES).indexOf(stage) <
              Object.keys(WORKFLOW_STAGES).indexOf(currentStage);

            return (
              <Group key={stage} gap="xs">
                <div
                  className={`
                  p-2 rounded-full transition-colors
                  ${
                    isActive
                      ? `bg-${STAGE_COLORS[stage as ShipmentRfpStage]}-100 text-${STAGE_COLORS[stage as ShipmentRfpStage]}-600`
                      : isPassed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                  }
                `}
                >
                  <StageIcon size={16} />
                </div>

                <Stack gap={0}>
                  <Text size="sm" fw={isActive ? 600 : 400} c={isActive ? 'dark' : 'dimmed'}>
                    {config.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {config.description}
                  </Text>
                </Stack>
              </Group>
            );
          })}
        </Group>
      </Stack>
    </div>
  );
};
