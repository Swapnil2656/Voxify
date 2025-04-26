import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Log environment information
console.log('Node environment:', process.env.NODE_ENV || 'development');
console.log('Using Groq API key:', process.env.GROQ_API_KEY ? 'Yes (configured)' : 'No (missing)');

// Middleware
// Enhanced CORS configuration for deployment
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if(!origin) return callback(null, true);

    // Allow all origins in development and production
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Simple route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required parameters. Please provide text and targetLanguage.'
      });
    }

    console.log(`Translating: "${text}" from ${sourceLanguage || 'auto'} to ${targetLanguage}`);
    console.log('Request received at /api/translate endpoint');

    // Use Groq API for translation
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({
        error: 'GROQ_API_KEY is not configured on the server.'
      });
    }

    // Get language name from code
    const languageNames = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'tr': 'Turkish',
      'nl': 'Dutch',
      'pl': 'Polish',
      'vi': 'Vietnamese',
      'th': 'Thai',
      'id': 'Indonesian',
      'ms': 'Malay',
      'fa': 'Persian',
      'he': 'Hebrew',
      'ur': 'Urdu',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'mr': 'Marathi',
      'gu': 'Gujarati',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'pa': 'Punjabi',
      'si': 'Sinhala',
      'ne': 'Nepali',
      'my': 'Burmese',
      'km': 'Khmer',
      'lo': 'Lao',
      'mn': 'Mongolian',
      'uk': 'Ukrainian',
      'cs': 'Czech',
      'sk': 'Slovak',
      'hu': 'Hungarian',
      'ro': 'Romanian',
      'bg': 'Bulgarian',
      'el': 'Greek',
      'sv': 'Swedish',
      'no': 'Norwegian',
      'da': 'Danish',
      'fi': 'Finnish',
      'is': 'Icelandic',
      'lt': 'Lithuanian',
      'lv': 'Latvian',
      'et': 'Estonian',
      'hr': 'Croatian',
      'sr': 'Serbian',
      'bs': 'Bosnian',
      'sl': 'Slovenian',
      'mk': 'Macedonian',
      'sq': 'Albanian',
      'mt': 'Maltese',
      'cy': 'Welsh',
      'ga': 'Irish',
      'gl': 'Galician',
      'eu': 'Basque',
      'ca': 'Catalan',
      'af': 'Afrikaans',
      'sw': 'Swahili',
      'zu': 'Zulu',
      'xh': 'Xhosa',
      'st': 'Sesotho',
      'tn': 'Tswana',
      'sn': 'Shona',
      'so': 'Somali',
      'am': 'Amharic',
      'ha': 'Hausa',
      'yo': 'Yoruba',
      'ig': 'Igbo',
      'mg': 'Malagasy',
      'tl': 'Tagalog',
      'mi': 'Maori',
      'haw': 'Hawaiian',
      'sm': 'Samoan',
      'to': 'Tongan',
      'fj': 'Fijian',
      'ty': 'Tahitian',
      'hy': 'Armenian',
      'ka': 'Georgian',
      'az': 'Azerbaijani',
      'uz': 'Uzbek',
      'kk': 'Kazakh',
      'ky': 'Kyrgyz',
      'tg': 'Tajik',
      'tk': 'Turkmen',
      'tt': 'Tatar',
      'ug': 'Uyghur',
      'bo': 'Tibetan',
      'dz': 'Dzongkha',
      'jv': 'Javanese',
      'su': 'Sundanese',
      'la': 'Latin',
      'grc': 'Ancient Greek',
      'sa': 'Sanskrit',
      'yi': 'Yiddish',
      'eo': 'Esperanto'
    };

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage;
    const sourceLanguageName = sourceLanguage ? (languageNames[sourceLanguage] || sourceLanguage) : 'auto';

    // Prepare the prompt for Groq
    const systemPrompt = "You are a professional multilingual translator for a travel and communication app. Translate text precisely and naturally.";

    const userPrompt = sourceLanguage === 'auto' ?
      `Translate the following text to ${targetLanguageName}:\n\n"${text}"` :
      `Translate the following ${sourceLanguageName} text to ${targetLanguageName}:\n\n"${text}"`;

    // Call Groq API
    console.log('Sending request to Groq API with prompt:', userPrompt);
    console.log('Using Groq API key:', groqApiKey.substring(0, 5) + '...');

    let groqResponse;
    try {
      groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        top_p: 0.9
      }, {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      });

      console.log('Groq API response received successfully');
    } catch (groqError) {
      console.error('Error calling Groq API:', groqError.message);
      if (groqError.response) {
        console.error('Groq API error response:', groqError.response.data);
      }

      // Return a fallback translation
      return res.json({
        translation: `[FALLBACK] ${text}`,
        translated: `[FALLBACK] ${text}`,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
        success: true,
        fallback: true
      });
    }

    // Extract the translation from Groq's response
    let translation = groqResponse.data.choices[0].message.content.trim();

    // Remove quotes if present (both double and single quotes)
    if ((translation.startsWith('"') && translation.endsWith('"')) ||
        (translation.startsWith("'") && translation.endsWith("'"))) {
      translation = translation.substring(1, translation.length - 1);
    }

    // Also remove any escaped quotes
    translation = translation.replace(/\\"/g, '"').replace(/\\'/g, "'");

    // Return the translation in both formats for compatibility
    return res.json({
      translation, // Original format
      translated: translation, // Alternative format
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      success: true
    });
  } catch (error) {
    console.error('Translation error:', error.message);
    return res.status(500).json({
      error: 'Translation failed. Please try again later.',
      details: error.message,
      success: false
    });
  }
});

// Speech to text endpoint
app.post('/api/speech-to-text', async (req, res) => {
  try {
    const { audio, language } = req.body;

    if (!audio) {
      return res.status(400).json({
        error: 'Missing audio data. Please provide audio.'
      });
    }

    // For now, we'll return a mock response since we don't have a real speech-to-text API
    // In a real implementation, you would send the audio to a speech recognition service

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.json({
      text: "This is a simulated transcription. In a real implementation, this would be the transcribed text from your audio.",
      language: language || 'en',
      confidence: 0.95,
      success: true
    });
  } catch (error) {
    console.error('Speech to text error:', error.message);
    return res.status(500).json({
      error: 'Speech to text failed. Please try again later.',
      details: error.message,
      success: false
    });
  }
});

// Text to speech endpoint
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing text. Please provide text to convert to speech.'
      });
    }

    // For now, we'll return a success response without actual audio
    // In a real implementation, you would send the text to a text-to-speech service
    // and return the audio data

    return res.json({
      success: true,
      message: 'Text to speech request received. Use browser TTS for now.',
      text,
      language: language || 'en'
    });
  } catch (error) {
    console.error('Text to speech error:', error.message);
    return res.status(500).json({
      error: 'Text to speech failed. Please try again later.',
      details: error.message,
      success: false
    });
  }
});

// Add FastAPI proxy endpoint for AI-enhanced translation
app.post('/api/translate-text', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage, aiEnhance } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required parameters. Please provide text and targetLanguage.'
      });
    }

    // Try to forward the request to the FastAPI backend
    try {
      // Determine the FastAPI URL based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      const fastApiUrl = isProduction ?
        `${req.protocol}://${req.get('host')}/fastapi/translate-text` :
        'http://localhost:8004/translate-text';

      console.log(`Using FastAPI URL: ${fastApiUrl}`);

      const fastApiResponse = await axios.post(fastApiUrl, {
        text,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
        aiEnhance: aiEnhance !== false
      }, {
        timeout: 10000 // 10 second timeout
      });

      return res.json(fastApiResponse.data);
    } catch (fastApiError) {
      console.warn('FastAPI request failed, falling back to direct translation:', fastApiError.message);

      // Fall back to our direct translation endpoint
      const isProduction = process.env.NODE_ENV === 'production';
      const translationUrl = isProduction ?
        `${req.protocol}://${req.get('host')}/api/translate` :
        `http://localhost:${PORT}/api/translate`;

      console.log(`Using fallback translation URL: ${translationUrl}`);

      const translationResponse = await axios.post(translationUrl, {
        text,
        sourceLanguage,
        targetLanguage
      }, {
        timeout: 8000 // 8 second timeout
      });

      return res.json({
        success: true,
        translated: translationResponse.data.translation,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
        aiEnhanced: false,
        fallback: true
      });
    }
  } catch (error) {
    console.error('AI-enhanced translation error:', error.message);
    return res.status(500).json({
      error: 'Translation failed. Please try again later.',
      details: error.message,
      success: false
    });
  }
});

// Add endpoint for text generation (used by camera translation)
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, messages, model, temperature, max_tokens, top_p } = req.body;

    // Check if we have either a prompt or messages
    if (!prompt && (!messages || !messages.length)) {
      return res.status(400).json({
        error: 'Missing required parameters. Please provide either prompt or messages.'
      });
    }

    // Use Groq API for text generation
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({
        error: 'GROQ_API_KEY is not configured on the server.'
      });
    }

    // Prepare the request data based on the input format
    let requestData;
    if (prompt) {
      // Legacy format with a single prompt string
      requestData = {
        model: model || "llama3-8b-8192",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 800,
        top_p: top_p || 0.9
      };
    } else {
      // New format with structured messages
      requestData = {
        model: model || "llama3-8b-8192",
        messages: messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 800,
        top_p: top_p || 0.9
      };
    }

    // Call Groq API
    const groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', requestData, {
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract the response content
    const content = groqResponse.data.choices[0].message.content.trim();

    // Return the response in the appropriate format
    if (prompt) {
      // Legacy format
      return res.json({
        text: content
      });
    } else {
      // New format
      return res.json({
        content: content,
        model: model || "llama3-8b-8192",
        success: true
      });
    }
  } catch (error) {
    console.error('Text generation error:', error.message);
    return res.status(500).json({
      error: 'Text generation failed. Please try again later.',
      details: error.message,
      success: false
    });
  }
});

// Add endpoint for OCR translation processing
app.post('/api/ocr-translation/process', async (req, res) => {
  try {
    const { imageData, sourceLanguage, targetLanguage } = req.body;

    if (!imageData) {
      return res.status(400).json({
        error: 'Missing image data. Please provide imageData.'
      });
    }

    // In a real implementation, you would:
    // 1. Process the image with OCR
    // 2. Clean up the OCR text
    // 3. Translate the cleaned text

    // For now, we'll use the Groq API to translate the text directly
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({
        error: 'GROQ_API_KEY is not configured on the server.'
      });
    }

    // Get language name from code
    const languageNames = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'tr': 'Turkish',
      'nl': 'Dutch',
      'pl': 'Polish',
      'vi': 'Vietnamese',
      'th': 'Thai'
    };

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage;

    // Step 1: Clean up the OCR text
    const systemPrompt1 =
      "You are an OCR post-processor. Your job is to clean and correct messy OCR output from images before it is used for translation.";

    const userPrompt1 =
      `Here is the raw OCR text extracted from an image:\n\n"${imageData}"\n\nPlease fix spelling, correct broken words, and return clean, readable text. Do not translate or change meaning. Just fix formatting and errors caused by OCR.`;

    const cleanupResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt1 },
        { role: "user", content: userPrompt1 }
      ],
      temperature: 0.2,
      max_tokens: 1000,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const cleanedText = cleanupResponse.data.choices[0].message.content.trim();

    // Step 2: Translate the cleaned text
    const systemPrompt2 =
      "You are a professional multilingual translator for a travel and communication app. Translate text precisely and naturally.";

    const userPrompt2 =
      `Translate the following English text to ${targetLanguageName}:\n\n"${cleanedText}"`;

    const translationResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt2 },
        { role: "user", content: userPrompt2 }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const translatedText = translationResponse.data.choices[0].message.content.trim();

    // Calculate processing time (simulated)
    const processingTimeMs = Math.floor(Math.random() * 1000) + 500;

    // Return the results
    return res.json({
      success: true,
      rawOcrText: imageData,
      cleanedText: cleanedText,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage: targetLanguage,
      processingTimeMs: processingTimeMs
    });
  } catch (error) {
    console.error('OCR translation error:', error.message);
    return res.status(500).json({
      error: 'OCR translation failed. Please try again later.',
      details: error.message,
      success: false
    });
  }
});

// Add a new endpoint for OCR and translation in one step
app.post('/api/ocr-translate', async (req, res) => {
  try {
    const { image, sourceLanguage, targetLanguage } = req.body;

    if (!image) {
      return res.status(400).json({
        error: 'Missing image data. Please provide image.'
      });
    }

    console.log('Received OCR-translate request');

    // For this hackathon, we'll simulate OCR by returning a fixed text
    // In a real implementation, you would use a server-side OCR library
    const extractedText = "This is simulated OCR text. In a real implementation, this would be the text extracted from your image.";

    // Now translate the extracted text
    const translationResponse = await axios.post('http://localhost:5000/api/translate', {
      text: extractedText,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage: targetLanguage || 'en'
    });

    // Return both the OCR result and the translation
    return res.json({
      success: true,
      extractedText: extractedText,
      translatedText: translationResponse.data.translation,
      confidence: 0.95,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage: targetLanguage || 'en',
      words: [] // In a real implementation, this would contain word bounding boxes
    });
  } catch (error) {
    console.error('OCR-translate error:', error.message);
    return res.status(500).json({
      error: 'OCR-translate failed. Please try again later.',
      details: error.message,
      success: false
    });
  }
});

// Proxy all FastAPI requests
app.use('/fastapi', async (req, res) => {
  try {
    const url = `http://localhost:8004${req.url.replace('/fastapi', '')}`;
    console.log(`Proxying request to FastAPI: ${url}`);

    const method = req.method.toLowerCase();
    let response;

    if (method === 'get') {
      response = await axios.get(url, { params: req.query });
    } else if (method === 'post') {
      response = await axios.post(url, req.body);
    } else if (method === 'put') {
      response = await axios.put(url, req.body);
    } else if (method === 'delete') {
      response = await axios.delete(url);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying to FastAPI:', error.message);
    if (error.response) {
      // Forward the error response from the FastAPI backend
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to connect to FastAPI service' });
    }
  }
});

// Serve index.html for client-side routing, but exclude API routes
app.get(/^(?!\/api\/).+/, (req, res) => {
  // Check if dist/index.html exists
  const indexPath = join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application is not built yet. Run npm run build first.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Local: http://localhost:${PORT}`);
});
