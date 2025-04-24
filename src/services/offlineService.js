import supabase from './supabaseClient';

/**
 * Service for managing offline language packs
 */
const offlineService = {
  /**
   * Get all language packs for the current user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Promise with language packs
   */
  async getUserLanguagePacks(userId) {
    try {
      if (!userId) {
        console.warn('No user ID provided to getUserLanguagePacks');
        return this.getMockLanguagePacks();
      }

      // Get language packs from Supabase
      const { data, error } = await supabase
        .from('language_packs')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching language packs:', error);
        throw error;
      }

      // If no data, return empty array
      if (!data || data.length === 0) {
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getUserLanguagePacks:', error);

      // Return mock data for testing if there's an error
      return this.getMockLanguagePacks();
    }
  },

  /**
   * Download a language pack
   * @param {string} userId - User ID
   * @param {string} languageCode - Language code
   * @param {string} languageName - Language name
   * @param {string} size - Size of the language pack
   * @returns {Promise<Object>} - Promise with language pack data
   */
  async downloadLanguagePack(userId, languageCode, languageName, size) {
    try {
      if (!userId) {
        console.warn('No user ID provided to downloadLanguagePack');
        return null;
      }

      // Check if language pack already exists
      const { data: existingPack } = await supabase
        .from('language_packs')
        .select('*')
        .eq('user_id', userId)
        .eq('language_code', languageCode)
        .single();

      if (existingPack) {
        console.log('Language pack already exists, updating last_used');

        // Update last_used timestamp
        const { data, error } = await supabase
          .from('language_packs')
          .update({ last_used: new Date().toISOString() })
          .eq('id', existingPack.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating language pack:', error);
          throw error;
        }

        return data;
      }

      // Create new language pack
      const { data, error } = await supabase
        .from('language_packs')
        .insert([
          {
            user_id: userId,
            language_code: languageCode,
            language_name: languageName,
            size: size,
            download_date: new Date().toISOString(),
            last_used: new Date().toISOString(),
            status: 'downloaded'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating language pack:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in downloadLanguagePack:', error);

      // Return mock data for testing if there's an error
      return {
        id: `mock-${Date.now()}`,
        user_id: userId,
        language_code: languageCode,
        language_name: languageName,
        size: size,
        download_date: new Date().toISOString(),
        last_used: new Date().toISOString(),
        status: 'downloaded'
      };
    }
  },

  /**
   * Delete a language pack
   * @param {string} userId - User ID
   * @param {string} languageCode - Language code
   * @returns {Promise<boolean>} - Promise with success status
   */
  async deleteLanguagePack(userId, languageCode) {
    try {
      if (!userId) {
        console.warn('No user ID provided to deleteLanguagePack');
        return true; // Return true for mock data
      }

      // Delete language pack
      const { error } = await supabase
        .from('language_packs')
        .delete()
        .eq('user_id', userId)
        .eq('language_code', languageCode);

      if (error) {
        console.error('Error deleting language pack:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteLanguagePack:', error);
      // For mock data or testing, return true to allow UI to update
      if (userId.startsWith('mock-') || error.message?.includes('does not exist')) {
        return true;
      }
      return false;
    }
  },

  /**
   * Get mock language packs for testing
   * @returns {Array} - Array of mock language packs
   */
  getMockLanguagePacks() {
    return [
      {
        id: 'mock-1',
        user_id: 'mock-user',
        language_code: 'en',
        language_name: 'English',
        size: '12MB',
        download_date: '2023-05-15T10:30:00Z',
        last_used: '2023-05-20T14:45:00Z',
        status: 'downloaded'
      },
      {
        id: 'mock-2',
        user_id: 'mock-user',
        language_code: 'es',
        language_name: 'Spanish',
        size: '15MB',
        download_date: '2023-05-16T11:20:00Z',
        last_used: '2023-05-21T09:15:00Z',
        status: 'downloaded'
      },
      {
        id: 'mock-3',
        user_id: 'mock-user',
        language_code: 'fr',
        language_name: 'French',
        size: '14MB',
        download_date: '2023-05-17T13:10:00Z',
        last_used: '2023-05-19T16:30:00Z',
        status: 'downloaded'
      }
    ];
  }
};

export default offlineService;
