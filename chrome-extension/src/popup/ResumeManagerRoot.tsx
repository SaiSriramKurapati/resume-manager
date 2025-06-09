import { useEffect, useState } from 'react';
import FloatingUI from './FloatingUI';
import { supabase } from '../lib/supabaseClient';

interface Resume {
  id: string;
  name: string;
  file_url: string;
  category: string;
  labels: string[];
  created_at: string;
}

interface ResumeManagerRootProps {
  isAutofillSupported: boolean;
  isObserverActive: boolean;
}

export default function ResumeManagerRoot({ isAutofillSupported, isObserverActive }: ResumeManagerRootProps) {
    const [showFloatingUI, setShowFloatingUI] = useState(true);
    const [showTab, setShowTab] = useState(false);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        chrome.storage.local.get('supabaseSession', ({ supabaseSession }) => {  
          setSession(supabaseSession || null);
        });
        
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
          if (area === 'local' && changes.supabaseSession) {
            setSession(changes.supabaseSession.newValue || null);
          }
        };
    
        chrome.storage.onChanged.addListener(handleStorageChange);
    
        return () => {
          chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    useEffect(() => {
      if (session){
        supabase.auth.setSession(session);
      }
    }, [session]);

    useEffect(() => {
        const handler = () => setShowFloatingUI((prev) => !prev);
        window.addEventListener('toggle-resume-manager', handler);
        return () => window.removeEventListener('toggle-resume-manager', handler);
    }, []);

    const handleCloseFloatingUI = () => {
        setShowFloatingUI(false);
        setShowTab(true);
    }

    const handleOpenFloatingUI = () => {
        setShowFloatingUI(true);
        setShowTab(false);
    }

    const handleRemoveTab = () => {
        setShowTab(false);
    }

    const handleAutoFill = (resume: Resume) => {
        console.log('Auto filling resume:', resume);
    }

    return (
        <>
          {showFloatingUI && <FloatingUI session={session} onClose={handleCloseFloatingUI} onAutoFill={handleAutoFill} isAutofillSupported={isAutofillSupported} isObserverActive={isObserverActive} />}
          {showTab && (
            <div className="fixed top-1/2 right-0 z-[9999] flex flex-col items-end">
              <div className="relative">
                <button
                  className="absolute -top-2 -left-2 bg-white rounded-full shadow p-1 text-xs"
                  onClick={handleRemoveTab}
                  aria-label="Remove tab"
                >
                  ×
                </button>
                <button
                  className="bg-blue-600 text-white font-bold rounded-l-lg px-4 py-2 shadow"
                  onClick={handleOpenFloatingUI}
                  aria-label="Open Resume Manager"
                >
                  RM
                </button>
              </div>
            </div>
          )}
        </>
    );
}