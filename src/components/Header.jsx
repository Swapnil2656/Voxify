import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ darkMode, toggleDarkMode }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="py-3 md:py-4 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            </div>
            <div>
              <a href="/#/" className="block">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity">
                  Voxify
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Real-Time Language Companion</p>
              </a>
            </div>
          </motion.div>

          {/* Empty middle section */}
          <div className="hidden md:block flex-1"></div>

          {/* Actions */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* AI Learning Hub Button */}
            <Link
              to="/learning-hub"
              className="hidden md:flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-sm"
            >
              <span className="text-sm font-medium mr-1.5">AI Learning Hub</span>
              <span className="px-1.5 py-0.5 text-xs font-medium bg-white/20 rounded-full">AI</span>
            </Link>

            {/* Authentication Buttons */}
            {isAuthenticated() ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <motion.button
                    className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Account'}
                  </motion.button>
                </Link>
                <motion.button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <motion.button
                    className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    className="text-sm px-3 py-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <motion.button
              className="dark-mode-toggle w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                /* Moon Icon - shown in dark mode */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
              ) : (
                /* Sun Icon - shown in light mode */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
