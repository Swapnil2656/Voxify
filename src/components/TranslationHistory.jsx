import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TranslationHistory = ({ history, languages, onReuse, onClear }) => {
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const toggleExpand = (id) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const toggleHistory = () => {
    setIsHistoryVisible(prev => !prev);
  };

  const getLanguageName = (code) => {
    return languages.find(l => l.code === code)?.name || code;
  };

  const getLanguageFlag = (code) => {
    // Import the same function from LanguageSelector to maintain consistency
    const flagEmojis = {
      // Common languages
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'zh': '🇨🇳',
      'zh-TW': '🇹🇼',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'ar': '🇸🇦',
      'hi': '🇮🇳',

      // European languages
      'nl': '🇳🇱',
      'el': '🇬🇷',
      'hu': '🇭🇺',
      'pl': '🇵🇱',
      'ro': '🇷🇴',
      'sv': '🇸🇪',
      'da': '🇩🇰',
      'fi': '🇫🇮',
      'cs': '🇨🇿',
      'sk': '🇸🇰',
      'uk': '🇺🇦',
      'no': '🇳🇴',
      'bg': '🇧🇬',
      'hr': '🇭🇷',
      'sr': '🇷🇸',
      'sl': '🇸🇮',
      'et': '🇪🇪',
      'lv': '🇱🇻',
      'lt': '🇱🇹',
      'tr': '🇹🇷',

      // Asian languages
      'th': '🇹🇭',
      'vi': '🇻🇳',
      'id': '🇮🇩',
      'ms': '🇲🇾',
      'tl': '🇵🇭',
      'bn': '🇧🇩',
      'ta': '🇮🇳',
      'te': '🇮🇳',
      'ml': '🇮🇳',
      'kn': '🇮🇳',
      'mr': '🇮🇳',
      'gu': '🇮🇳',
      'pa': '🇮🇳',
      'ur': '🇵🇰',
      'ne': '🇳🇵',
      'si': '🇱🇰',
      'km': '🇰🇭',
      'lo': '🇱🇦',
      'my': '🇲🇲',
      'mn': '🇲🇳',

      // Middle Eastern languages
      'he': '🇮🇱',
      'fa': '🇮🇷',
      'ps': '🇦🇫',
      'ku': '🇮🇶',
      'hy': '🇦🇲',
      'ka': '🇬🇪',

      // African languages
      'am': '🇪🇹',
      'ha': '🇳🇬',
      'ig': '🇳🇬',
      'yo': '🇳🇬',
      'zu': '🇿🇦',
      'xh': '🇿🇦',
      'sw': '🇹🇿',
      'so': '🇸🇴',
      'mg': '🇲🇬',

      // Other languages
      'is': '🇮🇸',
      'mt': '🇲🇹',
      'cy': '🇬🇧',
      'ga': '🇮🇪',
      'gd': '🇬🇧',
      'gl': '🇪🇸',
      'ca': '🇪🇸',
      'eu': '🇪🇸',
      'la': '🇻🇦',
      'eo': '🌍',
      'jv': '🇮🇩',
      'su': '🇮🇩',
      'haw': '🇺🇸',
      'mi': '🇳🇿',
      'sa': '🇮🇳',
      'yi': '🇮🇱',
      'ht': '🇭🇹',
      'lb': '🇱🇺',
      'mk': '🇲🇰',
      'az': '🇦🇿',
      'be': '🇧🇾',
      'fy': '🇳🇱',
      'kk': '🇰🇿',
      'ky': '🇰🇬',
      'tg': '🇹🇯',
      'tk': '🇹🇲',
      'uz': '🇺🇿',
    };

    return flagEmojis[code] || '🌐';
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mb-6">
      <button
        onClick={toggleHistory}
        className={`w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md hover:from-blue-600 hover:to-purple-600 transition-all ${isHistoryVisible ? 'rounded-b-none' : ''}`}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          <span className="text-lg font-semibold">Translation History</span>
          <span className="ml-2 bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
            {history.length}
          </span>
        </div>
        <div className="flex items-center">
          {history.length > 0 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="mr-3 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-white rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
              Clear
            </motion.button>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isHistoryVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isHistoryVisible && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-b-xl shadow-md border-t-0 border border-blue-100 dark:border-blue-800">
          {history.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500 dark:text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No translation history yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Your translations will appear here. You can reuse them later.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-auto custom-scrollbar">
            <AnimatePresence>
              {history.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group history-item p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleExpand(entry.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full mr-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getLanguageFlag(entry.sourceLanguage)}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mx-1 text-blue-500 dark:text-blue-400">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getLanguageFlag(entry.targetLanguage)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {getLanguageName(entry.sourceLanguage)} to {getLanguageName(entry.targetLanguage)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {entry.type === 'audio' && (
                          <span className="mr-2 badge badge-primary flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                              <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                              <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                            </svg>
                            Audio
                          </span>
                        )}
                        {entry.type === 'camera' && (
                          <span className="mr-2 badge badge-secondary flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                              <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0116.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Camera
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="text-base text-gray-700 dark:text-gray-300 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                      {entry.inputText}
                    </div>

                    <AnimatePresence>
                      {expandedEntry === entry.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg"
                        >
                          <div className="mb-3">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                              {entry.type === 'camera' ? 'Cleaned Text' : 'Original Text'}
                            </div>
                            <div className="text-sm text-gray-800 dark:text-gray-200 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-auto max-h-32">
                              {entry.inputText}
                            </div>
                          </div>

                          {entry.type === 'camera' && entry.rawOcrText && (
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                Raw OCR Text
                              </div>
                              <div className="text-sm text-gray-800 dark:text-gray-200 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-auto max-h-32 font-mono">
                                {entry.rawOcrText}
                              </div>
                            </div>
                          )}

                          <div className="mb-4">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                              Translation
                            </div>
                            <div className="text-sm text-gray-800 dark:text-gray-200 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-auto max-h-32">
                              {entry.translatedText}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                onReuse(entry);
                              }}
                              className="btn btn-sm btn-primary shadow-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                              </svg>
                              Use Again
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default TranslationHistory;
