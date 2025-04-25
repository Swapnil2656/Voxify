/**
 * Mock Camera Translation Service
 * This service provides client-side translation functionality without requiring server connections
 */

// Sample translations for common phrases in different languages
const translations = {
  es: {
    "Hello": "Hola",
    "Hello, How are You?": "Hola, ¿Cómo estás?",
    "Good morning": "Buenos días",
    "Good afternoon": "Buenas tardes",
    "Good evening": "Buenas noches",
    "How are you?": "¿Cómo estás?",
    "Thank you": "Gracias",
    "You're welcome": "De nada",
    "Goodbye": "Adiós",
    "See you later": "Hasta luego",
    "My name is": "Me llamo",
    "What is your name?": "¿Cómo te llamas?",
    "Nice to meet you": "Encantado de conocerte",
    "I don't understand": "No entiendo",
    "Please speak slowly": "Por favor, habla más despacio",
    "Where is the bathroom?": "¿Dónde está el baño?",
    "How much does this cost?": "¿Cuánto cuesta esto?",
    "I need help": "Necesito ayuda",
    "I'm sorry": "Lo siento",
    "Excuse me": "Disculpe"
  },
  fr: {
    "Hello": "Bonjour",
    "Hello, How are You?": "Bonjour, comment allez-vous?",
    "Good morning": "Bonjour",
    "Good afternoon": "Bon après-midi",
    "Good evening": "Bonsoir",
    "How are you?": "Comment allez-vous?",
    "Thank you": "Merci",
    "You're welcome": "De rien",
    "Goodbye": "Au revoir",
    "See you later": "À plus tard",
    "My name is": "Je m'appelle",
    "What is your name?": "Comment vous appelez-vous?",
    "Nice to meet you": "Enchanté de faire votre connaissance",
    "I don't understand": "Je ne comprends pas",
    "Please speak slowly": "Parlez lentement, s'il vous plaît",
    "Where is the bathroom?": "Où sont les toilettes?",
    "How much does this cost?": "Combien ça coûte?",
    "I need help": "J'ai besoin d'aide",
    "I'm sorry": "Je suis désolé",
    "Excuse me": "Excusez-moi"
  },
  de: {
    "Hello": "Hallo",
    "Hello, How are You?": "Hallo, wie geht es dir?",
    "Good morning": "Guten Morgen",
    "Good afternoon": "Guten Tag",
    "Good evening": "Guten Abend",
    "How are you?": "Wie geht es dir?",
    "Thank you": "Danke",
    "You're welcome": "Bitte",
    "Goodbye": "Auf Wiedersehen",
    "See you later": "Bis später",
    "My name is": "Ich heiße",
    "What is your name?": "Wie heißt du?",
    "Nice to meet you": "Schön, dich kennenzulernen",
    "I don't understand": "Ich verstehe nicht",
    "Please speak slowly": "Bitte sprich langsam",
    "Where is the bathroom?": "Wo ist die Toilette?",
    "How much does this cost?": "Wie viel kostet das?",
    "I need help": "Ich brauche Hilfe",
    "I'm sorry": "Es tut mir leid",
    "Excuse me": "Entschuldigung"
  },
  it: {
    "Hello": "Ciao",
    "Hello, How are You?": "Ciao, come stai?",
    "Good morning": "Buongiorno",
    "Good afternoon": "Buon pomeriggio",
    "Good evening": "Buonasera",
    "How are you?": "Come stai?",
    "Thank you": "Grazie",
    "You're welcome": "Prego",
    "Goodbye": "Arrivederci",
    "See you later": "A più tardi",
    "My name is": "Mi chiamo",
    "What is your name?": "Come ti chiami?",
    "Nice to meet you": "Piacere di conoscerti",
    "I don't understand": "Non capisco",
    "Please speak slowly": "Per favore, parla lentamente",
    "Where is the bathroom?": "Dov'è il bagno?",
    "How much does this cost?": "Quanto costa questo?",
    "I need help": "Ho bisogno di aiuto",
    "I'm sorry": "Mi dispiace",
    "Excuse me": "Scusa"
  },
  ja: {
    "Hello": "こんにちは (Konnichiwa)",
    "Hello, How are You?": "こんにちは、お元気ですか？ (Konnichiwa, ogenkidesuka?)",
    "Good morning": "おはようございます (Ohayou gozaimasu)",
    "Good afternoon": "こんにちは (Konnichiwa)",
    "Good evening": "こんばんは (Konbanwa)",
    "How are you?": "お元気ですか？ (Ogenki desu ka?)",
    "Thank you": "ありがとうございます (Arigatou gozaimasu)",
    "You're welcome": "どういたしまして (Dou itashimashite)",
    "Goodbye": "さようなら (Sayounara)",
    "See you later": "また後で (Mata atode)",
    "My name is": "私の名前は (Watashi no namae wa)",
    "What is your name?": "お名前は何ですか？ (Onamae wa nan desu ka?)",
    "Nice to meet you": "はじめまして (Hajimemashite)",
    "I don't understand": "わかりません (Wakarimasen)",
    "Please speak slowly": "ゆっくり話してください (Yukkuri hanashite kudasai)",
    "Where is the bathroom?": "お手洗いはどこですか？ (Otearai wa doko desu ka?)",
    "How much does this cost?": "これはいくらですか？ (Kore wa ikura desu ka?)",
    "I need help": "助けてください (Tasukete kudasai)",
    "I'm sorry": "すみません (Sumimasen)",
    "Excuse me": "すみません (Sumimasen)"
  },
  zh: {
    "Hello": "你好 (Nǐ hǎo)",
    "Hello, How are You?": "你好，你好吗？ (Nǐ hǎo, nǐ hǎo ma?)",
    "Good morning": "早上好 (Zǎoshang hǎo)",
    "Good afternoon": "下午好 (Xiàwǔ hǎo)",
    "Good evening": "晚上好 (Wǎnshang hǎo)",
    "How are you?": "你好吗？ (Nǐ hǎo ma?)",
    "Thank you": "谢谢 (Xièxiè)",
    "You're welcome": "不客气 (Bú kèqì)",
    "Goodbye": "再见 (Zàijiàn)",
    "See you later": "回头见 (Huítóu jiàn)",
    "My name is": "我的名字是 (Wǒ de míngzì shì)",
    "What is your name?": "你叫什么名字？ (Nǐ jiào shénme míngzì?)",
    "Nice to meet you": "很高兴认识你 (Hěn gāoxìng rènshí nǐ)",
    "I don't understand": "我不明白 (Wǒ bù míngbái)",
    "Please speak slowly": "请说慢一点 (Qǐng shuō màn yīdiǎn)",
    "Where is the bathroom?": "洗手间在哪里？ (Xǐshǒujiān zài nǎlǐ?)",
    "How much does this cost?": "这个多少钱？ (Zhège duōshǎo qián?)",
    "I need help": "我需要帮助 (Wǒ xūyào bāngzhù)",
    "I'm sorry": "对不起 (Duìbùqǐ)",
    "Excuse me": "打扰一下 (Dǎrǎo yīxià)"
  }
};

/**
 * Recognize text from an image (mock implementation)
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @returns {Promise<Object>} - OCR result
 */
const recognizeText = async (imageDataUrl) => {
  // In a real implementation, this would use OCR to extract text from the image
  // For this mock implementation, we'll return a predefined text

  // Generate a simple hash from the image data to get consistent results
  let hash = 0;
  const sampleStr = imageDataUrl.substring(0, 100);
  for (let i = 0; i < sampleStr.length; i++) {
    hash = ((hash << 5) - hash) + sampleStr.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to select a predefined text
  const phrases = [
    "Hello, How are You?",
    "Good morning",
    "Thank you",
    "Where is the bathroom?",
    "How much does this cost?",
    "I need help",
    "Excuse me"
  ];

  const index = Math.abs(hash) % phrases.length;
  const recognizedText = phrases[index];

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    text: recognizedText,
    confidence: 0.85 + (Math.random() * 0.1) // Random confidence between 0.85 and 0.95
  };
};

/**
 * Translate text to the target language
 * @param {string} text - Text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} - Translation result
 */
const translateText = async (text, sourceLanguage = 'en', targetLanguage = 'es') => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if we have translations for this language
  if (translations[targetLanguage]) {
    const langDict = translations[targetLanguage];

    // Check if we have a direct translation
    if (langDict[text]) {
      return {
        success: true,
        translation: langDict[text],
        sourceLanguage,
        targetLanguage
      };
    }

    // Check if we have translations for parts of the text
    for (const [eng, trans] of Object.entries(langDict)) {
      if (text.includes(eng)) {
        return {
          success: true,
          translation: text.replace(eng, trans),
          sourceLanguage,
          targetLanguage
        };
      }
    }
  }

  // For languages we don't have explicit translations for, generate a mock translation
  // This ensures all languages are supported
  const mockTranslation = generateMockTranslation(text, targetLanguage);

  return {
    success: true,
    translation: mockTranslation,
    sourceLanguage,
    targetLanguage
  };
};

/**
 * Generate a mock translation for any language
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @returns {string} - Mock translated text
 */
const generateMockTranslation = (text, targetLanguage) => {
  // For languages we have translations for, we should never reach here
  // This is a fallback for all other languages

  // Create a deterministic but different version of the text based on the language code
  const langSeed = targetLanguage.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Different language families have different characteristics
  // We'll simulate these differences based on the language code

  // Split the text into words
  const words = text.split(' ');

  // Transform each word based on the language
  const transformedWords = words.map((word, index) => {
    // Use the language seed and word index to create variations
    const seed = (langSeed + index) % 5;

    switch(targetLanguage) {
      // For languages not in our translations object, create mock translations

      // Romance languages (add vowels at the end)
      case 'pt': // Portuguese
      case 'ro': // Romanian
        return word + 'o';

      // Slavic languages (remove vowels)
      case 'ru': // Russian
      case 'pl': // Polish
      case 'cs': // Czech
      case 'bg': // Bulgarian
        return word.replace(/[aeiou]/g, '') + 'ski';

      // Nordic languages (add special characters)
      case 'sv': // Swedish
      case 'no': // Norwegian
      case 'da': // Danish
      case 'fi': // Finnish
        return word + 'ø';

      // Asian languages (shorter words)
      case 'ko': // Korean
      case 'th': // Thai
      case 'vi': // Vietnamese
        return word.substring(0, Math.max(2, word.length - 2));

      // Middle Eastern languages (longer words)
      case 'ar': // Arabic
      case 'he': // Hebrew
      case 'fa': // Persian
        return word + 'al' + word.substring(0, 2);

      // Default transformation for any other language
      default:
        // Create a unique transformation based on the language code
        if (seed === 0) return word + 'a';
        if (seed === 1) return 'le' + word;
        if (seed === 2) return word + 'en';
        if (seed === 3) return word.split('').reverse().join('');
        return word + '-' + targetLanguage;
    }
  });

  // Join the transformed words back together
  return `${transformedWords.join(' ')} (${targetLanguage})`;
};

/**
 * Combined function to recognize text from an image and translate it
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} - OCR and translation result
 */
const recognizeAndTranslate = async (imageDataUrl, sourceLanguage = 'en', targetLanguage = 'es') => {
  try {
    // First, recognize text from the image
    const ocrResult = await recognizeText(imageDataUrl);

    if (!ocrResult.success || !ocrResult.text) {
      return {
        success: false,
        error: 'Failed to recognize text from image'
      };
    }

    // Then, translate the recognized text
    const translationResult = await translateText(ocrResult.text, sourceLanguage, targetLanguage);

    if (!translationResult.success) {
      return {
        success: false,
        error: 'Failed to translate text',
        extractedText: ocrResult.text
      };
    }

    // Return the combined result
    return {
      success: true,
      extractedText: ocrResult.text,
      translatedText: translationResult.translation,
      confidence: ocrResult.confidence,
      sourceLanguage,
      targetLanguage
    };
  } catch (error) {
    console.error('Error in recognizeAndTranslate:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

export default {
  recognizeText,
  translateText,
  recognizeAndTranslate
};
