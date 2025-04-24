import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LearnMoreModal from './LearnMoreModal';

const HeroSection = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  const scrollToTranslationSection = () => {
    const section = document.getElementById('translation-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openLearnMore = () => {
    setIsLearnMoreOpen(true);
  };

  const closeLearnMore = () => {
    setIsLearnMoreOpen(false);
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              <span className="font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Voxify
              </span>{' '}
              - Break Language Barriers Anywhere You Go
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Start translating text and speech instantly with our powerful AI-driven language companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={scrollToTranslationSection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-lg"
              >
                Start Translating
              </motion.button>
              <motion.button
                onClick={openLearnMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline btn-lg"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-20 transform -rotate-6"></div>
            <img
              src="/travel-hero.svg"
              alt="Travel destinations"
              className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 z-20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">50+ Languages</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Translate anywhere</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Learn More Modal */}
      <LearnMoreModal isOpen={isLearnMoreOpen} onClose={closeLearnMore} />
    </section>
  );
};

export default HeroSection;
