window.addEventListener('supabase-session', (event) => {
    const session = event.detail;
    chrome.storage.local.set({ supabaseSession: session });
});

