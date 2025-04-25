-- Create stored procedure to create the learning_sessions table
CREATE OR REPLACE FUNCTION create_learning_sessions_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create learning_sessions table if it doesn't exist
  CREATE TABLE IF NOT EXISTS learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    user_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    proficiency_level VARCHAR(20) NOT NULL,
    focus_area VARCHAR(50) NOT NULL,
    suggestions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Add RLS (Row Level Security) policies to learning_sessions
  ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own learning sessions" ON learning_sessions;
  DROP POLICY IF EXISTS "Users can insert their own learning sessions" ON learning_sessions;
  DROP POLICY IF EXISTS "Users can update their own learning sessions" ON learning_sessions;
  DROP POLICY IF EXISTS "Users can delete their own learning sessions" ON learning_sessions;

  -- Policy: Users can only view their own learning sessions
  CREATE POLICY "Users can view their own learning sessions"
    ON learning_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

  -- Policy: Users can only insert their own learning sessions
  CREATE POLICY "Users can insert their own learning sessions"
    ON learning_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  -- Policy: Users can only update their own learning sessions
  CREATE POLICY "Users can update their own learning sessions"
    ON learning_sessions
    FOR UPDATE
    USING (auth.uid() = user_id);

  -- Policy: Users can only delete their own learning sessions
  CREATE POLICY "Users can delete their own learning sessions"
    ON learning_sessions
    FOR DELETE
    USING (auth.uid() = user_id);

  -- Create index for better performance
  CREATE INDEX IF NOT EXISTS learning_sessions_user_id_idx ON learning_sessions(user_id);
END;
$$;

-- Create stored procedure to create the learning_exercises table
CREATE OR REPLACE FUNCTION create_learning_exercises_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create learning_exercises table if it doesn't exist
  CREATE TABLE IF NOT EXISTS learning_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    proficiency_level VARCHAR(20) NOT NULL,
    exercise_type VARCHAR(50) NOT NULL,
    exercises JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Add RLS (Row Level Security) policies to learning_exercises
  ALTER TABLE learning_exercises ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own exercises" ON learning_exercises;
  DROP POLICY IF EXISTS "Users can insert their own exercises" ON learning_exercises;
  DROP POLICY IF EXISTS "Users can update their own exercises" ON learning_exercises;
  DROP POLICY IF EXISTS "Users can delete their own exercises" ON learning_exercises;

  -- Policy: Users can only view their own exercises
  CREATE POLICY "Users can view their own exercises"
    ON learning_exercises
    FOR SELECT
    USING (auth.uid() = user_id);

  -- Policy: Users can only insert their own exercises
  CREATE POLICY "Users can insert their own exercises"
    ON learning_exercises
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  -- Policy: Users can only update their own exercises
  CREATE POLICY "Users can update their own exercises"
    ON learning_exercises
    FOR UPDATE
    USING (auth.uid() = user_id);

  -- Policy: Users can only delete their own exercises
  CREATE POLICY "Users can delete their own exercises"
    ON learning_exercises
    FOR DELETE
    USING (auth.uid() = user_id);

  -- Create index for better performance
  CREATE INDEX IF NOT EXISTS learning_exercises_user_id_idx ON learning_exercises(user_id);
END;
$$;

-- Create stored procedure to create the conversation_analyses table
CREATE OR REPLACE FUNCTION create_conversation_analyses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create conversation_analyses table if it doesn't exist
  CREATE TABLE IF NOT EXISTS conversation_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation TEXT NOT NULL,
    speaker_a_language VARCHAR(10) NOT NULL,
    speaker_b_language VARCHAR(10) NOT NULL,
    analyze_for JSONB NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Add RLS (Row Level Security) policies to conversation_analyses
  ALTER TABLE conversation_analyses ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own conversation analyses" ON conversation_analyses;
  DROP POLICY IF EXISTS "Users can insert their own conversation analyses" ON conversation_analyses;
  DROP POLICY IF EXISTS "Users can update their own conversation analyses" ON conversation_analyses;
  DROP POLICY IF EXISTS "Users can delete their own conversation analyses" ON conversation_analyses;

  -- Policy: Users can only view their own conversation analyses
  CREATE POLICY "Users can view their own conversation analyses"
    ON conversation_analyses
    FOR SELECT
    USING (auth.uid() = user_id);

  -- Policy: Users can only insert their own conversation analyses
  CREATE POLICY "Users can insert their own conversation analyses"
    ON conversation_analyses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  -- Policy: Users can only update their own conversation analyses
  CREATE POLICY "Users can update their own conversation analyses"
    ON conversation_analyses
    FOR UPDATE
    USING (auth.uid() = user_id);

  -- Policy: Users can only delete their own conversation analyses
  CREATE POLICY "Users can delete their own conversation analyses"
    ON conversation_analyses
    FOR DELETE
    USING (auth.uid() = user_id);

  -- Create index for better performance
  CREATE INDEX IF NOT EXISTS conversation_analyses_user_id_idx ON conversation_analyses(user_id);
END;
$$;
