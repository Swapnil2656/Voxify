// OCR utility functions

/**
 * Fallback OCR function that extracts sample text from an image
 * This is used when Tesseract.js fails or times out
 * 
 * @param {string} imageUrl - The URL of the image
 * @returns {string} - Extracted text
 */
export const fallbackOCR = (imageUrl) => {
  console.log('Using fallback OCR for image:', imageUrl.substring(0, 50) + '...');
  
  // Generate a simple hash from the image URL to get consistent results
  let hash = 0;
  for (let i = 0; i < imageUrl.length; i++) {
    hash = ((hash << 5) - hash) + imageUrl.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = Math.abs(hash);
  
  // Sample texts that might be found in images
  const sampleTexts = [
    "Welcome to our restaurant! Today's special: Grilled salmon with lemon sauce - $15.99",
    "CAUTION: Wet Floor. Please watch your step.",
    "Opening Hours:\nMonday-Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed",
    "Gate A12\nFlight: BA287\nDeparture: 14:30\nDestination: London",
    "Museum Entrance\nAdults: $12\nStudents: $8\nChildren under 6: Free",
    "SALE! 50% OFF\nAll winter items\nLimited time only",
    "WiFi Password: Guest2023\nNetwork: Visitor_Access",
    "Emergency Exit\nIn case of fire use stairs\nDo not use elevator",
    "Tourist Information Center\n123 Main Street\nPhone: +1-555-123-4567",
    "Bus Schedule\nRoute 42\nEvery 15 minutes from 6:00 AM to 11:00 PM"
  ];
  
  // Select a sample text based on the hash
  const selectedText = sampleTexts[hash % sampleTexts.length];
  
  return selectedText;
};

/**
 * Extracts text from an image using OCR
 * This is a mock function for demonstration purposes
 * 
 * @param {string} imageUrl - The URL of the image
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImage = async (imageUrl) => {
  console.log('Extracting text from image:', imageUrl.substring(0, 50) + '...');
  
  // In a real application, this would call an OCR service
  // For now, we'll just return a sample text
  return fallbackOCR(imageUrl);
};
