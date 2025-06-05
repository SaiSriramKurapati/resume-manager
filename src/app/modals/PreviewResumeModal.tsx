// Remove the import of Resume from dashboard/page and define the Resume type here

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button'; // Import the Button component
import type { Resume } from '@/store/useStore';

interface PreviewResumeModalProps {
  open: boolean;
  onClose: () => void;
  resume: Resume | null;
}

const isPdf = (fileUrl: string) => fileUrl.toLowerCase().endsWith(".pdf");

export default function PreviewResumeModal({ open, onClose, resume }: PreviewResumeModalProps) {
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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-6 text-left align-middle shadow-lg transition-all relative text-white">
                <div className="flex justify-between items-start">
                  <div className="flex gap-5 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm6 1.414L18.586 10H14a2 2 0 0 1-2-2V3.414zM6 4h5v4a4 4 0 0 0 4 4h4v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4z" />
                    </svg>
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-center">
                        <Dialog.Title as="h2" className="text-lg font-semibold">
                          Resume Preview
                        </Dialog.Title>
                        <button
                          onClick={() => window.open(resume?.file_url, '_blank', 'noopener,noreferrer')}
                          aria-label="Open in new tab"
                          className="ml-1"
                          type="button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m5-3h3m0 0v3m0-3L10 14" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs xl:text-sm 2xl:text-base text-gray-400">
                        If the preview doesnt appear, try closing and reopening this popup. If the issue still exists,{' '}
                        <span
                          className="text-blue-400 hover:text-blue-300 cursor-pointer"
                          onClick={() => window.open(resume?.file_url, '_blank', 'noopener,noreferrer')}
                        >
                          click here
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-200 text-4xl cursor-pointer"
                    onClick={onClose}
                    aria-label="Close preview"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                {resume && isPdf(resume.file_url) ? (
                  <iframe
                    src={resume.file_url}
                    title="PDF Preview"
                    className="w-full h-128 backdrop-blur-sm border border-gray-200/50 shadow-sm rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48">
                    <Dialog.Description as="p" className="mb-4 text-gray-300">
                      Preview not available for this file type.
                    </Dialog.Description>
                    <Button
                      type="button"
                      onClick={() => window.open(resume?.file_url, '_blank', 'noopener,noreferrer')}
                      className="inline-flex justify-center rounded-md border border-blue-700 bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200"
                    >
                      Download
                    </Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 