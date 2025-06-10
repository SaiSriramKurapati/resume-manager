import { useEffect, useState } from 'react';
import FloatingUI from './FloatingUI';
import { supabase } from '../lib/supabaseClient';

interface ResumeManagerRootProps {
  isAutofillSupported: boolean;
  isObserverActive: boolean;
}

export default function ResumeManagerRoot({ isAutofillSupported, isObserverActive }: ResumeManagerRootProps) {
    const [showFloatingUI, setShowFloatingUI] = useState(true);
    const [showTab, setShowTab] = useState(false);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session: localSession } } = await supabase.auth.getSession();
            
            if (localSession) {
                // We have a session in storage. Let's verify it with the server.
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    // Session is invalid/expired. Clean up.
                    setSession(null);
                    chrome.storage.local.remove('supabaseSession');
                } else {
                    // Session is valid.
                    setSession(localSession);
                }
            } else {
                // No session found.
                setSession(null);
            }
        };

        checkSession();
        
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
          if (area === 'local' && 'supabaseSession' in changes) {
            // This key has been changed (either updated or removed).
            // We get the new value, which will be undefined if it was removed.
            const newSession = changes.supabaseSession.newValue || null;
            setSession(newSession);
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

    // This effect listens for direct messages to update the UI instantly,
    // providing a fallback for when the background service worker is inactive.
    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.type === 'SESSION_UPDATED') {
                setSession(message.session);
            }
            if (message.type === 'SESSION_LOGGED_OUT') {
                setSession(null);
            }
        };
        chrome.runtime.onMessage.addListener(handleMessage);
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    return (
        <>
          {showFloatingUI && <FloatingUI session={session} onClose={handleCloseFloatingUI} isAutofillSupported={isAutofillSupported} isObserverActive={isObserverActive} />}
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