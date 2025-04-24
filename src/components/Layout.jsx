import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ShortcutsBar from './ShortcutsBar';
import DatabaseStatus from './DatabaseStatus';

const Layout = ({
  children,
  darkMode,
  onToggleDarkMode
}) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLearnMorePage = location.pathname === '/learn-more';

  // Check if current page is a footer page or other page where shortcuts shouldn't appear
  const isFooterPage = [
    '/how-it-works',
    '/supported-languages',
    '/api-documentation',
    '/pricing',
    '/blog',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/profile',
    '/auth/callback',
    '/learning-hub'
  ].includes(location.pathname);
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div
        className={`transition-colors duration-300 min-h-screen ${isAuthPage ? 'flex flex-col' : ''}`}
        style={{
          backgroundImage: darkMode ? 'url(/colorful-pattern-dark.svg)' : 'url(/colorful-pattern.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Header darkMode={darkMode} toggleDarkMode={onToggleDarkMode} />

        {!isAuthPage && !isLearnMorePage && !isFooterPage && (
          <div className="container mx-auto px-4 sm:px-6 pt-4 max-w-6xl">
            <ShortcutsBar />
          </div>
        )}

        <motion.main
          className={`container mx-auto px-4 sm:px-6 py-4 max-w-6xl ${isAuthPage ? 'flex-grow' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>

        {!isAuthPage && <Footer />}
        <DatabaseStatus />
      </div>
    </div>
  );
};

export default Layout;
