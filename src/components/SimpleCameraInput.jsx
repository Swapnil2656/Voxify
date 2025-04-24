import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import groqService from '../services/groqService';
import { createWorker } from 'tesseract.js';

const SimpleCameraInput = ({ onImageCaptured, onError }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setCameraActive(false);
      } else {
        onError?.('Failed to capture image. Please try again.');
      }
    }
  }, [webcamRef, onError]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        setCameraActive(false);
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
      };
      reader.readAsDataURL(file);
    } else {
      onError?.('Please drop an image file.');
    }
  };

  // Use the captured image with OCR
  const useImage = async () => {
    console.log('=== IMAGE PROCESSING: Starting ===');

    if (!capturedImage) {
      console.log('No image captured');
      onError?.('No image captured. Please capture an image first.');
      return;
    }

    console.log('Image data length:', capturedImage.length);
    console.log('Image format:', capturedImage.substring(0, 30) + '...');

    // Set loading state
    setIsProcessing(true);
    console.log('Set processing state to true');

    try {
      // Perform OCR on the image
      console.log('=== IMAGE PROCESSING: Calling OCR function ===');
      const startTime = Date.now();
      const extractedText = await performOCR(capturedImage);
      const endTime = Date.now();
      console.log(`OCR completed in ${endTime - startTime}ms`);
      console.log('OCR result:', extractedText);
      console.log('OCR result length:', extractedText ? extractedText.length : 0);

      // Check if OCR was successful
      if (extractedText && extractedText.trim()) {
        console.log('=== IMAGE PROCESSING: OCR successful, passing to parent ===');
        // Pass the image and extracted text to the parent component
        onImageCaptured?.(capturedImage, extractedText.trim());
        console.log('Data passed to parent component');
      } else {
        console.log('OCR returned empty result');
        throw new Error('No text detected in the image. Please try a clearer image.');
      }
    } catch (err) {
      console.log('=== IMAGE PROCESSING: Error ===');
      console.error('Error processing image:', err);
      console.log('Error name:', err.name);
      console.log('Error message:', err.message);
      onError?.(err.message || 'Failed to process image');
    } finally {
      console.log('=== IMAGE PROCESSING: Cleanup ===');
      setIsProcessing(false);
      console.log('Set processing state to false');
    }
  };

  // Validate image data before OCR
  const validateImageData = (imageData) => {
    if (!imageData) {
      throw new Error('No image data provided');
    }

    // Check if it's a valid base64 image string
    if (typeof imageData !== 'string' || !imageData.startsWith('data:image')) {
      throw new Error('Invalid image format');
    }

    // Basic check for image size (prevent empty or tiny images)
    if (imageData.length < 1000) {
      throw new Error('Image is too small or empty');
    }

    return true;
  };

  // Perform OCR on the image using Tesseract.js
  const performOCR = async (imageData) => {
    let worker = null;

    console.log('=== OCR STAGE 1: Starting OCR process ===');
    console.log('Image data length:', imageData ? imageData.length : 0);
    console.log('Image data type:', typeof imageData);
    console.log('Image data preview:', imageData ? imageData.substring(0, 50) + '...' : 'null');

    // Validate the image data first
    try {
      console.log('=== OCR STAGE 2: Validating image data ===');
      validateImageData(imageData);
      console.log('Image validation successful');
    } catch (validationError) {
      console.error('Image validation failed:', validationError.message);
      throw validationError;
    }

    // Create an AbortController for timeout
    console.log('=== OCR STAGE 3: Setting up timeout ===');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('OCR process timed out after 10 seconds');
      controller.abort();
    }, 10000); // 10 seconds timeout

    try {
      // Initialize Tesseract worker
      console.log('=== OCR STAGE 4: Initializing Tesseract worker ===');
      worker = await createWorker({
        logger: progress => {
          console.log(`OCR progress: ${progress.status} - ${progress.progress?.toFixed(2) || 0}`);
        }
      });

      console.log('=== OCR STAGE 5: Loading Tesseract core ===');
      await worker.load();
      console.log('Tesseract core loaded successfully');

      console.log('=== OCR STAGE 6: Loading language data ===');
      // Load English for faster processing
      await worker.loadLanguage('eng');
      console.log('Language data loaded successfully');

      console.log('=== OCR STAGE 7: Initializing Tesseract ===');
      await worker.initialize('eng');
      console.log('Tesseract initialized successfully');

      console.log('=== OCR STAGE 8: Starting text recognition ===');

      // Check if the operation was aborted
      if (controller.signal.aborted) {
        console.log('OCR process was aborted before recognition started');
        throw new Error('OCR processing timed out');
      }

      // Perform OCR
      console.log('Calling worker.recognize with image data...');
      const startTime = Date.now();
      const { data } = await worker.recognize(imageData);
      const endTime = Date.now();
      console.log(`OCR recognition took ${endTime - startTime}ms to complete`);

      // Clear the timeout since we got a result
      clearTimeout(timeoutId);

      console.log('=== OCR STAGE 9: Text recognition completed ===');
      console.log('OCR Result:', data.text);
      console.log('OCR Confidence:', data.confidence);
      console.log('OCR Words detected:', data.words ? data.words.length : 0);

      // ✅ Check if OCR result is empty or contains only whitespace
      if (!data.text || data.text.trim() === "") {
        console.log('OCR returned empty text');
        throw new Error('No text detected in the image');
      }

      console.log('=== OCR STAGE 10: Returning cleaned text ===');
      return data.text.trim();
    } catch (error) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);

      console.log('=== OCR ERROR: Processing failed ===');
      console.error('OCR processing error:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      console.log('Controller aborted:', controller.signal.aborted);

      // Check if it was a timeout error
      if (error.name === 'AbortError' || controller.signal.aborted) {
        console.log('OCR timeout detected');
        throw new Error('OCR processing timed out. Please try again.');
      }

      throw new Error(`OCR failed: ${error.message || 'Unknown error'}`);
    } finally {
      // Ensure worker is terminated to free resources
      console.log('=== OCR CLEANUP: Terminating worker ===');
      if (worker) {
        try {
          await worker.terminate();
          console.log('Tesseract worker terminated successfully');
        } catch (termError) {
          console.error('Error terminating Tesseract worker:', termError);
          console.log('Termination error details:', termError.message);
        }
      } else {
        console.log('No worker to terminate');
      }
      console.log('=== OCR PROCESS COMPLETE ===');
    }
  };

  // Reset the camera and state
  const resetCamera = () => {
    setCapturedImage(null);
    setCameraActive(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <div
        className={`relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video mb-4 ${isDraggingOver ? 'border-2 border-dashed border-blue-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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

        {!cameraActive && capturedImage && (
          <div className="absolute top-2 right-2">
            <button
              onClick={resetCamera}
              className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
              aria-label="Retake photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {isDraggingOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <p className="text-gray-900 dark:text-white font-medium">Drop image here</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
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
              Capture
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 00-3-3H8zm7 7a3 3 0 01-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3H8a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a3 3 0 01-6 0z" clipRule="evenodd" />
              </svg>
              Upload
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </>
        ) : (
          <>
            {isProcessing ? (
              <button
                disabled
                className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg opacity-70 cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </button>
            ) : (
              <button
                id="camera-extract-button"
                onClick={useImage}
                disabled={!capturedImage}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                </svg>
                Extract Text
              </button>
            )}
          </>
        )}
      </div>

      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Drag & drop an image or use the camera</p>
      </div>
    </div>
  );
};

export default SimpleCameraInput;
