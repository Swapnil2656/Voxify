/**
 * Mock data service for language learning suggestions
 * This replaces the server API calls with client-side mock data
 */

// Sample translations for different languages
const translations = {
  es: {
    "Hello": "Hola",
    "Good morning": "Buenos días",
    "How are you?": "¿Cómo estás?",
    "Thank you": "Gracias",
    "Goodbye": "Adiós",
    "My name is": "Me llamo",
    "I like to learn languages": "Me gusta aprender idiomas",
    "I am a student": "Soy estudiante",
    "Where is the restaurant?": "¿Dónde está el restaurante?",
    "The weather is nice today": "El clima está agradable hoy"
  },
  fr: {
    "Hello": "Bonjour",
    "Good morning": "Bonjour",
    "How are you?": "Comment allez-vous?",
    "Thank you": "Merci",
    "Goodbye": "Au revoir",
    "My name is": "Je m'appelle",
    "I like to learn languages": "J'aime apprendre des langues",
    "I am a student": "Je suis étudiant",
    "Where is the restaurant?": "Où est le restaurant?",
    "The weather is nice today": "Il fait beau aujourd'hui"
  },
  de: {
    "Hello": "Hallo",
    "Good morning": "Guten Morgen",
    "How are you?": "Wie geht es dir?",
    "Thank you": "Danke",
    "Goodbye": "Auf Wiedersehen",
    "My name is": "Ich heiße",
    "I like to learn languages": "Ich lerne gerne Sprachen",
    "I am a student": "Ich bin Student",
    "Where is the restaurant?": "Wo ist das Restaurant?",
    "The weather is nice today": "Das Wetter ist heute schön"
  }
};

// Sample grammar points for different languages
const grammarPoints = {
  es: [
    "Spanish uses two forms of 'you': 'tú' (informal) and 'usted' (formal)",
    "Adjectives usually come after the noun they modify",
    "Most nouns ending in 'o' are masculine, while those ending in 'a' are feminine",
    "Spanish has two verbs for 'to be': 'ser' for permanent traits and 'estar' for temporary states"
  ],
  fr: [
    "French has masculine and feminine nouns, which affects adjectives and articles",
    "French uses different verb conjugations for each subject pronoun",
    "Adjectives usually come after the noun they modify",
    "French has formal and informal ways to say 'you': 'vous' and 'tu'"
  ],
  de: [
    "German has three grammatical genders: masculine, feminine, and neuter",
    "German uses four cases: nominative, accusative, dative, and genitive",
    "In German sentences, the verb is always the second element in main clauses",
    "German compound nouns can be very long and are written as one word"
  ]
};

// Sample vocabulary insights for different languages
const vocabularyInsights = {
  es: [
    "'Tiempo' can mean both 'time' and 'weather'",
    "'Esperar' can mean both 'to wait' and 'to hope'",
    "'Tener' (to have) is used in many expressions like 'tener hambre' (to be hungry)",
    "'Ser' vs 'Estar' - both mean 'to be' but are used in different contexts"
  ],
  fr: [
    "'Temps' can mean both 'time' and 'weather'",
    "'On' is commonly used instead of 'nous' in everyday speech",
    "The word 'pas' is used with 'ne' to form negations",
    "'Avoir' (to have) is used in many expressions like 'avoir faim' (to be hungry)"
  ],
  de: [
    "German has many compound words like 'Freundschaftsbeziehung' (friendship relationship)",
    "Modal particles like 'doch', 'mal', 'eben' add nuance but often have no direct translation",
    "Many German words have been adopted into English, like 'kindergarten' and 'zeitgeist'",
    "The prefix 'un-' works like English to make opposites (glücklich → unglücklich)"
  ]
};

// Sample learning suggestions for different focus areas
const learningSuggestions = {
  general: [
    "Practice with native speakers whenever possible",
    "Watch movies or TV shows with subtitles in the target language",
    "Label objects in your home with their names in the target language",
    "Set aside 15-30 minutes daily for consistent practice"
  ],
  grammar: [
    "Focus on one grammar rule at a time until you master it",
    "Create your own example sentences using new grammar structures",
    "Keep a grammar journal to note rules and examples",
    "Use grammar exercises and quizzes to test your understanding"
  ],
  vocabulary: [
    "Use flashcards or spaced repetition software like Anki",
    "Group vocabulary by themes or topics",
    "Learn words in context rather than in isolation",
    "Create mental associations or stories to remember new words"
  ],
  idioms: [
    "Learn idioms in context through authentic materials",
    "Practice using idioms in conversations",
    "Create visual associations for idioms to remember their meanings",
    "Keep an idiom journal with examples and usage notes"
  ]
};

// Sample cultural tips for different languages
const culturalTips = {
  es: [
    "In Spanish-speaking countries, greetings often include kisses on the cheek",
    "Meal times are typically later than in English-speaking countries",
    "The siesta tradition is still observed in some regions",
    "Family is highly valued in Hispanic cultures"
  ],
  fr: [
    "The French typically greet with 'la bise' (cheek kisses)",
    "Punctuality is important in formal situations",
    "Bread is an essential part of French meals",
    "Formal and informal language distinctions are important in French culture"
  ],
  de: [
    "Germans value punctuality and directness",
    "Recycling and environmental consciousness are important in German culture",
    "Academic titles are commonly used in formal settings",
    "There's a strong tradition of 'Kaffee und Kuchen' (coffee and cake) in the afternoon"
  ]
};

/**
 * Generate a mock translation based on the input text
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - The target language code
 * @returns {string} - The translated text
 */
const generateTranslation = (text, targetLanguage) => {
  // Default to Spanish if the target language is not supported
  const langDict = translations[targetLanguage] || translations.es;
  
  // Split the input text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  // Translate each sentence if it exists in our dictionary, otherwise return the original
  const translatedSentences = sentences.map(sentence => {
    const trimmed = sentence.trim();
    // Check if we have a direct translation
    if (langDict[trimmed]) {
      return langDict[trimmed];
    }
    
    // Check if we have translations for parts of the sentence
    for (const [eng, trans] of Object.entries(langDict)) {
      if (trimmed.includes(eng)) {
        return trimmed.replace(eng, trans);
      }
    }
    
    // If no match, return a placeholder translation
    return `[${trimmed}]`;
  });
  
  return translatedSentences.join(' ');
};

/**
 * Generate mock language learning suggestions
 * @param {Object} params - The parameters for generating suggestions
 * @param {string} params.text - The text to analyze
 * @param {string} params.userLanguage - The user's language
 * @param {string} params.targetLanguage - The target language
 * @param {string} params.proficiencyLevel - The user's proficiency level
 * @param {string} params.focusArea - The focus area for learning
 * @returns {Object} - The generated suggestions
 */
export const generateSuggestions = (params) => {
  const { text, userLanguage, targetLanguage, proficiencyLevel, focusArea } = params;
  
  // Generate a translation
  const translation = generateTranslation(text, targetLanguage);
  
  // Select grammar points based on target language
  const grammar = grammarPoints[targetLanguage] || grammarPoints.es;
  
  // Select vocabulary insights based on target language
  const vocabulary = vocabularyInsights[targetLanguage] || vocabularyInsights.es;
  
  // Select learning suggestions based on focus area
  const suggestions = learningSuggestions[focusArea] || learningSuggestions.general;
  
  // Select cultural tips based on target language
  const cultural = culturalTips[targetLanguage] || culturalTips.es;
  
  // Return the mock suggestions
  return {
    translation,
    grammar,
    vocabulary,
    suggestions,
    cultural
  };
};

export default {
  generateSuggestions
};
