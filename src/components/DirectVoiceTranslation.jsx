import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DirectSpeechRecognition from './DirectSpeechRecognition';
import translationService from '../services/translationService';

const DirectVoiceTranslation = ({ sourceLanguage, targetLanguage, onTranslationComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  // Handle transcript from speech recognition
  const handleTranscript = async (text) => {
    if (!text || text.trim() === '') return;

    setTranscript(text);
    setIsTranslating(true);
    setError(null);

    try {
      // Special handling for Hindi translations
      if (targetLanguage === 'hi') {
        console.log('Using special handling for Hindi translation');

        // For Hindi, always use English as the source language
        // This ensures we get more accurate translations using our direct mapping
        const translatedText = await translationService.translateText(
          text,
          'en',  // Force English as source language for Hindi
          'hi'
        );

        setTranslation(translatedText);

        // Notify parent component
        if (onTranslationComplete) {
          onTranslationComplete({
            sourceText: text,
            translatedText,
            sourceLanguage: 'en',  // Report English as source for Hindi
            targetLanguage: 'hi'
          });
        }
      } else {
        // Normal flow for other languages
        const translatedText = await translationService.translateText(
          text,
          sourceLanguage,
          targetLanguage
        );

        setTranslation(translatedText);

        // Notify parent component
        if (onTranslationComplete) {
          onTranslationComplete({
            sourceText: text,
            translatedText,
            sourceLanguage,
            targetLanguage
          });
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(`Translation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsTranslating(false);
      setIsListening(false);
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    setIsListening(!isListening);
    if (isListening) {
      // If we're stopping, clear the transcript
      setTranscript('');
      setTranslation('');
    } else {
      // If we're starting, clear any previous errors
      setError(null);
    }
  };

  // Get the correct language code for speech recognition
  const getSpeechRecognitionLanguage = (langCode) => {
    const languageMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'nl': 'nl-NL',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'tr': 'tr-TR'
    };

    return languageMap[langCode] || 'en-US';
  };

  return (
    <div className="direct-voice-translation">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Speech recognition component */}
        <DirectSpeechRecognition
          onTranscriptReady={handleTranscript}
          language={targetLanguage === 'hi' ? 'en-US' : getSpeechRecognitionLanguage(sourceLanguage)}
          isActive={isListening}
        />
        {targetLanguage === 'hi' && (
          <div className="text-sm text-blue-600 dark:text-blue-400 mt-2 text-center">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              Speak in English for Hindi translation
            </span>
          </div>
        )}

        {/* Listen button */}
        <motion.button
          onClick={toggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md ${
            isListening
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isTranslating}
        >
          {isListening ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          )}
        </motion.button>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isListening ? 'Tap to stop listening' : 'Tap to start listening'}
        </p>

        {/* Results display */}
        {transcript && (
          <div className="w-full mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recognized Speech:
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{transcript}</p>
            </div>
          </div>
        )}

        {translation && (
          <div className="w-full mt-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Translation:
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{translation}</p>
            </div>
          </div>
        )}

        {isTranslating && (
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Translating...
          </div>
        )}

        {error && (
          <div className="w-full mt-2">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectVoiceTranslation;
