import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaSpinner, FaComments, FaSmile, FaUserTie, FaUsers, FaGlobeAmericas } from 'react-icons/fa';
import configService from '../services/configService';

// Add a function to handle API errors consistently
const handleApiError = (error) => {
  if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again with a shorter conversation or fewer analysis options.';
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

const ConversationAnalyzer = () => {
  const [conversation, setConversation] = useState('');
  const [speakerA, setSpeakerA] = useState('en');
  const [speakerB, setSpeakerB] = useState('es');
  const [analyzeFor, setAnalyzeFor] = useState(['sentiment', 'formality']);
  const [analysis, setAnalysis] = useState(null);
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

  const analysisOptions = [
    { value: 'sentiment', label: 'Sentiment', icon: <FaSmile /> },
    { value: 'formality', label: 'Formality', icon: <FaUserTie /> },
    { value: 'engagement', label: 'Engagement', icon: <FaUsers /> },
    { value: 'cultural', label: 'Cultural Context', icon: <FaGlobeAmericas /> },
  ];

  const toggleAnalysisOption = (option) => {
    if (analyzeFor.includes(option)) {
      setAnalyzeFor(analyzeFor.filter(item => item !== option));
    } else {
      setAnalyzeFor([...analyzeFor, option]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!conversation.trim()) {
      setError('Please enter a conversation to analyze');
      return;
    }

    if (analyzeFor.length === 0) {
      setError('Please select at least one analysis option');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Parse the conversation into messages
      const lines = conversation.trim().split('\\n');
      const messages = [];

      for (const line of lines) {
        if (line.trim()) {
          // Try to detect if it's speaker A or B based on the line format
          const speakerAMatch = line.match(/^(A|Speaker A|Person A):\s*(.+)$/i);
          const speakerBMatch = line.match(/^(B|Speaker B|Person B):\s*(.+)$/i);

          if (speakerAMatch) {
            messages.push({
              speaker: 'A',
              text: speakerAMatch[2].trim(),
              language: speakerA
            });
          } else if (speakerBMatch) {
            messages.push({
              speaker: 'B',
              text: speakerBMatch[2].trim(),
              language: speakerB
            });
          } else {
            // If no clear speaker format, alternate between A and B
            const speaker = messages.length % 2 === 0 ? 'A' : 'B';
            const language = speaker === 'A' ? speakerA : speakerB;

            messages.push({
              speaker,
              text: line.trim(),
              language
            });
          }
        }
      }

      if (messages.length === 0) {
        throw new Error('Could not parse any messages from the conversation');
      }

      console.log('Sending conversation analysis request to backend...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await axios.post(`${configService.getFastApiUrl()}/analyze-conversation`, {
        messages,
        analyzeFor
      }, {
        timeout: 15000, // 15 second timeout for AI processing
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Received response:', response.data);

      if (response.data.success) {
        if (response.data.analysis && Object.keys(response.data.analysis).length > 0) {
          setAnalysis(response.data.analysis);
        } else if (response.data.analysis && response.data.analysis.raw) {
          // Handle raw text response
          setAnalysis({
            parsed: false,
            raw: response.data.analysis.raw,
            note: 'The AI returned a response in an unexpected format. Here is the raw content:'
          });
        } else {
          setError('Received empty response from the server');
        }
      } else {
        setError('Failed to analyze conversation');
      }
    } catch (err) {
      if (typeof timeoutId !== 'undefined') {
        clearTimeout(timeoutId);
      }
      console.error('Error analyzing conversation:', err);

      // Use the common error handling function
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    // Handle raw text response or parsed=false
    if (analysis.raw || analysis.parsed === false) {
      // Try to extract useful information from raw response
      let formattedContent = analysis.raw;
      try {
        // Check if the raw content contains JSON
        if (analysis.raw.includes('{') && analysis.raw.includes('}')) {
          // Try to extract JSON from the raw text
          const jsonMatch = analysis.raw.match(/\{[\s\S]*\}/g);
          if (jsonMatch && jsonMatch[0]) {
            const parsedJson = JSON.parse(jsonMatch[0]);

            // If we successfully parsed JSON, render it in a user-friendly format
            return (
              <div className="space-y-6">
                {/* Sentiment Analysis */}
                {parsedJson.sentiment && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaSmile className="text-blue-600 dark:text-blue-400 mr-2" />
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Sentiment Analysis</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                      <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                        {Array.isArray(parsedJson.sentiment) ? (
                          parsedJson.sentiment.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : typeof parsedJson.sentiment === 'object' ? (
                          Object.entries(parsedJson.sentiment).map(([key, value], idx) => (
                            <li key={idx}>
                              <span className="font-medium">{key}: </span>
                              <span>{value}</span>
                            </li>
                          ))
                        ) : (
                          <li>{parsedJson.sentiment}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Formality Analysis */}
                {parsedJson.formality && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaUserTie className="text-purple-600 dark:text-purple-400 mr-2" />
                      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Formality Analysis</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                      <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                        {Array.isArray(parsedJson.formality) ? (
                          parsedJson.formality.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : typeof parsedJson.formality === 'object' ? (
                          Object.entries(parsedJson.formality).map(([key, value], idx) => (
                            <li key={idx}>
                              <span className="font-medium">{key}: </span>
                              <span>{value}</span>
                            </li>
                          ))
                        ) : (
                          <li>{parsedJson.formality}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Engagement Analysis */}
                {parsedJson.engagement && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaUsers className="text-green-600 dark:text-green-400 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Engagement Analysis</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                      <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                        {Array.isArray(parsedJson.engagement) ? (
                          parsedJson.engagement.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : typeof parsedJson.engagement === 'object' ? (
                          Object.entries(parsedJson.engagement).map(([key, value], idx) => (
                            <li key={idx}>
                              <span className="font-medium">{key}: </span>
                              <span>{value}</span>
                            </li>
                          ))
                        ) : (
                          <li>{parsedJson.engagement}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Cultural Analysis */}
                {parsedJson.cultural && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaGlobeAmericas className="text-amber-600 dark:text-amber-400 mr-2" />
                      <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Cultural Context</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
                      <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                        {Array.isArray(parsedJson.cultural) ? (
                          parsedJson.cultural.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : typeof parsedJson.cultural === 'object' ? (
                          Object.entries(parsedJson.cultural).map(([key, value], idx) => (
                            <li key={idx}>
                              <span className="font-medium">{key}: </span>
                              <span>{value}</span>
                            </li>
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
          <h3 className="text-yellow-800 dark:text-yellow-400 font-medium mb-2">Conversation Analysis</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We received a response from our AI conversation analyzer, but it wasn't in the expected format.
            Here's what we got:
          </p>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {formattedContent.replace(/[\{\}"\[\]\,]/g, ' ').replace(/\s+/g, ' ')}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Try again with a different conversation or analysis options for better results.
          </p>
        </div>
      );
    }

    // Handle error response
    if (analysis.error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Error</h3>
          <p className="text-red-700 dark:text-red-300">{analysis.error}</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Please try again with a different conversation or analysis options.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Sentiment Analysis */}
        {analysis.sentiment && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaSmile className="text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Sentiment Analysis</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">How the speakers feel and express emotions:</p>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
              {typeof analysis.sentiment === 'string' ? (
                <p className="text-gray-800 dark:text-gray-200">{analysis.sentiment}</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                  {Object.entries(analysis.sentiment).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Formality Analysis */}
        {analysis.formality && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaUserTie className="text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Formality Analysis</h3>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">The level of formality in the conversation:</p>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
              {typeof analysis.formality === 'string' ? (
                <p className="text-gray-800 dark:text-gray-200">{analysis.formality}</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                  {Object.entries(analysis.formality).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Engagement Analysis */}
        {analysis.engagement && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaUsers className="text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Engagement Analysis</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">How speakers interact and engage with each other:</p>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
              {typeof analysis.engagement === 'string' ? (
                <p className="text-gray-800 dark:text-gray-200">{analysis.engagement}</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                  {Object.entries(analysis.engagement).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Cultural Analysis */}
        {analysis.cultural && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaGlobeAmericas className="text-amber-600 dark:text-amber-400 mr-2" />
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Cultural Context</h3>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">Cultural nuances and language-specific insights:</p>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-inner">
              {typeof analysis.cultural === 'string' ? (
                <p className="text-gray-800 dark:text-gray-200">{analysis.cultural}</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                  {Object.entries(analysis.cultural).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              )}
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
                    Conversation
                  </label>
                  <textarea
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                    placeholder="Enter conversation to analyze...\nExample:\nSpeaker A: Hello, how are you?\nSpeaker B: I'm doing well, thank you!"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="8"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: "Speaker A: [text]" and "Speaker B: [text]" or just enter lines of text (will alternate speakers)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Speaker A Language
                    </label>
                    <select
                      value={speakerA}
                      onChange={(e) => setSpeakerA(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {languages.map((lang) => (
                        <option key={`speaker-a-${lang.code}`} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Speaker B Language
                    </label>
                    <select
                      value={speakerB}
                      onChange={(e) => setSpeakerB(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {languages.map((lang) => (
                        <option key={`speaker-b-${lang.code}`} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Analysis Options
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {analysisOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleAnalysisOption(option.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                          analyzeFor.includes(option.value)
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Analyzing Conversation...
                    </span>
                  ) : (
                    'Analyze Conversation'
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
                  <FaSpinner className="animate-spin text-4xl text-purple-600 dark:text-purple-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Analyzing conversation...</p>
                </div>
              ) : analysis ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Conversation Analysis
                  </h3>
                  {renderAnalysis()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <FaComments className="text-5xl text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ready to analyze a conversation?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Enter a conversation and get insights into sentiment, formality, engagement, and cultural context.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
    </div>
  );
};

export default ConversationAnalyzer;
