// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.showPopup) {
        // Show the popup programmatically
        chrome.action.setPopup({ tabId: sender.tab.id, popup: 'popup.html' });
        chrome.action.openPopup();
        sendResponse({ status: 'Popup opened' });
    }
    return true;
});

// Listen for URL changes to detect job/career pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && 
        (tab.url.includes('/jobs') || tab.url.includes('/careers'))) {
        chrome.tabs.sendMessage(tabId, { checkJobPage: true });
    }
});