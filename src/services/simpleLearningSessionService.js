import supabase from './supabaseClient';

/**
 * Save a learning session to the database using a simplified approach
 * @param {Object} sessionData - The learning session data
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The saved session data
 */
export const saveSession = async (sessionData, userId) => {
  try {
    console.log('Using simplified approach to save session');
    
    // Simplify the suggestions to avoid JSON issues
    let simplifiedSuggestions;
    
    if (typeof sessionData.suggestions === 'object') {
      // Extract key information from the suggestions object
      simplifiedSuggestions = {
        simplified: true,
        translation: typeof sessionData.suggestions.translation === 'string' 
          ? sessionData.suggestions.translation.substring(0, 500) 
          : 'Translation not available',
        grammar: Array.isArray(sessionData.suggestions.grammar) 
          ? sessionData.suggestions.grammar.slice(0, 3).join(', ') 
          : 'Grammar not available',
        vocabulary: Array.isArray(sessionData.suggestions.vocabulary) 
          ? sessionData.suggestions.vocabulary.slice(0, 3).join(', ') 
          : 'Vocabulary not available'
      };
    } else {
      // If suggestions is not an object, create a simple placeholder
      simplifiedSuggestions = {
        simplified: true,
        note: 'Original suggestions could not be processed'
      };
    }
    
    // Create a minimal version of the data to save
    const minimalData = {
      user_id: userId,
      text: sessionData.text.substring(0, 1000), // Limit text length significantly
      user_language: sessionData.user_language,
      target_language: sessionData.target_language,
      proficiency_level: sessionData.proficiency_level,
      focus_area: sessionData.focus_area,
      suggestions: simplifiedSuggestions,
      created_at: new Date().toISOString()
    };
    
    console.log('Saving minimal session data');
    
    // Insert without returning data
    const { error } = await supabase
      .from('learning_sessions')
      .insert(minimalData);
    
    if (error) {
      console.error('Error in simplified save:', error);
      throw error;
    }
    
    // Return a mock response
    return {
      id: 'temp-' + new Date().getTime(),
      ...minimalData
    };
  } catch (error) {
    console.error('Error in simplified save session:', error);
    throw error;
  }
};

export default {
  saveSession
};
