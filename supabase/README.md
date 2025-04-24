# PolyLingo Supabase Setup

This directory contains the necessary files to set up the Supabase backend for the PolyLingo app.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note your project URL and anon key (you'll need these later)

### 2. Run the SQL Migrations

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `migrations/01_create_tables.sql`
3. Paste into the SQL Editor and run the query

### 3. Configure Authentication

1. In your Supabase project, go to Authentication > Settings
2. Under Email Auth, make sure "Enable Email Signup" is turned on
3. Configure any other authentication options as needed (e.g., password strength, email templates)

### 4. Update Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following environment variables:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Update `src/services/supabaseClient.js` to use these environment variables:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## Database Schema

### translation_history

Stores the user's translation history.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| source_language | VARCHAR(10) | Source language code |
| target_language | VARCHAR(10) | Target language code |
| input_text | TEXT | Original text |
| translated_text | TEXT | Translated text |
| type | VARCHAR(20) | Type of translation (text, voice, image) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### user_preferences

Stores user preferences.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| dark_mode | BOOLEAN | Dark mode preference |
| source_language | VARCHAR(10) | Default source language |
| target_language | VARCHAR(10) | Default target language |
| voice_speed | FLOAT | Voice playback speed |
| font_size | VARCHAR(10) | Font size preference |
| auto_detect_language | BOOLEAN | Auto-detect language preference |
| save_history | BOOLEAN | Save history preference |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

## Security

Row Level Security (RLS) policies are set up to ensure users can only access their own data. The policies are:

- Users can only view, insert, update, and delete their own translation history
- Users can only view, insert, and update their own preferences
