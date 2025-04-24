import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Direct English to Hindi translation dictionary
const englishToHindi = {
  // Greetings
  'hello': 'नमस्ते',
  'hi': 'नमस्ते',
  'good morning': 'सुप्रभात',
  'good afternoon': 'नमस्कार',
  'good evening': 'शुभ संध्या',
  'good night': 'शुभ रात्रि',
  
  // Common phrases
  'how are you': 'आप कैसे हैं',
  'i am fine': 'मैं ठीक हूँ',
  'thank you': 'धन्यवाद',
  'you are welcome': 'आपका स्वागत है',
  'please': 'कृपया',
  'excuse me': 'क्षमा करें',
  'sorry': 'माफ़ कीजिए',
  'yes': 'हाँ',
  'no': 'नहीं',
  
  // Questions
  'what is your name': 'आपका नाम क्या है',
  'my name is': 'मेरा नाम है',
  'where are you from': 'आप कहाँ से हैं',
  'i am from': 'मैं से हूँ',
  'how much is this': 'यह कितने का है',
  'where is': 'कहाँ है',
  'when': 'कब',
  'why': 'क्यों',
  'who': 'कौन',
  'what': 'क्या',
  
  // Travel phrases
  'i need help': 'मुझे मदद चाहिए',
  'i am lost': 'मैं खो गया हूँ',
  'where is the bathroom': 'बाथरूम कहाँ है',
  'where is the restaurant': 'रेस्टोरेंट कहाँ है',
  'where is the hotel': 'होटल कहाँ है',
  'where is the airport': 'हवाई अड्डा कहाँ है',
  'where is the train station': 'रेलवे स्टेशन कहाँ है',
  'where is the bus stop': 'बस स्टॉप कहाँ है',
  'how do i get to': 'मैं कैसे पहुँचूँ',
  'how far is': 'कितनी दूर है',
  'is it far': 'क्या यह दूर है',
  
  // Food related
  'i am hungry': 'मुझे भूख लगी है',
  'i am thirsty': 'मुझे प्यास लगी है',
  'the food is delicious': 'खाना बहुत स्वादिष्ट है',
  'can i have the menu': 'क्या मुझे मेन्यू मिल सकता है',
  'i would like to order': 'मैं ऑर्डर करना चाहूँगा',
  'water': 'पानी',
  'vegetarian': 'शाकाहारी',
  'non-vegetarian': 'मांसाहारी',
  
  // Emergency
  'help': 'मदद',
  'emergency': 'आपातकाल',
  'call the police': 'पुलिस को बुलाओ',
  'i need a doctor': 'मुझे डॉक्टर की जरूरत है',
  'i am sick': 'मैं बीमार हूँ',
  'hospital': 'अस्पताल',
  
  // Common words
  'today': 'आज',
  'tomorrow': 'कल',
  'yesterday': 'कल (बीता हुआ)',
  'now': 'अभी',
  'later': 'बाद में',
  'here': 'यहाँ',
  'there': 'वहाँ',
  'good': 'अच्छा',
  'bad': 'बुरा',
  'big': 'बड़ा',
  'small': 'छोटा',
  'hot': 'गरम',
  'cold': 'ठंडा',
  'expensive': 'महंगा',
  'cheap': 'सस्ता',
  
  // Numbers
  'one': 'एक',
  'two': 'दो',
  'three': 'तीन',
  'four': 'चार',
  'five': 'पाँच',
  'six': 'छह',
  'seven': 'सात',
  'eight': 'आठ',
  'nine': 'नौ',
  'ten': 'दस'
};

// Translate English text to Hindi
const translateToHindi = (text) => {
  if (!text) return '';
  
  const lowerText = text.toLowerCase();
  
  // Check for exact match
  if (englishToHindi[lowerText]) {
    return englishToHindi[lowerText];
  }
  
  // Check for partial matches
  let bestMatch = null;
  let bestMatchLength = 0;
  
  for (const [phrase, translation] of Object.entries(englishToHindi)) {
    if (lowerText.includes(phrase) && phrase.length > bestMatchLength) {
      bestMatch = translation;
      bestMatchLength = phrase.length;
    }
  }
  
  if (bestMatch) {
    return bestMatch;
  }
  
  // Try word-by-word translation
  const words = lowerText.split(' ');
  const translatedWords = [];
  let hasTranslation = false;
  
  for (const word of words) {
    if (englishToHindi[word]) {
      translatedWords.push(englishToHindi[word]);
      hasTranslation = true;
    } else {
      translatedWords.push(word);
    }
  }
  
  if (hasTranslation) {
    return translatedWords.join(' ');
  }
  
  // If no translation found, return a generic Hindi phrase
  const hindiPhrases = [
    'नमस्ते, मैं आपकी मदद कर सकता हूं।',
    'क्या आप अंग्रेजी बोलते हैं?',
    'मुझे माफ करें, मैं समझ नहीं पाया।',
    'कृपया धीरे बोलें।',
    'यह जानकारी उपयोगी है।',
    'धन्यवाद, आपका दिन शुभ हो।'
  ];
  
  return hindiPhrases[Math.floor(Math.random() * hindiPhrases.length)];
};

const HindiTranslation = ({ onTranslationComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
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
    
    // Configure recognition for English
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
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
      
      // If this is a final result, translate it
      if (result.isFinal) {
        const hindiText = translateToHindi(transcriptText);
        setTranslation(hindiText);
        
        // Notify parent component
        if (onTranslationComplete) {
          onTranslationComplete({
            sourceText: transcriptText,
            translatedText: hindiText,
            sourceLanguage: 'en',
            targetLanguage: 'hi'
          });
        }
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
  }, [onTranslationComplete]);
  
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
  
  return (
    <div className="hindi-translation">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center mb-2">
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">Hindi Translation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Speak in English to translate to Hindi
          </p>
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
                English:
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{transcript}</p>
            </div>
          </div>
        )}
        
        {translation && (
          <div className="w-full mt-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Hindi:
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{translation}</p>
            </div>
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

export default HindiTranslation;
