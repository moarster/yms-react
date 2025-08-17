import { Transition } from '@headlessui/react';
import { XIcon, InfoIcon, WarningCircleIcon, CheckCircleIcon } from '@phosphor-icons/react';

import clsx from 'clsx';
import React from 'react';

import { useUiStore } from '@/core/store/uiStore.ts';
import { Notification } from '@/types';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useUiStore();

  const icons = {
    error: WarningCircleIcon,
    info: InfoIcon,
    success: CheckCircleIcon,
    warning: WarningCircleIcon,
  };

  const colorClasses = {
    error: 'text-red-400',
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
  };

  const Icon = icons[notification.type];

  return (
    <Transition
      show={true}
      leaveTo="opacity-0"
      leaveFrom="opacity-100"
      leave="transition ease-in duration-100"
      enter="transform ease-out duration-300 transition"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      appear
    >
      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={clsx('h-6 w-6', colorClasses[notification.type])} />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
              {notification.actions && notification.actions.length > 0 && (
                <div className="mt-3 flex space-x-2">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      className="bg-white rounded-md text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={action.action}
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
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

const NotificationCenter: React.FC = () => {
  const { notifications } = useUiStore();

  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
