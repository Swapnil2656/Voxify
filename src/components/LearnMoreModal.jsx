import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LearnMoreModal = ({ isOpen, onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal content */}
              <div className="p-6 md:p-8">
                <div className="mb-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    About <span className="font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Voxify</span>
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Breaking language barriers with AI-powered real-time translation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-center">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Our Mission
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      At Voxify, we believe that language should never be a barrier to human connection. Our mission is to create technology that enables seamless communication across languages, cultures, and borders.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Whether you're traveling abroad, connecting with international colleagues, or learning a new language, Voxify is designed to make communication effortless and natural.
                    </p>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="/travel-map.svg"
                      alt="World map with travel routes"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Powered by Advanced AI
                  </h2>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Neural Machine Translation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          State-of-the-art AI models that understand context and nuance for more natural translations.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Speech Recognition</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Advanced voice recognition that works across accents and in noisy environments.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Natural Text-to-Speech</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Lifelike voice synthesis that sounds natural in any language.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Key Features
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">Offline Mode</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Download language packs for offline translation when traveling without internet access.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">Conversation Mode</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Real-time bilingual conversations with automatic language detection and translation.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">Travel Phrasebook</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Common travel phrases in 50+ languages, with audio pronunciation to help you communicate confidently.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    How It Works
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Speak or Type</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter text or use the microphone to record your voice in any language.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">2</span>
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">AI Translation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Our AI processes your input and translates it with high accuracy.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">3</span>
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Instant Results</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        See and hear the translation instantly, with options to copy, share, or save for later.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    AI Learning Hub
                  </h2>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-md">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="md:w-1/3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                          <img
                            src="/ai-learning.svg"
                            alt="AI Learning Hub"
                            className="w-full h-auto"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/600x400/indigo/white?text=AI+Learning+Hub";
                            }}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Accelerate Your Language Learning
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          The AI Learning Hub is Voxify's comprehensive language learning center that helps you master new languages faster and more effectively. Powered by advanced AI, it analyzes your language usage and provides personalized learning experiences.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Personalized Learning</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Customized lessons based on your proficiency level and learning goals</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Interactive Exercises</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Engaging activities to practice vocabulary, grammar, and pronunciation</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Progress Tracking</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Detailed analytics to monitor your improvement over time</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Daily Practice</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Short, effective daily lessons to build language skills consistently</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Break Language Barriers?
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    Start translating text and speech instantly with our powerful AI-driven language companion.
                  </p>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                  >
                    Try Voxify Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LearnMoreModal;
