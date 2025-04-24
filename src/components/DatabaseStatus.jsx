import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';

const DatabaseStatus = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        // Try to get the current user to check if Supabase is connected
        const { data, error } = await supabase.auth.getSession();
        
        if (error && error.message.includes('Failed to fetch')) {
          setStatus('disconnected');
          setError('Cannot connect to Supabase');
        } else {
          setStatus('connected');
          setError(null);
        }
      } catch (err) {
        console.error('Error checking database connection:', err);
        setStatus('error');
        setError(err.message);
      }
    };
    
    checkDatabaseConnection();
    
    // Set up a periodic check every 30 seconds
    const interval = setInterval(checkDatabaseConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1.5 rounded-full text-xs flex items-center shadow-lg">
        <div className="animate-pulse w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
        Checking database...
      </div>
    );
  }

  if (status === 'disconnected' || status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-800 text-white px-3 py-1.5 rounded-full text-xs flex items-center shadow-lg">
        <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
        Database disconnected {error && `(${error})`}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-800 text-white px-3 py-1.5 rounded-full text-xs flex items-center shadow-lg">
      <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
      Database connected
    </div>
  );
};

export default DatabaseStatus;
