import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner, FaUser, FaLock } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const BACKEND_URL = 'http://localhost:3002';

const LoginPage = ({ darkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowResendConfirmation(false);
    setIsLoading(true);

    console.log('Login attempt with credentials:', { email, passwordLength: password?.length });

    try {
      // Use the login function from AuthContext
      const result = await login(email, password);
      console.log('Login successful, result:', result);

      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Login error in LoginPage:', err);
      console.error('Error details:', { message: err.message, stack: err.stack });

      // Check if the error is about email confirmation
      if (err.message && err.message.includes('Email not confirmed')) {
        console.log('Email not confirmed, showing resend option');
        setShowResendConfirmation(true);
      }

      // Check if it's an invalid credentials error
      if (err.message && (err.message.includes('Invalid login') || err.message.includes('Invalid email') || err.message.includes('Invalid password'))) {
        console.log('Invalid credentials error detected');
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resendConfirmationEmail(email);
      setError('Confirmation email has been resent. Please check your inbox.');
    } catch (err) {
      console.error('Error resending confirmation email:', err);
      setError(err.message || 'Failed to resend confirmation email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your PolyLingo account</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6">
                <p>{error}</p>
                {showResendConfirmation && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                    className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                  >
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
