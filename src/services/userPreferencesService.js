import supabase from './supabaseClient';

/**
 * User preferences service using Supabase
 */
const userPreferencesService = {
  /**
   * Get user preferences
   * @returns {Promise} - Promise with user preferences or default values
   */
  async getPreferences() {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        // If user is not logged in, get from localStorage
        return this.getLocalPreferences();
      }

      // If user is logged in, get from database
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no preferences found, return default values
        if (error.code === 'PGRST116') {
          return this.getLocalPreferences();
        }
        throw error;
      }

      // Return preferences
      return {
        darkMode: data.dark_mode,
        sourceLanguage: data.source_language || 'en',
        targetLanguage: data.target_language || 'es',
        voiceSpeed: data.voice_speed || 1,
        fontSize: data.font_size || 'medium',
        autoDetectLanguage: data.auto_detect_language || true,
        saveHistory: data.save_history || true
      };
    } catch (error) {
      console.error('Error getting preferences:', error.message);
      // Fallback to localStorage
      return this.getLocalPreferences();
    }
  },

  /**
   * Save user preferences
   * @param {object} preferences - User preferences
   * @returns {Promise} - Promise with success or error
   */
  async savePreferences(preferences) {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      // Always save to localStorage as a backup
      this.saveLocalPreferences(preferences);

      if (!userId) {
        // If user is not logged in, just save to localStorage
        return { success: true };
      }

      // If user is logged in, save to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          dark_mode: preferences.darkMode,
          source_language: preferences.sourceLanguage || 'en',
          target_language: preferences.targetLanguage || 'es',
          voice_speed: preferences.voiceSpeed || 1,
          font_size: preferences.fontSize || 'medium',
          auto_detect_language: preferences.autoDetectLanguage || true,
          save_history: preferences.saveHistory || true
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving preferences:', error.message);
      // Still save to localStorage even if database save fails
      this.saveLocalPreferences(preferences);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get preferences from localStorage
   * @returns {object} - User preferences from localStorage or default values
   */
  getLocalPreferences() {
    const defaultPreferences = {
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      sourceLanguage: 'en',
      targetLanguage: 'es',
      voiceSpeed: 1,
      fontSize: 'medium',
      autoDetectLanguage: true,
      saveHistory: true
    };

    try {
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        return { ...defaultPreferences, ...JSON.parse(storedPreferences) };
      }
      return defaultPreferences;
    } catch (error) {
      console.error('Error reading preferences from localStorage:', error.message);
      return defaultPreferences;
    }
  },

  /**
   * Save preferences to localStorage
   * @param {object} preferences - User preferences
   */
  saveLocalPreferences(preferences) {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error.message);
    }
  }
};

export default userPreferencesService;
