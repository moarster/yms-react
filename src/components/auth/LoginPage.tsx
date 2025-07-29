// src/components/auth/LoginPage.tsx
import { CogIcon,EyeIcon, EyeSlashIcon, TruckIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { authConfig, demoUsers } from '@/config/keycloak'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showModeSwitch, setShowModeSwitch] = useState(false)
    const { login, isLoading, isDemoMode, switchToDemoMode, switchToKeycloakMode } = useAuthStore()
    const { addNotification } = useUiStore()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        try {
            if (isDemoMode) {
                await login(data.email, data.password)
            } else {
                // For Keycloak mode, redirect to Keycloak login
                await login()
            }

            addNotification({
                type: 'success',
                title: 'Welcome back!',
                message: 'You have successfully logged in.',
            })
        } catch (error: unknown) {
            const message = error?.message || 'Login failed. Please try again.'
            toast.error(message)
            addNotification({
                type: 'error',
                title: 'Login Failed',
                message,
            })
        }
    }

    const fillDemoCredentials = (userType: 'logist' | 'carrier' | 'admin') => {
        let demoUser
        if (userType === 'admin') {
            demoUser = demoUsers.find(u => u.email === authConfig.demoSuperuser.email)
        } else {
            demoUser = demoUsers.find(u => u.user.roles[0].name === userType.toUpperCase())
        }

        if (demoUser) {
            setValue('email', demoUser.email)
            setValue('password', demoUser.password)
        }
    }

    const handleModeSwitch = () => {
        if (isDemoMode) {
            switchToKeycloakMode()
            toast.success('Switched to Keycloak authentication')
        } else {
            switchToDemoMode()
            toast.success('Switched to demo mode')
        }
        setShowModeSwitch(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-600">
                        <TruckIcon className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Carrier Portal
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isDemoMode ? 'Demo Mode - Sign in with demo credentials' : 'Sign in to your account'}
                    </p>

                    {/* Mode indicator */}
                    <div className="mt-2 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isDemoMode
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {isDemoMode ? 'Demo Mode' : 'Keycloak Mode'}
                        </span>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {isDemoMode && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="label">
                                    Email address
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    autoComplete="email"
                                    className={errors.email ? 'input-error' : 'input'}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="label">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        className={errors.password ? 'input-error pr-10' : 'input pr-10'}
                                        placeholder="Enter your password"
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
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {!isDemoMode && (
                        <div className="text-center text-sm text-gray-600">
                            <p>You will be redirected to Keycloak for authentication</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                isDemoMode ? 'Sign in' : 'Sign in with Keycloak'
                            )}
                        </button>
                    </div>

                    {isDemoMode && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-50 text-gray-500">
                                        Demo Credentials
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    className="btn-outline text-xs"
                                    onClick={() => fillDemoCredentials('logist')}
                                >
                                    Logist Demo (logist@demo.com)
                                </button>
                                <button
                                    type="button"
                                    className="btn-outline text-xs"
                                    onClick={() => fillDemoCredentials('carrier')}
                                >
                                    Carrier Demo (carrier@demo.com)
                                </button>
                                <button
                                    type="button"
                                    className="btn-outline text-xs"
                                    onClick={() => fillDemoCredentials('admin')}
                                >
                                    Admin Demo (Full Access)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mode switch button */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setShowModeSwitch(!showModeSwitch)}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <CogIcon className="h-4 w-4 mr-1" />
                            Auth Settings
                        </button>

                        {showModeSwitch && (
                            <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                                <p className="text-xs text-gray-600 mb-2">
                                    Switch authentication mode
                                </p>
                                <button
                                    type="button"
                                    onClick={handleModeSwitch}
                                    className="text-xs bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50"
                                >
                                    Switch to {isDemoMode ? 'Keycloak' : 'Demo'} Mode
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage