# EurekaDeck - AI-Powered Flashcard Generator Chrome Extension

EurekaDeck is a Chrome extension that transforms any webpage into interactive flashcards using Chrome's built-in AI capabilities. It leverages Gemini Nano for on-device summarization and flashcard generation.

## Features

- Extract content from any webpage
- Generate concise summaries using Chrome's Summarization API
- Create interactive flashcards using Chrome's Prompt API
- Interactive carousel interface for flashcard navigation
- Track learning progress with scoring system
- Works completely on-device (no external API calls)

## Prerequisites

- Google Chrome version 131 or higher (Canary or Dev channel)
- At least 22GB of free storage space on the volume containing your Chrome profile
- Non-metered network connection
- Integrated GPU or discrete GPU with at least 4GB VRAM
- Operating System:
  - Windows 10/11, or
  - macOS 13 (Ventura) or higher

## Installation

1. Clone this repository: 

``` 
git clone [repository-url]
cd eurekadeck
```


2. Enable required Chrome flags:
   - Navigate to `chrome://flags/#optimization-guide-on-device-model`
     - Set to "Enabled BypassPerfRequirement"
   - Navigate to `chrome://flags/#prompt-api-for-gemini-nano`
     - Set to "Enabled"
   - Navigate to `chrome://flags/#summarization-api-for-gemini-nano`
     - Set to "Enabled"
   - Click "Restart" when prompted

3. Load the extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

4. Wait for model download:
   - Open `chrome://components`
   - Look for "Optimization Guide On Device Model"
   - Click "Check for update"
   - Wait for download to complete (3-5 minutes)

## Usage

1. Navigate to any webpage you want to study
2. Click the EurekaDeck extension icon
3. Select the number of flashcards you want to generate (5, 10, or 15)
4. Click "Generate Flashcards"
5. Use the carousel to navigate through flashcards
6. Click "Show Answer" to reveal the answer
7. Mark your response as correct or incorrect to track progress

## Project Structure

```eurekadeck/
├── manifest.json # Extension configuration
├── popup.html # Extension popup interface
├── popup.js # Popup functionality
├── popup.css # Popup styling
├── content.js # Webpage content extraction
├── background.js # AI processing and background tasks
├── images/ # Extension icons
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
└── lib/ # Third-party libraries
├── jquery-3.6.0.min.js
├── owl.carousel.min.js
├── owl.carousel.min.css
└── owl.theme.default.min.css
```

## Technical Details

- Uses Chrome's built-in Gemini Nano model for AI processing
- Implements Chrome's Summarization API for content summarization
- Uses Chrome's Prompt API for flashcard generation
- Built with Manifest V3
- Uses Owl Carousel for flashcard navigation
- jQuery for DOM manipulation

## Troubleshooting

If the extension isn't working:

1. Verify Chrome version (must be 131+)
2. Check if flags are properly enabled
3. Ensure model is downloaded in `chrome://components`
4. Check console for error messages
5. Verify storage space (22GB minimum)
6. Try restarting Chrome

## Development

To modify the extension:

1. Make changes to the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your chosen license]

## Acknowledgments

- Built using Chrome's AI APIs
- Uses Owl Carousel for UI
- jQuery for DOM manipulation
- Inspired by the need for better learning tools

## Privacy

- All processing happens on-device
- No data is sent to external servers
- Follows Google's Generative AI Prohibited Uses Policy