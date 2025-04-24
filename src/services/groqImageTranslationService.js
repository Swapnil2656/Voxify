// Advanced image translation service using Groq API for OCR cleanup and translation

import groqService from './groqService';

/**
 * Process an image through OCR, clean the text, and translate it
 * @param {string} imageData - Base64 encoded image data or OCR extracted text
 * @param {string} sourceLanguage - Source language code (or 'auto' for auto-detection)
 * @param {string} targetLanguage - Target language code
 * @param {boolean} isOcrText - Whether imageData is already OCR extracted text
 * @returns {Promise<Object>} - Object containing extracted text, cleaned text, and translation
 */
export const processImageWithGroq = async (imageData, sourceLanguage = 'auto', targetLanguage = 'en', isOcrText = false) => {
  console.log(`Processing image for translation from ${sourceLanguage} to ${targetLanguage}`);
  
  try {
    // Step 1: Get the OCR text (either from parameter or extract it)
    let extractedText = '';
    
    if (isOcrText) {
      extractedText = imageData;
      console.log('Using provided OCR text');
    } else {
      // In a real implementation, you would use an OCR service here
      // For this demo, we'll simulate OCR with some sample text with errors
      console.log('Simulating OCR extraction from image...');
      extractedText = simulateOcrExtraction(imageData);
    }
    
    console.log('Raw OCR text:', extractedText);
    
    // Step 2: Clean up the OCR text using Groq API
    const cleanedText = await cleanOcrTextWithGroq(extractedText);
    console.log('Cleaned text:', cleanedText);
    
    // Step 3: Translate the cleaned text using Groq API
    const translatedText = await translateTextWithGroq(cleanedText, targetLanguage);
    console.log('Translated text:', translatedText);
    
    return {
      success: true,
      rawOcrText: extractedText,
      cleanedText: cleanedText,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
      targetLanguage
    };
  } catch (error) {
    console.error('Error in image translation pipeline:', error);
    return {
      success: false,
      error: error.message || 'Failed to process image translation'
    };
  }
};

/**
 * Clean OCR text using Groq API
 * @param {string} ocrText - Raw OCR text to clean
 * @returns {Promise<string>} - Cleaned text
 */
async function cleanOcrTextWithGroq(ocrText) {
  try {
    const systemPrompt = 
      "You are an OCR post-processor. Your job is to clean and correct messy OCR output from images before it is used for translation.";
    
    const userPrompt = 
      `Here is the raw OCR text extracted from an image:

"${ocrText}"

Please fix spelling, correct broken words, and return clean, readable text. Do not translate or change meaning. Just fix formatting and errors caused by OCR.`;

    const response = await groqService.generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama3-8b-8192",
      temperature: 0.2,
      max_tokens: 1000,
      top_p: 0.9
    });

    return response.trim();
  } catch (error) {
    console.error('Error cleaning OCR text with Groq:', error);
    // If Groq API fails, return the original text as fallback
    return ocrText;
  }
}

/**
 * Translate text using Groq API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} - Translated text
 */
async function translateTextWithGroq(text, targetLanguage) {
  try {
    // Get the language name from the code
    const languageName = getLanguageNameFromCode(targetLanguage);
    
    const systemPrompt = 
      "You are a professional multilingual translator for a travel and communication app. Translate text precisely and naturally.";
    
    const userPrompt = 
      `Translate the following English text to ${languageName}:

"${text}"`;

    const response = await groqService.generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 1000,
      top_p: 0.9
    });

    return response.trim();
  } catch (error) {
    console.error(`Error translating text to ${targetLanguage} with Groq:`, error);
    // If Groq API fails, return the original text with a prefix as fallback
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }
}

/**
 * Combined single-call translation (less accurate, more performant)
 * @param {string} ocrText - Raw OCR text to clean and translate
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} - Translated text
 */
export async function singleCallTranslation(ocrText, targetLanguage) {
  try {
    // Get the language name from the code
    const languageName = getLanguageNameFromCode(targetLanguage);
    
    const systemPrompt = 
      `You are a smart image text translator. The text below comes from an OCR system and might have errors. First, clean the text (fix OCR issues), then translate it from English to ${languageName}. Return only the final translated sentence, nothing else.`;
    
    const userPrompt = 
      `Raw OCR text:
"${ocrText}"`;

    const response = await groqService.generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 1000,
      top_p: 0.9
    });

    return response.trim();
  } catch (error) {
    console.error(`Error in single-call translation to ${targetLanguage}:`, error);
    // If Groq API fails, return the original text with a prefix as fallback
    return `[${targetLanguage.toUpperCase()}] ${ocrText}`;
  }
}

/**
 * Get language name from language code
 * @param {string} code - Language code
 * @returns {string} - Language name
 */
function getLanguageNameFromCode(code) {
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

/**
 * Simulate OCR extraction with common OCR errors
 * @param {string} imageData - Base64 encoded image data
 * @returns {string} - Simulated OCR text with errors
 */
function simulateOcrExtraction(imageData) {
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
  let extractedText = sampleTexts[hash % sampleTexts.length];
  
  // Add random OCR artifacts
  const artifacts = [
    { find: 'e', replace: '3' },
    { find: 'o', replace: '0' },
    { find: 'l', replace: '1' },
    { find: 'i', replace: '1' },
    { find: ' ', replace: '  ' }
  ];
  
  // Apply some random artifacts
  for (let i = 0; i < 3; i++) {
    const artifact = artifacts[Math.floor(Math.random() * artifacts.length)];
    // Replace only some occurrences to make it more realistic
    const regex = new RegExp(artifact.find, 'g');
    const occurrences = [...extractedText.matchAll(regex)];
    
    if (occurrences.length > 0) {
      const randomIndex = Math.floor(Math.random() * occurrences.length);
      const position = occurrences[randomIndex].index;
      
      extractedText = 
        extractedText.substring(0, position) + 
        artifact.replace + 
        extractedText.substring(position + 1);
    }
  }
  
  return extractedText;
}
