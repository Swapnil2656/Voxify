-- Create translation_history table
CREATE TABLE IF NOT EXISTS translation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  input_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  source_language VARCHAR(10) DEFAULT 'en',
  target_language VARCHAR(10) DEFAULT 'es',
  voice_speed FLOAT DEFAULT 1.0,
  font_size VARCHAR(10) DEFAULT 'medium',
  auto_detect_language BOOLEAN DEFAULT TRUE,
  save_history BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for translation_history
ALTER TABLE translation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own translation history"
  ON translation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own translation history"
  ON translation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own translation history"
  ON translation_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own translation history"
  ON translation_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_translation_history_user_id ON translation_history(user_id);
CREATE INDEX idx_translation_history_created_at ON translation_history(created_at);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_translation_history_updated_at
BEFORE UPDATE ON translation_history
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
