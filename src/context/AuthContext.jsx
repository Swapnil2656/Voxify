import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import supabase from '../services/supabaseClient';

const BACKEND_URL = 'http://localhost:3002';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      try {
        const session = await authService.getSession();
        console.log('Initial session:', session);
        if (session) {
          console.log('Setting token from session:', session.access_token);
          setToken(session.access_token);
          const userData = await authService.getCurrentUser();
          console.log('Current user data:', userData);
          setUser(userData);
        } else {
          console.log('No session found during initialization');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', { event, session });
        if (session) {
          setToken(session.access_token);
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } else {
          setToken(null);
          setUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login function using Supabase
  const login = async (email, password) => {
    try {
      console.log('Login attempt with:', { email });
      const result = await authService.signIn(email, password);
      console.log('Auth service signIn result:', result);

      const { user: userData, session } = result;

      if (!session) {
        console.error('No session returned from signIn');
        throw new Error('Failed to create session');
      }

      // Save to state (auth state listener will handle this, but we set it here for immediate feedback)
      console.log('Setting token and user:', { token: session.access_token, userData });
      setToken(session.access_token);
      setUser(userData);

      // Store session in localStorage as a backup
      localStorage.setItem('polylingo-session', JSON.stringify(session));
      localStorage.setItem('polylingo-user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  // Signup function using Supabase
  const signup = async (email, password, userData = {}) => {
    try {
      console.log('Signup attempt with:', { email, userData });
      const result = await authService.signUp(email, password, userData);
      console.log('Auth service signUp result:', result);

      const { user: newUser, session } = result;

      if (!newUser) {
        console.error('No user returned from signUp');
        throw new Error('Failed to create user');
      }

      // If email confirmation is required, session might be null
      if (session) {
        console.log('Setting token and user from signup:', { token: session.access_token, newUser });
        // Save to state
        setToken(session.access_token);
        setUser(newUser);

        // Store session in localStorage
        localStorage.setItem('polylingo-session', JSON.stringify(session));
        localStorage.setItem('polylingo-user', JSON.stringify(newUser));
      } else {
        console.log('No session returned from signUp (email confirmation required)');
      }

      return { user: newUser, session };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  // Logout function using Supabase
  const logout = async () => {
    try {
      await authService.signOut();

      // Clear state (auth state listener will handle this, but we clear it here for immediate feedback)
      setToken(null);
      setUser(null);

      // Clear localStorage
      localStorage.removeItem('polylingo-session');
      localStorage.removeItem('polylingo-user');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.message);

      // Even if the API call fails, clear local state and storage
      setToken(null);
      setUser(null);
      localStorage.removeItem('polylingo-session');
      localStorage.removeItem('polylingo-user');

      throw new Error(error.message || 'Failed to log out');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    console.log('isAuthenticated check, token:', token);

    // First check if we have a token in state
    if (token) {
      return true;
    }

    // If not, check localStorage as a fallback
    try {
      const sessionStr = localStorage.getItem('polylingo-session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session && session.access_token) {
          // If we found a valid session in localStorage but not in state,
          // update the state (this shouldn't normally happen, but it's a safety measure)
          if (!token) {
            console.log('Found token in localStorage but not in state, updating state');
            setToken(session.access_token);

            const userStr = localStorage.getItem('polylingo-user');
            if (userStr) {
              const userData = JSON.parse(userStr);
              setUser(userData);
            }
          }
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking localStorage for session:', error);
    }

    return false;
  };

  // Create auth header for API requests
  const authHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    authHeader
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
