import axios from 'axios';

// Base URLs for API calls
const API_URL = 'http://localhost:5000/api';
const FASTAPI_URL = 'http://localhost:8004';

// Log the API URLs for debugging
console.log('Groq Service API URL:', API_URL);
console.log('Groq Service FastAPI URL:', FASTAPI_URL);

// Flag to enable AI enhancement
let aiEnhancementEnabled = true;

// Function to toggle AI enhancement
export const toggleAIEnhancement = (enabled) => {
  aiEnhancementEnabled = enabled;
  console.log(`AI enhancement ${aiEnhancementEnabled ? 'enabled' : 'disabled'}`);
  return aiEnhancementEnabled;
};

// Function to check if AI enhancement is enabled
export const isAIEnhancementEnabled = () => {
  return aiEnhancementEnabled;
};

// Groq API service for real-time conversation translation and text generation
const groqService = {
  // Translate conversation using Groq API
  async translateConversation(messages, sourceLanguage, targetLanguage) {
    try {
      // Check if AI enhancement is enabled
      if (aiEnhancementEnabled) {
        try {
          console.log('Using FastAPI backend for context-aware chat translation');

          // Get the last message
          const lastMessage = messages[messages.length - 1];

          // Format conversation history for context
          const conversationHistory = messages.slice(0, -1).map(msg => ({
            text: msg.text,
            speaker: msg.speaker,
            language: msg.language
          }));

          // Call the FastAPI backend
          const response = await axios.post(`${FASTAPI_URL}/translate-chat`, {
            message: lastMessage.text,
            conversationHistory,
            sourceLanguage,
            targetLanguage,
            aiEnhance: true
          }, {
            timeout: 15000 // 15 second timeout
          });

          if (response.data.success && response.data.translated) {
            console.log('FastAPI returned context-aware translation');
            return {
              originalText: lastMessage.text,
              translatedText: response.data.translated,
              detectedLanguage: sourceLanguage,
              targetLanguage: targetLanguage,
              aiEnhanced: true
            };
          }
        } catch (fastApiError) {
          console.warn('FastAPI context-aware translation failed, falling back to other methods:', fastApiError.message);
          console.log('AI enhancement is not available. Please make sure the backend server is running.');
          // Continue with other methods
        }
      }

      // Try to use the server API next
      try {
        const response = await axios.post(`${API_URL}/translate/conversation`, {
          messages,
          sourceLanguage,
          targetLanguage,
          prompt: this.getGroqPrompt(messages, sourceLanguage, targetLanguage)
        }, {
          headers: {
            'Authorization': 'Bearer YOUR_GROQ_API_KEY', // This should be set on the server side
            'Content-Type': 'application/json'
          }
        });

        return response.data;
      } catch (error) {
        console.error('Error calling Groq API via server:', error);

        // Fallback to local translation if server is unavailable
        return this.fallbackTranslateConversation(messages, sourceLanguage, targetLanguage);
      }
    } catch (outerError) {
      console.error('Unhandled error in translateConversation:', outerError);
      return this.fallbackTranslateConversation(messages, sourceLanguage, targetLanguage);
    }
  },

  // Generate the prompt for Groq API based on the template
  getGroqPrompt(messages, sourceLanguage, targetLanguage) {
    return `
You are a multilingual translator and conversation assistant. Your job is to help two people speaking different languages understand each other in real-time.

You will receive inputs in two different languages, one from each speaker. Your job is to:
1. Detect the language of each speaker.
2. Translate each speaker's message into the language of the other speaker.
3. Maintain context between messages for fluid conversation.
4. Keep the translations concise, natural, and casual unless otherwise requested.

Return both the original message and the translated version.

Example format:
Speaker A (English): How are you?
→ Speaker B (Hindi): आप कैसे हैं?

Speaker B (Hindi): मैं ठीक हूँ, धन्यवाद!
→ Speaker A (English): I'm fine, thank you!

Current conversation:
${messages.map(msg => `Speaker ${msg.speaker === 'user' ? 'A' : 'B'} (${msg.language}): ${msg.text}`).join('\n')}

Translate the last message from ${sourceLanguage} to ${targetLanguage}.
`;
  },

  // Fallback method for when the server is unavailable
  fallbackTranslateConversation(messages, sourceLanguage, targetLanguage) {
    console.log('Using fallback conversation translation');

    // Create a prompt based on the template
    const prompt = `
You are a multilingual translator and conversation assistant. Your job is to help two people speaking different languages understand each other in real-time.

You will receive inputs in two different languages, one from each speaker. Your job is to:
1. Detect the language of each speaker.
2. Translate each speaker's message into the language of the other speaker.
3. Maintain context between messages for fluid conversation.
4. Keep the translations concise, natural, and casual unless otherwise requested.

Return both the original message and the translated version.

Example format:
Speaker A (English): How are you?
→ Speaker B (Hindi): आप कैसे हैं?

Speaker B (Hindi): मैं ठीक हूँ, धन्यवाद!
→ Speaker A (English): I'm fine, thank you!

Current conversation:
${messages.map(msg => `Speaker ${msg.speaker === 'user' ? 'A' : 'B'} (${msg.language}): ${msg.text}`).join('\n')}

Translate the last message from ${sourceLanguage} to ${targetLanguage}.
`;

    // Mock response based on the last message
    const lastMessage = messages[messages.length - 1];

    // Use our existing translation service as a fallback
    const translatedText = this.getSimpleTranslation(lastMessage.text, sourceLanguage, targetLanguage);

    return {
      originalText: lastMessage.text,
      translatedText: translatedText,
      detectedLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    };
  },

  // Simple translation helper for fallback
  getSimpleTranslation(text, sourceLanguage, targetLanguage) {
    // Very basic translation dictionary for demo purposes
    const translations = {
      'en-hi': {
        'hello': 'नमस्ते',
        'how are you': 'आप कैसे हैं',
        'what is your name': 'आपका नाम क्या है',
        'my name is': 'मेरा नाम है',
        'thank you': 'धन्यवाद',
        'goodbye': 'अलविदा',
        'yes': 'हां',
        'no': 'नहीं',
        'please': 'कृपया',
        'sorry': 'माफ़ कीजिए',
        'help': 'मदद',
        'i don\'t understand': 'मैं समझ नहीं पा रहा हूँ',
        'can you repeat': 'क्या आप दोहरा सकते हैं',
        'speak slowly': 'धीरे बोलिए',
        'where is': 'कहाँ है',
        'how much': 'कितना',
        'when': 'कब',
        'why': 'क्यों',
        'who': 'कौन',
        'what': 'क्या',
        'how': 'कैसे'
      },
      'hi-en': {
        'नमस्ते': 'hello',
        'आप कैसे हैं': 'how are you',
        'आपका नाम क्या है': 'what is your name',
        'मेरा नाम है': 'my name is',
        'धन्यवाद': 'thank you',
        'अलविदा': 'goodbye',
        'हां': 'yes',
        'नहीं': 'no',
        'कृपया': 'please',
        'माफ़ कीजिए': 'sorry',
        'मदद': 'help',
        'मैं समझ नहीं पा रहा हूँ': 'i don\'t understand',
        'क्या आप दोहरा सकते हैं': 'can you repeat',
        'धीरे बोलिए': 'speak slowly',
        'कहाँ है': 'where is',
        'कितना': 'how much',
        'कब': 'when',
        'क्यों': 'why',
        'कौन': 'who',
        'क्या': 'what',
        'कैसे': 'how'
      }
    };

    const key = `${sourceLanguage}-${targetLanguage}`;

    if (!translations[key]) {
      return `[Translation from ${sourceLanguage} to ${targetLanguage}: ${text}]`;
    }

    // Try to find exact matches
    const lowerText = text.toLowerCase();
    if (translations[key][lowerText]) {
      return translations[key][lowerText];
    }

    // Try to find partial matches
    for (const [phrase, translation] of Object.entries(translations[key])) {
      if (lowerText.includes(phrase)) {
        return translation;
      }
    }

    // If no match found, return a placeholder
    return `[Translation from ${sourceLanguage} to ${targetLanguage}: ${text}]`;
  },

  // Generate text using Groq API with timeout
  async generateText(options, timeoutMs = 10000) {
    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // Handle both string prompts and structured message arrays
      const isLegacyPrompt = typeof options === 'string';
      const requestData = isLegacyPrompt
        ? { prompt: options }
        : {
            messages: options.messages,
            model: options.model || 'llama3-8b-8192',
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 800,
            top_p: options.top_p || 0.9
          };

      try {
        // Try to use the server API with timeout
        const response = await axios.post(`${API_URL}/generate`, requestData, {
          headers: {
            'Authorization': 'Bearer YOUR_GROQ_API_KEY', // This should be set on the server side
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        // Handle both legacy and new response formats
        return isLegacyPrompt ? response.data.text : response.data.content;
      } catch (axiosError) {
        // Clear the timeout to prevent memory leaks
        clearTimeout(timeoutId);

        // Check if the request was aborted due to timeout
        if (axiosError.name === 'AbortError' || axiosError.code === 'ECONNABORTED') {
          console.error('Groq API request timed out after', timeoutMs, 'ms');
          throw new Error('Translation request timed out. Please try again.');
        }

        // Re-throw other errors
        throw axiosError;
      }
    } catch (error) {
      console.error('Error calling Groq API via server:', error);

      // Fallback to local text generation if server is unavailable
      return this.fallbackGenerateText(options);
    }
  },

  // Fallback method for text generation when the server is unavailable
  fallbackGenerateText(options) {
    console.log('Using fallback text generation');

    // Handle both string prompts and structured message arrays
    if (typeof options === 'string') {
      // Legacy string prompt handling
      const prompt = options;
      // Extract the target language and input text from the prompt
      const translateToMatch = prompt.match(/Translate to: ([\w\s]+)/);
      const targetLanguage = translateToMatch ? translateToMatch[1] : 'English';

      // Extract text between quotes
      const inputTextMatch = prompt.match(/"([^"]+)"/);
      const inputText = inputTextMatch ? inputTextMatch[1] : '';

      // Return a simple placeholder response
      return `[Translation to ${targetLanguage}: ${inputText}]`;
    } else {
      // Structured message array handling
      const messages = options.messages || [];

      // Find the user message
      const userMessage = messages.find(msg => msg.role === 'user');
      const userContent = userMessage ? userMessage.content : '';

      // Find the system message for context
      const systemMessage = messages.find(msg => msg.role === 'system');
      const systemContent = systemMessage ? systemMessage.content : '';

      // Check if this is a translation request
      if (systemContent.includes('translator')) {
        // Extract language if possible
        const languageMatch = userContent.match(/to ([\w\s]+):/i);
        const language = languageMatch ? languageMatch[1] : 'the target language';

        // Extract text between quotes if possible
        const textMatch = userContent.match(/"([^"]+)"/);
        const text = textMatch ? textMatch[1] : userContent;

        return `[Translation to ${language}: ${text}]`;
      }
      // Check if this is an OCR cleanup request
      else if (systemContent.includes('OCR post-processor')) {
        // Extract text between quotes if possible
        const textMatch = userContent.match(/"([^"]+)"/);
        const text = textMatch ? textMatch[1] : userContent;

        return `[Cleaned OCR text: ${text}]`;
      }
      // Default fallback response
      else {
        return `I processed your request about: ${userContent.substring(0, 50)}...`;
      }
    }
  },

  // Process OCR text with cleaning and translation using backend API
  async processOcrTextTranslation(ocrText, sourceLanguage, targetLanguage) {
    console.log('=== GROQ SERVICE: Starting OCR text translation ===');
    console.log('OCR text length:', ocrText ? ocrText.length : 0);
    console.log('OCR text preview:', ocrText ? ocrText.substring(0, 100) + '...' : 'null');
    console.log('Source language:', sourceLanguage);
    console.log('Target language:', targetLanguage);

    try {
      // ✅ Add a check for empty OCR text
      if (!ocrText || ocrText.trim() === "") {
        console.error('=== GROQ SERVICE ERROR: Empty OCR text provided ===');
        return {
          success: false,
          error: 'No text detected in image. Please try a clearer image.'
        };
      }

      console.log('=== GROQ SERVICE: Calling backend OCR translation API ===');

      // Create a controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        // Call the backend API endpoint
        const response = await fetch(`${API_URL}/ocr-translation/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageData: ocrText, // This is actually the base64 image data
            sourceLanguage,
            targetLanguage
          }),
          signal: controller.signal
        });

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        // Check if the response is ok
        if (!response.ok) {
          const errorData = await response.json();
          console.error('=== GROQ SERVICE ERROR: Backend API returned error ===');
          console.error('Error status:', response.status);
          console.error('Error message:', errorData.error);

          return {
            success: false,
            error: errorData.error || `Server error: ${response.status}`
          };
        }

        // Parse the response
        const result = await response.json();
        console.log('=== GROQ SERVICE: Backend API returned success ===');
        console.log('Raw OCR text:', result.rawOcrText);
        console.log('Cleaned text:', result.cleanedText);
        console.log('Translated text:', result.translatedText);
        console.log('Processing time:', result.processingTimeMs, 'ms');

        return {
          success: true,
          rawOcrText: result.rawOcrText,
          cleanedText: result.cleanedText,
          translatedText: result.translatedText,
          sourceLanguage: result.sourceLanguage,
          targetLanguage: result.targetLanguage,
          processingTimeMs: result.processingTimeMs
        };
      } catch (apiError) {
        // Clear the timeout to prevent memory leaks
        clearTimeout(timeoutId);

        console.error('=== GROQ SERVICE ERROR: API call failed ===');
        console.error('Error calling backend API:', apiError);

        // Check if it was a timeout/abort error
        if (apiError.name === 'AbortError') {
          console.log('API call timed out');
          return {
            success: false,
            error: 'Translation request timed out. Please try again.'
          };
        }

        // For other errors
        return {
          success: false,
          error: apiError.message || 'Failed to connect to translation service'
        };
      }
    } catch (error) {
      console.error('=== GROQ SERVICE ERROR: Unhandled error in translation pipeline ===');
      console.error('Error in OCR text translation pipeline:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);

      const errorResult = {
        success: false,
        error: error.message || 'Failed to process OCR text translation'
      };
      console.log('Returning error result:', errorResult);
      return errorResult;
    }
  },

  // Process image with OCR and translation (legacy method - now we do OCR in the component)
  async processImageTranslation(imageData, sourceLanguage, targetLanguage, useOneStep = false) {
    try {
      // In a real implementation, you would send the image to the server for OCR processing
      // For this demo, we'll simulate OCR with some sample text with errors
      console.log('Simulating OCR extraction from image...');

      // Generate a simple hash from the image data to get consistent results
      let hash = 0;
      const sampleStr = imageData.substring(0, 100);
      for (let i = 0; i < sampleStr.length; i++) {
        hash = ((hash << 5) - hash) + sampleStr.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      hash = Math.abs(hash);

      // Sample texts with common OCR errors
      const sampleTexts = [
        "Welc0me to 0ur restaurantl Today's specia1: Gril1ed sa1mon with lem0n sauce - $l5.99",
        "CAUT1ON: Wet F100r. P1ease watch y0ur st3p.",
        "0pening H0urs:\nM0nday-Friday: 9:OO AM - 6:OO PM\nSaturday: 1O:OO AM - 4:OO PM\nSunday: C1osed",
        "Gate Al2\nF1ight: BA287\nDeparture: l4:3O\nDestination: L0ndon",
        "Mus3um Entrance\nAdu1ts: $l2\nStud3nts: $8\nChi1dren under 6: Fr3e",
        "SALEl 5O% 0FF\nA1l wint3r it3ms\nLimit3d tim3 0nly",
        "WiFi Passw0rd: Gu3st2O23\nNetw0rk: Visit0r_Acc3ss",
        "Em3rgency Ex1t\nln case 0f fire us3 sta1rs\nD0 n0t use e1evat0r",
        "T0urist Inf0rmati0n C3nter\nl23 Main Str3et\nPh0ne: +l-555-l23-4567",
        "Bus Schedu1e\nR0ute 42\nEv3ry l5 minut3s fr0m 6:OO AM t0 ll:OO PM"
      ];

      // Select a sample text based on the hash
      const extractedText = sampleTexts[hash % sampleTexts.length];
      console.log('Raw OCR text:', extractedText);

      if (useOneStep) {
        // Single-step approach (less accurate, more performant)
        const languageName = this.getLanguageNameFromCode(targetLanguage);

        const systemPrompt =
          `You are a smart image text translator. The text below comes from an OCR system and might have errors. First, clean the text (fix OCR issues), then translate it from English to ${languageName}. Return only the final translated sentence, nothing else.`;

        const userPrompt =
          `Raw OCR text:\n"${extractedText}"`;

        const translatedText = await this.generateText({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          model: "llama3-8b-8192",
          temperature: 0.3,
          max_tokens: 1000,
          top_p: 0.9
        });

        return {
          success: true,
          rawOcrText: extractedText,
          translatedText: translatedText,
          sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
          targetLanguage
        };
      } else {
        // Two-step approach (more accurate)
        // Step 1: Clean up the OCR text
        const systemPrompt1 =
          "You are an OCR post-processor. Your job is to clean and correct messy OCR output from images before it is used for translation.";

        const userPrompt1 =
          `Here is the raw OCR text extracted from an image:\n\n"${extractedText}"\n\nPlease fix spelling, correct broken words, and return clean, readable text. Do not translate or change meaning. Just fix formatting and errors caused by OCR.`;

        const cleanedText = await this.generateText({
          messages: [
            { role: "system", content: systemPrompt1 },
            { role: "user", content: userPrompt1 }
          ],
          model: "llama3-8b-8192",
          temperature: 0.2,
          max_tokens: 1000,
          top_p: 0.9
        });

        console.log('Cleaned text:', cleanedText);

        // Step 2: Translate the cleaned text
        const languageName = this.getLanguageNameFromCode(targetLanguage);

        const systemPrompt2 =
          "You are a professional multilingual translator for a travel and communication app. Translate text precisely and naturally.";

        const userPrompt2 =
          `Translate the following English text to ${languageName}:\n\n"${cleanedText}"`;

        const translatedText = await this.generateText({
          messages: [
            { role: "system", content: systemPrompt2 },
            { role: "user", content: userPrompt2 }
          ],
          model: "llama3-8b-8192",
          temperature: 0.3,
          max_tokens: 1000,
          top_p: 0.9
        });

        console.log('Translated text:', translatedText);

        return {
          success: true,
          rawOcrText: extractedText,
          cleanedText: cleanedText,
          translatedText: translatedText,
          sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
          targetLanguage
        };
      }
    } catch (error) {
      console.error('Error in image translation pipeline:', error);
      return {
        success: false,
        error: error.message || 'Failed to process image translation'
      };
    }
  },

  // Get language name from language code
  getLanguageNameFromCode(code) {
    const languageMap = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'nl': 'Dutch',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'tr': 'Turkish',
      'pl': 'Polish',
      'vi': 'Vietnamese',
      'th': 'Thai'
    };

    return languageMap[code] || code;
  }
};

export default groqService;
