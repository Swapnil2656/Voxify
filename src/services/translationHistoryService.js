import supabase from './supabaseClient';

/**
 * Translation history service using Supabase
 */
const translationHistoryService = {
  /**
   * Save a translation to history
   * @param {object} translation - Translation data
   * @returns {Promise} - Promise with saved translation or error
   */
  async saveTranslation(translation) {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        // If user is not logged in, store in localStorage
        const localHistory = JSON.parse(localStorage.getItem('translationHistory') || '[]');
        const newTranslation = {
          id: Date.now().toString(),
          sourceLanguage: translation.sourceLanguage,
          targetLanguage: translation.targetLanguage,
          inputText: translation.inputText,
          translatedText: translation.translatedText,
          type: translation.type || 'text',
          timestamp: new Date().toISOString()
        };
        
        localHistory.unshift(newTranslation);
        
        // Limit history size to 100 items
        if (localHistory.length > 100) {
          localHistory.pop();
        }
        
        localStorage.setItem('translationHistory', JSON.stringify(localHistory));
        return newTranslation;
      }

      // If user is logged in, store in database
      const { data, error } = await supabase
        .from('translation_history')
        .insert({
          user_id: userId,
          source_language: translation.sourceLanguage,
          target_language: translation.targetLanguage,
          input_text: translation.inputText,
          translated_text: translation.translatedText,
          type: translation.type || 'text'
        })
        .select();

      if (error) throw error;
      
      // Transform to match the expected format
      return {
        id: data[0].id,
        sourceLanguage: data[0].source_language,
        targetLanguage: data[0].target_language,
        inputText: data[0].input_text,
        translatedText: data[0].translated_text,
        type: data[0].type,
        timestamp: data[0].created_at
      };
    } catch (error) {
      console.error('Error saving translation to history:', error.message);
      // Fallback to localStorage
      return this.saveTranslationToLocalStorage(translation);
    }
  },

  /**
   * Get translation history
   * @param {number} limit - Maximum number of translations to return
   * @returns {Promise} - Promise with translation history or error
   */
  async getHistory(limit = 100) {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        // If user is not logged in, get from localStorage
        return this.getLocalHistory(limit);
      }

      // If user is logged in, get from database
      const { data, error } = await supabase
        .from('translation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform to match the expected format
      return data.map(item => ({
        id: item.id,
        sourceLanguage: item.source_language,
        targetLanguage: item.target_language,
        inputText: item.input_text,
        translatedText: item.translated_text,
        type: item.type,
        timestamp: item.created_at
      }));
    } catch (error) {
      console.error('Error getting translation history:', error.message);
      // Fallback to localStorage
      return this.getLocalHistory(limit);
    }
  },

  /**
   * Clear translation history
   * @returns {Promise} - Promise with success or error
   */
  async clearHistory() {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        // If user is not logged in, clear localStorage
        localStorage.removeItem('translationHistory');
        return { success: true };
      }

      // If user is logged in, clear from database
      const { error } = await supabase
        .from('translation_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error clearing translation history:', error.message);
      throw error;
    }
  },

  /**
   * Delete a translation from history
   * @param {string} id - Translation ID
   * @returns {Promise} - Promise with success or error
   */
  async deleteTranslation(id) {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        // If user is not logged in, delete from localStorage
        const localHistory = JSON.parse(localStorage.getItem('translationHistory') || '[]');
        const updatedHistory = localHistory.filter(item => item.id !== id);
        localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
        return { success: true };
      }

      // If user is logged in, delete from database
      const { error } = await supabase
        .from('translation_history')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting translation from history:', error.message);
      throw error;
    }
  },

  /**
   * Save translation to localStorage
   * @param {object} translation - Translation data
   * @returns {object} - Saved translation
   */
  saveTranslationToLocalStorage(translation) {
    try {
      const localHistory = JSON.parse(localStorage.getItem('translationHistory') || '[]');
      const newTranslation = {
        id: Date.now().toString(),
        sourceLanguage: translation.sourceLanguage,
        targetLanguage: translation.targetLanguage,
        inputText: translation.inputText,
        translatedText: translation.translatedText,
        type: translation.type || 'text',
        timestamp: new Date().toISOString()
      };
      
      localHistory.unshift(newTranslation);
      
      // Limit history size to 100 items
      if (localHistory.length > 100) {
        localHistory.pop();
      }
      
      localStorage.setItem('translationHistory', JSON.stringify(localHistory));
      return newTranslation;
    } catch (error) {
      console.error('Error saving translation to localStorage:', error.message);
      return translation;
    }
  },

  /**
   * Get translation history from localStorage
   * @param {number} limit - Maximum number of translations to return
   * @returns {array} - Translation history
   */
  getLocalHistory(limit = 100) {
    try {
      const localHistory = JSON.parse(localStorage.getItem('translationHistory') || '[]');
      return localHistory.slice(0, limit);
    } catch (error) {
      console.error('Error getting translation history from localStorage:', error.message);
      return [];
    }
  }
};

export default translationHistoryService;
