import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import './styles/darkModeToggle.css'
import './styles/historyStyles.css'
import { speakText, fallbackTextToSpeech, isSpeechSynthesisLanguageSupported } from './utils/speechUtils'
import useAudioRecorder from './hooks/useAudioRecorder'
import translationService from './services/translationService'
import translationHistoryService from './services/translationHistoryService'
import userPreferencesService from './services/userPreferencesService'
import AudioWaveform from './components/AudioWaveform'
import Layout from './components/Layout'
import TranslationResult from './components/TranslationResult'
import TranslationHistory from './components/TranslationHistory'
import RecordButton from './components/RecordButton'
import LanguageSelector from './components/LanguageSelector'
import TranslationActions from './components/TranslationActions'
import LoadingScreen from './components/LoadingScreen'
import HeroSection from './components/HeroSection'
import TravelerFeatures from './components/TravelerFeatures'
import TravelPhrases from './components/TravelPhrases'
import OfflineMode from './components/OfflineMode'
// import ConversationMode from './components/ConversationMode' // Using DualSpeakerConversationMode instead
import DualSpeakerConversationMode from './components/DualSpeakerConversationMode'
import DirectTranslation from './components/DirectTranslation'
import DirectTextTranslation from './components/DirectTextTranslation'
import SimpleCameraInput from './components/SimpleCameraInput'
import CameraOcr from './components/CameraOcr'
// AI Learning Hub is now a separate page
// import AILearningHub from './components/AILearningHub'
// import AILearningHub from './components/AILearningHub'
import groqService from './services/groqService'

function App({ darkMode, toggleDarkMode }) {
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [userPreferences, setUserPreferences] = useState(null)
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('text') // 'text', 'voice', or 'image'
  const [appLoading, setAppLoading] = useState(true)
  const [capturedImage, setCapturedImage] = useState(null)

  // Use our custom audio recorder hook
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    audioURL,
    clearRecording,
    error: recordingError
  } = useAudioRecorder()

  // Languages supported by the app (94+ languages)
  const languages = [
    // Common languages
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },

    // European languages
    { code: 'nl', name: 'Dutch' },
    { code: 'el', name: 'Greek' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'pl', name: 'Polish' },
    { code: 'ro', name: 'Romanian' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'cs', name: 'Czech' },
    { code: 'sk', name: 'Slovak' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'no', name: 'Norwegian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'et', name: 'Estonian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'tr', name: 'Turkish' },

    // Asian languages
    { code: 'th', name: 'Thai' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'tl', name: 'Filipino/Tagalog' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'kn', name: 'Kannada' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ne', name: 'Nepali' },
    { code: 'si', name: 'Sinhala' },
    { code: 'km', name: 'Khmer' },
    { code: 'lo', name: 'Lao' },
    { code: 'my', name: 'Burmese' },
    { code: 'mn', name: 'Mongolian' },

    // Middle Eastern languages
    { code: 'he', name: 'Hebrew' },
    { code: 'fa', name: 'Persian/Farsi' },
    { code: 'ps', name: 'Pashto' },
    { code: 'ku', name: 'Kurdish' },
    { code: 'hy', name: 'Armenian' },
    { code: 'ka', name: 'Georgian' },

    // African languages
    { code: 'am', name: 'Amharic' },
    { code: 'ha', name: 'Hausa' },
    { code: 'ig', name: 'Igbo' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zulu' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'sw', name: 'Swahili' },
    { code: 'so', name: 'Somali' },
    { code: 'mg', name: 'Malagasy' },

    // Other languages
    { code: 'is', name: 'Icelandic' },
    { code: 'mt', name: 'Maltese' },
    { code: 'cy', name: 'Welsh' },
    { code: 'ga', name: 'Irish' },
    { code: 'gd', name: 'Scottish Gaelic' },
    { code: 'gl', name: 'Galician' },
    { code: 'ca', name: 'Catalan' },
    { code: 'eu', name: 'Basque' },
    { code: 'la', name: 'Latin' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'jv', name: 'Javanese' },
    { code: 'su', name: 'Sundanese' },
    { code: 'haw', name: 'Hawaiian' },
    { code: 'mi', name: 'Maori' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'yi', name: 'Yiddish' },
    { code: 'ht', name: 'Haitian Creole' },
    { code: 'lb', name: 'Luxembourgish' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'be', name: 'Belarusian' },
    { code: 'fy', name: 'Frisian' },
    { code: 'kk', name: 'Kazakh' },
    { code: 'ky', name: 'Kyrgyz' },
    { code: 'tg', name: 'Tajik' },
    { code: 'tk', name: 'Turkmen' },
    { code: 'uz', name: 'Uzbek' },
  ]

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Initialize speech synthesis voices
  useEffect(() => {
    if (window.speechSynthesis) {
      // Load voices
      const loadVoices = () => {
        window.speechSynthesis.getVoices()
      }

      // Chrome needs this event listener to load voices
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }

      // Initial load of voices
      loadVoices()
    }
  }, [])

  // Set a flag that the main page has been loaded
  useEffect(() => {
    localStorage.setItem('mainPageLoaded', 'true')
    localStorage.setItem('learnMorePageOpened', 'false')
  }, [])

  // Load translation history from database
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const translations = await translationHistoryService.getHistory(100);
        setHistory(translations);
      } catch (error) {
        console.error('Error loading translation history:', error);
      }
    };

    loadHistory();
  }, [])

  // Load user preferences from database
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await userPreferencesService.getPreferences();
        setUserPreferences(prefs);

        // Apply preferences
        if (prefs.sourceLanguage) setSourceLanguage(prefs.sourceLanguage);
        if (prefs.targetLanguage) setTargetLanguage(prefs.targetLanguage);
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    };

    loadPreferences();
  }, [])

  // Simulate app loading
  useEffect(() => {
    // Simulate loading time for demonstration purposes
    const timer = setTimeout(() => {
      setAppLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle text translation
  const handleTranslate = async () => {
    if (!inputText.trim()) return

    // Skip translation as it's handled by DirectTextTranslation component
    console.log('Translation is handled by the DirectTextTranslation component')
    return
  }

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Process recorded audio
  const processRecordedAudio = async () => {
    if (!audioBlob) return

    setIsLoading(true)
    setError(null)

    // Show a message to the user
    const listeningMessage = targetLanguage === 'hi' ? 'Listening to your English speech...' : 'Listening to your recording...'
    setInputText(listeningMessage)

    try {
      // Special handling for Hindi translations
      if (targetLanguage === 'hi') {
        console.log('Processing audio for Hindi translation')

        // For Hindi, we'll use English speech recognition and then translate to Hindi
        // This ensures we get more accurate translations
        const transcribedText = await translationService.speechToText(audioBlob, 'en')
        setInputText(transcribedText)

        // Show a message that we're translating to Hindi
        setTranslatedText('Translating to Hindi...')

        // Translate the English text to Hindi
        const translatedResult = await translationService.translateText(
          transcribedText,
          'en',
          'hi'
        )

        setTranslatedText(translatedResult)

        // Add to history
        const newEntry = {
          id: Date.now(),
          sourceLanguage: 'en',
          targetLanguage: 'hi',
          inputText: transcribedText,
          translatedText: translatedResult,
          timestamp: new Date().toISOString(),
          type: 'audio'
        }
        setHistory([newEntry, ...history])
      } else {
        // Normal flow for other languages
        const transcribedText = await translationService.speechToText(audioBlob, sourceLanguage)
        setInputText(transcribedText)

        // Show a message that we're translating
        setTranslatedText('Translating...')

        // Translate the transcribed text using advanced AI with Groq API for travelers
        const translatedResult = await translationService.translateText(
          transcribedText,
          sourceLanguage,
          targetLanguage
        )

        setTranslatedText(translatedResult)

        // Add to history
        const newEntry = {
          id: Date.now(),
          sourceLanguage,
          targetLanguage,
          inputText: transcribedText,
          translatedText: translatedResult,
          timestamp: new Date().toISOString(),
          type: 'audio'
        }
        setHistory([newEntry, ...history])
      }
    } catch (err) {
      console.error('Audio processing error:', err)
      setError(`Failed to process audio: ${err.message || 'Please try again.'}`)
      // Clear the temporary messages
      if (inputText.includes('Listening')) {
        setInputText('')
      }
      if (translatedText.includes('Translating')) {
        setTranslatedText('')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Play translated audio
  const playTranslatedAudio = async () => {
    if (!translatedText) return

    setIsLoading(true)
    setError(null)

    try {
      // Remove any [OFFLINE] prefix if present
      const cleanText = translatedText.startsWith('[OFFLINE]')
        ? translatedText.replace('[OFFLINE] ', '')
        : translatedText;

      console.log(`Playing audio for text: "${cleanText}" in language: ${targetLanguage}`);

      // Try direct browser speech synthesis first - most reliable in deployed environments
      const speechResult = speakText(cleanText, targetLanguage, () => {
        console.log('Speech synthesis completed');
        setIsLoading(false);
      });

      // If direct speech synthesis worked, we're done
      if (speechResult) {
        console.log('Successfully started speech synthesis');
        return;
      }

      console.log('Direct speech synthesis failed, trying fallback methods');

      // If direct speech synthesis fails, try to get audio from the server
      try {
        const audioBlob = await translationService.textToSpeech(cleanText, targetLanguage);

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
            setIsLoading(false);
          };
          audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            URL.revokeObjectURL(url);
            setIsLoading(false);

            // Try fallback if server audio fails
            fallbackTextToSpeech(cleanText, targetLanguage);
          };

          // Play the audio
          const playPromise = audio.play();

          // Handle play promise (required for modern browsers)
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Audio play promise error:', error);
              URL.revokeObjectURL(url);
              setIsLoading(false);

              // Try fallback if play promise fails
              fallbackTextToSpeech(cleanText, targetLanguage);
            });
          }

          return;
        }
      } catch (serverError) {
        console.error('Server audio error:', serverError);
      }

      // If all else fails, use our fallback
      console.log('All audio methods failed, using ultimate fallback');
      fallbackTextToSpeech(cleanText, targetLanguage);
      setIsLoading(false);
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError('Failed to play audio. Please try again.');
      setIsLoading(false);

      // Even if we get an error, try the fallback as a last resort
      try {
        fallbackTextToSpeech(translatedText, targetLanguage);
      } catch (fallbackErr) {
        console.error('Even fallback failed:', fallbackErr);
      }
    }
  }

  // Clear history
  const clearHistory = async () => {
    try {
      await translationHistoryService.clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing translation history:', error);
    }
  }

  // Save user preferences
  const savePreferences = async (prefs) => {
    try {
      await userPreferencesService.savePreferences({
        ...userPreferences,
        ...prefs
      });
      setUserPreferences(prev => ({ ...prev, ...prefs }));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  // Handle source language change
  const handleSourceLanguageChange = (lang) => {
    setSourceLanguage(lang);
    savePreferences({ sourceLanguage: lang });
  };

  // Handle target language change
  const handleTargetLanguageChange = (lang) => {
    setTargetLanguage(lang);
    savePreferences({ targetLanguage: lang });
  };

  // Reuse a history entry
  const reuseHistoryEntry = (entry) => {
    setSourceLanguage(entry.sourceLanguage)
    setTargetLanguage(entry.targetLanguage)
    setInputText(entry.inputText)
    setTranslatedText(entry.translatedText)

    // Switch to the appropriate tab based on entry type
    if (entry.type === 'audio') {
      setActiveTab('voice')
    } else {
      setActiveTab('text')
    }

    // Save preferences
    savePreferences({
      sourceLanguage: entry.sourceLanguage,
      targetLanguage: entry.targetLanguage
    });
  }

  return (
    <div>
      <AnimatePresence>
        {appLoading && <LoadingScreen />}
      </AnimatePresence>

      <Layout darkMode={darkMode} onToggleDarkMode={toggleDarkMode}>
      {/* Hero Section */}
      <HeroSection />

      {/* Tab navigation */}
      <motion.div
        className="flex mb-8 card glass p-1 w-full md:w-96 mx-auto shadow-soft overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'text'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-black/10'}`}
          whileTap={{ scale: 0.97 }}
          aria-label="Switch to text translation"
        >
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v11.75A2.75 2.75 0 0016.75 18h-12A2.75 2.75 0 012 15.25V3.5zm3.75 7a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM5 5.75A.75.75 0 015.75 5h4.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-4.5A.75.75 0 015 8.25v-2.5z" clipRule="evenodd" />
            </svg>
            Text
          </span>
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'voice'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-black/10'}`}
          whileTap={{ scale: 0.97 }}
          aria-label="Switch to voice translation"
        >
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
              <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
              <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
            </svg>
            Voice
          </span>
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'camera'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-black/10'}`}
          whileTap={{ scale: 0.97 }}
          aria-label="Switch to camera translation"
        >
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
              <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Image
          </span>
        </motion.button>
      </motion.div>

      {/* Main content */}
      <motion.div
        id="translation-section"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="lg:hidden flex justify-center mb-8">
          <motion.img
            src="/translation-illustration.svg"
            alt="Translation Illustration"
            className="h-40 w-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        {/* Source panel */}
        <div className="card shadow-soft overflow-hidden hover-lift">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-blue-500">
                <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11c0 .32.19.611.485.729.646.184 1.331.282 2.046.282a7.462 7.462 0 004.25-1.329V4.065z" />
              </svg>
              Source Text
            </h3>
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              onLanguageChange={handleSourceLanguageChange}
              languages={languages}
              className="w-40"
            />
          </div>

          <div className="card-body">
            <div className="h-full flex flex-col">
              {activeTab === 'text' ? (
                <div className="form-control">
                  <label htmlFor="source-text" className="sr-only">Source text</label>
                  <textarea
                    id="source-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to translate..."
                    rows={6}
                    className="form-textarea mb-4 flex-grow text-lg focus-ring"
                    aria-label="Source text to translate"
                  />

                  {/* Direct Text Translation Component for all languages */}
                  <DirectTextTranslation
                    text={inputText}
                    sourceLanguage={sourceLanguage}
                    targetLanguage={targetLanguage}
                    onTranslate={(result) => {
                      // Update the translated text
                      setTranslatedText(result.translatedText);

                      // Add to history and save to database
                      const newEntry = {
                        sourceLanguage: result.sourceLanguage,
                        targetLanguage: result.targetLanguage,
                        inputText: result.sourceText,
                        translatedText: result.translatedText,
                        type: 'text'
                      };

                      // Save to database
                      translationHistoryService.saveTranslation(newEntry)
                        .then(savedEntry => {
                          setHistory([savedEntry, ...history]);
                        })
                        .catch(error => {
                          console.error('Error saving translation:', error);
                          // Still update local state even if database save fails
                          const fallbackEntry = {
                            ...newEntry,
                            id: Date.now(),
                            timestamp: new Date().toISOString()
                          };
                          setHistory([fallbackEntry, ...history]);
                        });
                    }}
                  />
                </div>
              ) : activeTab === 'voice' ? (
                <div className="flex flex-col items-center justify-center space-y-8 py-6 flex-grow">
                  {/* Direct Voice Translation Component for all languages */}
                  <DirectTranslation
                    sourceLanguage={sourceLanguage}
                    targetLanguage={targetLanguage}
                    onTranslationComplete={(result) => {
                      // Update the input and translated text
                      setInputText(result.sourceText);
                      setTranslatedText(result.translatedText);

                      // Add to history and save to database
                      const newEntry = {
                        sourceLanguage: result.sourceLanguage,
                        targetLanguage: result.targetLanguage,
                        inputText: result.sourceText,
                        translatedText: result.translatedText,
                        type: 'voice'
                      };

                      // Save to database
                      translationHistoryService.saveTranslation(newEntry)
                        .then(savedEntry => {
                          setHistory([savedEntry, ...history]);
                        })
                        .catch(error => {
                          console.error('Error saving voice translation:', error);
                          // Still update local state even if database save fails
                          const fallbackEntry = {
                            ...newEntry,
                            id: Date.now(),
                            timestamp: new Date().toISOString()
                          };
                          setHistory([fallbackEntry, ...history]);
                        });
                    }}
                  />

                  {/* Legacy Voice Recording UI - Hidden */}
                  <div className="hidden">
                    <AudioWaveform
                      audioURL={audioURL}
                      isRecording={isRecording}
                      darkMode={darkMode}
                      onDelete={clearRecording}
                    />

                    <div className="flex flex-col items-center">
                      <RecordButton
                        isRecording={isRecording}
                        onClick={toggleRecording}
                        disabled={isLoading}
                      />
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
                      </p>
                    </div>

                    {audioBlob && !isRecording && (
                      <motion.button
                        onClick={processRecordedAudio}
                        disabled={isLoading}
                        className="btn btn-primary btn-lg"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        aria-label="Process recorded audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                        Process Audio
                      </motion.button>
                    )}
                  </div>
                </div>
              ) : activeTab === 'camera' ? (
                /* Camera OCR Component */
                <CameraOcr
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                  onTranslationComplete={(result) => {
                    // Update the input and translated text
                    setInputText(result.sourceText);
                    setTranslatedText(result.translatedText);

                    // Store the captured image for retry functionality
                    setCapturedImage(result.image);

                    // Add to history and save to database
                    const newEntry = {
                      sourceLanguage: result.sourceLanguage,
                      targetLanguage: result.targetLanguage,
                      inputText: result.sourceText,
                      translatedText: result.translatedText,
                      type: 'camera'
                    };

                    // Save to database
                    translationHistoryService.saveTranslation(newEntry)
                      .then(savedEntry => {
                        setHistory([savedEntry, ...history]);
                      })
                      .catch(error => {
                        console.error('Error saving camera translation:', error);
                        // Still update local state even if database save fails
                        const fallbackEntry = {
                          ...newEntry,
                          id: Date.now(),
                          timestamp: new Date().toISOString()
                        };
                        setHistory([fallbackEntry, ...history]);
                      });
                  }}
                />
              ) : (
                /* Default case - should never happen */
                <div className="flex flex-col items-center justify-center p-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Please select a translation method from the tabs above.
                  </p>
                </div>
              )}

              {/* Error message */}
              {(error || recordingError) && (
                <div className="mt-4 alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div className="flex flex-col">
                    <span>{error || recordingError}</span>
                    {(error && typeof error === 'string' && error.includes('timed out')) && (
                      <button
                        onClick={() => {
                          setError(null);
                          // Retry the last operation
                          if (activeTab === 'camera' && capturedImage) {
                            // Find the camera component and trigger the extract text button
                            const extractButton = document.querySelector('#camera-extract-button');
                            if (extractButton) {
                              extractButton.click();
                            }
                          }
                        }}
                        className="mt-2 btn btn-sm btn-outline btn-info"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card-footer">
            <motion.button
              onClick={handleTranslate}
              disabled={
                (activeTab === 'text' && !inputText.trim()) ||
                (activeTab === 'voice' && !audioBlob) || isLoading
              }
              className={`btn btn-primary btn-lg w-full ${
                (activeTab === 'text' && !inputText.trim()) ||
                (activeTab === 'voice' && !audioBlob) || isLoading ? 'btn-disabled' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Translate text"
              id="translate-button"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                  Translate
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Translation panel */}
        <div className="card shadow-soft overflow-hidden hover-lift">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-blue-500">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
              Translation
            </h3>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onLanguageChange={handleTargetLanguageChange}
              languages={languages}
              className="w-40"
            />
          </div>

          <div className="card-body flex-grow">
            <TranslationResult
              text={translatedText}
              isLoading={isLoading}
              error={error}
              placeholder="Translation will appear here..."
              className="h-full"
              onPlayAudio={playTranslatedAudio}
            />
          </div>
        </div>
      </motion.div>

      {/* History section */}
      <motion.div
        id="history-section"
        className="mt-12 mb-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-blue-500">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            Translation History
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {history.length} {history.length === 1 ? 'translation' : 'translations'}
          </div>
        </div>

        <TranslationHistory
          history={history}
          languages={languages}
          onReuse={reuseHistoryEntry}
          onClear={clearHistory}
        />
      </motion.div>

      {/* Traveler Features Section */}
      <TravelerFeatures />


      {/* Offline Mode Section */}
      <OfflineMode />

      {/* Travel Phrases Section */}
      <TravelPhrases />

      {/* Conversation Mode Section - Using Dual Speaker API */}
      <DualSpeakerConversationMode />

      {/* Camera Translation is now integrated into the main translation area */}
    </Layout>
    </div>
  )
}

export default App
