console.log('Content script loaded');

// Function to extract main content from webpage
function extractPageContent() {
  console.log('Extracting content...');
  // Get the article content or main content
  const article = document.querySelector('article') || document.querySelector('main');
  
  if (!article) {
    console.log('No article/main found, using body content');
    // Fallback to body content if no article/main found
    return {
      title: document.title,
      content: document.body.innerText,
      url: window.location.href
    };
  }

  return {
    title: document.title,
    content: article.innerText,
    url: window.location.href
  };
}

// Listen for messages from popup/background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  
  if (request.action === 'extractContent') {
    try {
      const content = extractPageContent();
      console.log('Content extracted:', content);
      sendResponse(content);
    } catch (error) {
      console.error('Error extracting content:', error);
      sendResponse({ error: error.message });
    }
  }
  return true; // Keep the message channel open for async response
}); 