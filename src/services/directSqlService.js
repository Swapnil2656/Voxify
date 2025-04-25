import supabase from './supabaseClient';

/**
 * Execute a SQL query directly
 * @param {string} sql - The SQL query to execute
 * @returns {Promise<Object>} - The result of the query
 */
export const executeSql = async (sql) => {
  try {
    // Try using the exec_sql RPC function
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL via RPC:', error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in executeSql:', error);
    throw error;
  }
};

/**
 * Create the learning_sessions table using direct SQL
 * @returns {Promise<boolean>} - Whether the table was created successfully
 */
export const createLearningSessionsTableSql = async () => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS learning_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        text TEXT NOT NULL,
        user_language VARCHAR(10) NOT NULL,
        target_language VARCHAR(10) NOT NULL,
        proficiency_level VARCHAR(20) NOT NULL,
        focus_area VARCHAR(50) NOT NULL,
        suggestions JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    await executeSql(sql);
    
    // Create index
    const indexSql = `
      CREATE INDEX IF NOT EXISTS learning_sessions_user_id_idx ON learning_sessions(user_id);
    `;
    
    await executeSql(indexSql);
    
    // Enable RLS
    const rlsSql = `
      ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
    `;
    
    await executeSql(rlsSql);
    
    // Create policies
    const policiesSql = `
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Users can view their own learning sessions" ON learning_sessions;
      DROP POLICY IF EXISTS "Users can insert their own learning sessions" ON learning_sessions;
      DROP POLICY IF EXISTS "Users can update their own learning sessions" ON learning_sessions;
      DROP POLICY IF EXISTS "Users can delete their own learning sessions" ON learning_sessions;

      -- Create new policies
      CREATE POLICY "Users can view their own learning sessions"
        ON learning_sessions
        FOR SELECT
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own learning sessions"
        ON learning_sessions
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own learning sessions"
        ON learning_sessions
        FOR UPDATE
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete their own learning sessions"
        ON learning_sessions
        FOR DELETE
        USING (auth.uid() = user_id);
    `;
    
    await executeSql(policiesSql);
    
    return true;
  } catch (error) {
    console.error('Error creating learning_sessions table via SQL:', error);
    return false;
  }
};

export default {
  executeSql,
  createLearningSessionsTableSql
};
