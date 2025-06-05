"use client";

import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useAlert } from '../context/AlertContext'; // Import useAlert

export default function AlertContainer() {
  const { alert, hideAlert } = useAlert(); // Access alert state and hide function

  if (!alert) return null; // Don't render if no alert

  const alertClasses = clsx(
    'fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] p-4 rounded-md shadow-lg text-white',
    {
      'bg-green-500': alert.type === 'success',
      'bg-red-500': alert.type === 'error',
      'bg-blue-500': alert.type === 'info',
      'bg-yellow-500': alert.type === 'warning',
    }
  );

  return (
    <Transition
      show={!!alert} // Show based on alert state
      as={Fragment}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-y-[-20px]"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-[-20px]"
    >
      <div className={alertClasses} role="alert">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium mr-4">{alert.message}</p>
          <button
            onClick={hideAlert} // Use hideAlert to dismiss
            className="-mx-1.5 -my-1.5 bg-transparent text-white rounded-md p-1.5 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  );
} 