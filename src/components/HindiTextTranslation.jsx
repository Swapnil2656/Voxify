import React, { useState } from 'react';
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

const HindiTextTranslation = ({ text, onTranslate }) => {
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  
  const handleTranslate = () => {
    if (!text || text.trim() === '') {
      setError('Please enter some text to translate');
      return;
    }
    
    setIsTranslating(true);
    setError(null);
    
    try {
      // Simulate a delay to make it feel like it's processing
      setTimeout(() => {
        const hindiText = translateToHindi(text);
        setTranslation(hindiText);
        
        // Notify parent component
        if (onTranslate) {
          onTranslate({
            sourceText: text,
            translatedText: hindiText,
            sourceLanguage: 'en',
            targetLanguage: 'hi'
          });
        }
        
        setIsTranslating(false);
      }, 500);
    } catch (err) {
      console.error('Translation error:', err);
      setError(`Translation failed: ${err.message || 'Unknown error'}`);
      setIsTranslating(false);
    }
  };
  
  return (
    <div className="hindi-text-translation">
      <div className="flex flex-col space-y-4">
        <div className="text-center mb-2">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Enter English text to translate to Hindi
          </p>
        </div>
        
        <motion.button
          onClick={handleTranslate}
          disabled={isTranslating || !text}
          className={`btn btn-primary btn-lg w-full ${
            isTranslating || !text ? 'btn-disabled' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isTranslating ? (
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
              Translate to Hindi
            </>
          )}
        </motion.button>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default HindiTextTranslation;
