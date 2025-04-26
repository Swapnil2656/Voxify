// Serverless function for Vercel deployment
// This function proxies requests to the Groq API

import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required parameters. Please provide text and targetLanguage.'
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
    const sourceLanguageName = sourceLanguage ? (languageNames[sourceLanguage] || sourceLanguage) : 'auto';

    // Prepare the prompt for Groq
    const systemPrompt = "You are a professional multilingual translator for a travel and communication app. Translate text precisely and naturally.";

    const userPrompt = sourceLanguage === 'auto' ?
      `Translate the following text to ${targetLanguageName}:\n\n"${text}"` :
      `Translate the following ${sourceLanguageName} text to ${targetLanguageName}:\n\n"${text}"`;

    // Use the Groq API key from environment variables
    const groqApiKey = process.env.GROQ_API_KEY || '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';

    // Call Groq API
    const groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
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

    // Extract the translation from Groq's response
    let translation = groqResponse.data.choices[0].message.content.trim();

    // Remove quotes if present (both double and single quotes)
    if ((translation.startsWith('"') && translation.endsWith('"')) ||
        (translation.startsWith("'") && translation.endsWith("'"))) {
      translation = translation.substring(1, translation.length - 1);
    }

    // Also remove any escaped quotes
    translation = translation.replace(/\\"/g, '"').replace(/\\'/g, "'");

    // Return the translation
    return res.status(200).json({
      translation,
      translated: translation,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      success: true
    });
  } catch (error) {
    console.error('Translation error:', error.message);
    
    // Return a fallback translation
    return res.status(200).json({
      translation: `[FALLBACK] ${req.body.text || ''}`,
      translated: `[FALLBACK] ${req.body.text || ''}`,
      sourceLanguage: req.body.sourceLanguage || 'auto',
      targetLanguage: req.body.targetLanguage || 'en',
      success: true,
      fallback: true
    });
  }
}
