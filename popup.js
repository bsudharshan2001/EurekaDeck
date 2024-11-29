console.log('jQuery version:', typeof $, $.fn.jquery);
console.log('Owl Carousel version:', typeof $.fn.owlCarousel);

let currentFlashcards = [];
let currentIndex = 0;
let score = 0;

// Wait for both DOM and jQuery to be ready
$(document).ready(() => {
  const generateBtn = document.getElementById('generateBtn');
  const numCardsSelect = document.getElementById('numCards');
  
  // Initialize Owl Carousel
  try {
    const carousel = $('#flashcardsCarousel').owlCarousel({
      items: 1,
      loop: false,
      nav: true,
      dots: true,
      onChanged: (event) => {
        currentIndex = event.item.index;
        updateProgress();
      }
    });

    console.log('Carousel initialized successfully');
  } catch (error) {
    console.error('Error initializing carousel:', error);
  }

  generateBtn.addEventListener('click', async () => {
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    
    try {
      // Get current tab content
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active tab found');
      }
      
      console.log('Sending message to tab:', tab.id);
      const content = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      
      if (!content) {
        throw new Error('No content received from page');
      }
      
      if (content.error) {
        throw new Error(content.error);
      }
      
      // Generate flashcards
      const response = await chrome.runtime.sendMessage({
        action: 'generateFlashcards',
        content: content.content,
        numCards: parseInt(numCardsSelect.value)
      });

      if (response.success) {
        currentFlashcards = response.flashcards;
        displayFlashcards(currentFlashcards);
        resetScore();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Failed to generate flashcards: ' + error.message);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Flashcards';
    }
  });
});

function displayFlashcards(flashcards) {
  const carousel = $('#flashcardsCarousel');
  carousel.empty();

  flashcards.forEach((card, index) => {
    const cardElement = createFlashcardElement(card, index);
    carousel.append(cardElement);
  });

  // Refresh the carousel after adding new items
  carousel.trigger('refresh.owl.carousel');
  updateProgress();
}

function createFlashcardElement(card, index) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'flashcard';
  cardDiv.innerHTML = `
    <div class="flashcard-inner">
      <div class="flashcard-front">
        <p class="question">${card.question}</p>
        <button class="flip-btn">Show Answer</button>
      </div>
      <div class="flashcard-back">
        <p class="answer">${card.answer}</p>
        <div class="feedback-buttons">
          <button class="correct-btn">I got it right</button>
          <button class="wrong-btn">I got it wrong</button>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const flipBtn = cardDiv.querySelector('.flip-btn');
  const correctBtn = cardDiv.querySelector('.correct-btn');
  const wrongBtn = cardDiv.querySelector('.wrong-btn');

  flipBtn.addEventListener('click', () => {
    cardDiv.querySelector('.flashcard-inner').classList.add('flipped');
  });

  correctBtn.addEventListener('click', () => handleAnswer(true));
  wrongBtn.addEventListener('click', () => handleAnswer(false));

  return cardDiv;
}

function handleAnswer(isCorrect) {
  if (isCorrect) {
    score++;
  }
  updateScore();
  
  // Move to next card
  $('#flashcardsCarousel').trigger('next.owl.carousel');
}

function updateScore() {
  const scoreElement = document.getElementById('score');
  const totalElement = document.getElementById('total');
  
  scoreElement.textContent = score;
  totalElement.textContent = currentFlashcards.length;
}

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const progress = ((currentIndex + 1) / currentFlashcards.length) * 100;
  progressFill.style.width = `${progress}%`;
}

function resetScore() {
  score = 0;
  currentIndex = 0;
  updateScore();
  updateProgress();
}

function showError(message) {
  const errorContainer = document.getElementById('error-container');
  errorContainer.style.display = 'block';
  errorContainer.textContent = message;
  errorContainer.style.color = 'red';
  errorContainer.style.padding = '10px';
  errorContainer.style.marginBottom = '10px';
  
  // Hide error after 5 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
} 