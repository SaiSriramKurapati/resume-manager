chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SESSION_UPDATED') {
    chrome.storage.local.set({ supabaseSession: message.session });
    return; // Synchronous, no response needed.
  }

  if (message.type === 'SESSION_LOGGED_OUT') {
    chrome.storage.local.remove('supabaseSession');
    return;
  }

  if (message.type === 'FORWARD_TO_CONTENT_SCRIPT') {
    // Route the message to the content script in the sender's tab
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, message.payload, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ status: 'failed', error: chrome.runtime.lastError.message });
        } else {
          sendResponse(response);
        }
      });
    } else {
      sendResponse({ status: 'failed', error: 'Sender tab ID not found.' });
    }
    // Indicate that the response will be sent asynchronously
    return true;
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id!, { type: 'TOGGLE_RESUME_MANAGER' });
});


