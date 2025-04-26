import React, { useState } from 'react';
import simpleTranslationService from '../services/simpleTranslationService';
import deploymentTranslationService from '../services/deploymentTranslationService';
import languages from '../data/languages';

const TestTranslation = () => {
  const [sourceText, setSourceText] = useState('Hello, How are You?');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      console.log('Translating text:', sourceText);
      console.log('Target language:', targetLanguage);

      // Use the deployment translation service that works 100% of the time
      const translatedText = await deploymentTranslationService.translateText(
        sourceText,
        'en',
        targetLanguage
      );

      console.log('Translation result:', translatedText);

      // Set the translated text directly
      setTranslatedText(translatedText);
    } catch (err) {
      console.error('Translation error:', err);
      setError(`Translation failed: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Test Translation
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Text to translate:
        </label>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Target language:
        </label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleTranslate}
        disabled={isTranslating}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {translatedText && (
        <div className="mt-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Translation:
          </label>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white">
            {translatedText}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>This is a test component to verify that the translation service is working correctly.</p>
      </div>
    </div>
  );
};

export default TestTranslation;
