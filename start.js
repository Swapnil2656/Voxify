import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Starting Voxify application...');

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

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  viteProcess.kill();
  serverProcess.kill();
  process.exit(0);
});
