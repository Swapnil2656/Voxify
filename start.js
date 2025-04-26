import { spawn } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which .env file to use
const isProduction = process.env.NODE_ENV === 'production';
const envFile = isProduction ? '.env.production' : '.env';
console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`Using environment file: ${envFile}`);

// Load environment variables
if (fs.existsSync(path.join(__dirname, envFile))) {
  dotenv.config({ path: path.join(__dirname, envFile) });
  console.log('Environment variables loaded successfully');
} else {
  console.warn(`Warning: ${envFile} file not found. Using default environment variables.`);
  dotenv.config();
}

// Check if Groq API key is configured
if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY is not configured. Text translation will not work properly.');
  console.error('Please set the GROQ_API_KEY environment variable in your .env file.');
} else {
  console.log('Groq API key is configured');
}

console.log('Starting PolyLingo application...');

if (isProduction) {
  // In production, just start the server
  console.log('Running in production mode - starting server only');
  const serverProcess = spawn('npm', ['run', 'server:prod'], {
    stdio: 'inherit',
    shell: true
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start Express server:', error);
  });
} else {
  // In development, start both Vite and Express servers
  console.log('Running in development mode - starting both frontend and backend');

  // Start the Vite development server
  const viteProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (error) => {
    console.error('Failed to start Vite server:', error);
  });

  // Start the Express server
  const serverProcess = spawn('npm', ['run', 'server'], {
    stdio: 'inherit',
    shell: true
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start Express server:', error);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  viteProcess.kill();
  serverProcess.kill();
  process.exit(0);
});
