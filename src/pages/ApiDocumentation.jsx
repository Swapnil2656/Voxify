import React from 'react';
import { FaCode } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const ApiDocumentation = ({ darkMode, toggleDarkMode }) => {
  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="API Documentation"
      subtitle="Integrate PolyLingo's powerful translation capabilities into your applications"
      icon={<FaCode size={24} />}
    >
      <h2>Integrate PolyLingo's Translation Power Into Your Applications</h2>
      <p>
        The PolyLingo API gives developers access to our powerful translation capabilities,
        allowing you to integrate multilingual features into your own applications, websites,
        or services. Our RESTful API is designed to be easy to use, reliable, and scalable.
      </p>

      <h3>Getting Started</h3>
      <p>
        To use the PolyLingo API, you'll need an API key. You can obtain one by:
      </p>
      <ol>
        <li>Creating a PolyLingo account</li>
        <li>Navigating to the Developer Dashboard</li>
        <li>Generating a new API key</li>
      </ol>
      <p>
        Your API key should be included in all requests to the PolyLingo API as a header:
      </p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`Authorization: Bearer YOUR_API_KEY`}
        </code>
      </pre>

      <h3>Base URL</h3>
      <p>All API requests should be made to:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`https://api.polylingo.app/v1/`}
        </code>
      </pre>

      <h3>Text Translation</h3>
      <p>Translate text from one language to another:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`POST /translate

Request Body:
{
  "text": "Hello, how are you?",
  "source_language": "en",  // Optional, auto-detect if not provided
  "target_language": "es"
}

Response:
{
  "translation": "Hola, ¿cómo estás?",
  "detected_language": "en",  // Only included if source_language was not provided
  "confidence": 0.98
}`}
        </code>
      </pre>

      <h3>Batch Translation</h3>
      <p>Translate multiple texts in a single request:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`POST /translate/batch

Request Body:
{
  "texts": [
    "Hello",
    "Goodbye",
    "Thank you"
  ],
  "source_language": "en",
  "target_language": "fr"
}

Response:
{
  "translations": [
    {
      "text": "Hello",
      "translation": "Bonjour",
      "confidence": 0.99
    },
    {
      "text": "Goodbye",
      "translation": "Au revoir",
      "confidence": 0.99
    },
    {
      "text": "Thank you",
      "translation": "Merci",
      "confidence": 0.99
    }
  ]
}`}
        </code>
      </pre>

      <h3>Language Detection</h3>
      <p>Detect the language of a given text:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`POST /detect

Request Body:
{
  "text": "Bonjour, comment ça va?"
}

Response:
{
  "language": "fr",
  "confidence": 0.97,
  "alternatives": [
    {
      "language": "fr",
      "confidence": 0.97
    },
    {
      "language": "ca",
      "confidence": 0.02
    }
  ]
}`}
        </code>
      </pre>

      <h3>Text-to-Speech</h3>
      <p>Convert text to speech in a specified language:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`POST /tts

Request Body:
{
  "text": "Hello, how are you?",
  "language": "en",
  "voice": "female",  // Options: "male", "female"
  "speed": 1.0        // 0.5 to 2.0, with 1.0 being normal speed
}

Response:
{
  "audio_url": "https://api.polylingo.app/v1/audio/12345.mp3",
  "audio_data": "base64_encoded_audio_data"  // Only included if requested
}`}
        </code>
      </pre>

      <h3>Image Translation</h3>
      <p>Extract and translate text from an image:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`POST /translate/image

Request Body:
{
  "image": "base64_encoded_image",
  "source_language": "auto",  // "auto" for automatic detection
  "target_language": "en"
}

Response:
{
  "detected_language": "ja",
  "translations": [
    {
      "original_text": "こんにちは",
      "translated_text": "Hello",
      "bounding_box": {
        "x": 100,
        "y": 200,
        "width": 150,
        "height": 50
      }
    }
    // More text regions...
  ]
}`}
        </code>
      </pre>

      <h3>Rate Limits</h3>
      <p>
        API rate limits depend on your subscription plan:
      </p>
      <ul>
        <li><strong>Free:</strong> 100 requests per day</li>
        <li><strong>Basic:</strong> 1,000 requests per day</li>
        <li><strong>Professional:</strong> 10,000 requests per day</li>
        <li><strong>Enterprise:</strong> Custom limits</li>
      </ul>

      <h3>Error Handling</h3>
      <p>
        The API uses standard HTTP status codes and returns error details in the response body:
      </p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          {`{
  "error": {
    "code": "invalid_request",
    "message": "Missing required parameter: target_language",
    "status": 400
  }
}`}
        </code>
      </pre>

      <h3>SDKs and Client Libraries</h3>
      <p>
        We provide official client libraries for popular programming languages:
      </p>
      <ul>
        <li>JavaScript/TypeScript</li>
        <li>Python</li>
        <li>Java</li>
        <li>C#/.NET</li>
        <li>PHP</li>
        <li>Ruby</li>
        <li>Go</li>
      </ul>

      <p>
        For detailed documentation, code examples, and SDK downloads, please visit our
        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline"> Developer Portal</a>.
      </p>

      <h3>Support</h3>
      <p>
        If you have any questions or need assistance with the API, please contact our developer
        support team at <a href="mailto:api-support@polylingo.app" className="text-blue-600 dark:text-blue-400 hover:underline">api-support@polylingo.app</a>.
      </p>
    </FooterPageTemplate>
  );
};

export default ApiDocumentation;
