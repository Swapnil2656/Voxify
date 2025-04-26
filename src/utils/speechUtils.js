// Speech synthesis utility functions

// Map language codes to BCP 47 language tags for speech synthesis
// This helps ensure compatibility with the SpeechSynthesis API
export const getSpeechSynthesisLanguage = (languageCode) => {
  // Map of language codes to BCP 47 language tags
  const languageMap = {
    // Common languages
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-PT',
    'ru': 'ru-RU',
    'zh': 'zh-CN',
    'zh-TW': 'zh-TW',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'ar': 'ar-SA',
    'hi': 'hi-IN',

    // European languages
    'nl': 'nl-NL',
    'el': 'el-GR',
    'hu': 'hu-HU',
    'pl': 'pl-PL',
    'ro': 'ro-RO',
    'sv': 'sv-SE',
    'da': 'da-DK',
    'fi': 'fi-FI',
    'cs': 'cs-CZ',
    'sk': 'sk-SK',
    'uk': 'uk-UA',
    'no': 'nb-NO',
    'bg': 'bg-BG',
    'hr': 'hr-HR',
    'sr': 'sr-RS',
    'sl': 'sl-SI',
    'et': 'et-EE',
    'lv': 'lv-LV',
    'lt': 'lt-LT',
    'tr': 'tr-TR',

    // Asian languages
    'th': 'th-TH',
    'vi': 'vi-VN',
    'id': 'id-ID',
    'ms': 'ms-MY',
    'tl': 'fil-PH',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'ml': 'ml-IN',
    'kn': 'kn-IN',
    'mr': 'mr-IN',
    'gu': 'gu-IN',
    'pa': 'pa-IN',
    'ur': 'ur-PK',
    'ne': 'ne-NP',
    'si': 'si-LK',
    'km': 'km-KH',
    'lo': 'lo-LA',
    'my': 'my-MM',
    'mn': 'mn-MN',

    // Middle Eastern languages
    'he': 'he-IL',
    'fa': 'fa-IR',
    'ps': 'ps-AF',
    'ku': 'ku-TR',
    'hy': 'hy-AM',
    'ka': 'ka-GE',

    // African languages
    'am': 'am-ET',
    'ha': 'ha-NG',
    'ig': 'ig-NG',
    'yo': 'yo-NG',
    'zu': 'zu-ZA',
    'xh': 'xh-ZA',
    'sw': 'sw-KE',
    'so': 'so-SO',
    'mg': 'mg-MG',

    // Other languages
    'is': 'is-IS',
    'mt': 'mt-MT',
    'cy': 'cy-GB',
    'ga': 'ga-IE',
    'gd': 'gd-GB',
    'gl': 'gl-ES',
    'ca': 'ca-ES',
    'eu': 'eu-ES',
    'la': 'la',
    'eo': 'eo',
    'jv': 'jv-ID',
    'su': 'su-ID',
    'haw': 'haw-US',
    'mi': 'mi-NZ',
    'sa': 'sa-IN',
    'yi': 'yi',
    'ht': 'ht-HT',
    'lb': 'lb-LU',
    'mk': 'mk-MK',
    'az': 'az-AZ',
    'be': 'be-BY',
    'fy': 'fy-NL',
    'kk': 'kk-KZ',
    'ky': 'ky-KG',
    'tg': 'tg-TJ',
    'tk': 'tk-TM',
    'uz': 'uz-UZ',
  };

  return languageMap[languageCode] || languageCode;
};

// Check if a language is supported by the browser's speech synthesis
export const isSpeechSynthesisLanguageSupported = (languageCode) => {
  if (!window.speechSynthesis) return false;

  const voices = window.speechSynthesis.getVoices();
  const langTag = getSpeechSynthesisLanguage(languageCode);

  // First try exact match
  const exactMatch = voices.some(voice => voice.lang === langTag);
  if (exactMatch) return true;

  // Then try language match without region (e.g., 'en' instead of 'en-US')
  const langBase = langTag.split('-')[0];
  return voices.some(voice => voice.lang.startsWith(langBase + '-'));
};

// Get the best available voice for a language
export const getBestVoiceForLanguage = (languageCode) => {
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const langTag = getSpeechSynthesisLanguage(languageCode);

  // Try to find an exact match first
  let voice = voices.find(voice => voice.lang === langTag);

  // If no exact match, try to find a voice that matches the base language
  if (!voice) {
    const langBase = langTag.split('-')[0];
    voice = voices.find(voice => voice.lang.startsWith(langBase + '-'));
  }

  // If still no match, return null
  return voice || null;
};

// Speak text using the browser's speech synthesis
export const speakText = (text, languageCode, onEnd = () => {}) => {
  if (!window.speechSynthesis) {
    console.error('Speech synthesis not supported');
    onEnd();
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getSpeechSynthesisLanguage(languageCode);

  // Try to get the best voice for the language
  const voice = getBestVoiceForLanguage(languageCode);
  if (voice) {
    utterance.voice = voice;
  }

  // Set event handlers
  utterance.onend = onEnd;
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    onEnd();
  };

  // Fix for Chrome issue where speech synthesis stops after ~15 seconds
  // This is a known bug in Chrome's implementation
  const resumeInfinity = () => {
    // Resume if paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  // Keep checking and resuming if needed
  const intervalId = setInterval(resumeInfinity, 1000);

  // Clear interval when speech ends
  utterance.onend = () => {
    clearInterval(intervalId);
    onEnd();
  };

  utterance.onerror = (event) => {
    clearInterval(intervalId);
    console.error('Speech synthesis error:', event);
    onEnd();
  };

  // Speak the text
  window.speechSynthesis.speak(utterance);
  return true;
};

// Fallback text-to-speech using a more user-friendly approach
export const fallbackTextToSpeech = (text, languageCode) => {
  console.log(`Using fallback text-to-speech for ${languageCode}: "${text}"`);

  // Try to use any available voice, even if it's not the right language
  if (window.speechSynthesis) {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Get all available voices
      const voices = window.speechSynthesis.getVoices();

      // If we have any voices, use the default one
      if (voices && voices.length > 0) {
        // Try to find a voice that at least matches the language family
        const langBase = languageCode.split('-')[0];
        const similarVoice = voices.find(voice => voice.lang.startsWith(langBase));

        // Use a similar voice or the default voice
        utterance.voice = similarVoice || voices[0];

        // Fix for Chrome issue where speech synthesis stops after ~15 seconds
        const resumeInfinity = () => {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        };

        // Keep checking and resuming if needed
        const intervalId = setInterval(resumeInfinity, 1000);

        // Clear interval when speech ends
        utterance.onend = () => {
          clearInterval(intervalId);
        };

        utterance.onerror = () => {
          clearInterval(intervalId);
        };

        // Speak the text
        window.speechSynthesis.speak(utterance);
        return true;
      }
    } catch (err) {
      console.error('Fallback speech synthesis error:', err);
    }
  }

  // If browser speech synthesis fails, try using the Web Audio API
  try {
    // Create a simple beep sound to indicate that text-to-speech would have played
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.1; // Lower volume

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 300);
  } catch (audioErr) {
    console.error('Web Audio API error:', audioErr);
  }

  // Show a notification with the translated text
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  notification.style.color = 'white';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '5px';
  notification.style.maxWidth = '300px';
  notification.style.zIndex = '9999';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  notification.textContent = `Translation: ${text}`;

  document.body.appendChild(notification);

  // Remove the notification after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);

  return true;
};
