// Supabase initialization
const SUPABASE_URL = 'https://gkfgezmcsqvyhqnxxfto.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZmdlem1jc3F2eWhxbnh4ZnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTQyODcsImV4cCI6MjA2MjE5MDI4N30.rNs-OKTGi_BBycgnGZzB_OVYjKGBmChlgupAeSgm0xM';
const supabase = window.supabaseClient.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const loginSection = document.getElementById('login-section');
const resumeSection = document.getElementById('resume-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const autoFillBtn = document.getElementById('auto-fill-btn');
const actionButtons = document.getElementById('action-buttons');
const statusMessage = document.getElementById('status-message');
const loadingResumes = document.getElementById('loading-resumes');
const noResumesMessage = document.getElementById('no-resumes-message');

// Global state
let selectedResume = null;

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const loginBtn = document.querySelector('#login-btn');
  const loginSpan = loginBtn.querySelector('span');
  const loader = loginBtn.querySelector('.loader');
  
  loginSpan.style.display = 'none';
  loader.style.display = 'inline-block';
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    showResumeSection();
    fetchResumes();
  } catch (error) {
    loginError.textContent = error.message || 'Failed to login';
  } finally {
    loginSpan.style.display = 'inline';
    loader.style.display = 'none';
  }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    showLoginSection();
    selectedResume = null;
  }
});

// Handle auto-fill button click
autoFillBtn.addEventListener('click', async () => {
  if (!selectedResume) {
    statusMessage.textContent = 'Please select a resume first';
    statusMessage.className = 'status error';
    return;
  }
  
  if (!selectedResume.url) {
    statusMessage.textContent = 'No valid URL for this resume';
    statusMessage.className = 'status error';
    return;
  }
  
  const autoFillBtnSpan = autoFillBtn.querySelector('span');
  const loader = autoFillBtn.querySelector('.loader');
  
  autoFillBtnSpan.style.display = 'none';
  loader.style.display = 'inline-block';
  statusMessage.textContent = 'Searching for file inputs...';
  statusMessage.className = 'status';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Execute content script to check for file inputs
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: checkFileInputs
    });
    
    const fileInputsExist = results[0].result;
    
    if (!fileInputsExist) {
      statusMessage.textContent = 'No file input fields found on this page';
      statusMessage.className = 'status error';
      autoFillBtnSpan.style.display = 'inline';
      loader.style.display = 'none';
      return;
    }
    
    // Apply the resume if file inputs exist
    statusMessage.textContent = 'Auto-filling resume...';
    
    // Ensure we have a string URL
    const resumeUrl = selectedResume.url.toString();
    console.log('Auto-filling with URL:', resumeUrl);
    
    const success = await autoFillResume(resumeUrl, tab.id);
    
    if (success) {
      statusMessage.textContent = 'Resume auto-filled successfully';
      statusMessage.className = 'status success';
      
      // No auto-closing - removed the setTimeout for window.close()
    } else {
      statusMessage.textContent = 'Could not auto-fill resume';
      statusMessage.className = 'status error';
    }
  } catch (error) {
    console.error('Error in auto-fill:', error);
    statusMessage.textContent = 'Error: ' + error.message;
    statusMessage.className = 'status error';
  } finally {
    autoFillBtnSpan.style.display = 'inline';
    loader.style.display = 'none';
  }
});

// Show login section
function showLoginSection() {
  loginSection.style.display = 'block';
  resumeSection.style.display = 'none';
  loginError.textContent = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
}

// Show resume section
function showResumeSection() {
  loginSection.style.display = 'none';
  resumeSection.style.display = 'block';
  actionButtons.style.display = 'none';
  statusMessage.textContent = '';
}

// Handle preview button click - open in browser tab instead of modal
function openResumePreview(resumeUrl, resumeName) {
  console.log('Opening preview for resume:', resumeName);
  console.log('URL:', resumeUrl);
  
  try {
    // Ensure URL is a string and properly formatted
    const urlString = resumeUrl.toString();
    console.log('URL string:', urlString);
    
    // Make sure URL has proper protocol
    let formattedUrl = urlString;
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      formattedUrl = 'https://' + urlString.replace(/^\/\//, '');
      console.log('Formatted URL:', formattedUrl);
    }
    
    // First try to open the URL directly
    chrome.tabs.create({ url: formattedUrl }, (tab) => {
      if (chrome.runtime.lastError) {
        console.error('Error opening tab directly:', chrome.runtime.lastError);
        // If direct URL opening fails, try downloading and previewing
        downloadAndPreview(formattedUrl, resumeName);
      } else {
        console.log('Tab created successfully with ID:', tab.id);
      }
    });
  } catch (error) {
    console.error('Error in openResumePreview:', error);
  }
}

// Download and preview file as a fallback
async function downloadAndPreview(url, fileName) {
  console.log('Attempting to download and preview file:', fileName);
  
  try {
    // Fetch the file
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    // Get the blob
    const blob = await response.blob();
    
    // Create object URL
    const objectUrl = URL.createObjectURL(blob);
    console.log('Created object URL:', objectUrl);
    
    // Open in new tab
    chrome.tabs.create({ url: objectUrl }, (tab) => {
      if (chrome.runtime.lastError) {
        console.error('Error opening object URL tab:', chrome.runtime.lastError);
        
        // Final fallback: try to download the file
        const downloadLink = document.createElement('a');
        downloadLink.href = objectUrl;
        downloadLink.download = fileName || 'resume.pdf';
        downloadLink.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
      } else {
        console.log('Object URL tab created successfully with ID:', tab.id);
        
        // Listen for tab close to clean up object URL
        chrome.tabs.onRemoved.addListener(function listener(tabId) {
          if (tabId === tab.id) {
            URL.revokeObjectURL(objectUrl);
            chrome.tabs.onRemoved.removeListener(listener);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error in downloadAndPreview:', error);
  }
}

// Get current user from Supabase auth
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return data.session?.user || null;
}

// Fetch and display resumes
async function fetchResumes() {
  const user = await getCurrentUser();
  
  if (!user) {
    showLoginSection();
    return;
  }
  
  showResumeSection();
  
  // Show loading indicator
  const resumeList = document.getElementById('resume-list');
  resumeList.innerHTML = '';
  loadingResumes.style.display = 'inline-block';
  noResumesMessage.style.display = 'none';
  
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      throw error;
    }
    
    console.log('Fetched resumes:', data);
    
    if (data && data.length > 0) {
      data.forEach(resume => {
        const item = createResumeItem(resume);
        resumeList.appendChild(item);
      });
    } else {
      noResumesMessage.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching resumes:', error);
    noResumesMessage.textContent = 'Error loading resumes';
    noResumesMessage.style.display = 'block';
  } finally {
    loadingResumes.style.display = 'none';
  }
}

// Check if the page has file input fields
function checkFileInputs() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  return fileInputs.length > 0;
}

// Auto-fill resume
async function autoFillResume(resumeUrl, tabId) {
  // Ensure resumeUrl is a string
  const urlString = resumeUrl.toString();
  
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: injectResume,
      args: [urlString]
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('Script error:', chrome.runtime.lastError.message);
        resolve(false);
      } else {
        resolve(results && results[0] && results[0].result);
      }
    });
  });
}

// Inject resume into file input fields
function injectResume(resumeUrl) {
  console.log('Injecting resume from URL:', resumeUrl);
  
  return new Promise(async (resolve) => {
    try {
      // Ensure resumeUrl is a string
      if (!resumeUrl || typeof resumeUrl !== 'string') {
        console.error('Invalid resumeUrl:', resumeUrl);
        resolve(false);
        return;
      }
      
      // Fetch the resume file
      console.log('Fetching resume from:', resumeUrl);
      const response = await fetch(resumeUrl);
      
      if (!response.ok) {
        console.error('Failed to fetch resume:', response.status, response.statusText);
        resolve(false);
        return;
      }
      
      const blob = await response.blob();
      
      // Always use "Resume.pdf" as the file name for job applications
      const file = new File([blob], "Resume.pdf", { type: "application/pdf" });
      console.log('Created file with name: Resume.pdf');
      
      // Find file input fields
      const fileInputs = document.querySelectorAll('input[type="file"]');
      let filledCount = 0;
      
      if (fileInputs.length > 0) {
        console.log(`Found ${fileInputs.length} file input fields`);
        
        // 1. First try to find resume-specific inputs
        const resumeInputs = [];
        let bestResumeInput = null;
        let bestScore = 0;
        
        fileInputs.forEach(input => {
          if (input.style.display === 'none' || input.type === 'hidden') {
            return;
          }
          
          // Score each input based on how likely it is to be a resume field
          let score = 0;
          const inputName = (input.name || '').toLowerCase();
          const inputId = (input.id || '').toLowerCase();
          const inputAccept = (input.getAttribute('accept') || '').toLowerCase();
          
          // Check nearby label texts (up to 3 parent levels)
          let parentElement = input.parentElement;
          let labelText = '';
          let depth = 0;
          
          while (parentElement && depth < 3) {
            // Check for label elements
            const labels = parentElement.querySelectorAll('label');
            labels.forEach(label => {
              labelText += ' ' + (label.textContent || '').toLowerCase();
            });
            
            // Check for headings or paragraphs
            const textElements = parentElement.querySelectorAll('h1, h2, h3, h4, h5, p, div, span');
            textElements.forEach(el => {
              labelText += ' ' + (el.textContent || '').toLowerCase();
            });
            
            parentElement = parentElement.parentElement;
            depth++;
          }
          
          // Check if the input is directly inside or associated with a label
          const associatedLabel = document.querySelector(`label[for="${inputId}"]`);
          if (associatedLabel) {
            labelText += ' ' + (associatedLabel.textContent || '').toLowerCase();
          }
          
          // Score resume-specific attributes
          const resumeKeywords = ['resume', 'cv', 'curriculum', 'vitae', 'résumé'];
          const coverKeywords = ['cover', 'letter', 'motivation'];
          
          // Check name/id for resume keywords
          resumeKeywords.forEach(keyword => {
            if (inputName.includes(keyword)) score += 10;
            if (inputId.includes(keyword)) score += 10;
          });
          
          // Penalize if name/id contains cover letter keywords
          coverKeywords.forEach(keyword => {
            if (inputName.includes(keyword)) score -= 20;
            if (inputId.includes(keyword)) score -= 20;
          });
          
          // Check nearby text for resume keywords
          resumeKeywords.forEach(keyword => {
            if (labelText.includes(keyword)) score += 5;
          });
          
          // Penalize if nearby text has cover letter keywords
          coverKeywords.forEach(keyword => {
            if (labelText.includes(keyword)) score -= 15;
          });
          
          // Check accept attribute for doc/pdf
          if (inputAccept.includes('pdf') || inputAccept.includes('doc')) {
            score += 5;
          }
          
          // Found a resume-specific input with positive score
          if (score > 0) {
            resumeInputs.push({ input, score });
            if (score > bestScore) {
              bestScore = score;
              bestResumeInput = input;
            }
          }
          
          console.log(`Input ${inputName || inputId || 'unnamed'} scored ${score}`);
        });
        
        // First approach: If we found resume-specific inputs, use only those
        if (resumeInputs.length > 0) {
          console.log('Found resume-specific inputs:', resumeInputs.length);
          
          // If there's a clear winner with a high score, just use that one
          if (bestResumeInput && bestScore >= 15) {
            console.log(`Using best match with score ${bestScore}`);
            try {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              bestResumeInput.files = dataTransfer.files;
              
              // Dispatch change event
              const event = new Event('change', { bubbles: true });
              bestResumeInput.dispatchEvent(event);
              
              filledCount++;
              console.log('Successfully filled resume-specific input');
            } catch (err) {
              console.error('Error filling resume input:', err);
            }
          } else {
            // Otherwise use all resume-related inputs, sorted by score
            resumeInputs
              .sort((a, b) => b.score - a.score)
              .forEach(({ input }) => {
                try {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  input.files = dataTransfer.files;
                  
                  // Dispatch change event
                  const event = new Event('change', { bubbles: true });
                  input.dispatchEvent(event);
                  
                  filledCount++;
                  console.log('Filled resume input');
                } catch (err) {
                  console.error('Error filling resume input:', err);
                }
              });
          }
        } else {
          // Fallback: If no resume-specific inputs found, use the first valid file input
          console.log('No resume-specific inputs found, using fallback');
          
          for (const input of fileInputs) {
            // Skip hidden inputs or inputs that are not visible
            if (input.style.display === 'none' || input.type === 'hidden') {
              console.log('Skipping hidden input');
              continue;
            }
            
            try {
              // Check if this input accepts appropriate file types
              const acceptAttr = input.getAttribute('accept');
              if (acceptAttr && 
                  !(acceptAttr.includes('pdf') || 
                    acceptAttr.includes('doc') || 
                    acceptAttr.includes('application/pdf') || 
                    acceptAttr.includes('*') || 
                    acceptAttr === '')) {
                console.log('Skipping input that does not accept PDFs:', acceptAttr);
                continue;
              }
              
              // Auto-fill the resume
              console.log('Filling input as fallback:', input.name || input.id || 'unnamed');
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
              
              // Dispatch change event
              const event = new Event('change', { bubbles: true });
              input.dispatchEvent(event);
              
              filledCount++;
              console.log('Successfully filled input');
              
              // Only fill the first valid input in fallback mode
              break;
            } catch (err) {
              console.error('Error filling individual input:', err);
            }
          }
        }
        
        console.log(`Resume applied to ${filledCount} input(s) successfully`);
        resolve(filledCount > 0);
      } else {
        console.log('No file input fields found');
        resolve(false);
      }
    } catch (error) {
      console.error('Error in injecting resume:', error);
      resolve(false);
    }
  });
}

// Helper function to create resume item from template
function createResumeItem(resume) {
  const template = document.getElementById('resume-item-template');
  const clone = template.content.cloneNode(true);
  
  // Get the URL from the appropriate field
  const resumeUrl = resume.file_url || '';
  const fileName = resume.name || 'Unnamed Resume';
  
  // Set the file name
  const fileNameElement = clone.querySelector('.file-name');
  fileNameElement.textContent = fileName;
  
  // Get the list item element
  const listItem = clone.querySelector('.resume-item');
  listItem.dataset.url = resumeUrl;
  listItem.dataset.id = resume.id;
  
  // Set up preview button
  const previewBtn = clone.querySelector('.preview-btn');
  previewBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Clicking preview for:', fileName, 'URL:', resumeUrl);
    
    if (!resumeUrl) {
      console.error('No URL found for resume:', fileName);
      alert('No preview available for this resume');
      return;
    }
    
    openResumePreview(resumeUrl, fileName);
  });
  
  // Set up list item click handler
  listItem.addEventListener('click', () => {
    // Deselect previously selected resume
    const selectedItems = document.querySelectorAll('#resume-list .selected');
    selectedItems.forEach(el => el.classList.remove('selected'));
    
    // Select current resume
    listItem.classList.add('selected');
    selectedResume = {
      id: resume.id,
      name: resume.name,
      fileName: fileName,
      url: resumeUrl
    };
    
    // Show auto-fill button
    const actionButtons = document.getElementById('action-buttons');
    const statusMessage = document.getElementById('status-message');
    actionButtons.style.display = 'flex';
    statusMessage.textContent = '';
  });
  
  return clone;
}

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  // Add close button event listener
  document.getElementById('close-popup').addEventListener('click', () => {
    window.close();
  });
  
  // Check if user is already logged in
  const user = await getCurrentUser();
  if (user) {
    showResumeSection();
    fetchResumes();
  } else {
    showLoginSection();
  }
  
  // Update the auto-fill button handler to remove auto-close functionality
  updateAutoFillButtonHandler();
});

// Remove the auto-close functionality from autoFillBtn click handler by replacing the success callback
function updateAutoFillButtonHandler() {
  // Get reference to the autoFillBtn
  const autoFillBtn = document.getElementById('auto-fill-btn');
  
  // Remove the existing event listener if it exists
  const oldClickHandler = autoFillBtn.onclick;
  if (oldClickHandler) {
    autoFillBtn.removeEventListener('click', oldClickHandler);
  }
  
  // Add the new event listener
  autoFillBtn.addEventListener('click', async () => {
    if (!selectedResume) {
      statusMessage.textContent = 'Please select a resume first';
      statusMessage.className = 'status error';
      return;
    }
    
    if (!selectedResume.url) {
      statusMessage.textContent = 'No valid URL for this resume';
      statusMessage.className = 'status error';
      return;
    }
    
    const autoFillBtnSpan = autoFillBtn.querySelector('span');
    const loader = autoFillBtn.querySelector('.loader');
    
    autoFillBtnSpan.style.display = 'none';
    loader.style.display = 'inline-block';
    statusMessage.textContent = 'Searching for file inputs...';
    statusMessage.className = 'status';
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute content script to check for file inputs
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: checkFileInputs
      });
      
      const fileInputsExist = results[0].result;
      
      if (!fileInputsExist) {
        statusMessage.textContent = 'No file input fields found on this page';
        statusMessage.className = 'status error';
        autoFillBtnSpan.style.display = 'inline';
        loader.style.display = 'none';
        return;
      }
      
      // Apply the resume if file inputs exist
      statusMessage.textContent = 'Auto-filling resume...';
      
      // Ensure we have a string URL
      const resumeUrl = selectedResume.url.toString();
      console.log('Auto-filling with URL:', resumeUrl);
      
      const success = await autoFillResume(resumeUrl, tab.id);
      
      if (success) {
        statusMessage.textContent = 'Resume auto-filled successfully';
        statusMessage.className = 'status success';
        
        // No auto-closing - removed the setTimeout for window.close()
      } else {
        statusMessage.textContent = 'Could not auto-fill resume';
        statusMessage.className = 'status error';
      }
    } catch (error) {
      console.error('Error in auto-fill:', error);
      statusMessage.textContent = 'Error: ' + error.message;
      statusMessage.className = 'status error';
    } finally {
      autoFillBtnSpan.style.display = 'inline';
      loader.style.display = 'none';
    }
  });
}
  