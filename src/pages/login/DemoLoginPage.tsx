import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Form from '@rjsf/mui'
import { RJSFSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { demoUsers } from "@/core/auth/demo/demoUsers.ts"
import { authConfig } from "@/core/config"
import { useAuthStore } from '@/core/store/authStore.ts'
import { useUiStore } from '@/core/store/uiStore.ts'
import BaseLoginLayout from "@/layout/BaseLoginLayout.tsx";
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

const schema: RJSFSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: { type: "string", format: "email", title: "Email address" },
        password: { type: "string", title: "Password" }
    }
}

const uiSchema = {
    email: {
        "ui:placeholder": "Email address",
        "ui:options": { inputType: "email" }
    },
    password: {
        "ui:placeholder": "Enter your password",
        "ui:widget": "password"
    }
}

const DemoLoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { login, isLoading } = useAuthStore()
    const { addNotification } = useUiStore()
    const formRef = useRef<any>()

    const onSubmit = async ({ formData }: any) => {
        try {
            await login(formData.email, formData.password)
            addNotification({
                type: 'success',
                title: 'Welcome back!',
                message: 'You have successfully logged in.',
            })
        } catch (error: any) {
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
        if (demoUser && formRef.current) {
            formRef.current.change({ email: demoUser.email, password: demoUser.password })
        }
    }

    return (
        <BaseLoginLayout
            title="Carrier Portal"
            subtitle="Demo Mode - Sign in with demo credentials"
        >
            <Form
                ref={formRef}
                schema={schema}
                uiSchema={uiSchema}
                validator={validator}
                onSubmit={onSubmit}
                transformErrors={(errors) =>
                    errors.map((e) => {
                        if (e.name === "format" && e.property === ".email") {
                            e.message = "Invalid email address"
                        }
                        if (e.name === "required" && e.property === ".password") {
                            e.message = "Password is required"
                        }
                        return e
                    })
                }
            >
                <div className="relative mb-4">
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

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : 'Sign in'}
                    </button>
                </div>
            </Form>

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
        </BaseLoginLayout>
    )
}

export default DemoLoginPage
