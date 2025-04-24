import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { motion } from 'framer-motion';
import languages from '../data/languages';

function CameraOcr({ sourceLanguage = 'auto', targetLanguage = 'en', onTranslationComplete }) {
  // States for image and text
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [processingStage, setProcessingStage] = useState('idle');

  // Refs
  const webcamRef = useRef(null);
  const uploadInputRef = useRef(null);

  // Capture image from webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setExtractedText('');
        setTranslatedText('');
        setError(null);
      } else {
        setError('Failed to capture image. Please try again.');
      }
    }
  };

  // Process the captured image with OCR
  const processImage = async () => {
    if (!capturedImage) {
      setError('No image captured. Please capture an image first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setExtractedText('');
    setTranslatedText('');
    setProcessingStage('preprocessing');

    try {
      // Step 1: Preprocess the image (optional)
      console.log('Preprocessing image...');
      setProcessingStage('preprocessing');

      // Step 2: Perform OCR
      console.log('Performing OCR...');
      setProcessingStage('ocr');

      // Set up a manual progress indicator
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);

      try {
        // Use Tesseract.recognize with NO logger to avoid DataCloneError
        console.log('Starting Tesseract OCR...');
        const result = await Tesseract.recognize(
          capturedImage,
          'eng' // Use English for now
          // NO logger or callbacks here - this avoids DataCloneError
        );

        console.log('OCR complete');
        setProgress(100);

        // Extract and set the text
        if (result.data && result.data.text) {
          const cleanText = result.data.text.trim();
          setExtractedText(cleanText);

          // Step 3: Translate the text
          console.log('Translating text...');
          setProcessingStage('translation');
          await translateText(cleanText);
        } else {
          setError('No text detected in the image. Please try again with a clearer image.');
        }
      } catch (ocrError) {
        console.error('OCR error:', ocrError);
        throw new Error(`OCR failed: ${ocrError.message || 'Unknown error'}`);
      } finally {
        clearInterval(progressInterval);
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(`Failed to process image: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProcessingStage('idle');
    }
  };

  // Translate the extracted text
  const translateText = async (text) => {
    try {
      // For this example, we'll use a simple API call to the server
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.success && (data.translation || data.translated)) {
        const translatedText = data.translation || data.translated;
        setTranslatedText(translatedText);

        // Notify parent component if callback provided
        if (onTranslationComplete) {
          onTranslationComplete({
            sourceText: text,
            translatedText,
            sourceLanguage,
            targetLanguage,
            image: capturedImage
          });
        }
      } else {
        throw new Error(data.error || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError(`Translation failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Reset the camera
  const resetCamera = () => {
    setCapturedImage(null);
    setExtractedText('');
    setTranslatedText('');
    setError(null);
  };

  // Handle file upload from device
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please select an image smaller than 10MB.');
      return;
    }

    // Read the file and convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target.result);
      setExtractedText('');
      setTranslatedText('');
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read the selected file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4">
        {/* Header section removed */}

        <div className="max-w-xl mx-auto">
          {/* Camera/Image Column - Second box removed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            {/* Language selection box removed */}

            <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video mb-4">
              {!capturedImage ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "environment"
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                  <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium">
                    {processingStage === 'preprocessing' && 'Enhancing image...'}
                    {processingStage === 'ocr' && 'Recognizing text...'}
                    {processingStage === 'translation' && 'Translating text...'}
                    {processingStage === 'idle' && 'Processing...'}
                  </p>
                  {progress > 0 && processingStage === 'ocr' && (
                    <>
                      <div className="w-64 bg-gray-700 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1">{progress}%</p>
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
              {!capturedImage ? (
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
}

export default CameraOcr;
