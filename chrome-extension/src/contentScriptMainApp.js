// This script runs on the main web app to bridge the session to the extension.

(function() {
  let sessionExists = false;

  const findSessionKey = () => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        return key;
      }
    }
    return null;
  };

  const checkSession = () => {
    const sessionKey = findSessionKey();

    if (sessionKey && !sessionExists) {
      // --- LOGIN DETECTED ---
      // Session has appeared.
      try {
        const sessionData = JSON.parse(localStorage.getItem(sessionKey));
        if (sessionData) {
          chrome.runtime.sendMessage({ type: 'SESSION_UPDATED', session: sessionData });
          sessionExists = true;
        }
      } catch (e) {
        console.error('Resume Manager: Error parsing session data.', e);
      }
    } else if (!sessionKey && sessionExists) {
      // --- LOGOUT DETECTED ---
      // Session has disappeared.
      // Send to both background and any active UI for immediate update.
      chrome.runtime.sendMessage({ type: 'SESSION_LOGGED_OUT' });
      sessionExists = false;
    }
  };

  // Poll for session changes every 2 seconds. This is more robust than a
  // one-time check and necessary to detect logout.
  checkSession(); // Initial check on load
  setInterval(checkSession, 2000);

})();

