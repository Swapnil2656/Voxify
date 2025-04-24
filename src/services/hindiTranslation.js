// Hindi to English translation dictionary
const hindiToEnglish = {
  'नमस्ते': 'hello',
  'नमस्कार': 'hello',
  'आप कैसे हैं': 'how are you',
  'आप कैसे हो': 'how are you',
  'क्या हाल है': 'how are you',
  'आपका नाम क्या है': 'what is your name',
  'तुम्हारा नाम क्या है': 'what is your name',
  'मेरा नाम है': 'my name is',
  'मेरा नाम स्वप्निल है': 'my name is Swapnil',
  'मेरा': 'my',
  'नाम': 'name',
  'स्वप्निल': 'Swapnil',
  'धन्यवाद': 'thank you',
  'शुक्रिया': 'thank you',
  'अलविदा': 'goodbye',
  'फिर मिलेंगे': 'see you later',
  'हां': 'yes',
  'जी हां': 'yes',
  'नहीं': 'no',
  'जी नहीं': 'no',
  'कृपया': 'please',
  'माफ़ कीजिए': 'sorry',
  'क्षमा करें': 'sorry',
  'मदद': 'help',
  'सहायता': 'help',
  'मैं समझ नहीं पा रहा हूँ': 'I don\'t understand',
  'मुझे समझ नहीं आ रहा': 'I don\'t understand',
  'क्या आप दोहरा सकते हैं': 'can you repeat',
  'फिर से कहिए': 'please say it again',
  'धीरे बोलिए': 'speak slowly',
  'कहाँ है': 'where is',
  'कितना': 'how much',
  'कब': 'when',
  'क्यों': 'why',
  'कौन': 'who',
  'क्या': 'what',
  'कैसे': 'how',
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
  'मैं अंग्रेजी नहीं बोलता': 'I don\'t speak English',
  'मैं हिंदी बोलता हूँ': 'I speak Hindi',
  'क्या आप अंग्रेजी बोलते हैं': 'Do you speak English',
  'क्या आप हिंदी बोलते हैं': 'Do you speak Hindi',
  'मुझे अंग्रेजी नहीं आती': 'I don\'t know English',
  'मुझे हिंदी आती है': 'I know Hindi',
  'मैं भारत से हूँ': 'I am from India',
  'आप कहाँ से हैं': 'Where are you from',
  'मुझे समझ में नहीं आया': 'I didn\'t understand',
  'फिर से बताइए': 'Please tell me again',
  'धीरे-धीरे बोलिए': 'Please speak slowly',
  'एक मिनट': 'One minute',
  'रुकिए': 'Wait',
  'ठीक है': 'Okay',
  'बहुत अच्छा': 'Very good',
  'शुभ प्रभात': 'Good morning',
  'शुभ दिन': 'Good day',
  'शुभ संध्या': 'Good evening',
  'शुभ रात्रि': 'Good night',
  'आपसे मिलकर खुशी हुई': 'Nice to meet you',
  'स्वागत है': 'Welcome',
  'कृपया मदद कीजिए': 'Please help me'
};

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

export { translateFromHindi, hindiToEnglish };
