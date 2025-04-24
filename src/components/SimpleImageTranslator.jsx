import { useState, useRef } from 'react';
import axios from 'axios';
import { isAIEnhancementEnabled, toggleAIEnhancement } from '../services/translationService';

const API_URL = 'http://localhost:8004';

const SimpleImageTranslator = () => {
  const [image, setImage] = useState(null);
  const [targetLang, setTargetLang] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [error, setError] = useState(null);
  const [aiEnhanced, setAiEnhanced] = useState(isAIEnhancementEnabled());
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleAI = () => {
    const newValue = !aiEnhanced;
    setAiEnhanced(newValue);
    toggleAIEnhancement(newValue);
  };

  const handleTranslate = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSourceText('');
    setTranslatedText('');
    setProcessingStage('Preparing image...');

    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second client-side timeout

    try {
      console.log('Sending image for translation...');
      setProcessingStage('Extracting text from image...');

      // Use AI enhancement for OCR if enabled
      try {
        const response = await axios.post(`${API_URL}/translate-image`, {
          base64Image: image,
          targetLang,
          aiEnhance: aiEnhanced // Use the toggle state
        }, {
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        timeout: 30000, // 30 second axios timeout
        onUploadProgress: () => {
          setProcessingStage('Processing image...');
        }
      });

      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      if (response.data.success) {
        setProcessingStage('Translation complete!');
        setSourceText(response.data.sourceText);
        setTranslatedText(response.data.translated);

        // Log if AI enhancement was used
        if (response.data.aiEnhanced) {
          console.log('AI enhancement was used for this translation');

          // If there's cleaned text that's different from source text, log it
          if (response.data.cleanedText && response.data.cleanedText !== response.data.sourceText) {
            console.log('OCR text was cleaned by AI:', response.data.cleanedText);
          }
        }
      } else {
        setProcessingStage('Error occurred');

        // Check if there's an AI suggestion for the error
        if (response.data.suggestion) {
          setError(`${response.data.error} ${response.data.suggestion}`);
        } else {
          setError(response.data.error || 'Translation failed');
        }

        // If we got source text despite translation failure, still show it
        if (response.data.sourceText) {
          setSourceText(response.data.sourceText);
        }
      }
      } catch (apiError) {
        console.error('API error:', apiError);
        setProcessingStage('Error occurred');
        setError(`API error: ${apiError.message}. AI enhancement may not be available. Please make sure the backend server is running.`);
      }
    } catch (err) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);

      console.error('Translation error:', err);
      setProcessingStage('Error occurred');

      // Handle different error types with user-friendly messages
      if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again with a clearer image.');
      } else if (err.response) {
        // Server returned an error response
        const errorData = err.response.data;

        // Handle specific error types
        if (errorData.errorType === 'EMPTY_RESULT') {
          setError('No text detected in the image. Please try with a clearer image.');
        } else if (errorData.errorType === 'TIMEOUT_ERROR') {
          setError('Processing timed out. Please try again with a simpler image.');
        } else if (errorData.errorType === 'VALIDATION_ERROR') {
          setError(errorData.error || 'Invalid input. Please check your image.');
        } else {
          setError(errorData.error || 'Failed to translate image');
        }

        // If we got source text despite the error, still show it
        if (errorData.sourceText) {
          setSourceText(errorData.sourceText);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Could not connect to the translation service. Please check your internet connection.');
      } else {
        // Something else happened while setting up the request
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Simple Image Translator</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Language
        </label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          disabled={isLoading}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
          <option value="ru">Russian</option>
          <option value="ar">Arabic</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            AI Enhancement
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={aiEnhanced}
              onChange={handleToggleAI}
              disabled={isLoading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {aiEnhanced ? 'AI will enhance OCR results and improve translation quality' : 'Standard OCR and translation without AI enhancement'}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Select Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
          />
          <button
            onClick={handleTranslate}
            disabled={!image || isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {processingStage || 'Translating...'}
              </div>
            ) : (
              'Translate'
            )}
          </button>
        </div>
      </div>

      {image && (
        <div className="mb-4">
          <img src={image} alt="Selected" className="max-h-64 rounded-md" />
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <div className="flex flex-col space-y-2">
            <div>{error}</div>
            {(error.includes('timed out') || error.includes('timeout')) && (
              <button
                onClick={handleTranslate}
                className="self-start mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {sourceText && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Extracted Text:</h3>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white">
            {sourceText}
          </div>
        </div>
      )}

      {translatedText && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Translation:</h3>
            {aiEnhanced && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                AI Enhanced
              </span>
            )}
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-md text-gray-800 dark:text-white">
            {translatedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleImageTranslator;
