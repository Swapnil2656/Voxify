import React from 'react';
import { motion } from 'framer-motion';

const TranslationActions = ({ translatedText, isLoading, onPlayAudio }) => {
  const copyToClipboard = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      // You could add a toast notification here
    }
  };

  return (
    <div className="flex space-x-3">
      <motion.button
        onClick={onPlayAudio}
        disabled={!translatedText || isLoading}
        className={`btn btn-primary flex-1 ${!translatedText || isLoading ? 'btn-disabled' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Listen to translation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
          <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.477A6.98 6.98 0 002 10a6.98 6.98 0 00.467 2.523.75.75 0 00.7.477h1.537l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06a7 7 0 000-9.899z" />
          <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06a4 4 0 000-5.656z" />
        </svg>
        Listen
      </motion.button>
      
      {translatedText && (
        <motion.button
          onClick={copyToClipboard}
          className="btn btn-secondary btn-icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Copy translation to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default TranslationActions;
