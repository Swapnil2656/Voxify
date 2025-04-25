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
