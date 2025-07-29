import {
    BuildingOfficeIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { User } from '@/types'


// Profile form schema
const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
})

// Password change schema
const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

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

const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuthStore()
    const { addNotification } = useUiStore()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Profile form
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    })

    // Password form
    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    })

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (data: ProfileFormData) => {
            const response = await authService.updateProfile(data)
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
        mutationFn: async (data: PasswordFormData) => {
            await authService.changePassword( data.newPassword)
        },
        onSuccess: () => {
            resetPasswordForm()
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

    const onProfileSubmit = (data: ProfileFormData) => {
        updateProfileMutation.mutate(data)
    }

    const onPasswordSubmit = (data: PasswordFormData) => {
        changePasswordMutation.mutate(data)
    }

    if (!user) {
        return <LoadingSpinner size="lg" text="Loading profile..." />
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
                    <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                        <div>
                            <label className="label">Full Name *</label>
                            <input
                                {...registerProfile('name')}
                                type="text"
                                className={profileErrors.name ? 'input-error' : 'input'}
                                placeholder="Enter your full name"
                            />
                            {profileErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Email Address *</label>
                            <input
                                {...registerProfile('email')}
                                type="email"
                                className={profileErrors.email ? 'input-error' : 'input'}
                                placeholder="Enter your email address"
                            />
                            {profileErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                This email will be used for notifications and account recovery
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={updateProfileMutation.isPending}
                                className="btn-primary"
                            >
                                {updateProfileMutation.isPending ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        <span className="ml-2">Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                                        Update Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
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
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                    <div>
                        <label className="label">Current Password *</label>
                        <div className="relative">
                            <input
                                {...registerPassword('currentPassword')}
                                type={showCurrentPassword ? 'text' : 'password'}
                                className={passwordErrors.currentPassword ? 'input-error pr-10' : 'input pr-10'}
                                placeholder="Enter your current password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {passwordErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">New Password *</label>
                        <div className="relative">
                            <input
                                {...registerPassword('newPassword')}
                                type={showNewPassword ? 'text' : 'password'}
                                className={passwordErrors.newPassword ? 'input-error pr-10' : 'input pr-10'}
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">Confirm New Password *</label>
                        <div className="relative">
                            <input
                                {...registerPassword('confirmPassword')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={passwordErrors.confirmPassword ? 'input-error pr-10' : 'input pr-10'}
                                placeholder="Confirm your new password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                            className="btn-primary"
                        >
                            {changePasswordMutation.isPending ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Changing...</span>
                                </>
                            ) : (
                                <>
                                    <KeyIcon className="h-4 w-4 mr-2" />
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
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