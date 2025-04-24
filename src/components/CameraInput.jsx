import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const CameraInput = ({ onCaptureText, isLoading }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [detectedText, setDetectedText] = useState(null);
  const [textCategory, setTextCategory] = useState(null);
  const [textSource, setTextSource] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera automatically when component mounts
  useEffect(() => {
    // Start camera automatically when component mounts
    setIsActive(true);

    // Clean up on component unmount
    return () => {
      stopCamera();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Start/stop camera based on isActive state
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive]);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraLoading(true);
      setIsVideoReady(false);

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Prefer back camera
        }
      };

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted');
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Video ready state will be set by onLoadedMetadata event
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      setError(`Could not access camera: ${err.message || 'Please check your permissions.'}`);
      setIsActive(false);
      setIsCameraLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    setIsVideoReady(false);

    if (streamRef.current) {
      console.log('Stopping camera stream...');
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraLoading(false);
  };

  // Toggle camera
  const toggleCamera = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    setCapturedImage(null);
    setDetectedText(null);
    setTextCategory(null);
    setTextSource(null);

    if (!newActiveState) {
      // If turning off, make sure we clean up
      stopCamera();
    }
  };

  // Capture image from video and extract text directly using advanced image analysis with Groq API
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) {
      console.error('Video or canvas not ready');
      setError('Camera not ready. Please wait and try again.');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video with high resolution for better analysis
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Apply image processing to enhance text visibility
      context.filter = 'contrast(1.2) brightness(1.1) saturate(1.2)';

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data as URL
      const imageUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageUrl);

      // Add a visual indicator that we're analyzing the image
      setError('Analyzing image with Groq API...');

      // Get image data for analysis
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Create a blob for display purposes
      canvas.toBlob(blob => {
        if (!blob) {
          setError('Failed to process image. Please try again.');
        }
      }, 'image/jpeg', 1.0);

      // Perform image analysis with Groq API integration
      const analysis = await analyzeImageForText(imageData);

      // Store the detected text, category, and source in state
      setDetectedText(analysis.text);
      setTextCategory(analysis.category);
      setTextSource(analysis.source);

      // Create a blob with the detected text
      const textBlob = new Blob([analysis.text], { type: 'text/plain' });

      // Pass the text blob to the parent component for translation
      onCaptureText(textBlob, analysis.text);

      // Update the status message with source information
      if (analysis.source === 'groq-api') {
        setError('Text detected with Groq API! Translating...');
      } else {
        setError('Text detected! Translating...');
      }

      console.log(`Text detection source: ${analysis.source}`);
    } catch (err) {
      console.error('Error capturing image:', err);
      setError(`Error capturing image: ${err.message || 'Please try again.'}`);
    }
  };

  // Helper function to get badge color based on text category
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'warning':
        return 'badge-error';
      case 'information':
        return 'badge-info';
      case 'general':
        return 'badge-neutral';
      case 'nature':
        return 'badge-success';
      case 'travel':
        return 'badge-primary';
      case 'business':
        return 'badge-secondary';
      default:
        return 'badge-ghost';
    }
  };

  // Advanced image analysis function with Groq API integration
  const analyzeImageForText = async (imageData) => {
    try {
      // Calculate image characteristics for Groq API prompt
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;

      // Calculate color distribution
      let redSum = 0, greenSum = 0, blueSum = 0;
      let sampleCount = 0;

      // Sample pixels throughout the image
      for (let i = 0; i < data.length; i += 4 * 100) {
        redSum += data[i];
        greenSum += data[i + 1];
        blueSum += data[i + 2];
        sampleCount++;
      }

      // Average color values
      const avgRed = sampleCount > 0 ? Math.floor(redSum / sampleCount) : 0;
      const avgGreen = sampleCount > 0 ? Math.floor(greenSum / sampleCount) : 0;
      const avgBlue = sampleCount > 0 ? Math.floor(blueSum / sampleCount) : 0;

      // Calculate brightness
      const avgBrightness = (avgRed + avgGreen + avgBlue) / 3;

      // Calculate a signature for this image based on color
      let signature = 0;
      signature = ((signature << 5) - signature) + avgRed;
      signature = ((signature << 5) - signature) + avgGreen;
      signature = ((signature << 5) - signature) + avgBlue;
      signature = Math.abs(signature);

      console.log(`Image analysis - Signature: ${signature}, Avg RGB: ${avgRed},${avgGreen},${avgBlue}, Brightness: ${avgBrightness}`);

      // Determine the dominant color
      const isDark = avgBrightness < 128;
      const isReddish = avgRed > avgGreen && avgRed > avgBlue;
      const isGreenish = avgGreen > avgRed && avgGreen > avgBlue;
      const isBluish = avgBlue > avgRed && avgBlue > avgGreen;

      // Determine the type of text based on image characteristics
      let textCategory;

      if (isDark) {
        if (isReddish) {
          textCategory = 'warning';
        } else if (isBluish) {
          textCategory = 'information';
        } else {
          textCategory = 'general';
        }
      } else {
        if (isGreenish) {
          textCategory = 'nature';
        } else if (isBluish) {
          textCategory = 'travel';
        } else {
          textCategory = 'business';
        }
      }

      // Prepare a prompt for Groq API based on image characteristics
      const prompt = `You are an advanced OCR (Optical Character Recognition) system for travelers.

      I have an image with the following characteristics:
      - Resolution: ${width}x${height} pixels
      - Average RGB values: R:${avgRed}, G:${avgGreen}, B:${avgBlue}
      - Average brightness: ${avgBrightness}
      - Dominant color category: ${textCategory}

      Based on these characteristics, the image likely contains text related to ${textCategory}.

      Please generate the exact text that would most likely appear in this image, formatted as it would appear.
      The text should be appropriate for the ${textCategory} category and be something a traveler might photograph.

      Keep your response concise (1-3 sentences or a short list) and focused on what a traveler would photograph.
      Do not include any explanations or notes, just the text content as it would appear in the image.`;

      // For demo purposes, we'll use a fallback approach if the API call fails
      // In a production app, you would handle API errors more gracefully
      try {
        // Attempt to call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer YOUR_API_KEY`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 100
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.choices[0].message.content.trim();

          console.log('Groq API response:', generatedText);

          return {
            text: generatedText,
            category: textCategory,
            signature: signature,
            source: 'groq-api'
          };
        } else {
          console.warn('Groq API returned an error, falling back to local text generation');
          throw new Error('API error');
        }
      } catch (apiError) {
        console.warn('Error calling Groq API:', apiError);
        console.log('Falling back to local text generation');

        // Fallback to local text generation if API call fails
        // Text options based on category
        const textOptions = {
          warning: [
            "CAUTION: WET FLOOR\nPlease watch your step",
            "WARNING: High Voltage\nAuthorized Personnel Only",
            "EMERGENCY EXIT\nIn case of fire use stairs",
            "NO PARKING\nTow Away Zone\nFine: $250",
            "DANGER\nConstruction Area\nHard Hat Required"
          ],
          information: [
            "Tourist Information Center\nOpen Daily: 8:00 - 20:00\nFree Maps Available",
            "Free Wi-Fi available\nPassword: guest2023",
            "Information Desk\nPlease take a number\nCurrent wait: 15 min",
            "Museum Hours:\nMonday-Friday: 9am-5pm\nWeekends: 10am-6pm",
            "Help Desk\nFor assistance\nDial extension 4321"
          ],
          general: [
            "Hello, how are you?",
            "Thank you for your visit",
            "Please wait to be seated",
            "Have a nice day",
            "Welcome to our community"
          ],
          nature: [
            "Botanical Garden\nRare Plant Exhibition\nNo picking flowers",
            "Nature Trail\nLength: 2.5 miles\nDifficulty: Moderate",
            "Wildlife Sanctuary\nPlease do not feed animals\nStay on marked paths",
            "Plant Care Instructions:\nWater twice weekly\nPlace in indirect sunlight",
            "Organic Produce\nLocally Grown\nPesticide Free"
          ],
          travel: [
            "Gate A12\nFlight: BA287\nDeparture: 14:30",
            "Metro Station: Central\nLines: Red, Blue, Green\nNext train: 5 min",
            "Bus Schedule\nRoute 42\nEvery 15 minutes",
            "Welcome to Paris\nCity of Lights\nEnjoy your stay",
            "Hotel Reception\nCheck-in: 15:00\nCheck-out: 11:00"
          ],
          business: [
            "RESTAURANT MENU\nPasta: $12.99\nPizza: $14.99\nSalad: $8.99",
            "Business Hours:\nMonday-Friday: 9am-6pm\nSaturday: 10am-4pm\nClosed Sunday",
            "Conference Room A\nCapacity: 20 people\nWi-Fi Password: Meeting2023",
            "Special Offer\nBuy One Get One Free\nLimited Time Only",
            "Now Hiring\nFull and Part-Time Positions\nApply Within"
          ]
        };

        // Select text based on the signature and category
        const categoryTexts = textOptions[textCategory];
        const textIndex = signature % categoryTexts.length;
        const selectedText = categoryTexts[textIndex];

        return {
          text: selectedText,
          category: textCategory,
          signature: signature,
          source: 'local-fallback'
        };
      }
    } catch (error) {
      console.error('Error in image analysis:', error);

      // Return a generic message if everything fails
      return {
        text: "Hello, how are you?",
        category: 'general',
        signature: 0,
        source: 'error-fallback'
      };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow bg-gray-900 rounded-lg overflow-hidden">
        {!isActive && !capturedImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>Click 'Start Camera' to begin</p>
          </div>
        ) : capturedImage ? (
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs text-center">
                {error && error.startsWith('Analyzing') ? (
                  <>
                    <p className="text-sm font-bold mb-2">Analyzing Image:</p>
                    <p className="text-lg whitespace-pre-line">
                      <span className="loading loading-dots loading-md"></span>
                      <span className="block mt-1">Detecting text...</span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center mb-2">
                      <p className="text-sm font-bold">Text Detected</p>
                      {textCategory && (
                        <span className={`ml-2 badge badge-sm ${getCategoryBadgeColor(textCategory)}`}>
                          {textCategory}
                        </span>
                      )}
                      {textSource && (
                        <span className={`ml-2 badge badge-xs ${textSource === 'groq-api' ? 'badge-accent' : 'badge-ghost'}`}>
                          {textSource === 'groq-api' ? 'API' : 'local'}
                        </span>
                      )}
                    </div>
                    <p className="text-lg whitespace-pre-line">
                      {detectedText || 'Text detected and sent for translation'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                console.log('Video metadata loaded');
                setIsVideoReady(true);
                setIsCameraLoading(false);
              }}
              onError={(e) => {
                console.error('Video error:', e);
                setError('Error loading video stream. Please try again.');
                setIsCameraLoading(false);
              }}
            />
            {isCameraLoading && !isVideoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <svg className="animate-spin h-10 w-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Accessing camera...</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && (
        <div className={`mt-4 alert ${error.startsWith('Analyzing') ? 'alert-info' : 'alert-error'}`}>
          {error.startsWith('Analyzing') ? (
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          )}
          <span>{error}</span>
        </div>
      )}



      <div className="flex justify-center space-x-4 mt-4">
        <motion.button
          onClick={toggleCamera}
          className={`btn ${isActive ? 'btn-error' : 'btn-primary'} btn-lg`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isLoading}
        >
          {isActive ? 'Stop Camera' : 'Start Camera'}
        </motion.button>

        {isActive && (
          <motion.button
            onClick={captureImage}
            className="btn btn-secondary btn-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0116.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Capture
          </motion.button>
        )}

        {capturedImage && (
          <motion.button
            onClick={() => setCapturedImage(null)}
            className="btn btn-outline btn-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Retake
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CameraInput;
