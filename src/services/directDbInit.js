import supabase from './supabaseClient';

/**
 * Create the learning_exercises table directly
 * @returns {Promise<boolean>} - Whether the table was created successfully
 */
export const createExercisesTable = async () => {
  try {
    // SQL to create the learning_exercises table
    const sql = `
      -- Create learning_exercises table
      CREATE TABLE IF NOT EXISTS learning_exercises (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        text TEXT NOT NULL,
        target_language VARCHAR(10) NOT NULL,
        proficiency_level VARCHAR(20) NOT NULL,
        exercise_type VARCHAR(50) NOT NULL,
        exercises JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS learning_exercises_user_id_idx ON learning_exercises(user_id);

      -- Enable RLS
      ALTER TABLE learning_exercises ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      DO $$
      BEGIN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own exercises" ON learning_exercises;
        DROP POLICY IF EXISTS "Users can insert their own exercises" ON learning_exercises;
        DROP POLICY IF EXISTS "Users can update their own exercises" ON learning_exercises;
        DROP POLICY IF EXISTS "Users can delete their own exercises" ON learning_exercises;

        -- Create new policies
        CREATE POLICY "Users can view their own exercises"
          ON learning_exercises
          FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own exercises"
          ON learning_exercises
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own exercises"
          ON learning_exercises
          FOR UPDATE
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own exercises"
          ON learning_exercises
          FOR DELETE
          USING (auth.uid() = user_id);
      EXCEPTION
        WHEN OTHERS THEN
          -- Ignore errors
          NULL;
      END $$;
    `;

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

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
 * Create the learning_sessions table directly
 * @returns {Promise<boolean>} - Whether the table was created successfully
 */
export const createLearningSessionsTable = async () => {
  try {
    // SQL to create the learning_sessions table
    const sql = `
      -- Create learning_sessions table
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

      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS learning_sessions_user_id_idx ON learning_sessions(user_id);

      -- Enable RLS
      ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      DO $$
      BEGIN
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
      EXCEPTION
        WHEN OTHERS THEN
          -- Ignore errors
          NULL;
      END $$;
    `;

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

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
 * Initialize the database by creating the necessary tables directly
 * @returns {Promise<boolean>} - Whether the database was initialized successfully
 */
export const directDbInit = async () => {
  try {
    // Create the learning_exercises table
    const exercisesTableCreated = await createExercisesTable();

    // Create the learning_sessions table
    const sessionsTableCreated = await createLearningSessionsTable();

    return exercisesTableCreated && sessionsTableCreated;
  } catch (error) {
    console.error('Error initializing database directly:', error);
    return false;
  }
};

export default directDbInit;
