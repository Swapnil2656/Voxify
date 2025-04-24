import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import supabase from '../services/supabaseClient';
import Layout from '../components/Layout';

const AuthCallback = ({ darkMode, toggleDarkMode }) => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash
        const hash = window.location.hash;
        
        // Process the callback
        if (hash && hash.includes('access_token')) {
          // The hash contains an access token, which means the user has confirmed their email
          setStatus('success');
          
          // Wait a moment before redirecting
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          // Check if there's an error in the URL
          const url = new URL(window.location.href);
          const errorParam = url.searchParams.get('error');
          const errorDescription = url.searchParams.get('error_description');
          
          if (errorParam) {
            setStatus('error');
            setError(errorDescription || 'An error occurred during authentication.');
          } else {
            // No access token and no error, try to get the session
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              setStatus('error');
              setError(error.message);
            } else if (data.session) {
              // User is already authenticated
              setStatus('success');
              
              // Wait a moment before redirecting
              setTimeout(() => {
                navigate('/');
              }, 2000);
            } else {
              // No session, no token, no error - something went wrong
              setStatus('error');
              setError('No authentication data found. Please try signing in again.');
            }
          }
        }
      } catch (err) {
        console.error('Error processing auth callback:', err);
        setStatus('error');
        setError(err.message || 'An unexpected error occurred.');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="flex justify-center items-center py-12 flex-grow">
        <motion.div
          className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {status === 'processing' && 'Processing your authentication...'}
                {status === 'success' && 'Authentication successful!'}
                {status === 'error' && 'Authentication failed'}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              {status === 'processing' && (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              )}
              
              {status === 'success' && (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg w-full text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>You have been successfully authenticated. Redirecting you shortly...</p>
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p>{error || 'An error occurred during authentication.'}</p>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AuthCallback;
