import offlineService from './offlineService';
import authService from './authService';

// Basic offline translation dictionaries
const offlineDictionaries = {
  'en-es': {
    'hello': 'hola',
    'goodbye': 'adiós',
    'thank you': 'gracias',
    'please': 'por favor',
    'yes': 'sí',
    'no': 'no',
    'excuse me': 'disculpe',
    'sorry': 'lo siento',
    'help': 'ayuda',
    'water': 'agua',
    'food': 'comida',
    'restaurant': 'restaurante',
    'hotel': 'hotel',
    'airport': 'aeropuerto',
    'train': 'tren',
    'bus': 'autobús',
    'taxi': 'taxi',
    'bathroom': 'baño',
    'hospital': 'hospital',
    'pharmacy': 'farmacia',
    'doctor': 'médico',
    'police': 'policía',
    'emergency': 'emergencia',
    'how much': 'cuánto',
    'where is': 'dónde está',
    'when': 'cuándo',
    'today': 'hoy',
    'tomorrow': 'mañana',
    'yesterday': 'ayer'
  },
  'en-fr': {
    'hello': 'bonjour',
    'goodbye': 'au revoir',
    'thank you': 'merci',
    'please': 's\'il vous plaît',
    'yes': 'oui',
    'no': 'non',
    'excuse me': 'excusez-moi',
    'sorry': 'désolé',
    'help': 'aide',
    'water': 'eau',
    'food': 'nourriture',
    'restaurant': 'restaurant',
    'hotel': 'hôtel',
    'airport': 'aéroport',
    'train': 'train',
    'bus': 'bus',
    'taxi': 'taxi',
    'bathroom': 'toilettes',
    'hospital': 'hôpital',
    'pharmacy': 'pharmacie',
    'doctor': 'médecin',
    'police': 'police',
    'emergency': 'urgence',
    'how much': 'combien',
    'where is': 'où est',
    'when': 'quand',
    'today': 'aujourd\'hui',
    'tomorrow': 'demain',
    'yesterday': 'hier'
  },
  'en-de': {
    'hello': 'hallo',
    'goodbye': 'auf wiedersehen',
    'thank you': 'danke',
    'please': 'bitte',
    'yes': 'ja',
    'no': 'nein',
    'excuse me': 'entschuldigung',
    'sorry': 'es tut mir leid',
    'help': 'hilfe',
    'water': 'wasser',
    'food': 'essen',
    'restaurant': 'restaurant',
    'hotel': 'hotel',
    'airport': 'flughafen',
    'train': 'zug',
    'bus': 'bus',
    'taxi': 'taxi',
    'bathroom': 'badezimmer',
    'hospital': 'krankenhaus',
    'pharmacy': 'apotheke',
    'doctor': 'arzt',
    'police': 'polizei',
    'emergency': 'notfall',
    'how much': 'wie viel',
    'where is': 'wo ist',
    'when': 'wann',
    'today': 'heute',
    'tomorrow': 'morgen',
    'yesterday': 'gestern'
  },
  'en-it': {
    'hello': 'ciao',
    'goodbye': 'arrivederci',
    'thank you': 'grazie',
    'please': 'per favore',
    'yes': 'sì',
    'no': 'no',
    'excuse me': 'scusi',
    'sorry': 'mi dispiace',
    'help': 'aiuto',
    'water': 'acqua',
    'food': 'cibo',
    'restaurant': 'ristorante',
    'hotel': 'albergo',
    'airport': 'aeroporto',
    'train': 'treno',
    'bus': 'autobus',
    'taxi': 'taxi',
    'bathroom': 'bagno',
    'hospital': 'ospedale',
    'pharmacy': 'farmacia',
    'doctor': 'medico',
    'police': 'polizia',
    'emergency': 'emergenza',
    'how much': 'quanto',
    'where is': 'dov\'è',
    'when': 'quando',
    'today': 'oggi',
    'tomorrow': 'domani',
    'yesterday': 'ieri'
  },
  'en-hi': {
    'hello': 'नमस्ते',
    'goodbye': 'अलविदा',
    'thank you': 'धन्यवाद',
    'please': 'कृपया',
    'yes': 'हां',
    'no': 'नहीं',
    'excuse me': 'क्षमा करें',
    'sorry': 'माफ़ कीजिए',
    'help': 'मदद',
    'water': 'पानी',
    'food': 'खाना',
    'restaurant': 'रेस्तरां',
    'hotel': 'होटल',
    'airport': 'हवाई अड्डा',
    'train': 'ट्रेन',
    'bus': 'बस',
    'taxi': 'टैक्सी',
    'bathroom': 'बाथरूम',
    'hospital': 'अस्पताल',
    'pharmacy': 'फार्मेसी',
    'doctor': 'डॉक्टर',
    'police': 'पुलिस',
    'emergency': 'आपातकाल',
    'how much': 'कितना',
    'where is': 'कहां है',
    'when': 'कब',
    'today': 'आज',
    'tomorrow': 'कल',
    'yesterday': 'कल'
  }
};

// Check if a language pack is available for the given language pair
const isLanguagePackAvailable = async (sourceLanguage, targetLanguage) => {
  try {
    // Get current user
    const user = await authService.getCurrentUser();
    if (!user) {
      console.log('No user found, offline translation not available');
      return false;
    }

    // Get downloaded language packs
    const packs = await offlineService.getUserLanguagePacks(user.id);
    if (!packs || packs.length === 0) {
      console.log('No language packs found');
      return false;
    }

    // Check if the target language is available
    const targetPack = packs.find(pack => pack.language_code === targetLanguage);
    if (!targetPack) {
      console.log(`No language pack found for ${targetLanguage}`);
      return false;
    }

    // Update last_used timestamp
    if (targetPack.id && !targetPack.id.startsWith('mock-')) {
      try {
        await offlineService.downloadLanguagePack(
          user.id,
          targetPack.language_code,
          targetPack.language_name,
          targetPack.size
        );
      } catch (error) {
        console.error('Error updating last_used timestamp:', error);
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking language pack availability:', error);
    return false;
  }
};

// Get all available offline language packs
const getAvailableOfflineLanguages = async () => {
  try {
    // Get current user
    const user = await authService.getCurrentUser();
    if (!user) {
      console.log('No user found, offline translation not available');
      return [];
    }

    // Get downloaded language packs
    const packs = await offlineService.getUserLanguagePacks(user.id);
    if (!packs || packs.length === 0) {
      console.log('No language packs found');
      return [];
    }

    return packs.map(pack => pack.language_code);
  } catch (error) {
    console.error('Error getting available offline languages:', error);
    return [];
  }
};

// Perform offline translation
const translateOffline = async (text, sourceLanguage, targetLanguage) => {
  try {
    // Check if the language pack is available
    const isAvailable = await isLanguagePackAvailable(sourceLanguage, targetLanguage);
    if (!isAvailable) {
      throw new Error('Language pack not available for offline translation');
    }

    // For now, we'll use a simple dictionary-based approach
    const dictionaryKey = `${sourceLanguage}-${targetLanguage}`;
    const dictionary = offlineDictionaries[dictionaryKey];

    if (!dictionary) {
      throw new Error(`No offline dictionary available for ${sourceLanguage} to ${targetLanguage}`);
    }

    // Simple word-by-word translation
    const words = text.toLowerCase().split(' ');
    const translatedWords = words.map(word => {
      // Check if the word is in the dictionary
      if (dictionary[word]) {
        return dictionary[word];
      }

      // Check if any phrase in the dictionary contains this word
      for (const [phrase, translation] of Object.entries(dictionary)) {
        if (phrase.split(' ').includes(word)) {
          return translation;
        }
      }

      // If not found, return the original word
      return word;
    });

    return translatedWords.join(' ');
  } catch (error) {
    console.error('Error performing offline translation:', error);
    throw error;
  }
};

const offlineTranslationService = {
  isLanguagePackAvailable,
  getAvailableOfflineLanguages,
  translateOffline
};

export default offlineTranslationService;
