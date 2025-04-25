import supabase from './supabaseClient';

/**
 * Save an exercise to the database
 * @param {Object} exerciseData - The exercise data
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The saved exercise data
 */
export const saveExercise = async (exerciseData, userId) => {
  try {
    // Check if the exercises data is too large
    const exercisesStr = JSON.stringify(exerciseData.exercises);
    if (exercisesStr.length > 100000) { // 100KB limit
      // If it's too large, simplify it
      const simplifiedExercises = {
        simplified: true,
        summary: "Exercise data was too large and has been simplified",
        type: exerciseData.exercise_type,
        text_length: exerciseData.text.length
      };
      exerciseData.exercises = simplifiedExercises;
    }
    
    // Add user_id and created_at to the exercise data
    const dataToSave = {
      ...exerciseData,
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    
    console.log('Saving exercise data:', {
      text_length: dataToSave.text.length,
      target_language: dataToSave.target_language,
      proficiency_level: dataToSave.proficiency_level,
      exercise_type: dataToSave.exercise_type,
      exercises_size: JSON.stringify(dataToSave.exercises).length
    });
    
    // Insert the data into the learning_exercises table
    const { data, error } = await supabase
      .from('learning_exercises')
      .insert(dataToSave)
      .select();
    
    if (error) {
      console.error('Supabase error saving exercise:', error);
      throw new Error(error.message || 'Failed to save exercise');
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned from database');
    }
    
    console.log('Exercise saved successfully:', data[0].id);
    return data[0];
  } catch (error) {
    console.error('Error saving exercise:', error);
    throw error;
  }
};

/**
 * Get all exercises for a user
 * @param {string} userId - The user ID
 * @param {number} limit - The maximum number of exercises to return
 * @returns {Promise<Array>} - The exercises
 */
export const getExercisesForUser = async (userId, limit = 20) => {
  try {
    // Query the learning_exercises table for the user's exercises
    const { data, error } = await supabase
      .from('learning_exercises')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Supabase error getting exercises:', error);
      throw new Error(error.message || 'Failed to get exercises');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting exercises:', error);
    throw error;
  }
};

export default {
  saveExercise,
  getExercisesForUser
};
