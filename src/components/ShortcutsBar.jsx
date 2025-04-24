import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaComments,
  FaSuitcase,
  FaWifi
} from 'react-icons/fa';

const ShortcutsBar = () => {
  const shortcuts = [
    {
      name: 'Conversation Mode',
      icon: <FaComments className="text-amber-500" />,
      href: '#conversation-mode',
      description: 'Real-time conversation translation'
    },
    {
      name: 'Travel Phrases',
      icon: <FaSuitcase className="text-blue-500" />,
      href: '#travel-phrases',
      description: 'Common phrases for travelers'
    },
    {
      name: 'Offline Mode',
      icon: <FaWifi className="text-green-500" />,
      href: '#offline-mode',
      description: 'Use translation without internet'
    }
  ];

  return (
    <>
      {/* Desktop version */}
      <motion.div
        className="hidden md:block bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm py-3 px-4 rounded-xl shadow-sm mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between space-x-4">
          {shortcuts.map((shortcut, index) => (
            <a
              key={index}
              href={shortcut.href}
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector(shortcut.href);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
                if (shortcut.onClick) shortcut.onClick();
              }}
              className="flex flex-col items-center justify-center px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors group flex-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-700/80 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-sm">
                {React.cloneElement(shortcut.icon, { className: shortcut.icon.props.className + " text-lg" })}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {shortcut.name}
              </span>
              <span className="hidden group-hover:block absolute mt-16 bg-gray-800/90 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                {shortcut.description}
              </span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Mobile version - centered */}
      <motion.div
        className="md:hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm py-2 px-2 rounded-xl shadow-sm mb-4 max-w-[280px] mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between space-x-2">
          {shortcuts.map((shortcut, index) => (
            <a
              key={index}
              href={shortcut.href}
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector(shortcut.href);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
                if (shortcut.onClick) shortcut.onClick();
              }}
              className="flex flex-col items-center justify-center px-2 py-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors group flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-gray-700/80 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-sm">
                {shortcut.icon}
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center">
                {shortcut.name}
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default ShortcutsBar;
