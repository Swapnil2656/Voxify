/**
 * Server OCR Service - Uses the server-side OCR endpoint instead of client-side Tesseract.js
 * This completely avoids the DataCloneError by not using web workers at all
 */

const serverOcrService = {
  /**
   * Recognize text in an image using the server-side OCR endpoint
   * @param {string} imageDataUrl - Base64 encoded image data URL
   * @param {string} sourceLanguage - Source language code (optional)
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<Object>} - OCR and translation result
   */
  recognizeAndTranslate: async (imageDataUrl, sourceLanguage = 'auto', targetLanguage = 'en') => {
    try {
      console.log('Server OCR Service: Starting text recognition and translation...');
      
      // Extract the base64 data from the data URL
      const base64Data = imageDataUrl.split(',')[1];
      
      // Call the server-side OCR endpoint
      const response = await fetch('http://localhost:5000/api/ocr-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Data,
          sourceLanguage,
          targetLanguage
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown server error');
      }
      
      console.log('Server OCR Service: Text recognition and translation complete');
      
      return {
        success: true,
        text: result.extractedText || '',
        translatedText: result.translatedText || '',
        confidence: result.confidence || 0,
        words: result.words || []
      };
    } catch (error) {
      console.error('Server OCR Service error:', error);
      return {
        success: false,
        error: error.message || 'Unknown OCR error'
      };
    }
  }
};

export default serverOcrService;
