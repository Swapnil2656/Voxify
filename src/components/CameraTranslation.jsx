import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import mockCameraTranslationService from '../services/mockCameraTranslationService';
import languages from '../data/languages';
import { speakText } from '../utils/speechUtils';
import {
  preprocessImageForOcr,
  detectTextPresence
} from '../utils/imageProcessingUtils';

const CameraTranslation = ({ sourceLanguage = 'auto', targetLanguage = 'en', onTranslationComplete }) => {
  // Image and text states
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('idle'); // idle, preprocessing, ocr, translation
  const [error, setError] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  // UI states
  const [cameraActive, setCameraActive] = useState(true);
  const [highlightedImage, setHighlightedImage] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [useImagePreprocessing, setUseImagePreprocessing] = useState(true);

  // Refs
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const uploadInputRef = useRef(null);

  // Effect to notify parent component when translation is complete
  useEffect(() => {
    if (translatedText && extractedText && !isProcessing && onTranslationComplete) {
      onTranslationComplete({
        sourceText: extractedText,
        translatedText: translatedText,
        sourceLanguage: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
        targetLanguage,
        image: capturedImage
      });
    }
  }, [translatedText, extractedText, isProcessing, onTranslationComplete, sourceLanguage, targetLanguage, capturedImage]);

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setCameraActive(false);
        setExtractedText('');
        setTranslatedText('');
        setError(null);
        setHighlightedImage(null);
        setShowHighlights(false);
      } else {
        setError('Failed to capture image. Please try again.');
      }
    }
  }, [webcamRef]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        setCameraActive(false);
        setExtractedText('');
        setTranslatedText('');
        setError(null);
        setHighlightedImage(null);
        setShowHighlights(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        setCameraActive(false);
        setExtractedText('');
        setTranslatedText('');
        setError(null);
        setHighlightedImage(null);
        setShowHighlights(false);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please drop an image file.');
    }
  };

  // No Tesseract initialization needed - we're using our custom OCR service

  // Process the captured image with OCR
  const processImage = async () => {
    if (!capturedImage) {
      setError('No image captured. Please capture an image first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setOcrProgress(0);
    setHighlightedImage(null);
    setShowHighlights(false);
    setProcessingStage('preprocessing');
    setExtractedText('');
    setTranslatedText('');
    setDetectedLanguage(null);

    console.log('Starting image processing...');

    try {
      // Step 1: Preprocess the image (simple grayscale conversion)
      console.log('Step 1: Preprocessing image...');
      setProcessingStage('preprocessing');
      const imageToProcess = await preprocessImageForOcr(capturedImage);
      setProcessedImage(imageToProcess);

      // Set up a progress monitor for this specific recognition
      const progressMonitor = setInterval(() => {
        setOcrProgress(prev => {
          // Increment by small amounts to show activity
          const newProgress = prev + 2;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);

      // Step 2: Perform OCR and translation using our mock service
      console.log('Step 2: Performing OCR and translation...');
      setProcessingStage('ocr');

      try {
        // Use our mock service that doesn't require server connection
        const result = await mockCameraTranslationService.recognizeAndTranslate(
          imageToProcess,
          sourceLanguage,
          targetLanguage
        );

        console.log('OCR and translation complete, data received:', result);
        setOcrProgress(100);

        if (result.success) {
          // Set the extracted and translated text
          setExtractedText(result.extractedText);
          setTranslatedText(result.translatedText);
          setOcrConfidence(result.confidence || 0);

          // Save to translation history
          const historyEntry = {
            id: Date.now(),
            inputText: result.extractedText,
            translatedText: result.translatedText,
            sourceLanguage: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
            targetLanguage,
            timestamp: new Date().toISOString(),
            type: 'camera'
          };

          // Add to history in localStorage
          try {
            const history = JSON.parse(localStorage.getItem('polyLingo_history') || '[]');
            history.unshift(historyEntry);
            localStorage.setItem('polyLingo_history', JSON.stringify(history.slice(0, 50))); // Keep last 50 entries
          } catch (storageError) {
            console.error('Failed to save to history:', storageError);
          }
        } else {
          throw new Error(result.error || 'Failed to process image');
        }
      } catch (ocrError) {
        console.error('OCR error:', ocrError);
        throw new Error(`OCR failed: ${ocrError.message || 'Unknown error'}`);
      } finally {
        // Clean up the progress monitor
        clearInterval(progressMonitor);
      }
    } catch (err) {
      console.error('OCR processing error:', err);

      // Provide more helpful error messages
      if (err.message.includes('timed out')) {
        setError('OCR processing timed out. Please try again with a clearer image.');
      } else if (err.message.includes('load')) {
        setError('Failed to load OCR engine. Please check your internet connection and try again.');
      } else {
        setError(`Failed to process image: ${err.message || 'Unknown error'}`);
      }
    } finally {
      // Clean up resources
      setIsProcessing(false);
      setOcrProgress(0);
      setProcessingStage('idle');
      console.log('Image processing complete');
    }
  };

  // No cleanup needed for OCR service
  useEffect(() => {
    return () => {
      console.log('Component unmounting');
    };
  }, []);

  // Create highlighted image with bounding boxes
  const createHighlightedImage = (imageSrc, words) => {
    if (!imageSrc || !words || !Array.isArray(words) || words.length === 0) {
      console.warn('Invalid input for createHighlightedImage');
      return;
    }

    try {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          // Draw the original image
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Draw bounding boxes around detected text
          ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
          ctx.lineWidth = 2;
          ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';

          // Process each word safely
          words.forEach(word => {
            // Validate word object and bbox
            if (word && word.bbox && typeof word.bbox === 'object') {
              // Default confidence to 0 if not available
              const confidence = word.confidence || 0;

              if (confidence > 60) { // Only highlight words with decent confidence
                const { x0, y0, x1, y1 } = word.bbox;

                // Validate coordinates
                if (typeof x0 === 'number' && typeof y0 === 'number' &&
                    typeof x1 === 'number' && typeof y1 === 'number') {
                  // Calculate width and height
                  const width = x1 - x0;
                  const height = y1 - y0;

                  // Only draw if dimensions are valid
                  if (width > 0 && height > 0) {
                    ctx.strokeRect(x0, y0, width, height);
                    ctx.fillRect(x0, y0, width, height);
                  }
                }
              }
            }
          });

          // Convert to data URL and set state
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setHighlightedImage(dataUrl);
        } catch (canvasError) {
          console.error('Error creating highlighted image canvas:', canvasError);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading image for highlighting:', error);
      };

      // Set source to start loading
      img.src = imageSrc;
    } catch (error) {
      console.error('Error in createHighlightedImage:', error);
    }
  };

  // We're now handling translation directly in the processImage function
  // using our mockCameraTranslationService

  // Reset the camera and state
  const resetCamera = () => {
    setCapturedImage(null);
    setExtractedText('');
    setTranslatedText('');
    setError(null);
    setCameraActive(true);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4">
        {/* Header section removed */}

        <div className="max-w-xl mx-auto">
          {/* Camera/Image Column - Second box removed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            {/* Language selection */}
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Language:
              </div>
              <select
                value={targetLanguage}
                onChange={(e) => console.log("Language selection is handled by parent component")}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video mb-4">
              {cameraActive ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "environment"
                  }}
                  className="w-full h-full object-cover"
                />
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">Camera not available</p>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                  <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium">
                    {processingStage === 'preprocessing' && 'Enhancing image...'}
                    {processingStage === 'initializing' && 'Initializing OCR engine...'}
                    {processingStage === 'ocr' && 'Recognizing text...'}
                    {processingStage === 'translation' && 'Translating text...'}
                    {processingStage === 'idle' && 'Processing...'}
                  </p>
                  {ocrProgress > 0 && processingStage === 'ocr' && (
                    <>
                      <div className="w-64 bg-gray-700 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${ocrProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1">{ocrProgress}%</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hidden file input for uploads */}
            <input
              type="file"
              ref={uploadInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex space-x-2 mb-2">
              {cameraActive ? (
                <>
                  <button
                    onClick={captureImage}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Capture Image
                  </button>

                  <button
                    onClick={() => uploadInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
                    </svg>
                    Upload Image
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={resetCamera}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Retake
                  </button>
                  <button
                    onClick={processImage}
                    disabled={isProcessing || !capturedImage}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                    </svg>
                    Translate
                  </button>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CameraTranslation;
