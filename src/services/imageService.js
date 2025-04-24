// Image processing service

/**
 * Extract text from an image using Groq API
 * @param {string} imageUrl - Base64 encoded image data
 * @param {string} sourceLanguage - Source language code (or 'auto' for auto-detection)
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} - Object containing extracted text and translation
 */
export const extractTextFromImage = async (imageUrl, sourceLanguage = 'auto', targetLanguage = 'en') => {
  console.log('Extracting text from image...');
  
  try {
    // For demo purposes, we'll use a mock implementation
    // In a real app, you would send the image to a server for processing
    
    // Simulate a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a simple hash from the image URL to get consistent results
    let hash = 0;
    const sampleStr = imageUrl.substring(0, 100);
    for (let i = 0; i < sampleStr.length; i++) {
      hash = ((hash << 5) - hash) + sampleStr.charCodeAt(i);
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
    const extractedText = sampleTexts[hash % sampleTexts.length];
    
    // Mock translations for different languages
    const translations = {
      'es': {
        "Welcome to our restaurant! Today's special: Grilled salmon with lemon sauce - $15.99": 
          "¡Bienvenido a nuestro restaurante! Especial de hoy: Salmón a la parrilla con salsa de limón - $15.99",
        "CAUTION: Wet Floor. Please watch your step.": 
          "PRECAUCIÓN: Piso mojado. Por favor, tenga cuidado al caminar.",
        "Opening Hours:\nMonday-Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed": 
          "Horario de apertura:\nLunes-Viernes: 9:00 AM - 6:00 PM\nSábado: 10:00 AM - 4:00 PM\nDomingo: Cerrado",
        "Gate A12\nFlight: BA287\nDeparture: 14:30\nDestination: London": 
          "Puerta A12\nVuelo: BA287\nSalida: 14:30\nDestino: Londres",
        "Museum Entrance\nAdults: $12\nStudents: $8\nChildren under 6: Free": 
          "Entrada al Museo\nAdultos: $12\nEstudiantes: $8\nNiños menores de 6 años: Gratis",
        "SALE! 50% OFF\nAll winter items\nLimited time only": 
          "¡OFERTA! 50% DE DESCUENTO\nTodos los artículos de invierno\nTiempo limitado",
        "WiFi Password: Guest2023\nNetwork: Visitor_Access": 
          "Contraseña WiFi: Guest2023\nRed: Visitor_Access",
        "Emergency Exit\nIn case of fire use stairs\nDo not use elevator": 
          "Salida de Emergencia\nEn caso de incendio use las escaleras\nNo use el ascensor",
        "Tourist Information Center\n123 Main Street\nPhone: +1-555-123-4567": 
          "Centro de Información Turística\n123 Calle Principal\nTeléfono: +1-555-123-4567",
        "Bus Schedule\nRoute 42\nEvery 15 minutes from 6:00 AM to 11:00 PM": 
          "Horario de Autobuses\nRuta 42\nCada 15 minutos de 6:00 AM a 11:00 PM"
      },
      'fr': {
        "Welcome to our restaurant! Today's special: Grilled salmon with lemon sauce - $15.99": 
          "Bienvenue dans notre restaurant ! Spécialité du jour : Saumon grillé avec sauce au citron - 15,99 $",
        "CAUTION: Wet Floor. Please watch your step.": 
          "ATTENTION : Sol mouillé. Veuillez faire attention où vous marchez.",
        "Opening Hours:\nMonday-Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed": 
          "Heures d'ouverture :\nLundi-Vendredi : 9h00 - 18h00\nSamedi : 10h00 - 16h00\nDimanche : Fermé",
        "Gate A12\nFlight: BA287\nDeparture: 14:30\nDestination: London": 
          "Porte A12\nVol : BA287\nDépart : 14h30\nDestination : Londres",
        "Museum Entrance\nAdults: $12\nStudents: $8\nChildren under 6: Free": 
          "Entrée du Musée\nAdultes : 12 $\nÉtudiants : 8 $\nEnfants de moins de 6 ans : Gratuit",
        "SALE! 50% OFF\nAll winter items\nLimited time only": 
          "SOLDES ! 50% DE RÉDUCTION\nTous les articles d'hiver\nTemps limité seulement",
        "WiFi Password: Guest2023\nNetwork: Visitor_Access": 
          "Mot de passe WiFi : Guest2023\nRéseau : Visitor_Access",
        "Emergency Exit\nIn case of fire use stairs\nDo not use elevator": 
          "Sortie de Secours\nEn cas d'incendie utilisez les escaliers\nN'utilisez pas l'ascenseur",
        "Tourist Information Center\n123 Main Street\nPhone: +1-555-123-4567": 
          "Centre d'Information Touristique\n123 Rue Principale\nTéléphone : +1-555-123-4567",
        "Bus Schedule\nRoute 42\nEvery 15 minutes from 6:00 AM to 11:00 PM": 
          "Horaire des Bus\nLigne 42\nToutes les 15 minutes de 6h00 à 23h00"
      }
    };
    
    // Get translation based on target language
    let translatedText = extractedText;
    if (translations[targetLanguage] && translations[targetLanguage][extractedText]) {
      translatedText = translations[targetLanguage][extractedText];
    } else {
      // If no specific translation is available, add a prefix
      translatedText = `[${targetLanguage.toUpperCase()}] ${extractedText}`;
    }
    
    return {
      success: true,
      sourceText: extractedText,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
      targetLanguage
    };
  } catch (error) {
    console.error('Error extracting text from image:', error);
    return {
      success: false,
      error: error.message || 'Failed to extract text from image'
    };
  }
};
