import { useState } from 'react';
import LoginButton from '../components/LoginButton';
import ResumeList from '../components/ResumeList';

interface Resume {
  id: string;
  name: string;
  file_url: string;
  category: string;
  labels: string[];
  created_at: string;
}

interface FloatingUIProps {
  onClose: () => void;
  session: any;
  onAutoFill?: (resume: Resume) => void;
  isAutofillSupported: boolean;
  isObserverActive: boolean;
}

export default function FloatingUI({ session, onClose, isAutofillSupported, isObserverActive }: FloatingUIProps) {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillStatus, setAutoFillStatus] = useState('');

  const handleAutoFill = (resume: Resume) => {
    setIsAutoFilling(true);
    setAutoFillStatus('');
    // Send a message to the background script to forward to the content script
    chrome.runtime.sendMessage(
      {
        type: 'FORWARD_TO_CONTENT_SCRIPT',
        payload: { type: 'AUTOFILL_RESUME', resume },
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message to content script:', chrome.runtime.lastError.message);
        } else {
          console.log('Received response:', response);
        }
        setIsAutoFilling(false);
        if (response?.status === 'complete') setAutoFillStatus('Auto-fill complete!');
        else if (response?.status === 'no-fields') setAutoFillStatus('No fields available to auto-fill.');
        else if (response?.status === 'not-supported') setAutoFillStatus('Page not supported for Auto-fill.');
        else setAutoFillStatus('Auto-fill failed.');
        setTimeout(() => setAutoFillStatus(''), 3000); // Clear after 3s
      }
    );
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-white rounded-lg shadow-lg p-4 w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Resume Manager</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {!isAutofillSupported && (
        isObserverActive ? (
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-3 mb-4 text-white shadow-md" role="alert">
            <p className="text-center font-semibold text-sm">
              Waiting for application form...
              <span className="block font-normal text-xs mt-1">
                If this page has an "Apply" button, please click it to reveal the form.
              </span>
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-3 mb-4 text-white shadow-md" role="alert">
            <p className="text-center font-semibold">Auto-fill is not supported on this page.</p>
          </div>
        )
      )}
      {!session ? (
        <LoginButton />
      ) : (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Your Resumes</h2>
            <ResumeList
              selectedResume={selectedResume}
              setSelectedResume={setSelectedResume}
            />
            {isAutofillSupported && selectedResume && (
              <div className="mt-4 flex flex-col gap-1">
                <button
                  className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded shadow font-semibold transition-colors min-w-[120px] disabled:bg-gray-400"
                  onClick={() => handleAutoFill(selectedResume)}
                  disabled={isAutoFilling}
                >
                  {isAutoFilling ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {isAutoFilling ? 'Auto-filling...' : 'AutoFill'}
                </button>
                <span className="text-xs text-center text-gray-500 mt-1">Filename will always be <span className="font-mono bg-gray-100 px-1 rounded">Resume.pdf</span> for autofilling.</span>
                {autoFillStatus && (
                  <span className="text-xs text-center text-blue-600 mt-1">{autoFillStatus}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
  