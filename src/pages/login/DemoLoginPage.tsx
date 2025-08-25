import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React from 'react';

import { demoUsers } from '@/core/auth/demo/demoUsers.ts';
import { authConfig } from '@/core/config';
import { useAuthStore } from '@/core/store/authStore.ts';
import { useUiStore } from '@/core/store/uiStore.ts';
import BaseLoginLayout from '@/layout/BaseLoginLayout.tsx';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

interface LoginFormValues {
  email: string;
  password: string;
}

const DemoLoginPage: React.FC = () => {
  const { isLoading, login } = useAuthStore();
  const { addNotification } = useUiStore();

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        return null;
      },
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      addNotification({
        message: 'You have successfully logged in.',
        title: 'Welcome back!',
        type: 'success',
      });
    } catch (error: any) {
      const message = error?.message || 'Login failed. Please try again.';
      notifications.show({
        color: 'red',
        message,
      });
      addNotification({
        message,
        title: 'Login Failed',
        type: 'error',
      });
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'carrier' | 'logist') => {
    let demoUser;
    if (userType === 'admin') {
      demoUser = demoUsers.find((u) => u.email === authConfig.demoSuperuser.email);
    } else {
      demoUser = demoUsers.find((u) => u.user.roles[0].name === userType.toUpperCase());
    }

    if (demoUser) {
      form.setValues({
        email: demoUser.email,
        password: demoUser.password,
      });
    }
  };

  return (
    <BaseLoginLayout title="Carrier Portal" subtitle="Demo Mode - Sign in with demo credentials">
      <Stack gap="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email address"
              placeholder="Enter your email"
              type="email"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign in'}
            </Button>
          </Stack>
        </form>

        {/* Demo credentials section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Demo Credentials</span>
            </div>
          </div>

          <Stack gap="xs" mt="md">
            <Button
              variant="outline"
              size="xs"
              fullWidth
              onClick={() => fillDemoCredentials('logist')}
            >
              Logist Demo (logist@demo.com)
            </Button>

            <Button
              variant="outline"
              size="xs"
              fullWidth
              onClick={() => fillDemoCredentials('carrier')}
            >
              Carrier Demo (carrier@demo.com)
            </Button>

            <Button
              variant="outline"
              size="xs"
              fullWidth
              onClick={() => fillDemoCredentials('admin')}
            >
              Admin Demo (Full Access)
            </Button>
          </Stack>
        </div>
      </Stack>
    </BaseLoginLayout>
  );
};

export default DemoLoginPage;