import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { demoUsers } from "@/core/auth/demo/demoUsers.ts"
import { authConfig } from "@/core/config"
import { useAuthStore } from '@/core/store/authStore.ts'
import { useUiStore } from '@/core/store/uiStore.ts'
import BaseLoginLayout from "@/layout/BaseLoginLayout.tsx";
import LoadingSpinner from '@/shared/ui/LoadingSpinner'


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

const DemoLoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { login, isLoading } = useAuthStore()
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
            await login(data.email, data.password)

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

    return (
        <BaseLoginLayout
            title="Carrier Portal"
            subtitle="Demo Mode - Sign in with demo credentials"
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            autoComplete="email"
                            placeholder="Email address"
                            className={errors.email ? 'input-error' : 'input'}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">
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

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : 'Sign in'}
                    </button>
                </div>

                {/* Demo credentials section */}
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
            </form>
        </BaseLoginLayout>
    )
}

export default DemoLoginPage