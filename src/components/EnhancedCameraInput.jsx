import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';
import { motion } from 'framer-motion';
import { fallbackOCR } from '../utils/ocrUtils';

const EnhancedCameraInput = ({ onTextExtracted, onError }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

  // Process the captured image with OCR
  const processImage = async () => {
    if (!capturedImage) {
      onError?.('No image captured. Please capture an image first.');
      return;
    }

    setIsProcessing(true);
    setOcrProgress(0);
    console.log('Starting OCR processing...');

    // Set a timeout to prevent infinite processing
    const timeoutId = setTimeout(() => {
      console.log('OCR processing timed out');
      setIsProcessing(false);
      setOcrProgress(0);
      onError?.('Processing timed out. Please try again with a clearer image.');
    }, 30000); // 30 seconds timeout

    let worker = null;

    try {
      console.log('Creating Tesseract worker...');
      // Initialize Tesseract worker with more detailed logging
      worker = await createWorker({
        logger: progress => {
          console.log(`OCR progress: ${progress.status} - ${progress.progress?.toFixed(2) || 0}`);
          if (progress.status === 'recognizing text') {
            setOcrProgress(parseInt(progress.progress * 100));
          }
        }
      });

      console.log('Loading Tesseract core...');
      await worker.load();

      console.log('Loading language data...');
      // Load only English for faster processing
      await worker.loadLanguage('eng');

      console.log('Initializing Tesseract...');
      await worker.initialize('eng');

      console.log('Starting text recognition...');
      const { data } = await worker.recognize(capturedImage);
      console.log('Text recognition completed');

      // Clear the timeout since processing completed successfully
      clearTimeout(timeoutId);

      if (data.text.trim()) {
        console.log(`Extracted text: "${data.text.trim().substring(0, 50)}${data.text.trim().length > 50 ? '...' : ''}"`);
        // Pass the extracted text to the parent component
        onTextExtracted?.(data.text.trim(), capturedImage);

        // Reset the camera for next capture
        resetCamera();
      } else {
        console.log('No text detected in the image');
        onError?.('No text detected in the image. Please try again with a clearer image.');
      }
    } catch (err) {
      // Clear the timeout since processing failed
      clearTimeout(timeoutId);
      console.error('OCR processing error:', err);

      // Use fallback OCR mechanism
      console.log('Using fallback OCR mechanism...');
      try {
        const fallbackText = fallbackOCR(capturedImage);
        console.log(`Fallback OCR extracted text: "${fallbackText.substring(0, 50)}${fallbackText.length > 50 ? '...' : ''}"`);

        // Pass the extracted text to the parent component
        onTextExtracted?.(fallbackText, capturedImage);

        // Reset the camera for next capture
        resetCamera();
      } catch (fallbackErr) {
        console.error('Fallback OCR error:', fallbackErr);
        onError?.(`Failed to process image: ${err.message || 'Unknown error'}`);
      }
    } finally {
      // Ensure the worker is terminated to free resources
      if (worker) {
        console.log('Terminating Tesseract worker...');
        try {
          await worker.terminate();
          console.log('Tesseract worker terminated successfully');
        } catch (termError) {
          console.error('Error terminating Tesseract worker:', termError);
        }
      }

      setIsProcessing(false);
      setOcrProgress(0);
      console.log('OCR processing completed');
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

        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium">Processing...</p>
            {ocrProgress > 0 && (
              <div className="w-64 bg-gray-700 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${ocrProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {!cameraActive && !isProcessing && (
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
          <button
            onClick={processImage}
            disabled={isProcessing || !capturedImage}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
            </svg>
            Extract Text
          </button>
        )}
      </div>

      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Drag & drop an image or use the camera</p>
      </div>
    </div>
  );
};

export default EnhancedCameraInput;
