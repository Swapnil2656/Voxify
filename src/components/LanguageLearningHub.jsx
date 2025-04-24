import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaLightbulb, FaSpinner, FaGraduationCap, FaLanguage, FaGlobe, FaBook, FaCheck, FaSearch, FaComment } from 'react-icons/fa';

const BACKEND_URL = 'http://localhost:8004';

// Add a function to handle API errors consistently
const handleApiError = (error) => {
  if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again with a shorter text or different options.';
  } else if (error.response) {
    // Server responded with an error
    return `Server error: ${error.response.data.detail || error.response.statusText || 'Unknown error'}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'No response from server. Please check your connection and try again.';
  } else {
    // Something else went wrong
    return `Error: ${error.message || 'Failed to connect to the server'}`;
  }
};

const LanguageLearningHub = () => {
  const [text, setText] = useState('');
  const [userLanguage, setUserLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [proficiencyLevel, setProficiencyLevel] = useState('intermediate');
  const [focusArea, setFocusArea] = useState('general');
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pt', name: 'Portuguese' },
  ];

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const focusAreas = [
    { value: 'general', label: 'General Learning', icon: <FaGraduationCap /> },
    { value: 'grammar', label: 'Grammar Focus', icon: <FaLanguage /> },
    { value: 'vocabulary', label: 'Vocabulary Building', icon: <FaLightbulb /> },
    { value: 'idioms', label: 'Idioms & Expressions', icon: <FaLanguage /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      console.log('Sending learning suggestions request to backend...');
      const response = await axios.post(`${BACKEND_URL}/learning-suggestions`, {
        text,
        userLanguage,
        targetLanguage,
        proficiencyLevel,
        focusArea
      }, {
        timeout: 15000, // 15 second timeout for AI processing
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Received response:', response.data);

      if (response.data.success) {
        if (response.data.suggestions && Object.keys(response.data.suggestions).length > 0) {
          setSuggestions(response.data.suggestions);
        } else if (response.data.suggestions && response.data.suggestions.raw) {
          // Handle raw text response
          setSuggestions({
            parsed: false,
            raw: response.data.suggestions.raw,
            note: 'The AI returned a response in an unexpected format. Here is the raw content:'
          });
        } else {
          setError('Received empty response from the server');
        }
      } else {
        setError('Failed to generate suggestions');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Error generating learning suggestions:', err);

      // Use the common error handling function
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestions = () => {
    if (!suggestions) return null;

    // Handle raw text response or parsed=false
    if (suggestions.raw || suggestions.parsed === false) {
      // Try to extract useful information from raw response
      let formattedContent = suggestions.raw;
      try {
        // Check if the raw content contains JSON
        if (suggestions.raw.includes('{') && suggestions.raw.includes('}')) {
          // Try to extract JSON from the raw text
          const jsonMatch = suggestions.raw.match(/\{[\s\S]*\}/g);
          if (jsonMatch && jsonMatch[0]) {
            const parsedJson = JSON.parse(jsonMatch[0]);

            // If we successfully parsed JSON, render it in a user-friendly format
            return (
              <div className="space-y-6">
                {/* Translation Section */}
                {parsedJson.translation && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaCheck className="text-blue-600 dark:text-blue-400 mr-2" />
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Translation</h3>
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                      {Array.isArray(parsedJson.translation) ? (
                        parsedJson.translation.map((item, idx) => (
                          <div key={idx} className="mb-2 text-lg">{item}</div>
                        ))
                      ) : (
                        <p className="text-lg">{parsedJson.translation}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Grammar Section */}
                {parsedJson.grammar && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaSearch className="text-indigo-600 dark:text-indigo-400 mr-2" />
                      <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">Grammar Breakdown</h3>
                    </div>
                    <div className="text-gray-800 dark:text-gray-200">
                      <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">Understanding the grammar structure:</p>
                      <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                        {Array.isArray(parsedJson.grammar) ? (
                          parsedJson.grammar.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : (
                          <li>{parsedJson.grammar}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Vocabulary Section */}
                {parsedJson.vocabulary && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaBook className="text-green-600 dark:text-green-400 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Vocabulary Insights</h3>
                    </div>
                    <div className="text-gray-800 dark:text-gray-200">
                      <p className="text-sm text-green-700 dark:text-green-300 mb-2">Key words and phrases explained:</p>
                      <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                        {Array.isArray(parsedJson.vocabulary) ? (
                          parsedJson.vocabulary.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : (
                          <li>{parsedJson.vocabulary}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Suggestions Section */}
                {parsedJson.suggestions && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaLightbulb className="text-purple-600 dark:text-purple-400 mr-2" />
                      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Learning Suggestions</h3>
                    </div>
                    <div className="text-gray-800 dark:text-gray-200">
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">Practice these to improve your skills:</p>
                      <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                        {Array.isArray(parsedJson.suggestions) ? (
                          parsedJson.suggestions.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : (
                          <li>{parsedJson.suggestions}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Cultural Section */}
                {parsedJson.cultural && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaGlobe className="text-amber-600 dark:text-amber-400 mr-2" />
                      <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Cultural Tips</h3>
                    </div>
                    <div className="text-gray-800 dark:text-gray-200">
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">Cultural context and usage insights:</p>
                      <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                        {Array.isArray(parsedJson.cultural) ? (
                          parsedJson.cultural.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : (
                          <li>{parsedJson.cultural}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        }
      } catch (e) {
        console.error('Error parsing raw response:', e);
        // Continue with the default formatting below
      }

      // If we couldn't parse JSON or extract structured data, show a more user-friendly message
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-yellow-800 dark:text-yellow-400 font-medium mb-2">AI Response</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We received a response from our AI language tutor, but it wasn't in the expected format.
            Here's what we got:
          </p>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {formattedContent.replace(/[\{\}"\[\]\,]/g, ' ').replace(/\s+/g, ' ')}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Try again with a different text or focus area for better results.
          </p>
        </div>
      );
    }

    // Handle error response
    if (suggestions.error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Error</h3>
          <p className="text-red-700 dark:text-red-300">{suggestions.error}</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Please try again with a different text or settings.
          </p>
        </div>
      );
    }

    // New structured format based on the prompt
    return (
      <div className="space-y-6">
        {/* 1. Translation Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <FaCheck className="text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Translation</h3>
          </div>
          <div className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
            {suggestions.translation ? (
              typeof suggestions.translation === 'string' ? (
                <p className="text-lg">{suggestions.translation}</p>
              ) : Array.isArray(suggestions.translation) ? (
                suggestions.translation.map((item, idx) => (
                  <div key={idx} className="mb-2 text-lg">{item}</div>
                ))
              ) : (
                <p>Translation not available</p>
              )
            ) : (
              <p>Translation not available</p>
            )}
          </div>
        </div>

        {/* 2. Grammar Breakdown Section */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <FaSearch className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">Grammar Breakdown</h3>
          </div>
          <div className="text-gray-800 dark:text-gray-200">
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">Understanding the grammar structure:</p>
            <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
              {suggestions.grammar ? (
                typeof suggestions.grammar === 'string' ? (
                  <li>{suggestions.grammar}</li>
                ) : Array.isArray(suggestions.grammar) ? (
                  suggestions.grammar.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  Object.entries(suggestions.grammar).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))
                )
              ) : (
                <li>Grammar breakdown not available</li>
              )}
            </ul>
          </div>
        </div>

        {/* 3. Vocabulary Insights Section */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <FaBook className="text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Vocabulary Insights</h3>
          </div>
          <div className="text-gray-800 dark:text-gray-200">
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">Key words and phrases explained:</p>
            <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
              {suggestions.vocabulary ? (
                typeof suggestions.vocabulary === 'string' ? (
                  <li>{suggestions.vocabulary}</li>
                ) : Array.isArray(suggestions.vocabulary) ? (
                  suggestions.vocabulary.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  Object.entries(suggestions.vocabulary).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))
                )
              ) : (
                <li>Vocabulary insights not available</li>
              )}
            </ul>
          </div>
        </div>

        {/* 4. Learning Suggestions Section */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <FaLightbulb className="text-purple-600 dark:text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Learning Suggestions</h3>
          </div>
          <div className="text-gray-800 dark:text-gray-200">
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">Practice these to improve your skills:</p>
            <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
              {suggestions.suggestions ? (
                typeof suggestions.suggestions === 'string' ? (
                  <li>{suggestions.suggestions}</li>
                ) : Array.isArray(suggestions.suggestions) ? (
                  suggestions.suggestions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  Object.entries(suggestions.suggestions).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))
                )
              ) : (
                <li>Learning suggestions not available</li>
              )}
            </ul>
          </div>
        </div>

        {/* 5. Cultural Tip Section (if available) */}
        {suggestions.cultural && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaGlobe className="text-amber-600 dark:text-amber-400 mr-2" />
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Cultural Tips</h3>
            </div>
            <div className="text-gray-800 dark:text-gray-200">
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">Cultural context and usage insights:</p>
              <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                {typeof suggestions.cultural === 'string' ? (
                  <li>{suggestions.cultural}</li>
                ) : Array.isArray(suggestions.cultural) ? (
                  suggestions.cultural.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  Object.entries(suggestions.cultural).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-md p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text to Analyze
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to analyze..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Source Language
                    </label>
                    <select
                      value={userLanguage}
                      onChange={(e) => setUserLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((lang) => (
                        <option key={`user-${lang.code}`} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Language
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((lang) => (
                        <option key={`target-${lang.code}`} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Proficiency Level
                  </label>
                  <div className="flex justify-center gap-2">
                    {proficiencyLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setProficiencyLevel(level.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 min-w-[100px] ${
                          proficiencyLevel === level.value
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Focus Area
                  </label>
                  <div className="grid grid-cols-2 gap-2 justify-center">
                    {focusAreas.map((area) => (
                      <button
                        key={area.value}
                        type="button"
                        onClick={() => setFocusArea(area.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                          focusArea === area.value
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="mr-2">{area.icon}</span>
                        {area.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Analyzing Text...
                    </span>
                  ) : (
                    'Analyze Text'
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-md p-6 h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {error ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-300">
                  {error}
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <FaSpinner className="animate-spin text-4xl text-blue-600 dark:text-blue-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Analyzing your text and preparing personalized feedback...</p>
                </div>
              ) : suggestions ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Language Analysis Results
                  </h3>
                  {renderSuggestions()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <FaGraduationCap className="text-5xl text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    AI Language Tutor
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Enter text to receive a comprehensive language analysis with translation, grammar breakdown, vocabulary insights, learning suggestions, and cultural tips.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
    </div>
  );
};

export default LanguageLearningHub;
