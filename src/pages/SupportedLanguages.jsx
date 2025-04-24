import React from 'react';
import { FaLanguage } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const SupportedLanguages = ({ darkMode, toggleDarkMode }) => {
  // Define language groups
  const languageGroups = [
    {
      region: "European Languages",
      languages: [
        "English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch",
        "Greek", "Russian", "Polish", "Ukrainian", "Czech", "Hungarian", "Swedish",
        "Norwegian", "Danish", "Finnish", "Romanian", "Bulgarian", "Croatian",
        "Serbian", "Slovak", "Slovenian", "Albanian", "Lithuanian", "Latvian",
        "Estonian", "Icelandic", "Maltese", "Welsh", "Irish", "Scottish Gaelic",
        "Catalan", "Basque", "Galician"
      ]
    },
    {
      region: "Asian Languages",
      languages: [
        "Chinese (Simplified)", "Chinese (Traditional)", "Japanese", "Korean",
        "Hindi", "Bengali", "Urdu", "Punjabi", "Tamil", "Telugu", "Marathi",
        "Gujarati", "Kannada", "Malayalam", "Nepali", "Sinhala", "Thai",
        "Vietnamese", "Indonesian", "Malay", "Tagalog", "Khmer", "Lao",
        "Burmese", "Mongolian", "Kazakh", "Uzbek"
      ]
    },
    {
      region: "Middle Eastern Languages",
      languages: [
        "Arabic", "Hebrew", "Persian (Farsi)", "Turkish", "Kurdish",
        "Armenian", "Georgian", "Azerbaijani"
      ]
    },
    {
      region: "African Languages",
      languages: [
        "Swahili", "Amharic", "Hausa", "Yoruba", "Igbo", "Zulu",
        "Xhosa", "Afrikaans", "Somali", "Malagasy", "Kinyarwanda"
      ]
    },
    {
      region: "Other Languages",
      languages: [
        "Hawaiian", "Samoan", "Maori", "Esperanto", "Latin"
      ]
    }
  ];

  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="Supported Languages"
      subtitle="Over 100 languages supported for seamless global communication"
      icon={<FaLanguage size={24} />}
    >
      <h2>Global Communication Made Simple</h2>
      <p>
        Voxify supports over 100 languages, allowing you to communicate with people
        from all corners of the world. Our translation capabilities cover major global
        languages as well as many regional and less commonly spoken languages.
      </p>

      <h3>Translation Features by Language</h3>
      <p>
        While all languages support text translation, some advanced features may vary by language:
      </p>
      <ul>
        <li><strong>Full Support (All Features):</strong> Available for 40+ major languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, and more.</li>
        <li><strong>Standard Support:</strong> Text, speech, and image translation for 70+ additional languages.</li>
        <li><strong>Basic Support:</strong> Text translation only for rare or specialized languages.</li>
      </ul>

      <p>
        We're constantly expanding our language capabilities and improving translation quality
        across all supported languages. If you need a specific language that isn't listed,
        please contact us, and we'll prioritize adding it to our platform.
      </p>

      <h3>Languages by Region</h3>

      <div className="space-y-8">
        {languageGroups.map((group, index) => (
          <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xl font-semibold mb-4 flex items-center text-blue-700 dark:text-blue-400">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mr-2 text-sm font-bold">
                {index + 1}
              </span>
              {group.region}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.languages.map((language, langIndex) => (
                <div
                  key={langIndex}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:shadow-md transition-shadow flex items-center"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  {language}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3>Language Pairs</h3>
      <p>
        Voxify supports direct translation between any pair of supported languages,
        without having to translate through an intermediate language. This ensures higher
        quality translations that preserve the original meaning and context.
      </p>

      <h3>Language Quality</h3>
      <p>
        Translation quality can vary by language pair. Generally:
      </p>
      <ul>
        <li>Translations between major languages (e.g., English, Spanish, French, German, Chinese, Japanese) offer the highest accuracy.</li>
        <li>Translations involving less common languages may occasionally require post-editing for perfect accuracy, especially for specialized content.</li>
      </ul>

      <h3>Specialized Domains</h3>
      <p>
        Voxify offers enhanced translation quality for specific domains in select languages:
      </p>
      <ul>
        <li><strong>Business & Finance</strong></li>
        <li><strong>Medical & Healthcare</strong></li>
        <li><strong>Legal & Contracts</strong></li>
        <li><strong>Technical & IT</strong></li>
        <li><strong>Travel & Hospitality</strong></li>
      </ul>

      <p>
        Our language support is continuously evolving. Check back regularly for updates on newly
        added languages and enhanced features for existing languages.
      </p>
    </FooterPageTemplate>
  );
};

export default SupportedLanguages;
