-- Create language_packs table
CREATE TABLE IF NOT EXISTS language_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  language_name TEXT NOT NULL,
  size TEXT NOT NULL,
  download_date TIMESTAMP WITH TIME ZONE NOT NULL,
  last_used TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, language_code)
);

-- Create RLS policies
ALTER TABLE language_packs ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own language packs
CREATE POLICY select_own_language_packs ON language_packs
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own language packs
CREATE POLICY insert_own_language_packs ON language_packs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own language packs
CREATE POLICY update_own_language_packs ON language_packs
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own language packs
CREATE POLICY delete_own_language_packs ON language_packs
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS language_packs_user_id_idx ON language_packs (user_id);

-- Create function to update updated_at on update
CREATE OR REPLACE FUNCTION update_language_packs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on update
CREATE TRIGGER update_language_packs_updated_at
BEFORE UPDATE ON language_packs
FOR EACH ROW
EXECUTE FUNCTION update_language_packs_updated_at();
