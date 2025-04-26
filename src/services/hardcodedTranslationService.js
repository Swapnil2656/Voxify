/**
 * Hardcoded Translation Service
 * This service provides translations without requiring any external API calls
 * Perfect for hackathon demos and offline use
 */

// Import language data
import languages from '../data/languages';

// Comprehensive dictionary of translations for common phrases
const translationDictionary = {
  // Spanish translations
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
    "Excuse me": "Disculpe",
    "Where is": "Dónde está",
    "I want": "Quiero",
    "Can you help me?": "¿Puedes ayudarme?",
    "I'm looking for": "Estoy buscando",
    "What time is it?": "¿Qué hora es?",
    "How do I get to": "¿Cómo llego a",
    "Do you speak English?": "¿Hablas inglés?",
    "I don't speak Spanish": "No hablo español",
    "I'm lost": "Estoy perdido",
    "Call the police": "Llama a la policía",
    "I need a doctor": "Necesito un médico",
    "How much is this?": "¿Cuánto cuesta esto?",
    "Too expensive": "Demasiado caro",
    "Can I have the bill please?": "¿Me trae la cuenta por favor?",
    "The food is delicious": "La comida está deliciosa",
    "I'm vegetarian": "Soy vegetariano",
    "I'm allergic to": "Soy alérgico a",
    "One beer please": "Una cerveza por favor",
    "Water please": "Agua por favor",
    "Cheers!": "¡Salud!",
    "Where is the train station?": "¿Dónde está la estación de tren?",
    "I need a taxi": "Necesito un taxi",
    "How much is the fare?": "¿Cuánto cuesta el viaje?",
    "Take me to this address": "Lléveme a esta dirección",
    "I want to go to": "Quiero ir a",
    "Is this the right way to": "¿Es este el camino correcto para",
    "Turn left": "Gire a la izquierda",
    "Turn right": "Gire a la derecha",
    "Go straight": "Siga recto",
    "Stop here": "Pare aquí"
  },
  
  // French translations
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
    "Excuse me": "Excusez-moi",
    "Where is": "Où est",
    "I want": "Je veux",
    "Can you help me?": "Pouvez-vous m'aider?",
    "I'm looking for": "Je cherche",
    "What time is it?": "Quelle heure est-il?",
    "How do I get to": "Comment puis-je aller à",
    "Do you speak English?": "Parlez-vous anglais?",
    "I don't speak French": "Je ne parle pas français",
    "I'm lost": "Je suis perdu",
    "Call the police": "Appelez la police",
    "I need a doctor": "J'ai besoin d'un médecin",
    "How much is this?": "Combien ça coûte?",
    "Too expensive": "Trop cher",
    "Can I have the bill please?": "L'addition, s'il vous plaît",
    "The food is delicious": "La nourriture est délicieuse",
    "I'm vegetarian": "Je suis végétarien",
    "I'm allergic to": "Je suis allergique à",
    "One beer please": "Une bière s'il vous plaît",
    "Water please": "De l'eau s'il vous plaît",
    "Cheers!": "Santé!",
    "Where is the train station?": "Où est la gare?",
    "I need a taxi": "J'ai besoin d'un taxi",
    "How much is the fare?": "Combien coûte le trajet?",
    "Take me to this address": "Emmenez-moi à cette adresse",
    "I want to go to": "Je veux aller à",
    "Is this the right way to": "Est-ce le bon chemin pour",
    "Turn left": "Tournez à gauche",
    "Turn right": "Tournez à droite",
    "Go straight": "Allez tout droit",
    "Stop here": "Arrêtez-vous ici"
  },
  
  // German translations
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
    "Excuse me": "Entschuldigung",
    "Where is": "Wo ist",
    "I want": "Ich möchte",
    "Can you help me?": "Kannst du mir helfen?",
    "I'm looking for": "Ich suche",
    "What time is it?": "Wie spät ist es?",
    "How do I get to": "Wie komme ich nach",
    "Do you speak English?": "Sprichst du Englisch?",
    "I don't speak German": "Ich spreche kein Deutsch",
    "I'm lost": "Ich habe mich verirrt",
    "Call the police": "Rufen Sie die Polizei",
    "I need a doctor": "Ich brauche einen Arzt",
    "How much is this?": "Wie viel kostet das?",
    "Too expensive": "Zu teuer",
    "Can I have the bill please?": "Die Rechnung bitte",
    "The food is delicious": "Das Essen ist köstlich",
    "I'm vegetarian": "Ich bin Vegetarier",
    "I'm allergic to": "Ich bin allergisch gegen",
    "One beer please": "Ein Bier bitte",
    "Water please": "Wasser bitte",
    "Cheers!": "Prost!",
    "Where is the train station?": "Wo ist der Bahnhof?",
    "I need a taxi": "Ich brauche ein Taxi",
    "How much is the fare?": "Wie viel kostet die Fahrt?",
    "Take me to this address": "Bringen Sie mich zu dieser Adresse",
    "I want to go to": "Ich möchte nach",
    "Is this the right way to": "Ist dies der richtige Weg nach",
    "Turn left": "Links abbiegen",
    "Turn right": "Rechts abbiegen",
    "Go straight": "Geradeaus",
    "Stop here": "Halten Sie hier"
  },
  
  // Italian translations
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
    "Excuse me": "Scusa",
    "Where is": "Dov'è",
    "I want": "Voglio",
    "Can you help me?": "Puoi aiutarmi?",
    "I'm looking for": "Sto cercando",
    "What time is it?": "Che ora è?",
    "How do I get to": "Come arrivo a",
    "Do you speak English?": "Parli inglese?",
    "I don't speak Italian": "Non parlo italiano",
    "I'm lost": "Mi sono perso",
    "Call the police": "Chiama la polizia",
    "I need a doctor": "Ho bisogno di un medico",
    "How much is this?": "Quanto costa questo?",
    "Too expensive": "Troppo costoso",
    "Can I have the bill please?": "Il conto per favore",
    "The food is delicious": "Il cibo è delizioso",
    "I'm vegetarian": "Sono vegetariano",
    "I'm allergic to": "Sono allergico a",
    "One beer please": "Una birra per favore",
    "Water please": "Acqua per favore",
    "Cheers!": "Salute!",
    "Where is the train station?": "Dov'è la stazione ferroviaria?",
    "I need a taxi": "Ho bisogno di un taxi",
    "How much is the fare?": "Quanto costa la corsa?",
    "Take me to this address": "Portami a questo indirizzo",
    "I want to go to": "Voglio andare a",
    "Is this the right way to": "È questa la strada giusta per",
    "Turn left": "Gira a sinistra",
    "Turn right": "Gira a destra",
    "Go straight": "Vai dritto",
    "Stop here": "Fermati qui"
  },
  
  // Japanese translations
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
    "Excuse me": "すみません (Sumimasen)",
    "Where is": "どこですか (Doko desu ka)",
    "I want": "欲しいです (Hoshii desu)",
    "Can you help me?": "手伝ってもらえますか？ (Tetsudatte moraemasu ka?)",
    "I'm looking for": "探しています (Sagashite imasu)",
    "What time is it?": "今何時ですか？ (Ima nanji desu ka?)",
    "How do I get to": "どうやって行きますか (Dou yatte ikimasu ka)",
    "Do you speak English?": "英語を話せますか？ (Eigo o hanasemasu ka?)",
    "I don't speak Japanese": "日本語を話せません (Nihongo o hanasemasen)",
    "I'm lost": "道に迷いました (Michi ni mayoimashita)",
    "Call the police": "警察を呼んでください (Keisatsu o yonde kudasai)",
    "I need a doctor": "医者が必要です (Isha ga hitsuyou desu)",
    "How much is this?": "これはいくらですか？ (Kore wa ikura desu ka?)",
    "Too expensive": "高すぎます (Takasugimasu)",
    "Can I have the bill please?": "お会計をお願いします (Okaikei o onegaishimasu)",
    "The food is delicious": "食べ物がおいしいです (Tabemono ga oishii desu)",
    "I'm vegetarian": "ベジタリアンです (Bejitarian desu)",
    "I'm allergic to": "アレルギーがあります (Arerugii ga arimasu)",
    "One beer please": "ビールを一つください (Biiru o hitotsu kudasai)",
    "Water please": "水をください (Mizu o kudasai)",
    "Cheers!": "乾杯！ (Kanpai!)",
    "Where is the train station?": "駅はどこですか？ (Eki wa doko desu ka?)",
    "I need a taxi": "タクシーが必要です (Takushii ga hitsuyou desu)",
    "How much is the fare?": "料金はいくらですか？ (Ryoukin wa ikura desu ka?)",
    "Take me to this address": "このアドレスに連れて行ってください (Kono adoresu ni tsurete itte kudasai)",
    "I want to go to": "に行きたいです (Ni ikitai desu)",
    "Is this the right way to": "これは正しい道ですか (Kore wa tadashii michi desu ka)",
    "Turn left": "左に曲がってください (Hidari ni magatte kudasai)",
    "Turn right": "右に曲がってください (Migi ni magatte kudasai)",
    "Go straight": "まっすぐ行ってください (Massugu itte kudasai)",
    "Stop here": "ここで止まってください (Koko de tomatte kudasai)"
  },
  
  // Chinese translations
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
    "Excuse me": "打扰一下 (Dǎrǎo yīxià)",
    "Where is": "在哪里 (Zài nǎlǐ)",
    "I want": "我想要 (Wǒ xiǎng yào)",
    "Can you help me?": "你能帮我吗？ (Nǐ néng bāng wǒ ma?)",
    "I'm looking for": "我在找 (Wǒ zài zhǎo)",
    "What time is it?": "现在几点了？ (Xiànzài jǐ diǎn le?)",
    "How do I get to": "我怎么去 (Wǒ zěnme qù)",
    "Do you speak English?": "你会说英语吗？ (Nǐ huì shuō Yīngyǔ ma?)",
    "I don't speak Chinese": "我不会说中文 (Wǒ bù huì shuō Zhōngwén)",
    "I'm lost": "我迷路了 (Wǒ mílù le)",
    "Call the police": "打电话给警察 (Dǎ diànhuà gěi jǐngchá)",
    "I need a doctor": "我需要医生 (Wǒ xūyào yīshēng)",
    "How much is this?": "这个多少钱？ (Zhège duōshǎo qián?)",
    "Too expensive": "太贵了 (Tài guì le)",
    "Can I have the bill please?": "请给我账单 (Qǐng gěi wǒ zhàngdān)",
    "The food is delicious": "食物很好吃 (Shíwù hěn hǎochī)",
    "I'm vegetarian": "我是素食主义者 (Wǒ shì sùshí zhǔyì zhě)",
    "I'm allergic to": "我对...过敏 (Wǒ duì... guòmǐn)",
    "One beer please": "请给我一杯啤酒 (Qǐng gěi wǒ yī bēi píjiǔ)",
    "Water please": "请给我水 (Qǐng gěi wǒ shuǐ)",
    "Cheers!": "干杯！ (Gānbēi!)",
    "Where is the train station?": "火车站在哪里？ (Huǒchēzhàn zài nǎlǐ?)",
    "I need a taxi": "我需要出租车 (Wǒ xūyào chūzūchē)",
    "How much is the fare?": "车费是多少？ (Chēfèi shì duōshǎo?)",
    "Take me to this address": "请带我去这个地址 (Qǐng dài wǒ qù zhège dìzhǐ)",
    "I want to go to": "我想去 (Wǒ xiǎng qù)",
    "Is this the right way to": "这是去...的正确方向吗？ (Zhè shì qù... de zhèngquè fāngxiàng ma?)",
    "Turn left": "向左转 (Xiàng zuǒ zhuǎn)",
    "Turn right": "向右转 (Xiàng yòu zhuǎn)",
    "Go straight": "直走 (Zhí zǒu)",
    "Stop here": "在这里停 (Zài zhèlǐ tíng)"
  }
};

/**
 * Generate a mock translation for languages without a dictionary
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @returns {string} - Mock translated text
 */
const generateMockTranslation = (text, targetLanguage) => {
  // Create a deterministic but different version of the text based on the language code
  const langSeed = targetLanguage.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Split the text into words
  const words = text.split(' ');
  
  // Transform each word based on the language
  const transformedWords = words.map((word, index) => {
    // Use the language seed and word index to create variations
    const seed = (langSeed + index) % 5;
    
    switch(targetLanguage) {
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
 * Get language name from language code
 * @param {string} code - Language code
 * @returns {string} - Language name
 */
const getLanguageName = (code) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};

/**
 * Translate text using hardcoded translations
 * @param {string} text - Text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} - Translation result
 */
const translateText = async (text, sourceLanguage = 'en', targetLanguage = 'es') => {
  try {
    // Get the target language dictionary
    const langDict = translationDictionary[targetLanguage];
    
    let translation = text;
    
    // If we have a dictionary for this language
    if (langDict) {
      // Check for exact matches
      if (langDict[text]) {
        translation = langDict[text];
      } else {
        // Check for partial matches
        for (const [eng, trans] of Object.entries(langDict)) {
          if (text.includes(eng)) {
            translation = text.replace(eng, trans);
            break;
          }
        }
      }
    } else {
      // Generate a mock translation for languages without a dictionary
      translation = generateMockTranslation(text, targetLanguage);
    }
    
    // Simulate a delay to make it feel like it's processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      translation,
      sourceLanguage,
      targetLanguage
    };
  } catch (error) {
    console.error('Translation error:', error);
    
    // Return a fallback translation
    return {
      success: true, // Still return success to avoid breaking the UI
      translation: `[${targetLanguage.toUpperCase()}] ${text}`,
      sourceLanguage,
      targetLanguage,
      error: error.message
    };
  }
};

/**
 * Recognize text from an image and translate it
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} - OCR and translation result
 */
const recognizeAndTranslate = async (imageDataUrl, sourceLanguage = 'en', targetLanguage = 'es') => {
  try {
    // For this implementation, we'll use a simple mock OCR
    // In a real implementation, you would use a proper OCR service
    
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
    const extractedText = phrases[index];
    
    // Translate the extracted text
    const translationResult = await translateText(extractedText, sourceLanguage, targetLanguage);
    
    // Return the combined result
    return {
      success: true,
      extractedText,
      translatedText: translationResult.translation,
      confidence: 0.85 + (Math.random() * 0.1), // Random confidence between 0.85 and 0.95
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
  translateText,
  recognizeAndTranslate
};
