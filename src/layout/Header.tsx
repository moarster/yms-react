import { ActionIcon, Avatar, Box, Container, Group, Indicator, Menu, Text } from '@mantine/core';
import { ArrowSquareRightIcon, BellIcon, GearSixIcon, UserIcon } from '@phosphor-icons/react';
import React, { useState } from 'react';

import { useAuthStore } from '@/core/store/authStore.ts';
import { useUiStore } from '@/core/store/uiStore.ts';

const Header: React.FC = () => {
  const { logout, user } = useAuthStore();
  const { notifications, sidebarOpen } = useUiStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      style={{
        height: 64,
        marginLeft: sidebarOpen ? 256 : 64,
        transition: 'margin-left 200ms ease',
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: 'var(--mantine-color-white)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Container size="100%" h="100%" px="md">
        <Group h="100%" justify="space-between">
          {/* Page title */}
          <Box flex={1}>
            <Text size="xl" fw={600} c="gray.9">
              {/* Title can be controlled by context or passed down */}
            </Text>
          </Box>

          {/* Right side actions */}
          <Group gap="sm">
            {/* Notifications button */}
            <Indicator
              disabled={unreadCount === 0}
              color="red"
              size={8}
              offset={2}
            >
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon size={20} />
              </ActionIcon>
            </Indicator>

            {/* User menu */}
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg">
                  <Avatar
                    size={32}
                    color="blue"
                    radius="xl"
                    style={{ cursor: 'pointer' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {/* User info header */}
                <Box px="sm" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                  <Text fw={500} size="sm">
                    {user?.name}
                  </Text>
                  <Text c="dimmed" size="xs">
                    {user?.email}
                  </Text>
                </Box>

                <Menu.Item
                  leftSection={<UserIcon size={16} />}
                  component="a"
                  href="/profile"
                >
                  Profile
                </Menu.Item>

                <Menu.Item
                  leftSection={<GearSixIcon size={16} />}
                  component="a"
                  href="/settings"
                >
                  Settings
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  leftSection={<ArrowSquareRightIcon size={16} />}
                  onClick={handleLogout}
                  color="red"
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          </Group>
      </Container>
    </header>
);
};

export default Header;