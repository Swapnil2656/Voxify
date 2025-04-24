import React from 'react';
import { FaLightbulb } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const HowItWorks = ({ darkMode, toggleDarkMode }) => {
  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="How It Works"
      subtitle="Discover how Voxify breaks language barriers with advanced AI technology"
      icon={<FaLightbulb size={24} />}
    >
      <h2>Breaking Language Barriers with Advanced AI</h2>
      <p>
        Voxify leverages cutting-edge AI technology to provide seamless, real-time translation
        across multiple languages. Our platform is designed to be intuitive, fast, and accurate,
        making communication across language barriers effortless.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-8 border-l-4 border-blue-500">
        <h3 className="flex items-center text-xl font-bold text-blue-700 dark:text-blue-400 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Text Translation
        </h3>
        <p>
          Our text translation feature uses Groq's ultra-fast inference engine to deliver
          translations with exceptional speed and accuracy. Simply type or paste your text,
          select your target language, and get instant translations.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Support for over 100 languages</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Context-aware translations that preserve meaning</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Specialized handling for idioms and cultural expressions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time translation as you type</span>
            </li>
          </ul>
        </div>
      </div>

      <h3>Speech-to-Text Translation</h3>
      <p>
        Speak naturally in your language, and Voxify will transcribe and translate your
        speech in real-time. Perfect for conversations, meetings, or when you need hands-free
        translation.
      </p>
      <ul>
        <li>High-accuracy speech recognition</li>
        <li>Support for multiple accents and dialects</li>
        <li>Background noise filtering</li>
        <li>Continuous listening mode for conversations</li>
      </ul>

      <h3>Image-Based Translation</h3>
      <p>
        Point your camera at text in a foreign language, and Voxify will translate it
        instantly. Ideal for menus, signs, documents, or any printed text you encounter.
      </p>
      <ul>
        <li>OCR (Optical Character Recognition) technology</li>
        <li>Maintains original formatting where possible</li>
        <li>Works with various fonts and text styles</li>
        <li>Handles text at different angles and in different lighting conditions</li>
      </ul>

      <h3>Conversation Mode</h3>
      <p>
        Facilitate bilingual conversations with our conversation mode. Voxify acts as an
        interpreter between two speakers of different languages, translating in both directions
        in real-time.
      </p>
      <ul>
        <li>Seamless back-and-forth translation</li>
        <li>Speaker identification</li>
        <li>Maintains conversation context for more accurate translations</li>
        <li>Works offline for essential phrases (with Premium plan)</li>
      </ul>

      <h3>AI Learning Hub</h3>
      <p>
        Our AI Learning Hub goes beyond simple translation to help you learn languages more
        effectively. It provides grammar explanations, vocabulary insights, and cultural
        context to deepen your understanding.
      </p>
      <ul>
        <li>Personalized learning recommendations</li>
        <li>Grammar breakdowns and explanations</li>
        <li>Cultural notes and usage examples</li>
        <li>Adaptive difficulty based on your proficiency level</li>
      </ul>

      <h2>Technology Behind Voxify</h2>
      <p>
        Voxify is powered by Groq's state-of-the-art language models and inference engine,
        delivering translations with unprecedented speed and accuracy. Our platform combines
        several AI technologies:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="p-5">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Large Language Models</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">For context-aware, natural-sounding translations that preserve meaning across languages.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="p-5">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Speech Recognition</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">For accurate transcription of spoken language with support for multiple accents and dialects.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
          <div className="p-5">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 017.072 0m-9.9-2.828a9 9 0 0112.728 0" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Text-to-Speech</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">For natural-sounding pronunciation that helps with language learning and communication.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600"></div>
          <div className="p-5">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Computer Vision</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">For image-based translation that helps you understand text in foreign languages on signs, menus, and documents.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="p-1 bg-gradient-to-r from-red-500 to-pink-600"></div>
          <div className="p-5">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Adaptive Learning</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">For personalized language learning experiences that adapt to your proficiency level and learning style.</p>
          </div>
        </div>
      </div>

      <p>
        All of these technologies work together seamlessly to provide you with a comprehensive
        language solution that adapts to your needs, whether you're traveling, learning a new
        language, or communicating with people around the world.
      </p>
    </FooterPageTemplate>
  );
};

export default HowItWorks;
