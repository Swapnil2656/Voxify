// Configuration service to manage API URLs and other settings
// This allows us to use environment variables and have different configurations for development and production

// Get API URL from environment variables or use fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get FastAPI URL from environment variables or use fallback
const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8004';

// Check if we're in a deployed environment (not localhost)
const isDeployed = !window.location.hostname.includes('localhost');

// In deployed environments, we'll use relative URLs for API calls
// This assumes the FastAPI backend is deployed alongside the main app
const getApiUrl = () => {
  if (isDeployed) {
    // Use relative URL in production
    return '/api';
  }
  return API_URL;
};

// For FastAPI, we'll use a proxy through the main server in production
const getFastApiUrl = () => {
  if (isDeployed) {
    // In production, FastAPI requests will be proxied through the main server
    return '/fastapi';
  }
  return FASTAPI_URL;
};

// Log configuration for debugging
console.log('Config Service Initialized:');
console.log('- API URL:', getApiUrl());
console.log('- FastAPI URL:', getFastApiUrl());
console.log('- Is Deployed:', isDeployed);

export default {
  getApiUrl,
  getFastApiUrl,
  isDeployed
};
