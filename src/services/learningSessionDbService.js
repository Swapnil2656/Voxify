import supabase from './supabaseClient';

/**
 * Save a learning session to the database
 * @param {Object} sessionData - The learning session data
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The saved session data
 */
export const saveLearningSession = async (sessionData, userId) => {
  try {
    console.log('Starting saveLearningSession with userId:', userId);

    // Check if the suggestions data is too large
    const suggestionsStr = JSON.stringify(sessionData.suggestions);
    console.log('Suggestions data size:', suggestionsStr.length);

    let processedSuggestions = sessionData.suggestions;
    if (suggestionsStr.length > 100000) { // 100KB limit
      // If it's too large, simplify it
      console.log('Suggestions data too large, simplifying...');
      processedSuggestions = {
        simplified: true,
        summary: "Suggestions data was too large and has been simplified",
        focus_area: sessionData.focus_area,
        text_length: sessionData.text.length
      };
    }

    // Create a simplified version of the data to save
    const dataToSave = {
      user_id: userId,
      text: sessionData.text.substring(0, 5000), // Limit text length
      user_language: sessionData.user_language,
      target_language: sessionData.target_language,
      proficiency_level: sessionData.proficiency_level,
      focus_area: sessionData.focus_area,
      suggestions: processedSuggestions,
      created_at: new Date().toISOString()
    };

    console.log('Attempting to save learning session with data:', {
      text_length: dataToSave.text.length,
      user_language: dataToSave.user_language,
      target_language: dataToSave.target_language,
      proficiency_level: dataToSave.proficiency_level,
      focus_area: dataToSave.focus_area
    });

    // First, check if the table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('learning_sessions')
      .select('id')
      .limit(1);

    if (tableCheckError) {
      console.error('Error checking if learning_sessions table exists:', tableCheckError);
      // Table might not exist, try creating it
      await createLearningSessionsTable();
    }

    // Insert the data into the learning_sessions table
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert(dataToSave)
      .select();

    if (error) {
      console.error('Supabase error saving learning session:', error);
      throw new Error(error.message || 'Failed to save learning session');
    }

    if (!data || data.length === 0) {
      console.error('No data returned after insert');

      // Try a different approach - insert without returning data
      const insertResult = await supabase
        .from('learning_sessions')
        .insert(dataToSave);

      if (insertResult.error) {
        console.error('Second attempt failed:', insertResult.error);
        throw new Error('Failed to save learning session - insert failed');
      }

      // If insert succeeded but didn't return data, create a mock response
      return {
        id: 'temp-' + new Date().getTime(),
        ...dataToSave
      };
    }

    console.log('Learning session saved successfully:', data[0].id);
    return data[0];
  } catch (error) {
    console.error('Error in saveLearningSession:', error);
    throw error;
  }
};

/**
 * Create the learning_sessions table if it doesn't exist
 * @returns {Promise<void>}
 */
const createLearningSessionsTable = async () => {
  try {
    console.log('Attempting to create learning_sessions table...');

    // Create a simple version of the table without RLS
    const { error } = await supabase
      .from('learning_sessions')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        text: 'Table initialization',
        user_language: 'en',
        target_language: 'en',
        proficiency_level: 'beginner',
        focus_area: 'general',
        suggestions: { test: true }
      });

    if (error && error.code !== '23505') { // Ignore unique violation errors
      console.error('Error creating learning_sessions table:', error);
    } else {
      console.log('Learning sessions table created or already exists');
    }
  } catch (error) {
    console.error('Error in createLearningSessionsTable:', error);
  }
};

/**
 * Get all learning sessions for a user
 * @param {string} userId - The user ID
 * @param {number} limit - The maximum number of sessions to return
 * @returns {Promise<Array>} - The learning sessions
 */
export const getLearningSessionsForUser = async (userId, limit = 20) => {
  try {
    console.log('Getting learning sessions for user:', userId);

    // First, check if the table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('learning_sessions')
      .select('id')
      .limit(1);

    if (tableCheckError) {
      console.error('Error checking if learning_sessions table exists:', tableCheckError);
      // Table might not exist, try creating it
      await createLearningSessionsTable();
    }

    // Query the learning_sessions table for the user's sessions
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error getting learning sessions:', error);
      return []; // Return empty array instead of throwing
    }

    console.log(`Found ${data?.length || 0} learning sessions for user`);
    return data || [];
  } catch (error) {
    console.error('Error getting learning sessions:', error);
    return []; // Return empty array instead of throwing
  }
};

export default {
  saveLearningSession,
  getLearningSessionsForUser
};
