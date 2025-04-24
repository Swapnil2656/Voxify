import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
  languages,
  label = 'Language',
  className = '',
  showFlag = true,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="form-label mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-3 py-2
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
          rounded-md shadow-sm text-left
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500'}
          transition-colors duration-200
        `}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {showFlag && <span className="mr-2 text-base">{getLanguageFlag(selectedLang?.code)}</span>}
          <span className="text-gray-900 dark:text-gray-100">{selectedLang?.name}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto custom-scrollbar"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <ul className="py-1" role="listbox">
              {languages.map((lang) => (
                <motion.li
                  key={lang.code}
                  className={`
                    px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                    ${selectedLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
                    flex items-center
                  `}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={selectedLanguage === lang.code}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                >
                  {showFlag && <span className="mr-2 text-base">{getLanguageFlag(lang.code)}</span>}
                  {lang.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to get flag emoji for language code
function getLanguageFlag(code) {
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
}

export default LanguageSelector;
