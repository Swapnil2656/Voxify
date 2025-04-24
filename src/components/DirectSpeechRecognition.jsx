import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DirectSpeechRecognition = ({ onTranscriptReady, language = 'en-US', isActive = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError(null);
    };
    
    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;
      
      console.log(`Recognized: "${transcriptText}"`);
      setTranscript(transcriptText);
      
      // If this is a final result, send it to the parent component
      if (result.isFinal) {
        onTranscriptReady(transcriptText);
      }
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      // If we have a transcript, send it to the parent component
      if (transcript && !error) {
        onTranscriptReady(transcript);
      }
    };
    
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors when stopping
        }
      }
    };
  }, [language]);
  
  // Start/stop recognition when isActive changes
  useEffect(() => {
    if (isActive && recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError(`Could not start speech recognition: ${err.message}`);
      }
    } else if (!isActive && recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    }
  }, [isActive, isListening]);
  
  return (
    <div className="direct-speech-recognition">
      {isListening && (
        <motion.div 
          className="listening-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="audio-bars mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="audio-bar bg-blue-500 dark:bg-blue-400"></div>
              ))}
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Listening...
            </span>
          </div>
          
          {transcript && (
            <div className="transcript-preview p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                "{transcript}"
              </p>
            </div>
          )}
        </motion.div>
      )}
      
      {error && (
        <div className="error-message p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm mb-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default DirectSpeechRecognition;
