import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import languages from '../data/languages';
import translationService from '../services/translationService';
import deploymentTranslationService from '../services/deploymentTranslationService';
import offlineTranslationService from '../services/offlineTranslationService';

// Get language name from code
const getLanguageName = (code) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};

const DirectTextTranslation = ({ text, sourceLanguage, targetLanguage, onTranslate }) => {
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [offlineAvailable, setOfflineAvailable] = useState(false);
  const [offlineLanguages, setOfflineLanguages] = useState([]);

  // Check if offline translation is available for this language pair
  useEffect(() => {
    const checkOfflineAvailability = async () => {
      try {
        // Get all available offline languages
        const languages = await offlineTranslationService.getAvailableOfflineLanguages();
        setOfflineLanguages(languages);

        // Check if the target language is available offline
        const isAvailable = languages.includes(targetLanguage);
        setOfflineAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking offline availability:', error);
        setOfflineAvailable(false);
      }
    };

    checkOfflineAvailability();
  }, [targetLanguage]);

  const handleTranslate = async () => {
    if (!text || text.trim() === '') {
      setError('Please enter some text to translate');
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      // DIRECT IMPLEMENTATION: Call Groq API directly from the frontend
      // This ensures it works in all environments including Vercel deployment
      console.log('Translating text directly with Groq API');

      // Get language name from code
      const languageNames = {
        'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
        'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh': 'Chinese',
        'ja': 'Japanese', 'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi'
      };

      const targetLanguageName = languageNames[targetLanguage] || targetLanguage;
      const sourceLanguageName = sourceLanguage ? (languageNames[sourceLanguage] || sourceLanguage) : 'auto';

      // Prepare the prompt for Groq
      const systemPrompt = "You are a professional multilingual translator for a travel and communication app. Translate text precisely and naturally.";
      const userPrompt = sourceLanguage === 'auto' ?
        `Translate the following text to ${targetLanguageName}:\n\n"${text}"` :
        `Translate the following ${sourceLanguageName} text to ${targetLanguageName}:\n\n"${text}"`;

      // IMPORTANT: Hardcoded Groq API key for the hackathon project
      const groqApiKey = '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';

      try {
        // First attempt: Direct API call to Groq
        console.log('Attempting direct API call to Groq');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1000,
            top_p: 0.9
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        let translatedText = data.choices[0].message.content.trim();

        // Remove quotes if present
        if ((translatedText.startsWith('"') && translatedText.endsWith('"')) ||
            (translatedText.startsWith("'") && translatedText.endsWith("'"))) {
          translatedText = translatedText.substring(1, translatedText.length - 1);
        }

        console.log('Successfully translated with Groq API:', translatedText);

        setTranslation(translatedText);

        // Notify parent component
        if (onTranslate) {
          onTranslate({
            sourceText: text,
            translatedText,
            sourceLanguage,
            targetLanguage,
            isOffline: false
          });
        }
      } catch (directApiError) {
        console.error('Direct Groq API call failed:', directApiError.message);

        // Fallback to deployment translation service
        console.log('Falling back to deployment translation service');
        const fallbackText = await deploymentTranslationService.translateText(text, sourceLanguage, targetLanguage);

        setTranslation(fallbackText);

        // Notify parent component
        if (onTranslate) {
          onTranslate({
            sourceText: text,
            translatedText: fallbackText,
            sourceLanguage,
            targetLanguage,
            isOffline: true
          });
        }
      }

      setIsTranslating(false);
    } catch (err) {
      console.error('Translation error:', err);
      setError(`Translation failed: ${err.message || 'Unknown error'}`);
      setIsTranslating(false);
    }
  };

  return (
    <div className="direct-text-translation">
      <div className="flex flex-col space-y-4">
        <div className="text-center mb-2">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Translate from {getLanguageName(sourceLanguage)} to {getLanguageName(targetLanguage)}
            {offlineAvailable && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Offline Available
              </span>
            )}
          </p>
        </div>

        <motion.button
          id="translate-button"
          onClick={handleTranslate}
          disabled={isTranslating || !text}
          className={`btn btn-primary btn-lg w-full ${
            isTranslating || !text ? 'btn-disabled' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isTranslating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Translating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
              </svg>
              Translate to {getLanguageName(targetLanguage)}
            </>
          )}
        </motion.button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectTextTranslation;
