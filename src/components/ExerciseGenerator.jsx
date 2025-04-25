import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaSpinner, FaGraduationCap, FaBook, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import configService from '../services/configService';

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

const ExerciseGenerator = () => {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [proficiencyLevel, setProficiencyLevel] = useState('intermediate');
  const [exerciseType, setExerciseType] = useState('mixed');
  const [exercises, setExercises] = useState(null);
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

  const exerciseTypes = [
    { value: 'mixed', label: 'Mixed Exercises', icon: <FaGraduationCap /> },
    { value: 'vocabulary', label: 'Vocabulary', icon: <FaBook /> },
    { value: 'grammar', label: 'Grammar', icon: <FaCheckCircle /> },
    { value: 'comprehension', label: 'Comprehension', icon: <FaQuestionCircle /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please enter some text to generate exercises');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExercises(null);

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      console.log('Sending exercise generation request to backend...');
      const response = await axios.post(`${configService.getFastApiUrl()}/generate-exercises`, {
        text,
        targetLanguage,
        proficiencyLevel,
        exerciseType
      }, {
        timeout: 15000, // 15 second timeout for AI processing
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Received response:', response.data);

      if (response.data.success) {
        if (response.data.exercises && Object.keys(response.data.exercises).length > 0) {
          setExercises(response.data.exercises);
        } else if (response.data.exercises && response.data.exercises.raw) {
          // Handle raw text response
          setExercises({
            parsed: false,
            raw: response.data.exercises.raw,
            note: 'The AI returned a response in an unexpected format. Here is the raw content:'
          });
        } else {
          setError('Received empty response from the server');
        }
      } else {
        setError('Failed to generate exercises');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Error generating exercises:', err);

      // Use the common error handling function
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const renderExercises = () => {
    if (!exercises) return null;

    // Handle raw text response or parsed=false
    if (exercises.raw || exercises.parsed === false) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-yellow-800 dark:text-yellow-400 font-medium mb-2">Response</h3>
          {exercises.note && <p className="text-yellow-700 dark:text-yellow-300 mb-2">{exercises.note}</p>}
          <pre className="whitespace-pre-wrap text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40 p-3 rounded">
            {exercises.raw}
          </pre>
        </div>
      );
    }

    // Handle error response
    if (exercises.error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-300">
          {exercises.error}
        </div>
      );
    }

    // Render based on exercise type
    switch (exerciseType) {
      case 'vocabulary':
        return (
          <div className="space-y-4">
            {exercises.vocabulary && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Key Vocabulary</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {Array.isArray(exercises.vocabulary) ?
                    exercises.vocabulary.map((word, idx) => (
                      <li key={idx} className="text-gray-800 dark:text-gray-200">{word}</li>
                    )) :
                    <li className="text-gray-800 dark:text-gray-200">{exercises.vocabulary}</li>
                  }
                </ul>
              </div>
            )}

            {exercises.fillBlanks && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Fill in the Blanks</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.fillBlanks === 'string' ?
                    <p>{exercises.fillBlanks}</p> :
                    Array.isArray(exercises.fillBlanks) ?
                      exercises.fillBlanks.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.fillBlanks).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.matching && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">Matching Exercise</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.matching === 'string' ?
                    <p>{exercises.matching}</p> :
                    Array.isArray(exercises.matching) ?
                      exercises.matching.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.matching).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.questions && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Questions</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.questions === 'string' ?
                    <p>{exercises.questions}</p> :
                    Array.isArray(exercises.questions) ?
                      exercises.questions.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.questions).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}
          </div>
        );

      case 'grammar':
        return (
          <div className="space-y-4">
            {exercises.grammarPoints && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Grammar Points</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.grammarPoints === 'string' ?
                    <p>{exercises.grammarPoints}</p> :
                    Array.isArray(exercises.grammarPoints) ?
                      exercises.grammarPoints.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.grammarPoints).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.transformations && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Sentence Transformations</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.transformations === 'string' ?
                    <p>{exercises.transformations}</p> :
                    Array.isArray(exercises.transformations) ?
                      exercises.transformations.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.transformations).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.corrections && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Error Corrections</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.corrections === 'string' ?
                    <p>{exercises.corrections}</p> :
                    Array.isArray(exercises.corrections) ?
                      exercises.corrections.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.corrections).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.questions && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Questions</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.questions === 'string' ?
                    <p>{exercises.questions}</p> :
                    Array.isArray(exercises.questions) ?
                      exercises.questions.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.questions).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}
          </div>
        );

      case 'comprehension':
        return (
          <div className="space-y-4">
            {exercises.multipleChoice && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Multiple Choice Questions</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.multipleChoice === 'string' ?
                    <p>{exercises.multipleChoice}</p> :
                    Array.isArray(exercises.multipleChoice) ?
                      exercises.multipleChoice.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.multipleChoice).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.trueFalse && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">True/False Statements</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.trueFalse === 'string' ?
                    <p>{exercises.trueFalse}</p> :
                    Array.isArray(exercises.trueFalse) ?
                      exercises.trueFalse.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.trueFalse).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.shortAnswer && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">Short Answer Questions</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.shortAnswer === 'string' ?
                    <p>{exercises.shortAnswer}</p> :
                    Array.isArray(exercises.shortAnswer) ?
                      exercises.shortAnswer.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.shortAnswer).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.summary && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Summary Writing</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.summary === 'string' ?
                    <p>{exercises.summary}</p> :
                    Array.isArray(exercises.summary) ?
                      exercises.summary.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.summary).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}
          </div>
        );

      default: // mixed
        return (
          <div className="space-y-4">
            {exercises.vocabulary && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Vocabulary</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.vocabulary === 'string' ?
                    <p>{exercises.vocabulary}</p> :
                    Array.isArray(exercises.vocabulary) ?
                      exercises.vocabulary.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.vocabulary).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.grammar && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Grammar</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.grammar === 'string' ?
                    <p>{exercises.grammar}</p> :
                    Array.isArray(exercises.grammar) ?
                      exercises.grammar.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.grammar).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.comprehension && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">Comprehension</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.comprehension === 'string' ?
                    <p>{exercises.comprehension}</p> :
                    Array.isArray(exercises.comprehension) ?
                      exercises.comprehension.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.comprehension).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {exercises.discussion && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Discussion</h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {typeof exercises.discussion === 'string' ?
                    <p>{exercises.discussion}</p> :
                    Array.isArray(exercises.discussion) ?
                      exercises.discussion.map((item, idx) => (
                        <div key={idx} className="mb-2">{item}</div>
                      )) :
                      Object.entries(exercises.discussion).map(([key, value], idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-medium">{key}: </span>
                          <span>{value}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}
          </div>
        );
    }
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
                    Text for Exercises
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text in your target language..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                    required
                  />
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Proficiency Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {proficiencyLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setProficiencyLevel(level.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                    Exercise Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {exerciseTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setExerciseType(type.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                          exerciseType === type.value
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
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
                      Generating Exercises...
                    </span>
                  ) : (
                    'Generate Exercises'
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
                  <p className="text-gray-600 dark:text-gray-400">Generating personalized exercises...</p>
                </div>
              ) : exercises ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Practice Exercises
                  </h3>
                  {renderExercises()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <FaGraduationCap className="text-5xl text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ready to practice your language skills?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Enter text in your target language and get personalized exercises powered by AI.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
    </div>
  );
};

export default ExerciseGenerator;
