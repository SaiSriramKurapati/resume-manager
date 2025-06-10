import { createRoot } from 'react-dom/client';
import ResumeManagerRoot from './popup/ResumeManagerRoot';
import tailwindStyles from './styles/tailwind.css?inline';

// console.log('Content script loaded');

const container = document.createElement('div');
container.id = 'resume-manager-floating-ui';

// Reset all CSS properties to their initial values, creating a hermetic seal.
// This prevents ANY style from the host page (e.g., box-sizing, positioning)
// from affecting the container. We then reset display to make it visible.
container.style.all = 'initial';
container.style.display = 'block';

// Dynamically scale the UI to counteract host pages that change the root font-size,
// which would otherwise break all `rem` units used by Tailwind.
const hostFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
const desiredBaseFontSize = 16; // The pixel value that Tailwind's `1rem` is based on.
if (hostFontSize !== desiredBaseFontSize) {
  const zoomRatio = desiredBaseFontSize / hostFontSize;
  container.style.zoom = `${zoomRatio}`;
}

document.body.appendChild(container);

// Create a Shadow DOM to encapsulate styles
const shadowRoot = container.attachShadow({ mode: 'open' });

// Create a container for the React app within the Shadow DOM
const appContainer = document.createElement('div');
// Apply base Tailwind styles to reset the context for inheritable CSS properties
appContainer.className = 'font-sans antialiased text-base font-normal';
shadowRoot.appendChild(appContainer);

// Inject Tailwind styles directly into the Shadow DOM
const styleElement = document.createElement('style');
styleElement.textContent = tailwindStyles;
shadowRoot.appendChild(styleElement);

const root = createRoot(appContainer);

function checkForSupportAndRender(isObserverActive = false) {
  const isSupported = document.querySelectorAll('input[type="file"]').length > 0;
  root.render(
    <ResumeManagerRoot
      isAutofillSupported={isSupported}
      isObserverActive={!isSupported && isObserverActive}
    />
  );
  return isSupported;
}

// A list of domains known to have delayed-loading application forms.
const domainsWithDelayedForms = ['jobs.ashbyhq.com'];
const currentHostname = window.location.hostname;
const needsObserver = domainsWithDelayedForms.some(domain => currentHostname.includes(domain));

// Initial check
if (!checkForSupportAndRender(needsObserver) && needsObserver) {
  // If not supported initially, and on a known site,
  // set up an observer to watch for the form.
  const observer = new MutationObserver((mutationsList, obs) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        if (checkForSupportAndRender(true)) {
          // Form found, disconnect the observer.
          obs.disconnect();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Optional: disconnect observer after a timeout to prevent it running forever.
  setTimeout(() => {
    observer.disconnect();
  }, 120000); // 2 minutes
}

chrome.runtime.onMessage.addListener((message, _unused, sendResponse) => {
  // Handle TOGGLE_RESUME_MANAGER
  if (message.type === 'TOGGLE_RESUME_MANAGER') {
    window.dispatchEvent(new Event('toggle-resume-manager'));
    sendResponse();
    return;
  }

  // Handle AUTOFILL_RESUME
  if (message.type === 'AUTOFILL_RESUME') {
    setTimeout(async () => {
      try {
        // 1. Find all file inputs
        const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')) as HTMLInputElement[];
        if (fileInputs.length === 0) {
          sendResponse({ status: 'not-supported' });
          return;
        }

        // 2. Try to find the best match for resume
        const keywords = ['resume', 'cv', 'upload'];
        let bestInput: HTMLInputElement | null = null;
        for (const input of fileInputs) {
          const labelElem = input.id ? document.querySelector(`label[for="${input.id}"]`) as HTMLLabelElement : null;
          const label = labelElem?.innerText?.toLowerCase() || '';
          const placeholder = input.getAttribute('placeholder')?.toLowerCase() || '';
          const ariaLabel = input.getAttribute('aria-label')?.toLowerCase() || '';
          const name = input.getAttribute('name')?.toLowerCase() || '';
          const id = input.id?.toLowerCase() || '';
          const allText = [label, placeholder, ariaLabel, name, id].join(' ');
          if (keywords.some(k => allText.includes(k))) {
            bestInput = input;
            break;
          }
        }
        if (!bestInput) {
          // fallback: just pick the first file input
          bestInput = fileInputs[0];
        }

        if (!bestInput) {
          sendResponse({ status: 'no-fields' });
          return;
        }

        // 3. Fetch the resume file and attach it
        if (!message.resume?.file_url) {
          throw new Error('Resume file URL not provided.');
        }
        const response = await fetch(message.resume.file_url);
        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.statusText}`);
        }
        const fileBlob = await response.blob();
        const resumeFile = new File([fileBlob], 'Resume.pdf', { type: fileBlob.type });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(resumeFile);
        bestInput.files = dataTransfer.files;

        // 4. Dispatch a change event to notify the page and focus the input
        bestInput.dispatchEvent(new Event('change', { bubbles: true }));
        bestInput.focus();
        bestInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 5. Return status
        sendResponse({ status: 'complete' });
      } catch (error) {
        console.error('Auto-fill failed:', error);
        try {
          sendResponse({ status: 'failed', error: (error as Error).message });
        } catch (err) {
          // This warning can be noisy. It's better to rely on the outer error log.
          // console.warn('sendResponse failed silently', err);
        }
      }
    }, 0);
    return true;
  }
});
