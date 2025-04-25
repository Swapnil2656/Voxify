import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../services/supabaseClient';
import { initDatabase } from '../services/initDatabase';

// Table names
const LEARNING_SESSIONS_TABLE = 'learning_sessions';
const EXERCISES_TABLE = 'learning_exercises';
const CONVERSATION_ANALYSES_TABLE = 'conversation_analyses';

/**
 * Custom hook for accessing the AI Learning Hub database
 * @returns {Object} - Database operations and state
 */
export const useLearningHubDb = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize the database when the hook is first used
  useEffect(() => {
    const initDb = async () => {
      try {
        const success = await initDatabase();
        setDbInitialized(success);
        if (!success) {
          console.error('Failed to initialize database');
          setError('Failed to initialize database');
        }
      } catch (err) {
        console.error('Error initializing database:', err);
        setError('Error initializing database: ' + (err.message || 'Unknown error'));
      }
    };

    initDb();
  }, []);

  // Reset error when auth state changes
  useEffect(() => {
    setError(null);
  }, [user]);

  /**
   * Save a learning session to the database
   * @param {Object} sessionData - The learning session data
   * @returns {Promise<Object>} - The saved session data
   */
  const saveLearningSession = async (sessionData) => {
    if (!isAuthenticated()) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Add user_id and created_at to the session data
      const dataToSave = {
        ...sessionData,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      // Insert the data into the learning_sessions table
      const { data, error } = await supabase
        .from(LEARNING_SESSIONS_TABLE)
        .insert(dataToSave)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('Error saving learning session:', error);
      setError(error.message || 'Failed to save learning session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all learning sessions for the current user
   * @param {number} limit - The maximum number of sessions to return
   * @returns {Promise<Array>} - The learning sessions
   */
  const getLearningSessionsForUser = async (limit = 20) => {
    if (!isAuthenticated()) {
      setError('User not authenticated');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Query the learning_sessions table for the user's sessions
      const { data, error } = await supabase
        .from(LEARNING_SESSIONS_TABLE)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting learning sessions:', error);
      setError(error.message || 'Failed to get learning sessions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save an exercise to the database
   * @param {Object} exerciseData - The exercise data
   * @returns {Promise<Object>} - The saved exercise data
   */
  const saveExercise = async (exerciseData) => {
    if (!isAuthenticated()) {
      setError('User not authenticated');
      return null;
    }

    if (!dbInitialized) {
      setError('Database not initialized');
      return null;
    }

    setLoading(true);
    setError(null);

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
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      console.log('Saving exercise data:', dataToSave);

      // Insert the data into the learning_exercises table
      const { data, error } = await supabase
        .from(EXERCISES_TABLE)
        .insert(dataToSave)
        .select();

      if (error) {
        console.error('Supabase error saving exercise:', error);
        throw new Error(error.message || 'Failed to save exercise');
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from database');
      }

      console.log('Exercise saved successfully:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Error saving exercise:', error);
      setError(error.message || 'Failed to save exercise');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all exercises for the current user
   * @param {number} limit - The maximum number of exercises to return
   * @returns {Promise<Array>} - The exercises
   */
  const getExercisesForUser = async (limit = 20) => {
    if (!isAuthenticated()) {
      setError('User not authenticated');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Query the learning_exercises table for the user's exercises
      const { data, error } = await supabase
        .from(EXERCISES_TABLE)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting exercises:', error);
      setError(error.message || 'Failed to get exercises');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save a conversation analysis to the database
   * @param {Object} analysisData - The conversation analysis data
   * @returns {Promise<Object>} - The saved analysis data
   */
  const saveConversationAnalysis = async (analysisData) => {
    if (!isAuthenticated()) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Add user_id and created_at to the analysis data
      const dataToSave = {
        ...analysisData,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      // Insert the data into the conversation_analyses table
      const { data, error } = await supabase
        .from(CONVERSATION_ANALYSES_TABLE)
        .insert(dataToSave)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('Error saving conversation analysis:', error);
      setError(error.message || 'Failed to save conversation analysis');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all conversation analyses for the current user
   * @param {number} limit - The maximum number of analyses to return
   * @returns {Promise<Array>} - The conversation analyses
   */
  const getConversationAnalysesForUser = async (limit = 20) => {
    if (!isAuthenticated()) {
      setError('User not authenticated');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Query the conversation_analyses table for the user's analyses
      const { data, error } = await supabase
        .from(CONVERSATION_ANALYSES_TABLE)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting conversation analyses:', error);
      setError(error.message || 'Failed to get conversation analyses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveLearningSession,
    getLearningSessionsForUser,
    saveExercise,
    getExercisesForUser,
    saveConversationAnalysis,
    getConversationAnalysesForUser
  };
};

export default useLearningHubDb;
