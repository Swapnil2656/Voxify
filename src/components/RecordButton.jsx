import React from 'react';
import { motion } from 'framer-motion';

const RecordButton = ({ isRecording, onClick, disabled }) => {
  return (
    <div className="relative mb-4">
      {/* Outer ring animation when recording */}
      {isRecording && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/20"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.5, 0.7] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative flex items-center justify-center w-20 h-20 rounded-full
          ${isRecording
            ? 'bg-gradient-to-br from-red-500 to-red-600 recording-pulse'
            : 'bg-gradient-to-br from-blue-500 to-blue-700'}
          text-white shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          transition-all duration-300 z-10 mb-2
        `}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08, boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.2), 0 10px 15px -5px rgba(0, 0, 0, 0.1)' }}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <motion.div
          animate={isRecording ? { scale: [1, 0.9, 1] } : { scale: 1 }}
          transition={isRecording ? { duration: 1.5, repeat: Infinity } : {}}
        >
          {isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Status indicator */}
      <motion.div
        className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium shadow-sm z-20 ${isRecording ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isRecording ? 'Recording' : 'Ready'}
      </motion.div>
    </div>
  );
};

export default RecordButton;
