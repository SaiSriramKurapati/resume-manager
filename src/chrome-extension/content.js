// Check if the current page is a job application page
function isJobPage() {
    // Expanded list of job-related URL keywords
    const jobKeywords = [
        '/jobs', '/careers', '/apply', '/application', 
        '/job-', '/career-', '/positions', 
        '/opportunities', '/vacancy', '/employment'
    ];
    
    // Check form elements with resume-related attributes
    const hasResumeInputs = document.querySelectorAll('input[type="file"][accept*="pdf"], input[type="file"][name*="resume"], input[type="file"][name*="cv"]').length > 0;
    
    // Check for job-related elements
    const jobTextElements = document.querySelectorAll('h1, h2, h3, h4, h5');
    let hasJobTitles = false;
    
    for (const element of jobTextElements) {
        const text = element.innerText.toLowerCase();
        if (text.includes('job application') || 
            text.includes('apply') || 
            text.includes('upload resume') || 
            text.includes('upload your cv')) {
            hasJobTitles = true;
            break;
        }
    }
    
    // Check URL for job-related keywords
    const urlMatchesJobPattern = jobKeywords.some(keyword => 
        window.location.href.toLowerCase().includes(keyword)
    );
    
    return urlMatchesJobPattern || hasResumeInputs || hasJobTitles;
}

// Trigger popup when on a job page after a short delay to ensure page is loaded
setTimeout(() => {
    if (isJobPage()) {
        chrome.runtime.sendMessage({ showPopup: true });
    }
}, 1500);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.checkJobPage && isJobPage()) {
        chrome.runtime.sendMessage({ showPopup: true });
    }
});