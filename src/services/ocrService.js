import Tesseract from 'tesseract.js';

/**
 * A simplified OCR service that avoids worker issues
 */
const ocrService = {
  /**
   * Recognize text in an image
   * @param {string} imageDataUrl - Base64 encoded image data URL
   * @returns {Promise<Object>} - OCR result
   */
  recognizeText: async (imageDataUrl) => {
    try {
      console.log('OCR Service: Starting text recognition...');

      // Use the simplest possible approach with NO configuration to avoid DataCloneError
      const result = await Tesseract.recognize(
        imageDataUrl,
        'eng' // Use English for now
        // NO CONFIGURATION AT ALL - this avoids DataCloneError
      );

      console.log('OCR Service: Text recognition complete');

      return {
        success: true,
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words
      };
    } catch (error) {
      console.error('OCR Service error:', error);
      return {
        success: false,
        error: error.message || 'Unknown OCR error'
      };
    }
  }
};

export default ocrService;
