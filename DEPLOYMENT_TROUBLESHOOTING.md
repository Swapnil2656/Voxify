# PolyLingo Deployment Troubleshooting Guide

This guide provides solutions for common issues that may occur when deploying the PolyLingo application.

## Text Translation Not Working in Deployment

If text translation is working locally but not in the deployed environment, follow these steps:

### 1. Check Server Logs

First, check your server logs for any errors related to the Groq API or CORS issues:

```bash
# If using Vercel
vercel logs

# If using Netlify
netlify functions:log

# If using a VPS
tail -f /path/to/your/logs/server.log
```

### 2. Verify Environment Variables

Make sure your Groq API key is properly set in your deployment environment:

- For Vercel: Check the Environment Variables section in your project settings
- For Netlify: Check the Environment Variables section in your site settings
- For VPS: Check your .env.production file or environment configuration

The required environment variable is:
```
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Test API Endpoints Directly

Test the API endpoints directly to see if they're responding:

```bash
# Replace with your actual deployed URL
curl -X POST -H "Content-Type: application/json" -d '{"text":"Hello", "targetLanguage":"es"}' https://your-deployed-app.com/api/translate
```

### 4. Check CORS Configuration

If you're seeing CORS errors in the browser console, make sure your server is properly configured to allow requests from your frontend domain.

### 5. Check Network Tab in Browser

Open your browser's developer tools and look at the Network tab when attempting a translation:
- Are the requests being sent to the correct URL?
- Are there any 4xx or 5xx errors?
- What is the response content?

### 6. Verify API URL Configuration

The application should automatically detect whether it's running in production or development and use the appropriate API URLs. If this is not working:

1. Open your browser console and look for logs showing:
   - "Environment: Production"
   - "Current origin: https://your-deployed-app.com"
   - "Translation API URL: https://your-deployed-app.com/api"

2. If these logs show incorrect values, you may need to manually update the API URL configuration in `src/services/translationService.js`.

### 7. Server-Side Proxy Issues

If your deployment uses a proxy or serverless functions, make sure they're properly configured to forward requests to the Groq API.

### 8. Groq API Rate Limits

Check if you've hit Groq API rate limits. If so, you may need to:
- Implement rate limiting on your server
- Contact Groq to increase your limits
- Implement more aggressive caching

## Quick Fixes

### Fix 1: Force Production Mode

Add this to your deployment environment variables:
```
NODE_ENV=production
```

### Fix 2: Explicit API URL

If automatic URL detection isn't working, you can explicitly set the API URL in your environment variables:
```
VITE_API_URL=https://your-deployed-app.com/api
```

### Fix 3: Restart the Server

Sometimes simply restarting the server can resolve issues:
```bash
# If using PM2
pm2 restart polylingo

# If using systemd
sudo systemctl restart polylingo
```

### Fix 4: Clear Browser Cache

Have users clear their browser cache or try in an incognito/private window.

## Still Having Issues?

If you've tried all the above solutions and are still experiencing problems, please:

1. Gather all relevant logs and error messages
2. Take screenshots of any error messages in the browser console
3. Document the steps you've taken to troubleshoot
4. Contact the development team with this information

Remember that the application includes fallback mechanisms that should provide translations even if the Groq API is unavailable, so users should still be able to use basic translation functionality.
