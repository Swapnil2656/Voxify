import supabase from './supabaseClient';
import { useAuth } from '../context/AuthContext';

// Database service for AI Learning Hub
// This service handles all database operations for the learning hub

// Table names
const LEARNING_SESSIONS_TABLE = 'learning_sessions';
const EXERCISES_TABLE = 'learning_exercises';
const CONVERSATION_ANALYSES_TABLE = 'conversation_analyses';

/**
 * Save a learning session to the database
 * @param {Object} sessionData - The learning session data
 * @returns {Promise<Object>} - The saved session data
 */
export const saveLearningSession = async (sessionData) => {
  try {
    // Get the current user
    const { user } = useAuth();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
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
    throw error;
  }
};

/**
 * Get all learning sessions for the current user
 * @param {number} limit - The maximum number of sessions to return
 * @returns {Promise<Array>} - The learning sessions
 */
export const getLearningSessionsForUser = async (limit = 20) => {
  try {
    // Get the current user
    const { user } = useAuth();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
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
    throw error;
  }
};

/**
 * Save an exercise to the database
 * @param {Object} exerciseData - The exercise data
 * @returns {Promise<Object>} - The saved exercise data
 */
export const saveExercise = async (exerciseData) => {
  try {
    // Get the current user
    const { user } = useAuth();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Add user_id and created_at to the exercise data
    const dataToSave = {
      ...exerciseData,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };
    
    // Insert the data into the learning_exercises table
    const { data, error } = await supabase
      .from(EXERCISES_TABLE)
      .insert(dataToSave)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error saving exercise:', error);
    throw error;
  }
};

/**
 * Get all exercises for the current user
 * @param {number} limit - The maximum number of exercises to return
 * @returns {Promise<Array>} - The exercises
 */
export const getExercisesForUser = async (limit = 20) => {
  try {
    // Get the current user
    const { user } = useAuth();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
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
    throw error;
  }
};

/**
 * Save a conversation analysis to the database
 * @param {Object} analysisData - The conversation analysis data
 * @returns {Promise<Object>} - The saved analysis data
 */
export const saveConversationAnalysis = async (analysisData) => {
  try {
    // Get the current user
    const { user } = useAuth();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
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
    throw error;
  }
};

/**
 * Get all conversation analyses for the current user
 * @param {number} limit - The maximum number of analyses to return
 * @returns {Promise<Array>} - The conversation analyses
 */
export const getConversationAnalysesForUser = async (limit = 20) => {
  try {
    // Get the current user
    const { user } = useAuth();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
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
    throw error;
  }
};

export default {
  saveLearningSession,
  getLearningSessionsForUser,
  saveExercise,
  getExercisesForUser,
  saveConversationAnalysis,
  getConversationAnalysesForUser
};
