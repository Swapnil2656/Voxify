import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, fallbackTextToSpeech } from '../utils/speechUtils';

const TranslationResult = ({
  text,
  isLoading,
  error,
  placeholder = 'Translation will appear here...',
  className = '',
  onPlayAudio
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState(-1);
  const [words, setWords] = useState([]);

  // Split text into words when it changes
  useEffect(() => {
    if (text) {
      // Clean the text by removing any offline prefix
      const cleanText = text.startsWith('[OFFLINE]')
        ? text.replace('[OFFLINE] ', '')
        : text;

      // Remove any language code prefix like [ES]
      const textWithoutLangCode = cleanText.replace(/\[[A-Z]{2}\]\s*/, '');

      // Split the text into words
      const wordArray = textWithoutLangCode.split(/\s+/).filter(word => word.length > 0);
      setWords(wordArray);
      setCurrentWord(-1);
    } else {
      setWords([]);
      setCurrentWord(-1);
    }
  }, [text]);

  // Function to simulate word-by-word highlighting
  const simulateWordHighlighting = () => {
    if (words.length === 0) return;

    setCurrentWord(0);

    // Calculate average word duration based on total words and estimated speech duration
    const avgWordDuration = Math.max(300, 5000 / words.length); // Minimum 300ms per word

    // Create a sequence of timeouts to highlight each word
    words.forEach((word, index) => {
      if (index === 0) return; // Skip first word as it's already highlighted

      setTimeout(() => {
        setCurrentWord(index);
      }, index * avgWordDuration);
    });

    // Reset highlighting after all words have been spoken
    setTimeout(() => {
      setCurrentWord(-1);
      setIsPlaying(false);
    }, words.length * avgWordDuration + 500);
  };

  // Direct audio playback function that works in all environments
  const handlePlayAudio = () => {
    if (!text || isPlaying) return;

    setIsPlaying(true);
    console.log('TranslationResult: Playing audio for text:', text);

    try {
      // Start word highlighting simulation
      simulateWordHighlighting();

      // If parent component provided an onPlayAudio function, use it
      if (onPlayAudio) {
        onPlayAudio();
        return;
      }

      // Otherwise, use our own implementation
      // Remove any [OFFLINE] prefix if present
      const cleanText = text.startsWith('[OFFLINE]')
        ? text.replace('[OFFLINE] ', '')
        : text;

      // Extract language code from text if available, or default to English
      const languageMatch = text.match(/\[([A-Z]{2})\]/);
      const languageCode = languageMatch ? languageMatch[1].toLowerCase() : 'en';

      console.log(`Playing audio in language: ${languageCode}`);

      // Try to use the browser's speech synthesis
      const speechResult = speakText(cleanText, languageCode, () => {
        console.log('Speech synthesis completed');
        // Note: We don't reset isPlaying here because the word highlighting will do it
      });

      // If speech synthesis fails, use fallback
      if (!speechResult) {
        console.log('Speech synthesis failed, using fallback');
        fallbackTextToSpeech(cleanText, languageCode);
        // We still let the word highlighting control the isPlaying state
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setCurrentWord(-1);

      // Try fallback as last resort
      try {
        fallbackTextToSpeech(text, 'en');
      } catch (fallbackErr) {
        console.error('Even fallback failed:', fallbackErr);
      }
    }
  };
  return (
    <div className={`relative h-full ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <div className="relative w-20 h-20 mb-6">
              {/* Animated circles */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: [0.7, 0.3, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-t-4 border-blue-500 dark:border-blue-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-blue-600 dark:text-blue-400">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </div>
            </div>
            <motion.h3
              className="text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Translating your text
            </motion.h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">This will just take a moment...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <motion.div
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 text-red-500 dark:text-red-400 mb-6 shadow-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.05, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Translation Error</h3>
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Please check your input and try again. If the problem persists, it might be an issue with the translation service.
            </p>
            <motion.button
              className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                Refresh Page
              </span>
            </motion.button>
          </motion.div>
        ) : text ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="h-full overflow-auto p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300 custom-scrollbar">
              {/* Play button at the top */}
              <div className="mb-4 flex justify-end">
                <motion.button
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  className={`flex items-center px-4 py-2 rounded-lg ${isPlaying ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40'} transition-colors duration-200`}
                  whileHover={{ scale: isPlaying ? 1 : 1.05 }}
                  whileTap={{ scale: isPlaying ? 1 : 0.95 }}
                >
                  {isPlaying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Playing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                        <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.477A6.98 6.98 0 002 10a6.98 6.98 0 00.467 2.523.75.75 0 00.7.477h1.537l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06a7 7 0 000-9.899z" />
                        <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06a4 4 0 000-5.656z" />
                      </svg>
                      Listen
                    </>
                  )}
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {text.startsWith('[OFFLINE]') ? (
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-2">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        Offline Mode
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Using downloaded language pack</span>
                    </div>
                    <div className={`relative p-4 rounded-lg ${isPlaying ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30' : ''}`}>
                      {isPlaying && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.477A6.98 6.98 0 002 10a6.98 6.98 0 00.467 2.523.75.75 0 00.7.477h1.537l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06a7 7 0 000-9.899z" />
                            <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06a4 4 0 000-5.656z" />
                          </svg>
                        </div>
                      )}
                      {words.length > 0 ? (
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-pretty">
                          {words.map((word, index) => (
                            <React.Fragment key={index}>
                              <span
                                className={`${currentWord === index ? 'bg-blue-200 dark:bg-blue-700 px-1 py-0.5 rounded' : ''}
                                  transition-all duration-200`}
                              >
                                {word}
                              </span>
                              {index < words.length - 1 ? ' ' : ''}
                            </React.Fragment>
                          ))}
                        </p>
                      ) : (
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-pretty">{text.replace('[OFFLINE] ', '')}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`relative p-4 rounded-lg ${isPlaying ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30' : ''}`}>
                      {isPlaying && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.477A6.98 6.98 0 002 10a6.98 6.98 0 00.467 2.523.75.75 0 00.7.477h1.537l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06a7 7 0 000-9.899z" />
                            <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06a4 4 0 000-5.656z" />
                          </svg>
                        </div>
                      )}
                      {words.length > 0 ? (
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-pretty">
                          {words.map((word, index) => (
                            <React.Fragment key={index}>
                              <span
                                className={`${currentWord === index ? 'bg-blue-200 dark:bg-blue-700 px-1 py-0.5 rounded' : ''}
                                  transition-all duration-200`}
                              >
                                {word}
                              </span>
                              {index < words.length - 1 ? ' ' : ''}
                            </React.Fragment>
                          ))}
                        </p>
                      ) : (
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-pretty">{text}</p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <motion.div
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-500 dark:text-blue-400 mb-6 shadow-md"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">{placeholder}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
              Enter text or record audio and click the translate button to see your translation appear here
            </p>

            {/* Language support badges */}
            <div className="flex flex-wrap justify-center gap-2 max-w-md mb-4">
              {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'].map((lang) => (
                <motion.span
                  key={lang}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang}
                </motion.span>
              ))}
              <motion.span
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                +94 more
              </motion.span>
            </div>

            <motion.div
              className="mt-4 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              Powered by Groq's ultra-fast inference engine
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TranslationResult;
