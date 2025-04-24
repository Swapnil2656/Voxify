/**
 * Utility functions for image processing to improve OCR accuracy
 */

/**
 * Preprocesses an image for better OCR results
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @returns {Promise<string>} - Processed image data URL
 */
export const preprocessImageForOcr = async (imageDataUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded for preprocessing, dimensions:', img.width, 'x', img.height);

        // Create canvas for image processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        console.log('Preprocessing image for OCR - using simple grayscale conversion...');

        // Simple grayscale conversion - much faster and more reliable
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale with weighted RGB (standard formula)
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);

          // Set all RGB channels to the grayscale value
          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
          // Alpha channel (data[i + 3]) remains unchanged
        }

        // Put processed image data back to canvas
        ctx.putImageData(imageData, 0, 0);

        // Apply a slight sharpening filter to enhance text edges
        ctx.filter = 'contrast(1.1) brightness(1.05)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';

        console.log('Image preprocessing complete');

        // Convert canvas to data URL with high quality
        const processedImageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(processedImageDataUrl);
      };

      img.onerror = (error) => {
        console.error('Error loading image for preprocessing:', error);
        // If preprocessing fails, return the original image
        console.log('Preprocessing failed, returning original image');
        resolve(imageDataUrl);
      };

      // Set the source to start loading
      console.log('Setting image source to start loading...');
      img.src = imageDataUrl;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      // If any error occurs, return the original image
      console.log('Preprocessing error, returning original image');
      resolve(imageDataUrl);
    }
  });
};

/**
 * Detects if an image is likely to contain text
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @returns {Promise<boolean>} - True if the image likely contains text
 */
export const detectTextPresence = async (imageDataUrl) => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        // Create canvas for image analysis
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Get image data for analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Calculate edge density (a simple heuristic for text presence)
        let edgeCount = 0;
        const edgeThreshold = 30; // Threshold for edge detection

        // Simple edge detection by comparing adjacent pixels
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            const idx = (y * canvas.width + x) * 4;
            const prevX = ((y) * canvas.width + (x - 1)) * 4;
            const nextX = ((y) * canvas.width + (x + 1)) * 4;
            const prevY = ((y - 1) * canvas.width + (x)) * 4;
            const nextY = ((y + 1) * canvas.width + (x)) * 4;

            // Calculate horizontal and vertical gradients
            const gradX = Math.abs(data[prevX] - data[nextX]);
            const gradY = Math.abs(data[prevY] - data[nextY]);

            // If gradient exceeds threshold, count as edge
            if (gradX > edgeThreshold || gradY > edgeThreshold) {
              edgeCount++;
            }
          }
        }

        // Calculate edge density (ratio of edge pixels to total pixels)
        const edgeDensity = edgeCount / (canvas.width * canvas.height);

        // Heuristic: If edge density is above a certain threshold, likely contains text
        // Text typically has a higher edge density than natural scenes
        const textLikelyPresent = edgeDensity > 0.05;

        resolve(textLikelyPresent);
      };

      img.onerror = () => {
        // If analysis fails, assume text might be present
        resolve(true);
      };

      img.src = imageDataUrl;
    } catch (error) {
      console.error('Text presence detection error:', error);
      // If any error occurs, assume text might be present
      resolve(true);
    }
  });
};

/**
 * Determines the optimal Tesseract parameters based on image characteristics
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @returns {Promise<Object>} - Tesseract configuration parameters
 */
export const getOptimalTesseractConfig = async (imageDataUrl) => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        // Default configuration
        const config = {
          tessedit_char_whitelist: '', // No whitelist by default
          tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
          tessedit_ocr_engine_mode: '2', // Legacy + LSTM engines
          preserve_interword_spaces: '1',
          tessjs_create_hocr: '0',
          tessjs_create_tsv: '0',
          tessjs_create_box: '0',
          tessjs_create_unlv: '0',
          tessjs_create_osd: '0'
        };

        // Analyze image characteristics to determine optimal config
        const aspectRatio = img.width / img.height;
        const isLandscape = aspectRatio > 1.2;
        const isPortrait = aspectRatio < 0.8;
        const isSmall = img.width < 800 || img.height < 800;

        // Adjust configuration based on image characteristics
        if (isSmall) {
          // For small images, use more aggressive settings
          config.tessedit_pageseg_mode = '6'; // Assume a single uniform block of text
          config.tessedit_ocr_engine_mode = '2'; // Legacy + LSTM engines
        } else if (isLandscape) {
          // For landscape images (likely documents, receipts, etc.)
          config.tessedit_pageseg_mode = '1'; // Automatic page segmentation with OSD
        } else if (isPortrait) {
          // For portrait images (likely phone screenshots, menus, etc.)
          config.tessedit_pageseg_mode = '4'; // Assume a single column of text
        }

        resolve(config);
      };

      img.onerror = () => {
        // If analysis fails, use default configuration
        resolve({
          tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
          tessedit_ocr_engine_mode: '2', // Legacy + LSTM engines
          preserve_interword_spaces: '1'
        });
      };

      img.src = imageDataUrl;
    } catch (error) {
      console.error('Tesseract config optimization error:', error);
      // If any error occurs, use default configuration
      resolve({
        tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
        tessedit_ocr_engine_mode: '2', // Legacy + LSTM engines
        preserve_interword_spaces: '1'
      });
    }
  });
};

/**
 * Maps language codes to Tesseract language codes
 * @param {string} languageCode - ISO language code
 * @returns {string} - Tesseract language code
 */
export const mapToTesseractLanguage = (languageCode) => {
  const languageMap = {
    'en': 'eng',
    'es': 'spa',
    'fr': 'fra',
    'de': 'deu',
    'it': 'ita',
    'pt': 'por',
    'nl': 'nld',
    'ru': 'rus',
    'ja': 'jpn',
    'ko': 'kor',
    'zh': 'chi_sim',
    'zh-TW': 'chi_tra',
    'ar': 'ara',
    'hi': 'hin',
    'tr': 'tur',
    'pl': 'pol',
    'vi': 'vie',
    'th': 'tha',
    'he': 'heb',
    'cs': 'ces',
    'uk': 'ukr',
    'el': 'ell',
    'hu': 'hun',
    'ro': 'ron',
    'da': 'dan',
    'fi': 'fin',
    'no': 'nor',
    'sv': 'swe'
  };

  return languageMap[languageCode] || 'eng';
};

/**
 * Gets the optimal Tesseract language string based on source and target languages
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {string} - Tesseract language string
 */
export const getOptimalLanguageString = (sourceLanguage, targetLanguage) => {
  // Always include English as a fallback
  let languages = ['eng'];

  // If source language is specified and not 'auto', add it
  if (sourceLanguage && sourceLanguage !== 'auto') {
    const tesseractLang = mapToTesseractLanguage(sourceLanguage);
    if (tesseractLang && !languages.includes(tesseractLang)) {
      languages.push(tesseractLang);
    }
  }

  // Add target language if it's different from source
  if (targetLanguage && targetLanguage !== sourceLanguage) {
    const tesseractLang = mapToTesseractLanguage(targetLanguage);
    if (tesseractLang && !languages.includes(tesseractLang)) {
      languages.push(tesseractLang);
    }
  }

  // Add common languages for better detection
  const commonLanguages = ['fra', 'deu', 'spa', 'ita', 'por', 'rus', 'jpn', 'kor', 'chi_sim', 'ara'];
  commonLanguages.forEach(lang => {
    if (!languages.includes(lang)) {
      languages.push(lang);
    }
  });

  return languages.join('+');
};
