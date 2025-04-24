import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const LearnMore = ({ darkMode, onToggleDarkMode }) => {
  return (
    <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Voxify</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Breaking language barriers with AI-powered real-time translation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
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

          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Powered by Advanced AI
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Groq API Integration</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Voxify leverages Groq's ultra-fast inference engine for high-quality, low-latency translations across 50+ languages.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Speech Recognition</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Advanced speech-to-text capabilities that accurately capture natural speech in multiple languages and accents.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Natural Translation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Context-aware translations that preserve meaning, tone, and cultural nuances across languages.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Key Features
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Offline Mode</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Download language packs for offline translation when traveling without reliable internet access.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Camera Translation</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Point your camera at signs, menus, or documents for instant visual translation.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conversation Mode</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Real-time two-way translation for natural conversations between speakers of different languages.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Travel Phrasebook</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Common travel phrases in 50+ languages, with audio pronunciation to help you communicate confidently.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              AI Learning Hub
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-md">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="/ai-learning.svg"
                      alt="AI Learning Hub"
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=AI+Learning+Hub';
                      }}
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Accelerate Your Language Learning
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The AI Learning Hub is Voxify's comprehensive language learning center that helps you master new languages faster and more effectively. Powered by advanced AI, it analyzes your language usage and provides personalized learning experiences.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Grammar Breakdown</h4>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Detailed analysis of sentence structure and grammar rules</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Vocabulary Insights</h4>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Word explanations with usage examples and synonyms</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Learning Suggestions</h4>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Personalized tips to improve your language skills</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Cultural Tips</h4>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Cultural context and usage insights for natural communication</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Speak or Type</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter text or use the microphone to record your voice in any language.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">AI Translation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI processes your input and translates it with high accuracy and natural phrasing.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Instant Results</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See and hear the translation instantly, with options to copy, share, or save for later.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Supported Languages
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">EN</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">English</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">ES</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Spanish</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">FR</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">French</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">DE</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">German</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">IT</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Italian</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">PT</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Portuguese</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">RU</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Russian</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">ZH</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chinese</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">JA</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Japanese</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">KO</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Korean</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">AR</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Arabic</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">HI</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hindi</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">TR</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Turkish</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">NL</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dutch</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">+35</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">More</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Break Language Barriers?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Start translating text and speech instantly with our powerful AI-driven language companion.
            </p>
            <motion.a
              href="/#/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 shadow-md"
            >
              Try Voxify Now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LearnMore;
