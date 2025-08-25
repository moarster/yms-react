import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  KeyIcon,
  UserIcon,
} from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import { authService } from '@/core/auth/authService.ts';
import { KeycloakAuthService } from '@/core/auth/keycloak/keycloakService.ts';
import { User } from '@/core/auth/types.ts';
import { useAuthStore } from '@/core/store/authStore.ts';
import { useUiStore } from '@/core/store/uiStore.ts';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

interface ProfileFormValues {
  name: string;
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileSectionProps {
  children: React.ReactNode;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ children, icon: Icon, title }) => (
  <Paper shadow="sm" p="md" withBorder>
    <Stack gap="md">
      <Group gap="sm">
        <ActionIcon variant="subtle" size="lg" color="gray">
          <Icon size={20} />
        </ActionIcon>
        <Title order={3}>{title}</Title>
      </Group>
      {children}
    </Stack>
  </Paper>
);

const ProfilePage: React.FC = () => {
  const { setUser, user } = useAuthStore();
  const { addNotification } = useUiStore();

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) => (value.trim().length > 0 ? null : 'Current password is required'),
      newPassword: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.newPassword ? null : 'Passwords do not match',
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await (authService as KeycloakAuthService).updateProfile(data);
      return response.data;
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message || 'Failed to update profile',
      });
    },
    onSuccess: (updatedUser: User) => {
      setUser(updatedUser);
      notifications.show({
        color: 'green',
        message: 'Profile updated successfully',
      });
      addNotification({
        message: 'Your profile information has been updated successfully',
        title: 'Profile Updated',
        type: 'success',
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { newPassword: string }) => {
      await (authService as KeycloakAuthService).changePassword(data.newPassword);
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message || 'Failed to change password',
      });
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: 'Password changed successfully',
      });
      addNotification({
        message: 'Your password has been changed successfully',
        title: 'Password Changed',
        type: 'success',
      });
      passwordForm.reset();
    },
  });

  const handleProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  const handlePasswordSubmit = (values: PasswordFormValues) => {
    changePasswordMutation.mutate({ newPassword: values.newPassword });
  };

  if (!user) {
    return <LoadingSpinner size="lg" text="Loading profile..." />;
  }

  return (
    <Stack gap="xl">
      {/* Page header */}
      <div>
        <Title order={1}>Profile Settings</Title>
        <Text c="dimmed">Manage your account settings and preferences</Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          {/* Profile Information */}
          <ProfileSection icon={UserIcon} title="Profile Information">
            <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  {...profileForm.getInputProps('name')}
                />

                <TextInput
                  label="Email Address"
                  placeholder="Enter your email address"
                  type="email"
                  required
                  description="This email will be used for notifications and account recovery"
                  {...profileForm.getInputProps('email')}
                />

                <Group justify="flex-end" pt="md">
                  <Button
                    type="submit"
                    loading={updateProfileMutation.isPending}
                    leftSection={<CheckCircleIcon size={16} />}
                  >
                    Update Profile
                  </Button>
                </Group>
              </Stack>
            </form>
          </ProfileSection>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          {/* User Roles & Permissions */}
          <ProfileSection icon={UserIcon} title="Roles & Permissions">
            <Stack gap="md">
              <div>
                <Text fw={500} size="sm" mb="xs">Your Roles</Text>
                <Group gap="xs">
                  {user.roles.map((role) => (
                    <Text
                      key={role.id}
                      size="xs"
                      px="sm"
                      py={4}
                      bg="blue.1"
                      c="blue.8"
                      style={{ borderRadius: '1rem' }}
                    >
                      {role.name}
                    </Text>
                  ))}
                </Group>
              </div>

              <div>
                <Text fw={500} size="sm" mb="xs">Permissions</Text>
                <Grid gutter="xs">
                  {user.roles
                    .flatMap((role) => role.permissions)
                    .filter((permission, index, arr) => arr.indexOf(permission) === index)
                    .map((permission) => (
                      <Grid.Col span={6} key={permission}>
                        <Group gap="xs">
                          <CheckCircleIcon size={16} color="var(--mantine-color-green-6)" />
                          <Text size="sm" c="dimmed">
                            {permission.replace(/_/g, ' ').toLowerCase()}
                          </Text>
                        </Group>
                      </Grid.Col>
                    ))}
                </Grid>
              </div>

              <Text size="sm" c="dimmed">
                Roles and permissions are managed by your system administrator.
                Contact support if you need additional access.
              </Text>
            </Stack>
          </ProfileSection>
        </Grid.Col>
      </Grid>

      {/* Organization Information */}
      {user.organization && (
        <ProfileSection icon={BuildingOfficeIcon} title="Organization">
          <Stack gap="md">
            <TextInput
              label="Organization Name"
              value={user.organization.name}
              disabled
              styles={{ input: { backgroundColor: 'var(--mantine-color-gray-1)' } }}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="INN"
                  value={user.organization.inn}
                  disabled
                  styles={{ input: { backgroundColor: 'var(--mantine-color-gray-1)' } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="OGRN"
                  value={user.organization.ogrn}
                  disabled
                  styles={{ input: { backgroundColor: 'var(--mantine-color-gray-1)' } }}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Address"
              value={user.organization.address}
              disabled
              styles={{ input: { backgroundColor: 'var(--mantine-color-gray-1)' } }}
            />

            <Text size="sm" c="dimmed">
              Organization information is managed by your administrator.
              Contact support if you need to update these details.
            </Text>
          </Stack>
        </ProfileSection>
      )}

      {/* Password Change */}
      <ProfileSection icon={KeyIcon} title="Change Password">
        <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              required
              {...passwordForm.getInputProps('currentPassword')}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              required
              description="Password must be at least 6 characters long"
              {...passwordForm.getInputProps('newPassword')}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              required
              {...passwordForm.getInputProps('confirmPassword')}
            />

            <Group justify="flex-end" pt="md">
              <Button
                type="submit"
                loading={changePasswordMutation.isPending}
                leftSection={<KeyIcon size={16} />}
              >
                Change Password
              </Button>
            </Group>
          </Stack>
        </form>
      </ProfileSection>
    </Stack>
  );
};

export default ProfilePage;