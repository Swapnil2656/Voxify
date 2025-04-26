# Voxify - Real-Time Language Companion

Voxify is a multimodal translation web app that enables real-time multilingual communication by processing both text and audio inputs. It uses Groq's ultra-fast inference engine to power speech-to-text, text translation, and text-to-speech functionality.

## Features

- 🌐 Translate text-to-text, speech-to-text, and text-to-speech in real time
- 🎙️ Speak into the app, get the translated text, and hear the translated speech
- 🧳 Designed for travelers & remote team communication
- 💡 Powered by Groq's ultra-fast inference engine
- 🧪 Stores translations in database with user accounts
- 🔐 User authentication and preferences synchronization
- 🌈 Modern UI with dark/light mode and waveform visualization
- 💬 **Conversation Mode**: Real-time two-way translation for natural conversations between speakers of different languages
- 📱 **Offline Mode**: Download language packs for offline translation when traveling without reliable internet access
- 📚 **Travel Phrasebook**: Common travel phrases in 50+ languages, with audio pronunciation to help you communicate confidently

## Tech Stack

### Frontend
- React with Vite
- TailwindCSS for styling
- Framer Motion for animations
- WaveSurfer.js for audio visualization

### Backend
- Node.js with Express
- Multer for handling audio file uploads
- Groq API integration for language processing
- Supabase for database and authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/polylingo.git
cd polylingo
```

2. Install frontend dependencies
```
npm install
```

3. Install backend dependencies
```
cd server
npm install
cd ..
```

4. Create a `.env` file in the root directory with your API keys
```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_FASTAPI_URL=http://localhost:8004
```

For detailed instructions on setting up the Groq API, see [GROQ_SETUP.md](GROQ_SETUP.md)

5. Set up Supabase database

Follow the instructions in [supabase/README.md](supabase/README.md) to set up your Supabase project and database tables.

### Running the App

#### Development Mode

1. Start the development server
```
npm run dev
```

#### Production Mode

1. Build and start the production server
```
npm start
```

Or manually:

```
npm run build
npm run server
```

2. Open your browser and navigate to:
   - Local: `http://localhost:3002`
   - Network: Check the terminal output for network URLs (e.g., `http://YOUR_IP_ADDRESS:3002`)

   If you're having trouble with network access, visit `http://localhost:3002/network-test.html` to troubleshoot

## Usage

1. Select your source and target languages
2. Enter text or record audio to translate
3. Click "Translate" to see the translation
4. Click "Listen" to hear the translated text
5. View your translation history at the bottom of the page

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Groq for providing the API for language processing
- The React and Vite communities for excellent documentation
- All contributors to the open-source libraries used in this project
