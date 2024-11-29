// Initialize APIs
let summarizer = null;
let promptModel = null;

// Function to check API availability
async function checkAPIAvailability() {
  if (!chrome.ai) {
    console.log('chrome.ai not available yet');
    return false;
  }

  try {
    const summarizerCapabilities = await chrome.ai.summarizer.capabilities();
    const promptCapabilities = await chrome.ai.prompt.capabilities();
    
    console.log('Summarizer capabilities:', summarizerCapabilities);
    console.log('Prompt capabilities:', promptCapabilities);
    
    return summarizerCapabilities.available === 'readily' && 
           promptCapabilities.available === 'readily';
  } catch (error) {
    console.error('Error checking API availability:', error);
    return false;
  }
}

// Function to initialize APIs
async function initializeAPIs() {
  try {
    // Force Chrome to schedule model download
    console.log('Registering APIs...');
    try {
      await chrome.ai.summarizer.create();
      await chrome.ai.prompt.create();
    } catch (e) {
      console.log('Initial API registration (expected to fail):', e);
    }

    // Wait and check availability
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      console.log(`Checking API availability (attempt ${attempts + 1}/${maxAttempts})...`);
      
      if (await checkAPIAvailability()) {
        summarizer = chrome.ai.summarizer;
        promptModel = chrome.ai.prompt;
        console.log('APIs initialized successfully');
        return true;
      }
      
      console.log('APIs not ready yet, waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    }
    
    throw new Error('Failed to initialize APIs after multiple attempts');
  } catch (error) {
    console.error('API initialization failed:', error);
    return false;
  }
}

// Initialize on install and on startup
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed, initializing APIs...');
  initializeAPIs();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Chrome started, initializing APIs...');
  initializeAPIs();
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateFlashcards') {
    handleGenerateFlashcards(request)
      .then(response => sendResponse(response))
      .catch(error => {
        console.error('Error in handleGenerateFlashcards:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

async function handleGenerateFlashcards(request) {
  if (!summarizer || !promptModel) {
    throw new Error('APIs not initialized. Make sure you have Chrome 131+ and the required flags enabled.');
  }

  try {
    // First summarize the content
    const summaryResult = await summarizer.summarize({
      text: request.content,
      modelConfig: {
        type: 'key-points',
        format: 'markdown',
        length: 'medium'
      }
    });
    console.log('Summary generated:', summaryResult.summary);

    // Generate flashcards using the Prompt API
    const promptTemplate = `Create ${request.numCards || 10} flashcards from this text. 
      Each flashcard should have a question and answer.
      Format the output as a JSON array of objects with "question" and "answer" fields.
      Text to process: ${summaryResult.summary}`;

    const flashcardsResponse = await promptModel.prompt({
      prompt: promptTemplate,
      modelConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        candidateCount: 1
      }
    });

    if (!flashcardsResponse.candidates || !flashcardsResponse.candidates.length) {
      throw new Error('No response from AI model');
    }

    // Parse and validate the response
    const flashcards = JSON.parse(flashcardsResponse.candidates[0].text);
    if (!Array.isArray(flashcards)) {
      throw new Error('Response is not an array');
    }

    console.log('Generated flashcards:', flashcards);
    return { success: true, flashcards };
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
} 