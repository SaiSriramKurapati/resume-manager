import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    itemCount: number;
    loading: boolean;
}

export default function DeleteConfirmationModal({
    open,
    onClose,
    onConfirm,
    itemCount,
    loading,
}: DeleteConfirmationModalProps) {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-6 text-left align-middle shadow-lg transition-all relative text-white">
                                {/* Close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl cursor-pointer"
                                    onClick={onClose}
                                    aria-label="Close delete modal"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>

                                <Dialog.Title as="h2" className="text-lg font-semibold mb-4">
                                    Confirm Delete
                                </Dialog.Title>
                                <div className="mt-2">
                                    <Dialog.Description as="p" className="text-sm text-gray-300 mb-4">
                                        Are you sure you want to delete {itemCount > 1 ? `${itemCount} resumes` : `this resume`}?
                                    </Dialog.Description>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors duration-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={onConfirm}
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md border border-red-700 bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors duration-200"
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 