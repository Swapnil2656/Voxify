import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import offlineService from '../services/offlineService';
import authService from '../services/authService';

const OfflineMode = () => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadedPacks, setDownloadedPacks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user and downloaded language packs
  useEffect(() => {
    const fetchUserAndPacks = async () => {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        if (user) {
          const packs = await offlineService.getUserLanguagePacks(user.id);
          setDownloadedPacks(packs);

          // If there are downloaded packs, enable offline mode
          if (packs.length > 0) {
            setOfflineEnabled(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user or language packs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPacks();
  }, []);

  // Available languages for offline use
  const availableLanguages = [
    { code: 'en', name: 'English', size: '12MB' },
    { code: 'es', name: 'Spanish', size: '15MB' },
    { code: 'fr', name: 'French', size: '14MB' },
    { code: 'de', name: 'German', size: '16MB' },
    { code: 'it', name: 'Italian', size: '14MB' },
    { code: 'pt', name: 'Portuguese', size: '15MB' },
    { code: 'ru', name: 'Russian', size: '18MB' },
    { code: 'zh', name: 'Chinese', size: '22MB' },
    { code: 'ja', name: 'Japanese', size: '20MB' },
    { code: 'ko', name: 'Korean', size: '18MB' },
    { code: 'ar', name: 'Arabic', size: '17MB' },
    { code: 'hi', name: 'Hindi', size: '16MB' },
  ];

  // Toggle language selection
  const toggleLanguage = (langCode) => {
    setSelectedLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  // Start downloading selected language packs
  const downloadLanguagePacks = async () => {
    if (selectedLanguages.length === 0) return;

    // If no current user, create a mock user for testing
    if (!currentUser) {
      setCurrentUser({
        id: 'mock-user-' + Date.now(),
        email: 'mock@example.com',
        user_metadata: {
          username: 'mockuser',
          full_name: 'Mock User'
        }
      });
    }

    // Initialize progress for each selected language
    const initialProgress = {};
    selectedLanguages.forEach(code => {
      initialProgress[code] = 0;
    });
    setDownloadProgress(initialProgress);

    // Process each selected language
    for (const code of selectedLanguages) {
      // Find the language details
      const language = availableLanguages.find(lang => lang.code === code);
      if (!language) continue;

      // Simulate download progress
      const totalTime = Math.random() * 3000 + 2000; // 2-5 seconds
      const interval = 100;
      const steps = totalTime / interval;
      let currentStep = 0;

      const progressPromise = new Promise(resolve => {
        const progressInterval = setInterval(() => {
          currentStep++;
          const progress = Math.min(Math.round((currentStep / steps) * 100), 100);

          setDownloadProgress(prev => ({
            ...prev,
            [code]: progress
          }));

          if (progress === 100) {
            clearInterval(progressInterval);
            resolve();
          }
        }, interval);
      });

      // Wait for the progress animation to complete
      await progressPromise;

      try {
        // Get the current user (might have been set during this function execution)
        const user = currentUser || {
          id: 'mock-user-' + Date.now(),
          email: 'mock@example.com',
          user_metadata: {
            username: 'mockuser',
            full_name: 'Mock User'
          }
        };

        // Save the language pack to the database
        const pack = await offlineService.downloadLanguagePack(
          user.id,
          code,
          language.name,
          language.size
        );

        // Add the pack to the downloaded packs
        if (pack) {
          setDownloadedPacks(prev => {
            // Remove any existing pack with the same language code
            const filtered = prev.filter(p => p.language_code !== code);
            return [...filtered, pack];
          });
        }
      } catch (error) {
        console.error(`Error saving language pack ${code}:`, error);
      }
    }

    // Enable offline mode and clear progress
    setOfflineEnabled(true);
    setTimeout(() => {
      setDownloadProgress({});
    }, 1000);
  };

  // Delete a language pack
  const deleteLanguagePack = async (languageCode) => {
    console.log(`Attempting to delete language pack: ${languageCode}`);
    // If no current user, create a mock user for testing
    const user = currentUser || {
      id: 'mock-user-' + Date.now(),
      email: 'mock@example.com',
      user_metadata: {
        username: 'mockuser',
        full_name: 'Mock User'
      }
    };

    try {
      const success = await offlineService.deleteLanguagePack(user.id, languageCode);

      console.log(`Delete operation result: ${success}`);
      if (success) {
        // Remove the pack from the downloaded packs and update offline mode status
        setDownloadedPacks(prev => {
          console.log(`Current packs before deletion:`, prev);
          const updatedPacks = prev.filter(p => p.language_code !== languageCode);

          // If no packs left after deletion, disable offline mode
          if (updatedPacks.length === 0) {
            setOfflineEnabled(false);
          }

          console.log(`Updated packs after deletion:`, updatedPacks);
          return updatedPacks;
        });
      }
    } catch (error) {
      console.error(`Error deleting language pack ${languageCode}:`, error);
    }
  };

  // Try offline mode
  const tryOfflineMode = () => {
    // Check if user is logged in
    if (!currentUser) {
      setError('Please log in to use offline mode');
      return;
    }

    setShowModal(true);
  };

  // State for error message
  const [error, setError] = useState(null);
  return (
    <>
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <img
                src="/travel-map.svg"
                alt="Travel map"
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <div className="mt-6">
                <img
                  src="/landmarks.svg"
                  alt="World landmarks"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 order-1 lg:order-2"
            >
              <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                Travel Without Limits
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                <span className="font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Voxify</span> - Translate Anywhere with Offline Mode
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-400">
                Don't let poor connectivity stop you from communicating. Voxify's offline mode ensures you can translate essential phrases even without an internet connection.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Download Language Packs</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Download compact language packs before your trip to ensure you're never left speechless.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Works Without Internet</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Perfect for remote locations, flights, or areas with limited connectivity.</p>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>

                  {error.includes('log in') && (
                    <div className="mt-3 flex space-x-3">
                      <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Log In
                      </Link>
                      <Link to="/signup" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 space-y-4">
                <motion.button
                  onClick={tryOfflineMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary btn-lg"
                >
                  {offlineEnabled ? 'Offline Mode Enabled' : 'Try Offline Mode'}
                </motion.button>

                {/* Downloaded Language Packs Dropdown */}
                {downloadedPacks.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span>Downloaded Language Packs ({downloadedPacks.length})</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="max-h-60 overflow-y-auto">
                          {downloadedPacks.map((pack) => (
                            <div
                              key={pack.id}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{pack.language_name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {pack.size} • Downloaded {new Date(pack.download_date).toLocaleDateString()}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click
                                  deleteLanguagePack(pack.language_code);
                                }}
                                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete language pack"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Language Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Download Language Packs</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select languages to download for offline use. These will be available even without an internet connection.
              </p>

              <div className="space-y-2">
                {availableLanguages.map(lang => {
                  const isSelected = selectedLanguages.includes(lang.code);
                  const progress = downloadProgress[lang.code] || 0;
                  const isDownloading = progress > 0 && progress < 100;
                  const isDownloaded = progress === 100;
                  const isAlreadyDownloaded = downloadedPacks.some(pack => pack.language_code === lang.code);

                  return (
                    <div
                      key={lang.code}
                      className={`p-3 border rounded-lg flex items-center justify-between ${isSelected ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : isAlreadyDownloaded ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`lang-${lang.code}`}
                          checked={isSelected || isAlreadyDownloaded}
                          onChange={() => !isAlreadyDownloaded && toggleLanguage(lang.code)}
                          disabled={isDownloading || isAlreadyDownloaded}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`lang-${lang.code}`} className="ml-3 block text-gray-900 dark:text-white">
                          {lang.name} <span className="text-sm text-gray-500 dark:text-gray-400">({lang.size})</span>
                          {isAlreadyDownloaded && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Downloaded
                            </span>
                          )}
                        </label>
                      </div>

                      <div className="flex items-center">
                        {isDownloading && (
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        )}

                        {isDownloaded && (
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}

                        {isAlreadyDownloaded && !isDownloading && !isDownloaded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent checkbox toggle
                              deleteLanguagePack(lang.code);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete language pack"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={downloadLanguagePacks}
                disabled={selectedLanguages.length === 0 || Object.keys(downloadProgress).length > 0}
                className={`px-4 py-2 rounded-md text-white ${selectedLanguages.length === 0 || Object.keys(downloadProgress).length > 0 ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'} transition-colors`}
              >
                {Object.keys(downloadProgress).length > 0 ? 'Downloading...' : 'Download Selected'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default OfflineMode;
