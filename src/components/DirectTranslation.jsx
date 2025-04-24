import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import languages from '../data/languages';

// Get language name from code
const getLanguageName = (code) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};

const DirectTranslation = ({ sourceLanguage, targetLanguage, onTranslationComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
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

    // For Hindi, always use English as the source language
    // For other languages, use the selected source language
    const recognitionLanguage = targetLanguage === 'hi' ? 'en-US' : getSpeechRecognitionLanguage(sourceLanguage);

    // Configure recognition
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = recognitionLanguage;

    console.log(`Speech recognition configured for language: ${recognitionLanguage}`);
    console.log(`Target language: ${targetLanguage}`);
    console.log(`Source language: ${sourceLanguage}`);

    // Set up event handlers
    recognitionRef.current.onstart = () => {
      console.log(`Speech recognition started for ${sourceLanguage}`);
      setIsListening(true);
      setError(null);
    };

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;

      console.log(`Recognized: "${transcriptText}"`);
      setTranscript(transcriptText);

      // If this is a final result, translate it
      if (result.isFinal) {
        translateText(transcriptText);
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
  }, [sourceLanguage, targetLanguage]);

  // Translate the recognized text
  const translateText = async (text) => {
    if (!text || text.trim() === '') return;

    setIsTranslating(true);

    try {
      // Simulate translation delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let translatedText;
      let actualSourceLanguage = sourceLanguage;

      // For Hindi, always translate from English
      if (targetLanguage === 'hi') {
        console.log('Using special handling for Hindi translation');
        translatedText = await mockTranslate(text, 'en', 'hi');
        actualSourceLanguage = 'en';
      } else {
        // For other languages, use the selected source language
        translatedText = await mockTranslate(text, sourceLanguage, targetLanguage);
      }

      setTranslation(translatedText);

      // Notify parent component
      if (onTranslationComplete) {
        onTranslationComplete({
          sourceText: text,
          translatedText,
          sourceLanguage: actualSourceLanguage,
          targetLanguage
        });
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(`Translation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    } else {
      setTranscript('');
      setTranslation('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError(`Could not start speech recognition: ${err.message}`);
      }
    }
  };

  // Get the correct language code for speech recognition
  const getSpeechRecognitionLanguage = (langCode) => {
    const languageMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'nl': 'nl-NL',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'tr': 'tr-TR'
    };

    return languageMap[langCode] || 'en-US';
  };

  // Mock translation function
  const mockTranslate = async (text, fromLang, toLang) => {
    // This is a placeholder for actual translation
    // In a real app, you would call your translation API here

    // For demo purposes, we'll just return a mock translation
    const mockTranslations = {
      'en-es': {
        'hello': 'hola',
        'how are you': 'cómo estás',
        'thank you': 'gracias',
        'goodbye': 'adiós',
        'what is your name': 'cómo te llamas',
        'my name is': 'me llamo',
        'where is': 'dónde está',
        'i need help': 'necesito ayuda',
        'how much is this': 'cuánto cuesta esto',
        'i don\'t understand': 'no entiendo'
      },
      'en-fr': {
        'hello': 'bonjour',
        'how are you': 'comment allez-vous',
        'thank you': 'merci',
        'goodbye': 'au revoir',
        'what is your name': 'comment vous appelez-vous',
        'my name is': 'je m\'appelle',
        'where is': 'où est',
        'i need help': 'j\'ai besoin d\'aide',
        'how much is this': 'combien ça coûte',
        'i don\'t understand': 'je ne comprends pas'
      },
      'en-de': {
        'hello': 'hallo',
        'how are you': 'wie geht es dir',
        'thank you': 'danke',
        'goodbye': 'auf wiedersehen',
        'what is your name': 'wie heißt du',
        'my name is': 'ich heiße',
        'where is': 'wo ist',
        'i need help': 'ich brauche hilfe',
        'how much is this': 'wie viel kostet das',
        'i don\'t understand': 'ich verstehe nicht'
      },
      'en-it': {
        'hello': 'ciao',
        'how are you': 'come stai',
        'thank you': 'grazie',
        'goodbye': 'arrivederci',
        'what is your name': 'come ti chiami',
        'my name is': 'mi chiamo',
        'where is': 'dov\'è',
        'i need help': 'ho bisogno di aiuto',
        'how much is this': 'quanto costa questo',
        'i don\'t understand': 'non capisco'
      },
      'en-pt': {
        'hello': 'olá',
        'how are you': 'como está',
        'thank you': 'obrigado',
        'goodbye': 'adeus',
        'what is your name': 'qual é o seu nome',
        'my name is': 'meu nome é',
        'where is': 'onde está',
        'i need help': 'preciso de ajuda',
        'how much is this': 'quanto custa isto',
        'i don\'t understand': 'não entendo'
      },
      'en-nl': {
        'hello': 'hallo',
        'how are you': 'hoe gaat het',
        'thank you': 'dank je',
        'goodbye': 'tot ziens',
        'what is your name': 'hoe heet je',
        'my name is': 'mijn naam is',
        'where is': 'waar is',
        'i need help': 'ik heb hulp nodig',
        'how much is this': 'hoeveel kost dit',
        'i don\'t understand': 'ik begrijp het niet'
      },
      'en-ru': {
        'hello': 'привет',
        'how are you': 'как дела',
        'thank you': 'спасибо',
        'goodbye': 'до свидания',
        'what is your name': 'как вас зовут',
        'my name is': 'меня зовут',
        'where is': 'где находится',
        'i need help': 'мне нужна помощь',
        'how much is this': 'сколько это стоит',
        'i don\'t understand': 'я не понимаю'
      },
      'en-ja': {
        'hello': 'こんにちは',
        'how are you': 'お元気ですか',
        'thank you': 'ありがとう',
        'goodbye': 'さようなら',
        'what is your name': 'お名前は何ですか',
        'my name is': '私の名前は',
        'where is': 'どこですか',
        'i need help': '助けが必要です',
        'how much is this': 'これはいくらですか',
        'i don\'t understand': '分かりません'
      },
      'en-ko': {
        'hello': '안녕하세요',
        'how are you': '어떻게 지내세요',
        'thank you': '감사합니다',
        'goodbye': '안녕히 가세요',
        'what is your name': '이름이 뭐예요',
        'my name is': '제 이름은',
        'where is': '어디에 있어요',
        'i need help': '도움이 필요해요',
        'how much is this': '이것은 얼마인가요',
        'i don\'t understand': '이해가 안 돼요'
      },
      'en-zh': {
        'hello': '你好',
        'how are you': '你好吗',
        'thank you': '谢谢',
        'goodbye': '再见',
        'what is your name': '你叫什么名字',
        'my name is': '我的名字是',
        'where is': '在哪里',
        'i need help': '我需要帮助',
        'how much is this': '这个多少钱',
        'i don\'t understand': '我不明白'
      },
      'en-ar': {
        'hello': 'مرحبا',
        'how are you': 'كيف حالك',
        'thank you': 'شكرا لك',
        'goodbye': 'مع السلامة',
        'what is your name': 'ما هو اسمك',
        'my name is': 'اسمي هو',
        'where is': 'أين',
        'i need help': 'أحتاج مساعدة',
        'how much is this': 'كم سعر هذا',
        'i don\'t understand': 'أنا لا أفهم'
      },
      'en-hi': {
        'hello': 'नमस्ते',
        'how are you': 'आप कैसे हैं',
        'thank you': 'धन्यवाद',
        'goodbye': 'अलविदा',
        'what is your name': 'आपका नाम क्या है',
        'my name is': 'मेरा नाम है',
        'where is': 'कहाँ है',
        'i need help': 'मुझे मदद चाहिए',
        'how much is this': 'यह कितने का है',
        'i don\'t understand': 'मैं समझ नहीं पा रहा हूँ'
      },
      'en-tr': {
        'hello': 'merhaba',
        'how are you': 'nasılsın',
        'thank you': 'teşekkür ederim',
        'goodbye': 'güle güle',
        'what is your name': 'adın ne',
        'my name is': 'benim adım',
        'where is': 'nerede',
        'i need help': 'yardıma ihtiyacım var',
        'how much is this': 'bu ne kadar',
        'i don\'t understand': 'anlamıyorum'
      }
    };

    // Create a key for the language pair
    const key = `${fromLang}-${toLang}`;

    // If we have translations for this language pair
    if (mockTranslations[key]) {
      const lowerText = text.toLowerCase();

      // Check for exact matches
      if (mockTranslations[key][lowerText]) {
        return mockTranslations[key][lowerText];
      }

      // Check for partial matches
      let bestMatch = null;
      let bestMatchLength = 0;

      for (const [phrase, translation] of Object.entries(mockTranslations[key])) {
        if (lowerText.includes(phrase) && phrase.length > bestMatchLength) {
          bestMatch = translation;
          bestMatchLength = phrase.length;
        }
      }

      if (bestMatch) {
        return bestMatch;
      }
    }

    // If no match found, return a generic message
    return `[${toLang.toUpperCase()}] ${text}`;
  };

  return (
    <div className="direct-translation">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center mb-2">
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">
            {targetLanguage === 'hi' ? 'English' : getLanguageName(sourceLanguage)} → {getLanguageName(targetLanguage)}
          </h3>
          {targetLanguage === 'hi' ? (
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Speak in English to translate to Hindi
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                (Hindi translation requires English input)
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Speak in {getLanguageName(sourceLanguage)} to translate to {getLanguageName(targetLanguage)}
            </p>
          )}
        </div>

        {/* Listening indicator */}
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

        {/* Listen button */}
        <motion.button
          onClick={toggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md ${
            isListening
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isListening ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          )}
        </motion.button>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isListening ? 'Tap to stop listening' : 'Tap to start listening'}
        </p>

        {/* Results display */}
        {transcript && (
          <div className="w-full mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {getLanguageName(sourceLanguage)}:
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{transcript}</p>
            </div>
          </div>
        )}

        {translation && (
          <div className="w-full mt-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                {getLanguageName(targetLanguage)}:
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{translation}</p>
            </div>
          </div>
        )}

        {isTranslating && (
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Translating...
          </div>
        )}

        {error && (
          <div className="w-full mt-2">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectTranslation;
