/**
 * Simple OCR Service - Uses Tesseract.js without callbacks to avoid DataCloneError
 */
import Tesseract from 'tesseract.js';

const simpleOcrService = {
  /**
   * Recognize text in an image without using progress callbacks
   * @param {string} imageDataUrl - Base64 encoded image data URL
   * @returns {Promise<Object>} - OCR result
   */
  recognizeText: async (imageDataUrl) => {
    try {
      // Use Tesseract.recognize with NO logger or callbacks to avoid DataCloneError
      const result = await Tesseract.recognize(
        imageDataUrl,
        'eng' // Use English for now
        // NO CONFIGURATION OR CALLBACKS HERE - this avoids DataCloneError
      );
      
      return {
        success: true,
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (error) {
      console.error('OCR error:', error);
      return {
        success: false,
        error: error.message || 'Unknown OCR error'
      };
    }
  }
};

export default simpleOcrService;
