import React from 'react'
import { Transition } from '@headlessui/react'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import { useUiStore } from '@/stores/uiStore'
import { Notification } from '@/types'
import clsx from 'clsx'

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { removeNotification } = useUiStore()

    const icons = {
        success: CheckCircleIcon,
        error: ExclamationCircleIcon,
        warning: ExclamationCircleIcon,
        info: InformationCircleIcon,
    }

    const colorClasses = {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
    }

    const Icon = icons[notification.type]

    return (
        <Transition
            appear
            show={true}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Icon className={clsx('h-6 w-6', colorClasses[notification.type])} />
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {notification.message}
                            </p>
                            {notification.actions && notification.actions.length > 0 && (
                                <div className="mt-3 flex space-x-2">
                                    {notification.actions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={action.action}
                                            className="bg-white rounded-md text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                onClick={() => removeNotification(notification.id)}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    )
}

const NotificationCenter: React.FC = () => {
    const { notifications } = useUiStore()

    return (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    )
}

export default NotificationCenter