import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@phosphor-icons/react';
import React, { Fragment } from 'react';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  size?: '2xl' | 'lg' | 'md' | 'sm' | 'xl';
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  showCloseButton = true,
  size = 'md',
  title,
}) => {
  const sizeClasses = {
    '2xl': 'max-w-6xl',
    lg: 'max-w-2xl',
    md: 'max-w-lg',
    sm: 'max-w-md',
    xl: 'max-w-4xl',
  };

  return (
    <Transition as={Fragment} show={isOpen} appear>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          leaveTo="opacity-0"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leave="ease-in duration-200"
          enter="ease-out duration-300"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              leave="ease-in duration-200"
              leaveTo="opacity-0 scale-95"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all`}
              >
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    {title && (
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}

                <div className={title || showCloseButton ? '' : 'p-6'}>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
