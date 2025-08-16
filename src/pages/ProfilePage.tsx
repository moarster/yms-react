import {
    BuildingOfficeIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { authService } from '@/core/auth/authService.ts'
import {KeycloakAuthService} from "@/core/auth/keycloak/keycloakService.ts";
import {User} from "@/core/auth/types.ts";
import { useAuthStore } from '@/core/store/authStore.ts'
import { useUiStore } from '@/core/store/uiStore.ts'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'


const profileSchema = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
        name: {
            type: 'string',
            title: 'Full Name',
            minLength: 1,
        },
        email: {
            type: 'string',
            title: 'Email Address',
            format: 'email',
        },
    },
}

const passwordSchema = {
    type: 'object',
    required: ['currentPassword', 'newPassword', 'confirmPassword'],
    properties: {
        currentPassword: {
            type: 'string',
            title: 'Current Password',
            minLength: 1,
        },
        newPassword: {
            type: 'string',
            title: 'New Password',
            minLength: 6,
        },
        confirmPassword: {
            type: 'string',
            title: 'Confirm New Password',
            minLength: 1,
        },
    },
}

const profileUiSchema = {
    name: {
        'ui:placeholder': 'Enter your full name',
        'ui:classNames': 'input',
    },
    email: {
        'ui:placeholder': 'Enter your email address',
        'ui:help': 'This email will be used for notifications and account recovery',
        'ui:classNames': 'input',
    },
}

const passwordUiSchema = {
    currentPassword: {
        'ui:widget': 'password',
        'ui:placeholder': 'Enter your current password',
        'ui:classNames': 'input',
    },
    newPassword: {
        'ui:widget': 'password',
        'ui:placeholder': 'Enter your new password',
        'ui:classNames': 'input',
    },
    confirmPassword: {
        'ui:widget': 'password',
        'ui:placeholder': 'Confirm your new password',
        'ui:classNames': 'input',
    },
}
const passwordValidate = (formData: any, errors: any) => {
    if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword.addError("Passwords don't match")
    }
    return errors
}

const FieldTemplate = (props: any) => {
    const { id, classNames, label, help, required, description, errors, children } = props
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
                    {Array.isArray(errors)
                        ? errors.map((error: string, index: number) => (
                            <p key={index} className="text-sm text-red-600">
                                {error}
                            </p>
                        ))
                        : <p className="text-sm text-red-600">{errors}</p>
                    }
                </div>
            )}
            {help && <div className="mt-1 text-xs text-gray-500">{help}</div>}
        </div>
    )
}

const ObjectFieldTemplate = (props: any) => {
    return (
        <div className="space-y-4">
            {props.properties.map((element: any) => (
                <div key={element.content.key}>{element.content}</div>
            ))}
        </div>
    )
}

// Custom submit button template
const SubmitButton = ({ loading, icon: Icon, children }: any) => (
    <div className="pt-4">
        <button
            type="submit"
            disabled={loading}
            className="btn-primary"
        >
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
)

interface ProfileSectionProps {
    title: string
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon: Icon, children }) => (
    <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
)

// Custom password widget with show/hide toggle
const PasswordWidget = (props: any) => {
    const [showPassword, setShowPassword] = useState(false)
    const { value, onChange, placeholder, className } = props

    return (
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${className} pr-10`}
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
    )
}

const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuthStore()
    const { addNotification } = useUiStore()

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (data: { name: string; email: string }) => {
            const response = await (authService as KeycloakAuthService).updateProfile(data)
            return response.data
        },
        onSuccess: (updatedUser: User) => {
            setUser(updatedUser)
            toast.success('Profile updated successfully')
            addNotification({
                type: 'success',
                title: 'Profile Updated',
                message: 'Your profile information has been updated successfully',
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update profile')
        },
    })

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: async (data: { newPassword: string }) => {
            await (authService as KeycloakAuthService).changePassword(data.newPassword)
        },
        onSuccess: () => {
            toast.success('Password changed successfully')
            addNotification({
                type: 'success',
                title: 'Password Changed',
                message: 'Your password has been changed successfully',
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to change password')
        },
    })

    const handleProfileSubmit = ({ formData }: any) => {
        updateProfileMutation.mutate(formData)
    }

    const handlePasswordSubmit = ({ formData }: any) => {
        changePasswordMutation.mutate({ newPassword: formData.newPassword })
    }

    if (!user) {
        return <LoadingSpinner size="lg" text="Loading profile..." />
    }

    // Custom widgets
    const widgets = {
        password: PasswordWidget,
    }

    const templates = {
        FieldTemplate,
        ObjectFieldTemplate,
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <ProfileSection title="Profile Information" icon={UserIcon}>
                    <Form
                        schema={profileSchema}
                        uiSchema={profileUiSchema}
                        formData={{
                            name: user.name || '',
                            email: user.email || '',
                        }}
                        onSubmit={handleProfileSubmit}
                        validator={validator}
                        templates={templates}
                        showErrorList={false}
                    >
                        <SubmitButton
                            loading={updateProfileMutation.isPending}
                            icon={CheckCircleIcon}
                        >
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
                                    value={user.organization.name}
                                    className="input bg-gray-50"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">INN</label>
                                    <input
                                        type="text"
                                        value={user.organization.inn}
                                        className="input bg-gray-50"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="label">OGRN</label>
                                    <input
                                        type="text"
                                        value={user.organization.ogrn}
                                        className="input bg-gray-50"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Address</label>
                                <textarea
                                    value={user.organization.address}
                                    className="input bg-gray-50"
                                    rows={2}
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
            <ProfileSection title="Change Password" icon={KeyIcon}>
                <Form
                    schema={passwordSchema}
                    uiSchema={passwordUiSchema}
                    onSubmit={handlePasswordSubmit}
                    validator={validator}
                    templates={templates}
                    widgets={widgets}
                    validate={passwordValidate}
                    showErrorList={false}
                >
                    <SubmitButton
                        loading={changePasswordMutation.isPending}
                        icon={KeyIcon}
                    >
                        {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                    </SubmitButton>
                </Form>
            </ProfileSection>

            {/* User Roles & Permissions */}
            <ProfileSection title="Roles & Permissions" icon={UserIcon}>
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
                                .flatMap(role => role.permissions)
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
    )
}

export default ProfilePage