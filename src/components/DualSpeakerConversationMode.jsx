import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { speakText, fallbackTextToSpeech, isSpeechSynthesisLanguageSupported } from '../utils/speechUtils';
import translationService from '../services/translationService';
import groqService, { isAIEnhancementEnabled, toggleAIEnhancement } from '../services/groqService';
import languages from '../data/languages';
import { translateWithHindi } from '../services/hindiTranslationService';
import authService from '../services/authService';

// Helper function to get speech recognition language code
const getSpeechRecognitionLanguage = (langCode) => {
  const mapping = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-BR',
    'nl': 'nl-NL',
    'ru': 'ru-RU',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh': 'zh-CN',
    'ar': 'ar-SA',
    'hi': 'hi-IN',
    'tr': 'tr-TR'
  };
  return mapping[langCode] || 'en-US';
};

const DualSpeakerConversationMode = () => {
  // State variables
  const [conversation, setConversation] = useState([]);
  const [speakerALanguage, setSpeakerALanguage] = useState('en');
  const [speakerBLanguage, setSpeakerBLanguage] = useState('hi');
  const [speakerAInput, setSpeakerAInput] = useState('');
  const [speakerBInput, setSpeakerBInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [aiEnhanced, setAiEnhanced] = useState(isAIEnhancementEnabled());
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSpeaker, setRecordingSpeaker] = useState(null);
  const [visibleTranslations, setVisibleTranslations] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const conversationEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Auto-scroll to the bottom of conversation
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  // Save conversation to localStorage
  useEffect(() => {
    if (conversation.length > 0) {
      localStorage.setItem('voxify_conversation', JSON.stringify(conversation));
    }
  }, [conversation]);

  // Load conversation from localStorage on initial load
  useEffect(() => {
    const savedConversation = localStorage.getItem('voxify_conversation');
    if (savedConversation) {
      try {
        setConversation(JSON.parse(savedConversation));
      } catch (err) {
        console.error('Error loading saved conversation:', err);
      }
    }
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle sending a text message
  const handleSendMessage = async (speaker) => {
    try {
      setError(null);

      // Check if user is logged in
      if (!currentUser) {
        setError('Please log in to use conversation mode');
        return;
      }

      setIsTranslating(true);

      // Get the appropriate input and language based on the speaker
      const input = speaker === 'A' ? speakerAInput : speakerBInput;
      const sourceLanguage = speaker === 'A' ? speakerALanguage : speakerBLanguage;
      const targetLanguage = speaker === 'A' ? speakerBLanguage : speakerALanguage;

      if (!input.trim()) {
        setError('Please enter a message');
        setIsTranslating(false);
        return;
      }

      // Create a new message object
      const newMessage = {
        id: Date.now(),
        text: input,
        speaker,
        language: sourceLanguage,
        timestamp: new Date().toISOString()
      };

      // Add to conversation immediately to show the message
      setConversation(prev => [...prev, newMessage]);

      // Clear the input
      if (speaker === 'A') {
        setSpeakerAInput('');
      } else {
        setSpeakerBInput('');
      }

      // If auto-translate is enabled, translate the message
      if (autoTranslate) {
        // Prepare conversation history for context
        const conversationHistory = conversation.map(entry => ({
          text: entry.text,
          language: entry.language,
          speaker: entry.speaker
        }));

        // Add the current message to the history
        conversationHistory.push({
          text: input,
          language: sourceLanguage,
          speaker
        });

        let translatedText;
        let actualSourceLanguage = sourceLanguage;

        // Try to use AI-enhanced context-aware translation first if enabled
        let isAiEnhanced = false;

        if (aiEnhanced) {
          try {
            console.log('Using AI-enhanced context-aware translation');
            // Use Groq API for translation with conversation context
            const translationResult = await groqService.translateConversation(
              conversationHistory,
              sourceLanguage,
              targetLanguage
            );

            // Extract the translated text
            if (translationResult && translationResult.translatedText) {
              translatedText = translationResult.translatedText;
              isAiEnhanced = translationResult.aiEnhanced || false;
              console.log(`AI-enhanced translation: "${translatedText}"`);

              // If the translation was successful, skip the other methods
              if (translatedText && !translatedText.startsWith('[Translation from')) {
                console.log('AI-enhanced translation successful');
              } else {
                console.log('AI-enhanced translation returned a placeholder, trying other methods');
              }
            }
          } catch (aiError) {
            console.error('AI-enhanced translation failed:', aiError);
            // Show a message to the user that AI enhancement is not available
            setError('AI enhancement is not available. Please make sure the backend server is running.');
            // Continue with other translation methods
          }
        }

        // If AI-enhanced translation failed or is disabled, try other methods
        if (!translatedText || translatedText.startsWith('[Translation from')) {
          // Special handling for translations involving Hindi (either source or target)
          if (sourceLanguage === 'hi' || targetLanguage === 'hi') {
            console.log('Using enhanced Hindi translation service');
            // Use our specialized Hindi translation function
            translatedText = translateWithHindi(input, sourceLanguage, targetLanguage);
            console.log(`Hindi translation result: "${translatedText}"`);

            // If our direct translation didn't work well, try using Groq API
            if (translatedText.startsWith('[Translation from')) {
              console.log('Direct translation failed, trying Groq API');
              try {
                // Use Groq API for translation with conversation context
                const translationResult = await groqService.translateConversation(
                  conversationHistory,
                  sourceLanguage,
                  targetLanguage
                );

                // Extract the translated text
                if (translationResult && translationResult.translatedText) {
                  translatedText = translationResult.translatedText;
                  isAiEnhanced = translationResult.aiEnhanced || false;
                  console.log(`Groq API translation: "${translatedText}"`);
                }
              } catch (groqError) {
                console.error('Groq API translation failed:', groqError);
                // If Groq fails, try the translation service
                console.log('Groq API failed, trying translation service');
                translatedText = await translationService.translateText(
                  input,
                  sourceLanguage,
                  targetLanguage
                );
                console.log(`Translation service result: "${translatedText}"`);
              }
            }
          } else {
            // Use translationService for all other translations
            translatedText = await translationService.translateText(
              input,
              sourceLanguage,
              targetLanguage
            );

            console.log(`Translation result: "${translatedText}"`);

            // If the translation failed or returned a placeholder, try using Groq API
            if (!translatedText || translatedText.startsWith('[Translation from')) {
              console.log('Using Groq API as fallback for translation');

              try {
                // Use Groq API for translation with conversation context
                const translationResult = await groqService.translateConversation(
                  conversationHistory,
                  sourceLanguage,
                  targetLanguage
                );

                // Extract the translated text
                if (translationResult && translationResult.translatedText) {
                  translatedText = translationResult.translatedText;
                  isAiEnhanced = translationResult.aiEnhanced || false;
                  console.log(`Groq API translation: "${translatedText}"`);
                }
              } catch (groqError) {
                console.error('Groq API translation failed:', groqError);
                // Keep the translatedText from translationService if Groq fails
              }
            }
          }
        }

        // Update the message with the translation
        setConversation(prev =>
          prev.map(msg =>
            msg.id === newMessage.id
              ? {
                  ...msg,
                  translatedText,
                  targetLanguage,
                  sourceLanguage: actualSourceLanguage,
                  aiEnhanced: isAiEnhanced
                }
              : msg
          )
        );

        // Play the translated audio if available
        if (translatedText) {
          await playTranslatedAudio(translatedText, targetLanguage);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(`Failed to send message: ${err.message || 'Please try again.'}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle voice input
  const handleVoiceInput = async (speaker) => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      setError(null);

      // Check if user is logged in
      if (!currentUser) {
        setError('Please log in to use conversation mode');
        return;
      }

      setRecordingSpeaker(speaker);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Determine which language to use for speech recognition
      let recognitionLanguage = speaker === 'A' ? speakerALanguage : speakerBLanguage;

      // Special handling for Hindi - use English for speech recognition
      if (recognitionLanguage === 'hi') {
        console.log('Using English for Hindi speech recognition');
        recognitionLanguage = 'en'; // Use English for speech recognition instead of Hindi
      }

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition is not supported in this browser.');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getSpeechRecognitionLanguage(recognitionLanguage);

      let finalTranscript = '';

      recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the appropriate input field with the interim transcript
        if (speaker === 'A') {
          setSpeakerAInput(finalTranscript || interimTranscript);
        } else {
          setSpeakerBInput(finalTranscript || interimTranscript);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);

        // If we have a final transcript, send the message
        if (finalTranscript) {
          // Special handling for Hindi - if the original language was Hindi but we used English for recognition
          const originalLanguage = speaker === 'A' ? speakerALanguage : speakerBLanguage;

          if (originalLanguage === 'hi' && recognitionLanguage === 'en') {
            // We need to translate from English to Hindi first
            (async () => {
              try {
                setIsTranslating(true);
                console.log('Translating speech from English to Hindi');

                // Use our enhanced Hindi translation service
                const hindiText = translateWithHindi(finalTranscript, 'en', 'hi');
                console.log(`English to Hindi translation result: "${hindiText}"`);

                // If our direct translation didn't work well, try the translation service
                if (hindiText.startsWith('[Translation from')) {
                  console.log('Direct translation failed, trying translation service');
                  const serviceHindiText = await translationService.translateText(
                    finalTranscript,
                    'en',
                    'hi'
                  );

                  if (speaker === 'A') {
                    setSpeakerAInput(serviceHindiText);
                    setTimeout(() => handleSendMessage('A'), 500);
                  } else {
                    setSpeakerBInput(serviceHindiText);
                    setTimeout(() => handleSendMessage('B'), 500);
                  }
                } else {
                  // Use our direct translation
                  if (speaker === 'A') {
                    setSpeakerAInput(hindiText);
                    setTimeout(() => handleSendMessage('A'), 500);
                  } else {
                    setSpeakerBInput(hindiText);
                    setTimeout(() => handleSendMessage('B'), 500);
                  }
                }
              } catch (err) {
                console.error('Error translating to Hindi:', err);
                setError(`Failed to translate to Hindi: ${err.message || 'Please try again.'}`);
                setIsTranslating(false);
              }
            })();
          } else {
            // Normal flow for other languages
            if (speaker === 'A') {
              setSpeakerAInput(finalTranscript);
              setTimeout(() => handleSendMessage('A'), 500);
            } else {
              setSpeakerBInput(finalTranscript);
              setTimeout(() => handleSendMessage('B'), 500);
            }
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      // Start recording
      recognition.start();
      setIsRecording(true);

    } catch (err) {
      console.error('Error starting voice input:', err);
      setError(`Could not start voice input: ${err.message || 'Please check your permissions.'}`);
      setIsRecording(false);
      setRecordingSpeaker(null);
    }
  };

  // Stop recording
  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }

      setIsRecording(false);
      setRecordingSpeaker(null);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError(`Error stopping recording: ${err.message || 'Unknown error'}`);
    }
  };

  // Play translated audio
  const playTranslatedAudio = async (text, language) => {
    try {
      console.log(`Playing audio for text: "${text}" in language: ${language}`);

      // First try to use our enhanced browser speech synthesis directly
      // This is more reliable than going through the server
      console.log('Attempting to use browser speech synthesis');
      const speechResult = speakText(text, language, () => {
        console.log('Speech synthesis completed');
      });

      // If speech synthesis is successful, return
      if (speechResult) {
        console.log('Successfully started speech synthesis');
        return;
      }

      console.log('Browser speech synthesis not available, trying server');

      // If browser speech synthesis fails, try to get audio from the server
      const audioBlob = await translationService.textToSpeech(text, language);

      // If we have a real audio blob from the server, use it
      if (audioBlob) {
        console.log('Got audio blob from server, playing...');
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);

        // Set up event handlers
        audio.onplay = () => console.log('Audio started playing');
        audio.onended = () => {
          console.log('Audio finished playing');
          URL.revokeObjectURL(url);
        };
        audio.onerror = (e) => console.error('Audio playback error:', e);

        // Play the audio
        const playPromise = audio.play();

        // Handle play promise (required for modern browsers)
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log('Audio playback started successfully'))
            .catch(error => {
              console.error('Audio playback failed:', error);
              // If audio playback fails, use fallback
              fallbackTextToSpeech(text, language);
            });
        }
        return;
      }

      // If all else fails, use fallback
      console.log('No audio available, using fallback');
      fallbackTextToSpeech(text, language);
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError(`Failed to play audio: ${err.message || 'Please try again.'}`);

      // Try fallback as last resort
      try {
        fallbackTextToSpeech(text, language);
      } catch (fallbackErr) {
        console.error('Fallback text-to-speech error:', fallbackErr);
      }
    }
  };

  // Clear conversation history
  const clearConversation = () => {
    setConversation([]);
    setVisibleTranslations({});
    localStorage.removeItem('voxify_conversation');
  };

  // Toggle translation visibility
  const toggleTranslation = (messageId) => {
    setVisibleTranslations(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  // Toggle AI enhancement
  const handleToggleAI = () => {
    const newValue = !aiEnhanced;
    setAiEnhanced(newValue);
    toggleAIEnhancement(newValue);
  };

  return (
    <section id="conversation-mode" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Voxify</span> Conversation Mode
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real-time two-way translation for natural conversations
          </motion.p>
        </div>

        {/* Language selection and auto-translate toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Speaker A Language
              </label>
              <select
                value={speakerALanguage}
                onChange={(e) => setSpeakerALanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isTranslating || isRecording}
              >
                {languages.map((lang) => (
                  <option key={`speaker-a-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Speaker B Language
              </label>
              <select
                value={speakerBLanguage}
                onChange={(e) => setSpeakerBLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isTranslating || isRecording}
              >
                {languages.map((lang) => (
                  <option key={`speaker-b-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto-Translate</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autoTranslate}
                  onChange={() => setAutoTranslate(!autoTranslate)}
                  disabled={isTranslating}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">AI Enhancement</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={aiEnhanced}
                  onChange={handleToggleAI}
                  disabled={isTranslating}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button
              onClick={clearConversation}
              className="px-3 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={conversation.length === 0 || isTranslating || isRecording}
            >
              Clear Conversation
            </button>
          </div>
        </div>

        {/* Conversation area with two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Speaker A Column */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                <span className="text-blue-600 dark:text-blue-300 font-medium">A</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Speaker A
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({languages.find(l => l.code === speakerALanguage)?.name})
                </span>
              </h3>
            </div>

            <div className="flex-grow p-4 overflow-y-auto max-h-80">
              {conversation.filter(msg => msg.speaker === 'A').length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation
                    .filter(msg => msg.speaker === 'A')
                    .map((msg) => (
                      <div key={msg.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{msg.text}</p>
                        {msg.translatedText && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleTranslation(msg.id)}
                              className="flex items-center justify-between w-full px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <div className="flex items-center">
                                <span className="font-medium">Translation</span>
                                {aiEnhanced && msg.aiEnhanced && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100 rounded-full">
                                    AI
                                  </span>
                                )}
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${visibleTranslations[msg.id] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {visibleTranslations[msg.id] && (
                              <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 border border-blue-100 dark:border-blue-800">
                                {msg.translatedText}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="text-xs text-right mt-1 text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* Speaker B Column */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                <span className="text-purple-600 dark:text-purple-300 font-medium">B</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Speaker B
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({languages.find(l => l.code === speakerBLanguage)?.name})
                </span>
              </h3>
            </div>

            <div className="flex-grow p-4 overflow-y-auto max-h-80">
              {conversation.filter(msg => msg.speaker === 'B').length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation
                    .filter(msg => msg.speaker === 'B')
                    .map((msg) => (
                      <div key={msg.id} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{msg.text}</p>
                        {msg.translatedText && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleTranslation(msg.id)}
                              className="flex items-center justify-between w-full px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-md hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <div className="flex items-center">
                                <span className="font-medium">Translation</span>
                                {aiEnhanced && msg.aiEnhanced && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-100 rounded-full">
                                    AI
                                  </span>
                                )}
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${visibleTranslations[msg.id] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {visibleTranslations[msg.id] && (
                              <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 border border-purple-100 dark:border-purple-800">
                                {msg.translatedText}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="text-xs text-right mt-1 text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6">
            <div className="flex items-center mb-2">
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

        {/* Input area with separate inputs for each speaker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Speaker A Input */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 ${isRecording && recordingSpeaker === 'A' ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                  <span className="text-blue-600 dark:text-blue-300 font-medium text-xs">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Speaker A Input
                </span>
              </div>

              {isRecording && recordingSpeaker === 'A' && (
                <div className="flex items-center text-xs text-red-600 dark:text-red-400 animate-pulse">
                  <span className="mr-1">Recording</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex">
              <textarea
                value={speakerAInput}
                onChange={(e) => setSpeakerAInput(e.target.value)}
                placeholder={`Type in ${languages.find(l => l.code === speakerALanguage)?.name}...`}
                className={`flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isRecording && recordingSpeaker === 'A' ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''}`}
                rows="2"
                disabled={isTranslating || (isRecording && recordingSpeaker !== 'A')}
              />
              <div className="flex flex-col">
                <button
                  onClick={() => handleSendMessage('A')}
                  className="h-1/2 px-4 bg-blue-600 text-white rounded-tr-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                  disabled={!speakerAInput.trim() || isTranslating || isRecording}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleVoiceInput('A')}
                  className={`h-1/2 px-4 ${isRecording && recordingSpeaker === 'A' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'} rounded-br-lg hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-50 disabled:text-blue-400 disabled:cursor-not-allowed transition-colors`}
                  disabled={isTranslating || (isRecording && recordingSpeaker !== 'A')}
                >
                  {isRecording && recordingSpeaker === 'A' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Speaker B Input */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 ${isRecording && recordingSpeaker === 'B' ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                  <span className="text-purple-600 dark:text-purple-300 font-medium text-xs">B</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Speaker B Input
                </span>
              </div>

              {isRecording && recordingSpeaker === 'B' && (
                <div className="flex items-center text-xs text-red-600 dark:text-red-400 animate-pulse">
                  <span className="mr-1">Recording</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex">
              <textarea
                value={speakerBInput}
                onChange={(e) => setSpeakerBInput(e.target.value)}
                placeholder={`Type in ${languages.find(l => l.code === speakerBLanguage)?.name}...`}
                className={`flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${isRecording && recordingSpeaker === 'B' ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''}`}
                rows="2"
                disabled={isTranslating || (isRecording && recordingSpeaker !== 'B')}
              />
              <div className="flex flex-col">
                <button
                  onClick={() => handleSendMessage('B')}
                  className="h-1/2 px-4 bg-purple-600 text-white rounded-tr-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
                  disabled={!speakerBInput.trim() || isTranslating || isRecording}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleVoiceInput('B')}
                  className={`h-1/2 px-4 ${isRecording && recordingSpeaker === 'B' ? 'bg-red-500 text-white' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'} rounded-br-lg hover:bg-purple-200 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-50 disabled:text-purple-400 disabled:cursor-not-allowed transition-colors`}
                  disabled={isTranslating || (isRecording && recordingSpeaker !== 'B')}
                >
                  {isRecording && recordingSpeaker === 'B' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualSpeakerConversationMode;
