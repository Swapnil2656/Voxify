import React from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const Pricing = ({ darkMode, toggleDarkMode }) => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Basic translation for casual users",
      features: [
        "Text translation (up to 500 characters per request)",
        "10 translations per day",
        "5 supported languages",
        "Basic speech-to-text",
        "Standard translation quality",
        "Web access only"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Enhanced features for regular users",
      features: [
        "Unlimited text translation",
        "Unlimited translations",
        "All supported languages",
        "Advanced speech-to-text",
        "High-quality translation",
        "Image translation",
        "Web and mobile access",
        "Offline mode for essential phrases",
        "No ads"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Professional",
      price: "$19.99",
      period: "per month",
      description: "Advanced features for power users",
      features: [
        "All Premium features",
        "Priority processing",
        "Specialized domain translations",
        "Document translation",
        "Conversation mode",
        "Custom terminology",
        "Translation history and favorites",
        "Priority support",
        "API access (1,000 requests/day)"
      ],
      cta: "Start Free Trial",
      highlighted: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for organizations",
      features: [
        "All Professional features",
        "Custom integration options",
        "Dedicated account manager",
        "SLA guarantees",
        "Enhanced security features",
        "Team collaboration tools",
        "Custom AI model training",
        "Unlimited API access",
        "24/7 premium support"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="Pricing"
      subtitle="Flexible plans for individuals, professionals, and enterprises"
      icon={<FaMoneyBillWave size={24} />}
    >
      <h2>Choose the Perfect Plan for Your Translation Needs</h2>
      <p className="mb-8">
        PolyLingo offers flexible pricing options to suit individual users, professionals,
        and enterprises. All plans come with a 14-day free trial, no credit card required.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`rounded-xl overflow-hidden shadow-lg ${
              plan.highlighted
                ? 'border-2 border-blue-500 dark:border-blue-400'
                : 'border border-gray-200 dark:border-gray-700'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className={`p-6 ${
              plan.highlighted
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800'
            }`}>
              <h3 className={`text-xl font-bold ${!plan.highlighted && 'text-gray-900 dark:text-white'}`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="ml-1 text-sm opacity-80">/{plan.period}</span>
              </div>
              <p className={`mt-2 text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {plan.description}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-6 w-full py-2 px-4 rounded-lg font-medium ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-colors`}
              >
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <h3>Frequently Asked Questions</h3>

      <div className="space-y-6 mt-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Can I switch plans at any time?</h4>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Is there a free trial?</h4>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">What payment methods do you accept?</h4>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Can I cancel my subscription?</h4>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to your plan until the end of your current billing period.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Do you offer discounts for annual billing?</h4>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Yes, you can save 20% by choosing annual billing on any of our paid plans.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Is there a student discount?</h4>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Yes, we offer a 50% discount for students and educators with valid ID. Contact our support team to apply for the educational discount.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Need a Custom Solution?</h3>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          If you have specific requirements or need a tailored solution for your organization,
          our team is ready to help. Contact us to discuss your needs and get a custom quote.
        </p>
        <button className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Contact Sales
        </button>
      </div>
    </FooterPageTemplate>
  );
};

export default Pricing;
