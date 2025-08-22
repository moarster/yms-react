import Form from '@aokiapp/rjsf-mantine-theme';
import { notifications } from '@mantine/notifications';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  UserIcon,
} from '@phosphor-icons/react';
import validator from '@rjsf/validator-ajv8';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

import { authService } from '@/core/auth/authService.ts';
import { KeycloakAuthService } from '@/core/auth/keycloak/keycloakService.ts';
import { User } from '@/core/auth/types.ts';
import { useAuthStore } from '@/core/store/authStore.ts';
import { useUiStore } from '@/core/store/uiStore.ts';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

const profileSchema = {
  properties: {
    email: {
      format: 'email',
      title: 'Email Address',
      type: 'string',
    },
    name: {
      minLength: 1,
      title: 'Full Name',
      type: 'string',
    },
  },
  required: ['name', 'email'],
  type: 'object',
};

const passwordSchema = {
  properties: {
    confirmPassword: {
      minLength: 1,
      title: 'Confirm New Password',
      type: 'string',
    },
    currentPassword: {
      minLength: 1,
      title: 'Current Password',
      type: 'string',
    },
    newPassword: {
      minLength: 6,
      title: 'New Password',
      type: 'string',
    },
  },
  required: ['currentPassword', 'newPassword', 'confirmPassword'],
  type: 'object',
};

const profileUiSchema = {
  email: {
    'ui:classNames': 'input',
    'ui:help': 'This email will be used for notifications and account recovery',
    'ui:placeholder': 'Enter your email address',
  },
  name: {
    'ui:classNames': 'input',
    'ui:placeholder': 'Enter your full name',
  },
};

const passwordUiSchema = {
  confirmPassword: {
    'ui:classNames': 'input',
    'ui:placeholder': 'Confirm your new password',
    'ui:widget': 'password',
  },
  currentPassword: {
    'ui:classNames': 'input',
    'ui:placeholder': 'Enter your current password',
    'ui:widget': 'password',
  },
  newPassword: {
    'ui:classNames': 'input',
    'ui:placeholder': 'Enter your new password',
    'ui:widget': 'password',
  },
};
const passwordValidate = (formData: any, errors: any) => {
  if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword.addError("Passwords don't match");
  }
  return errors;
};

const FieldTemplate = (props: any) => {
  const { children, classNames, description, errors, help, id, label, required } = props;
  return (
    <div className={classNames}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required ? ' *' : ''}
        </label>
      )}
      {description && <p className="text-sm text-gray-600 mb-1">{description}</p>}
      {children}
      {errors && errors.length > 0 && (
        <div className="mt-1">
          {Array.isArray(errors) ? (
            errors.map((error: string, index: number) => (
              <p key={index} className="text-sm text-red-600">
                {error}
              </p>
            ))
          ) : (
            <p className="text-sm text-red-600">{errors}</p>
          )}
        </div>
      )}
      {help && <div className="mt-1 text-xs text-gray-500">{help}</div>}
    </div>
  );
};

const ObjectFieldTemplate = (props: any) => {
  return (
    <div className="space-y-4">
      {props.properties.map((element: any) => (
        <div key={element.content.key}>{element.content}</div>
      ))}
    </div>
  );
};

// Custom submit button template
const SubmitButton = ({ children, icon: Icon, loading }: any) => (
  <div className="pt-4">
    <button type="submit" disabled={loading} className="btn-primary">
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        <>
          <Icon className="h-4 w-4 mr-2" />
          {children}
        </>
      )}
    </button>
  </div>
);

interface ProfileSectionProps {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ children, icon: Icon, title }) => (
  <div className="card">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Custom password widget with show/hide toggle
const PasswordWidget = (props: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const { className, onChange, placeholder, value } = props;

  return (
    <div className="relative">
      <input
        value={value || ''}
        placeholder={placeholder}
        className={`${className} pr-10`}
        type={showPassword ? 'text' : 'password'}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <EyeIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { setUser, user } = useAuthStore();
  const { addNotification } = useUiStore();

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
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
    },
  });

  const handleProfileSubmit = ({ formData }: any) => {
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = ({ formData }: any) => {
    changePasswordMutation.mutate({ newPassword: formData.newPassword });
  };

  if (!user) {
    return <LoadingSpinner size="lg" text="Loading profile..." />;
  }

  // Custom widgets
  const widgets = {
    password: PasswordWidget,
  };

  const templates = {
    FieldTemplate,
    ObjectFieldTemplate,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <ProfileSection icon={UserIcon} title="Profile Information">
          <Form
            formData={{
              email: user.email || '',
              name: user.name || '',
            }}
            showErrorList={false}
            templates={templates}
            validator={validator}
            schema={profileSchema}
            uiSchema={profileUiSchema}
            onSubmit={handleProfileSubmit}
          >
            <SubmitButton icon={CheckCircleIcon} loading={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
            </SubmitButton>
          </Form>
        </ProfileSection>

        {/* Organization Information */}
        {user.organization && (
          <ProfileSection title="Organization" icon={BuildingOfficeIcon}>
            <div className="space-y-4">
              <div>
                <label className="label">Organization Name</label>
                <input
                  type="text"
                  className="input bg-gray-50"
                  value={user.organization.name}
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">INN</label>
                  <input
                    type="text"
                    className="input bg-gray-50"
                    value={user.organization.inn}
                    disabled
                  />
                </div>
                <div>
                  <label className="label">OGRN</label>
                  <input
                    type="text"
                    className="input bg-gray-50"
                    value={user.organization.ogrn}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="label">Address</label>
                <textarea
                  rows={2}
                  className="input bg-gray-50"
                  value={user.organization.address}
                  disabled
                />
              </div>

              <div className="text-sm text-gray-500">
                <p>Organization information is managed by your administrator.</p>
                <p>Contact support if you need to update these details.</p>
              </div>
            </div>
          </ProfileSection>
        )}
      </div>

      {/* Password Change */}
      <ProfileSection icon={KeyIcon} title="Change Password">
        <Form
          widgets={widgets}
          showErrorList={false}
          templates={templates}
          validator={validator}
          schema={passwordSchema}
          uiSchema={passwordUiSchema}
          validate={passwordValidate}
          onSubmit={handlePasswordSubmit}
        >
          <SubmitButton icon={KeyIcon} loading={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
          </SubmitButton>
        </Form>
      </ProfileSection>

      {/* User Roles & Permissions */}
      <ProfileSection icon={UserIcon} title="Roles & Permissions">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Your Roles</h4>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <span
                  key={role.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
            <div className="grid grid-cols-2 gap-2">
              {user.roles
                .flatMap((role) => role.permissions)
                .filter((permission, index, arr) => arr.indexOf(permission) === index) // Remove duplicates
                .map((permission) => (
                  <div key={permission} className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {permission.replace(/_/g, ' ').toLowerCase()}
                  </div>
                ))}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Roles and permissions are managed by your system administrator.</p>
            <p>Contact support if you need additional access.</p>
          </div>
        </div>
      </ProfileSection>
    </div>
  );
};

export default ProfilePage;
