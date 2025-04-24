import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LanguageLearningHub from './LanguageLearningHub';
import ExerciseGenerator from './ExerciseGenerator';
import ConversationAnalyzer from './ConversationAnalyzer';
import Header from './Header';
import Footer from './Footer';
import { FaGraduationCap, FaBook, FaComments, FaArrowLeft } from 'react-icons/fa';

const AILearningHub = ({ darkMode, toggleDarkMode }) => {
  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [activeTab, setActiveTab] = useState('learning'); // 'learning', 'exercises', 'analyzer'

  const tabs = [
    { id: 'learning', label: 'Learning Suggestions', icon: <FaGraduationCap className="mr-2" /> },
    { id: 'exercises', label: 'Exercise Generator', icon: <FaBook className="mr-2" /> },
    { id: 'analyzer', label: 'Conversation Analyzer', icon: <FaComments className="mr-2" /> },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div
        className="transition-colors duration-300 min-h-screen"
        style={{
          backgroundImage: darkMode ? 'url(/colorful-pattern-dark.svg)' : 'url(/colorful-pattern.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <motion.main
          className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section id="ai-learning-hub" className="py-8">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Voxify
                </span> AI Learning Hub
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Enhance your language learning with AI-powered tools
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-white/20 rounded-full">
                        AI
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg p-6 backdrop-blur-sm">
              {activeTab === 'learning' && (
                <div className="learning-suggestions-content">
                  <LanguageLearningHub />
                </div>
              )}

              {activeTab === 'exercises' && (
                <div className="exercise-generator-content">
                  <ExerciseGenerator />
                </div>
              )}

              {activeTab === 'analyzer' && (
                <div className="conversation-analyzer-content">
                  <ConversationAnalyzer />
                </div>
              )}
            </div>
          </section>
        </motion.main>

        <Footer />
      </div>
    </div>
  );
};

export default AILearningHub;
