// Enhanced Hindi translation service for bidirectional translation
// This module handles both Hindi to other languages and other languages to Hindi

// Hindi to English translation dictionary
const hindiToEnglish = {
  // Greetings and common phrases
  'नमस्ते': 'hello',
  'नमस्कार': 'hello',
  'शुभ प्रभात': 'good morning',
  'शुभ दिन': 'good day',
  'शुभ संध्या': 'good evening',
  'शुभ रात्रि': 'good night',
  'आप कैसे हैं': 'how are you',
  'आप कैसे हो': 'how are you',
  'क्या हाल है': 'how are you',
  'मैं ठीक हूँ': 'I am fine',
  'मैं अच्छा हूँ': 'I am good',
  'धन्यवाद': 'thank you',
  'शुक्रिया': 'thanks',
  'स्वागत है': 'welcome',
  'आपका स्वागत है': 'you are welcome',
  'माफ़ कीजिए': 'sorry',
  'क्षमा करें': 'excuse me',
  'कृपया': 'please',
  'हाँ': 'yes',
  'जी हाँ': 'yes',
  'नहीं': 'no',
  'जी नहीं': 'no',
  'ठीक है': 'okay',
  'बहुत अच्छा': 'very good',
  'अलविदा': 'goodbye',
  'फिर मिलेंगे': 'see you later',
  'आपसे मिलकर खुशी हुई': 'nice to meet you',

  // Questions and personal information
  'आपका नाम क्या है': 'what is your name',
  'तुम्हारा नाम क्या है': 'what is your name',
  'मेरा नाम है': 'my name is',
  'मेरा नाम स्वप्निल है': 'my name is Swapnil',
  'आप कहाँ से हैं': 'where are you from',
  'मैं भारत से हूँ': 'I am from India',
  'आप क्या करते हैं': 'what do you do',
  'मैं छात्र हूँ': 'I am a student',
  'मैं इंजीनियर हूँ': 'I am an engineer',
  'आपकी उम्र क्या है': 'what is your age',
  'मेरी उम्र बीस साल है': 'I am twenty years old',

  // Common words
  'मेरा': 'my',
  'तुम्हारा': 'your',
  'आपका': 'your (formal)',
  'नाम': 'name',
  'स्वप्निल': 'Swapnil',
  'है': 'is',
  'हूँ': 'am',
  'हो': 'are',
  'हैं': 'are (formal)',
  'और': 'and',
  'या': 'or',
  'नहीं': 'not',
  'अच्छा': 'good',
  'बुरा': 'bad',
  'बड़ा': 'big',
  'छोटा': 'small',
  'यहाँ': 'here',
  'वहाँ': 'there',
  'अब': 'now',
  'बाद में': 'later',
  'पहले': 'before',
  'आज': 'today',
  'कल': 'tomorrow',
  'परसों': 'day after tomorrow',
  'दिन': 'day',
  'रात': 'night',
  'सुबह': 'morning',
  'शाम': 'evening',
  'समय': 'time',
  'घंटा': 'hour',
  'मिनट': 'minute',

  // Question words
  'क्या': 'what',
  'कौन': 'who',
  'कब': 'when',
  'कहाँ': 'where',
  'क्यों': 'why',
  'कैसे': 'how',
  'कितना': 'how much',
  'कितने': 'how many',

  // Needs and feelings
  'मुझे भूख लगी है': 'I am hungry',
  'मुझे प्यास लगी है': 'I am thirsty',
  'मुझे नींद आ रही है': 'I am sleepy',
  'मैं थक गया हूँ': 'I am tired',
  'मुझे खुशी हो रही है': 'I am happy',
  'मुझे दुख हो रहा है': 'I am sad',
  'मुझे गुस्सा आ रहा है': 'I am angry',
  'मुझे डर लग रहा है': 'I am scared',
  'मुझे समझ नहीं आ रहा है': 'I don\'t understand',
  'मुझे मदद चाहिए': 'I need help',
  'मुझे पता नहीं': 'I don\'t know',
  'मुझे यह पसंद है': 'I like this',
  'मुझे यह पसंद नहीं है': 'I don\'t like this',

  // Language related
  'मैं अंग्रेजी नहीं बोलता': 'I don\'t speak English',
  'मैं हिंदी बोलता हूँ': 'I speak Hindi',
  'क्या आप अंग्रेजी बोलते हैं': 'Do you speak English',
  'क्या आप हिंदी बोलते हैं': 'Do you speak Hindi',
  'मुझे अंग्रेजी नहीं आती': 'I don\'t know English',
  'मुझे हिंदी आती है': 'I know Hindi',
  'मुझे समझ में नहीं आया': 'I didn\'t understand',
  'फिर से बताइए': 'Please tell me again',
  'धीरे-धीरे बोलिए': 'Please speak slowly',
  'एक मिनट': 'One minute',
  'रुकिए': 'Wait',
  'क्या आप दोहरा सकते हैं': 'can you repeat',
  'फिर से कहिए': 'please say it again',
  'धीरे बोलिए': 'speak slowly',
  
  // Travel and directions
  'होटल': 'hotel',
  'रेस्तरां': 'restaurant',
  'बाजार': 'market',
  'अस्पताल': 'hospital',
  'स्टेशन': 'station',
  'हवाई अड्डा': 'airport',
  'बस स्टॉप': 'bus stop',
  'सड़क': 'road',
  'दाएं': 'right',
  'बाएं': 'left',
  'सीधे': 'straight',
  'पीछे': 'back',
  'पास': 'near',
  'दूर': 'far',
  'अंदर': 'inside',
  'बाहर': 'outside',
  'ऊपर': 'up',
  'नीचे': 'down',
  
  // Emergency phrases
  'मदद': 'help',
  'सहायता': 'assistance',
  'आपातकालीन': 'emergency',
  'डॉक्टर': 'doctor',
  'पुलिस': 'police',
  'आग': 'fire',
  'चोट': 'injury',
  'दुर्घटना': 'accident',
  'चोरी': 'theft'
};

// English to Hindi translation dictionary (reverse of hindiToEnglish)
const englishToHindi = Object.entries(hindiToEnglish).reduce((acc, [hindi, english]) => {
  acc[english.toLowerCase()] = hindi;
  return acc;
}, {});

// Additional English to Hindi translations that might not be in the reverse mapping
const additionalEnglishToHindi = {
  'hi': 'नमस्ते',
  'greetings': 'नमस्कार',
  'namaste': 'नमस्ते',
  'ok': 'ठीक है',
  'fine': 'ठीक',
  'great': 'बहुत अच्छा',
  'excellent': 'उत्कृष्ट',
  'awesome': 'बहुत बढ़िया',
  'amazing': 'अद्भुत',
  'wonderful': 'अद्भुत',
  'fantastic': 'शानदार',
  'terrific': 'बहुत अच्छा',
  'superb': 'उत्कृष्ट',
  'perfect': 'एकदम सही',
  'good job': 'अच्छा काम',
  'well done': 'शाबाश',
  'congratulations': 'बधाई हो',
  'congrats': 'बधाई',
  'best wishes': 'शुभकामनाएं',
  'best of luck': 'शुभकामनाएं',
  'good luck': 'शुभकामनाएं',
  'take care': 'अपना ख्याल रखना',
  'be careful': 'सावधान रहें',
  'be safe': 'सुरक्षित रहें',
  'stay healthy': 'स्वस्थ रहें',
  'get well soon': 'जल्दी ठीक हो जाओ',
  'feel better': 'बेहतर महसूस करो',
  'i miss you': 'मुझे तुम्हारी याद आती है',
  'i love you': 'मैं तुमसे प्यार करता हूँ',
  'happy birthday': 'जन्मदिन मुबारक',
  'happy anniversary': 'सालगिरह मुबारक',
  'happy new year': 'नया साल मुबारक',
  'merry christmas': 'क्रिसमस मुबारक',
  'happy diwali': 'दिवाली मुबारक',
  'happy holi': 'होली मुबारक'
};

// Merge the additional translations into englishToHindi
Object.entries(additionalEnglishToHindi).forEach(([english, hindi]) => {
  englishToHindi[english.toLowerCase()] = hindi;
});

// Function to translate from Hindi to English
const translateFromHindi = (text) => {
  console.log(`Using Hindi to English dictionary for: "${text}"`);
  
  // Try to find exact matches
  if (hindiToEnglish[text]) {
    console.log(`Found exact match for: "${text}" -> "${hindiToEnglish[text]}"`);
    return hindiToEnglish[text];
  }
  
  // Try to find partial matches
  for (const [hindiPhrase, englishTranslation] of Object.entries(hindiToEnglish)) {
    if (text.includes(hindiPhrase)) {
      console.log(`Found partial match: "${hindiPhrase}" in "${text}" -> "${englishTranslation}"`);
      return englishTranslation;
    }
  }
  
  // If no match found, try to translate word by word
  const words = text.split(' ');
  if (words.length > 1) {
    console.log(`Trying word-by-word translation for: "${text}"`);
    const translatedWords = [];
    let translatedAny = false;
    
    for (const word of words) {
      if (hindiToEnglish[word]) {
        translatedWords.push(hindiToEnglish[word]);
        translatedAny = true;
      } else {
        // Try to find partial word matches
        let wordTranslated = false;
        for (const [hindiPhrase, englishTranslation] of Object.entries(hindiToEnglish)) {
          if (word.includes(hindiPhrase)) {
            translatedWords.push(englishTranslation);
            wordTranslated = true;
            translatedAny = true;
            break;
          }
        }
        
        // If no translation found, keep the original word
        if (!wordTranslated) {
          translatedWords.push(word);
        }
      }
    }
    
    // Only return word-by-word translation if we translated at least one word
    if (translatedAny) {
      const result = translatedWords.join(' ');
      console.log(`Word-by-word translation result: "${result}"`);
      return result;
    }
  }
  
  // If no match found, return a placeholder
  console.log(`No translation found for: "${text}"`);
  return `[Translation from Hindi to English: ${text}]`;
};

// Function to translate from any language to Hindi
const translateToHindi = (text, sourceLanguage) => {
  console.log(`Translating to Hindi from ${sourceLanguage}: "${text}"`);
  
  // If source is already Hindi, return as is
  if (sourceLanguage === 'hi') {
    return text;
  }
  
  // For now, we only support direct English to Hindi translation
  if (sourceLanguage !== 'en') {
    console.log(`Source language ${sourceLanguage} not directly supported for Hindi translation, will need to go through English`);
    return `[Translation from ${sourceLanguage} to Hindi: ${text}]`;
  }
  
  const lowerText = text.toLowerCase();
  
  // Try to find exact matches
  if (englishToHindi[lowerText]) {
    console.log(`Found exact match for: "${lowerText}" -> "${englishToHindi[lowerText]}"`);
    return englishToHindi[lowerText];
  }
  
  // Try to find partial matches
  for (const [englishPhrase, hindiTranslation] of Object.entries(englishToHindi)) {
    if (lowerText.includes(englishPhrase)) {
      console.log(`Found partial match: "${englishPhrase}" in "${lowerText}" -> "${hindiTranslation}"`);
      return hindiTranslation;
    }
  }
  
  // If no match found, try to translate word by word
  const words = lowerText.split(' ');
  if (words.length > 1) {
    console.log(`Trying word-by-word translation for: "${lowerText}"`);
    const translatedWords = [];
    let translatedAny = false;
    
    for (const word of words) {
      if (englishToHindi[word]) {
        translatedWords.push(englishToHindi[word]);
        translatedAny = true;
      } else {
        // Try to find partial word matches
        let wordTranslated = false;
        for (const [englishPhrase, hindiTranslation] of Object.entries(englishToHindi)) {
          if (word.includes(englishPhrase)) {
            translatedWords.push(hindiTranslation);
            wordTranslated = true;
            translatedAny = true;
            break;
          }
        }
        
        // If no translation found, keep the original word
        if (!wordTranslated) {
          translatedWords.push(word);
        }
      }
    }
    
    // Only return word-by-word translation if we translated at least one word
    if (translatedAny) {
      const result = translatedWords.join(' ');
      console.log(`Word-by-word translation result: "${result}"`);
      return result;
    }
  }
  
  // If no match found, return a placeholder
  console.log(`No translation found for: "${text}"`);
  return `[Translation from English to Hindi: ${text}]`;
};

// Function to translate between Hindi and any other language
const translateWithHindi = (text, sourceLanguage, targetLanguage) => {
  console.log(`Translating with Hindi module from ${sourceLanguage} to ${targetLanguage}: "${text}"`);
  
  // Hindi to English translation
  if (sourceLanguage === 'hi' && targetLanguage === 'en') {
    return translateFromHindi(text);
  }
  
  // English to Hindi translation
  if (sourceLanguage === 'en' && targetLanguage === 'hi') {
    return translateToHindi(text, sourceLanguage);
  }
  
  // Hindi to other language (via English)
  if (sourceLanguage === 'hi' && targetLanguage !== 'en') {
    const englishText = translateFromHindi(text);
    if (!englishText.startsWith('[Translation from')) {
      return `[Translation from Hindi to ${targetLanguage} via English: ${englishText}]`;
    }
    return `[Translation from Hindi to ${targetLanguage}: ${text}]`;
  }
  
  // Other language to Hindi (via English)
  if (sourceLanguage !== 'en' && targetLanguage === 'hi') {
    return `[Translation from ${sourceLanguage} to Hindi: ${text}]`;
  }
  
  // For any other language pair, return a placeholder
  return `[Translation from ${sourceLanguage} to ${targetLanguage}: ${text}]`;
};

export { 
  translateFromHindi, 
  translateToHindi, 
  translateWithHindi,
  hindiToEnglish, 
  englishToHindi 
};
