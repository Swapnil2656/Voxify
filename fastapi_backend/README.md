# PolyLingo FastAPI Backend

This is the FastAPI backend for the PolyLingo translation app. It provides robust OCR and translation services for camera and image-upload based translation, fixing the issues with the previous implementation.

## Features

- **Robust OCR**: Extract text from images using Tesseract OCR with proper error handling and timeouts
- **Image Preprocessing**: Enhance images before OCR to improve accuracy
- **Translation**: Translate text using Groq API with proper error handling and timeouts
- **Fallback Mechanisms**: Multiple fallback strategies for both OCR and translation
- **Comprehensive Logging**: Detailed logging for debugging and monitoring
- **Error Handling**: Proper error handling and reporting to the frontend

## Fixed Issues

- **Stalled Translations**: Added timeout mechanisms to prevent hanging
- **Empty OCR Results**: Added validation and preprocessing to improve OCR accuracy
- **Random/Unrelated Outputs**: Improved error handling and fallback mechanisms
- **Frontend Infinite Spinner**: Ensured proper error responses are sent to the frontend

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Install Tesseract OCR:

- **Windows**: Download and install from https://github.com/UB-Mannheim/tesseract/wiki
- **macOS**: `brew install tesseract`
- **Linux**: `sudo apt-get install tesseract-ocr`

3. Create a `.env` file based on `.env.example` and add your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

## Running the Server

```bash
python run.py
```

Or directly with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Testing the Implementation

You can test the OCR and translation functionality separately using the test script:

```bash
python test_ocr_translation.py
```

This will test:
1. Translation to multiple languages
2. OCR on a test image (if provided)
3. The complete OCR + translation pipeline

## API Endpoints

### Image Translation

**Endpoint**: `POST /api/image-translate`

**Request Body**:
```json
{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  "targetLang": "es",
  "sourceLanguage": "auto",
  "enhanceOcr": true
}
```

**Response**:
```json
{
  "success": true,
  "sourceText": "Hello world",
  "translated": "Hola mundo",
  "targetLanguage": "es",
  "processingTimeMs": 1234
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "No readable text found in the image",
  "errorType": "OCR_ERROR",
  "processingTimeMs": 567
}
```

### Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy"
}
```

## Error Types

- `VALIDATION_ERROR`: Invalid input data
- `OCR_ERROR`: Failed to extract text from image
- `TRANSLATION_ERROR`: Failed to translate text
- `SERVER_ERROR`: Unexpected server error

## Logs

Logs are stored in the `logs` directory. The log file is rotated when it reaches 10MB and old logs are deleted after 7 days.

## Integration with Frontend

Update the frontend to call the FastAPI backend instead of the Express backend. The API endpoint is compatible with the existing frontend code.

See the `FRONTEND_INTEGRATION.md` file for detailed instructions on how to integrate with the frontend.
