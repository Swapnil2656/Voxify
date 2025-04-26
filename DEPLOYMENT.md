# PolyLingo Deployment Guide

This guide provides instructions for deploying the PolyLingo application to a production environment.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- A server or hosting platform (Vercel, Netlify, Heroku, etc.)
- Groq API key

## Deployment Steps

### 1. Prepare the Environment

Make sure your `.env.production` file is properly configured with the following variables:

```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=/api
VITE_FASTAPI_URL=/fastapi

# Set production mode
NODE_ENV=production
```

### 2. Build the Application

Run the production build command:

```bash
npm run build:prod
```

This will create a production-ready build in the `dist` directory.

### 3. Deploy to a Hosting Platform

#### Option A: Deploy to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the application:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your deployment.

4. Set environment variables in the Vercel dashboard.

#### Option B: Deploy to Netlify

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy the application:
   ```bash
   netlify deploy
   ```

3. Follow the prompts to configure your deployment.

4. Set environment variables in the Netlify dashboard.

#### Option C: Deploy to a VPS or Dedicated Server

1. Transfer the files to your server:
   ```bash
   scp -r dist server.js package.json .env.production start.js user@your-server:/path/to/deployment
   ```

2. SSH into your server:
   ```bash
   ssh user@your-server
   ```

3. Navigate to the deployment directory:
   ```bash
   cd /path/to/deployment
   ```

4. Install dependencies:
   ```bash
   npm install --production
   ```

5. Start the application:
   ```bash
   NODE_ENV=production node start.js
   ```

6. (Optional) Set up a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start start.js --name polylingo
   pm2 save
   ```

### 4. Verify the Deployment

1. Visit your deployed application URL
2. Test the text translation functionality to ensure it's working with the Groq API
3. Test the camera translation functionality
4. Test the conversation mode

## Troubleshooting

### Text Translation Not Working

If text translation is not working in production:

1. Check the server logs for any errors related to the Groq API
2. Verify that the `GROQ_API_KEY` environment variable is set correctly
3. Check the browser console for any API errors
4. Ensure the server is properly configured to handle API requests

### CORS Issues

If you're experiencing CORS issues:

1. Make sure your server is properly configured to allow cross-origin requests
2. Check that the API URLs in the frontend are correctly pointing to your deployed backend

### Server Connection Issues

If the frontend cannot connect to the backend:

1. Verify that the API URLs are correctly configured for production
2. Check that your server is running and accessible
3. Ensure any necessary proxies or redirects are properly set up

## Maintenance

- Regularly update dependencies to ensure security and performance
- Monitor server logs for any errors or issues
- Keep your Groq API key secure and rotate it periodically
- Back up your environment configuration and database (if applicable)

For additional help or questions, please contact the development team.
