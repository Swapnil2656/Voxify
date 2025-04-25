import supabase from './supabaseClient';

// Table names
const LEARNING_SESSIONS_TABLE = 'learning_sessions';
const EXERCISES_TABLE = 'learning_exercises';
const CONVERSATION_ANALYSES_TABLE = 'conversation_analyses';

/**
 * Check if a table exists in the database
 * @param {string} tableName - The name of the table to check
 * @returns {Promise<boolean>} - Whether the table exists
 */
const tableExists = async (tableName) => {
  try {
    // Query the information_schema to check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Create the learning_sessions table
 * @returns {Promise<boolean>} - Whether the table was created successfully
 */
const createLearningSessionsTable = async () => {
  try {
    const { error } = await supabase.rpc('create_learning_sessions_table');
    
    if (error) {
      console.error('Error creating learning_sessions table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating learning_sessions table:', error);
    return false;
  }
};

/**
 * Create the learning_exercises table
 * @returns {Promise<boolean>} - Whether the table was created successfully
 */
const createLearningExercisesTable = async () => {
  try {
    const { error } = await supabase.rpc('create_learning_exercises_table');
    
    if (error) {
      console.error('Error creating learning_exercises table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating learning_exercises table:', error);
    return false;
  }
};

/**
 * Create the conversation_analyses table
 * @returns {Promise<boolean>} - Whether the table was created successfully
 */
const createConversationAnalysesTable = async () => {
  try {
    const { error } = await supabase.rpc('create_conversation_analyses_table');
    
    if (error) {
      console.error('Error creating conversation_analyses table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating conversation_analyses table:', error);
    return false;
  }
};

/**
 * Initialize the database by creating the necessary tables if they don't exist
 * @returns {Promise<boolean>} - Whether the database was initialized successfully
 */
export const initDatabase = async () => {
  try {
    // Check if the tables exist
    const learningSessionsExists = await tableExists(LEARNING_SESSIONS_TABLE);
    const learningExercisesExists = await tableExists(EXERCISES_TABLE);
    const conversationAnalysesExists = await tableExists(CONVERSATION_ANALYSES_TABLE);
    
    // Create the tables if they don't exist
    if (!learningSessionsExists) {
      await createLearningSessionsTable();
    }
    
    if (!learningExercisesExists) {
      await createLearningExercisesTable();
    }
    
    if (!conversationAnalysesExists) {
      await createConversationAnalysesTable();
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

export default initDatabase;
