import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';
import translationHistoryService from '../services/translationHistoryService';
import userPreferencesService from '../services/userPreferencesService';

const ProfilePage = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [translations, setTranslations] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load translations
        const translationHistory = await translationHistoryService.getHistory(10);
        setTranslations(translationHistory);
        
        // Load preferences
        const userPrefs = await userPreferencesService.getPreferences();
        setPreferences(userPrefs);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{user?.email || 'Not available'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                      <p className="text-gray-900 dark:text-white">{user?.id || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
                  {preferences ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Default Source Language</p>
                        <p className="text-gray-900 dark:text-white">{preferences.sourceLanguage || 'English'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Default Target Language</p>
                        <p className="text-gray-900 dark:text-white">{preferences.targetLanguage || 'Spanish'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Dark Mode</p>
                        <p className="text-gray-900 dark:text-white">{preferences.darkMode ? 'Enabled' : 'Disabled'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Voice Speed</p>
                        <p className="text-gray-900 dark:text-white">{preferences.voiceSpeed || '1.0'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No preferences found.</p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Translations</h2>
                  {translations.length > 0 ? (
                    <div className="space-y-4">
                      {translations.slice(0, 5).map((translation, index) => (
                        <div key={translation.id || index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-gray-900 dark:text-white font-medium">{translation.inputText}</p>
                              <p className="text-gray-600 dark:text-gray-300 mt-1">{translation.translatedText}</p>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(translation.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="mr-2">{translation.sourceLanguage} → {translation.targetLanguage}</span>
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                              {translation.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No translations found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
