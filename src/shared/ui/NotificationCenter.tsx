import { CheckCircleIcon, InfoIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react';
import { ActionIcon, Box, Button, Group, Notification, Stack, Transition } from '@mantine/core';
import React from 'react';

import { useUiStore } from '@/core/store/uiStore.ts';
import { Notification as NotificationType } from '@/types';

const NOTIFICATION_COLORS = {
  error: 'red',
  info: 'blue',
  success: 'green',
  warning: 'yellow',
} as const;

const NOTIFICATION_ICONS = {
  error: WarningCircleIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningCircleIcon,
} as const;

interface NotificationItemProps {
  notification: NotificationType;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification } = useUiStore();

  const Icon = NOTIFICATION_ICONS[notification.type];
  const color = NOTIFICATION_COLORS[notification.type];

  return (
    <Transition
      mounted
      transition="slide-left"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <Notification
          style={styles}
          color={color}
          icon={<Icon size={20} />}
          withCloseButton={false}
          onClose={() => removeNotification(notification.id)}
          withBorder
          radius="md"
          w={400}
        >
          <Group justify="space-between" align="flex-start">
            <Box flex={1}>
              <Box fw={500} size="sm">
                {notification.title}
              </Box>
              <Box c="dimmed" size="sm">
                {notification.message}
              </Box>
              {notification.actions && notification.actions.length > 0 && (
                <Group mt="xs" gap="xs">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="subtle"
                      size="xs"
                      onClick={action.action}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Group>
              )}
            </Box>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => removeNotification(notification.id)}
            >
              <XIcon size={16} />
            </ActionIcon>
          </Group>
        </Notification>
      )}
    </Transition>
  );
};

const NotificationCenter: React.FC = () => {
  const { notifications } = useUiStore();

  if (notifications.length === 0) return null;

  return (
    <Box
      pos="fixed"
      top={0}
      right={0}
      p="md"
      style={{
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      <Stack gap="sm" style={{ pointerEvents: 'auto' }}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </Stack>
    </Box>
  );
};

export default NotificationCenter;