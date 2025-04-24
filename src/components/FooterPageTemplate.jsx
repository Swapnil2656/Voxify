import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const FooterPageTemplate = ({ darkMode, toggleDarkMode, title, children, subtitle, icon }) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Function to generate breadcrumbs
  const generateBreadcrumbs = () => {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');

    return (
      <div className="flex items-center text-sm text-white/70 mb-6">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white font-medium">{title}</span>
      </div>
    );
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 bg-gradient-to-br from-blue-700 to-purple-800 rounded-xl shadow-xl text-white">
        {/* Breadcrumbs */}
        {generateBreadcrumbs()}

        <motion.div
          className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg overflow-hidden text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with animated gradient background */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-x"></div>
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/30"
                  style={{
                    width: `${Math.random() * 50 + 10}px`,
                    height: `${Math.random() * 50 + 10}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                ></div>
              ))}
            </div>
            <div className="relative p-10 text-white z-10">
              <div className="flex flex-col md:flex-row md:items-center">
                {icon && (
                  <div className="mb-4 md:mb-0 md:mr-6 bg-white/20 p-4 rounded-lg inline-flex items-center justify-center transform transition-transform hover:scale-110">
                    {React.cloneElement(icon, { size: 36 })}
                  </div>
                )}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
                  {subtitle && <p className="mt-3 text-xl text-blue-100 max-w-3xl">{subtitle}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            <motion.div
              className="prose prose-invert max-w-none prose-headings:relative prose-headings:text-white prose-p:text-white/90 prose-a:text-white prose-a:underline prose-strong:text-white prose-h2:pl-4 prose-h2:border-l-4 prose-h2:border-white/50 prose-h2:py-1 prose-h3:text-white prose-img:rounded-xl prose-img:shadow-md prose-li:text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {children}
            </motion.div>

            {/* Call to action */}
            <motion.div
              className="mt-16 bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold text-white mb-2">Have Questions?</h3>
                  <p className="text-white/80 max-w-md">Our support team is here to help you with any questions you may have about our translation services.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@polylingo.app"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Support
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white border border-white/50 rounded-lg hover:bg-white/10 transition-all transform hover:scale-105 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    View FAQ
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Back to top button */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/30 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to top
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default FooterPageTemplate;
