import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const PrivacyPolicy = ({ darkMode, toggleDarkMode }) => {
  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information"
      icon={<FaShieldAlt size={24} />}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Last Updated: June 1, 2023
      </p>

      <h2>Introduction</h2>
      <p>
        PolyLingo ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information when you use our
        translation service, website, and mobile application (collectively, the "Service").
      </p>
      <p>
        Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge
        that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
      </p>

      <h2>Information We Collect</h2>

      <h3>Personal Information</h3>
      <p>
        We may collect personal information that you voluntarily provide to us when you:
      </p>
      <ul>
        <li>Create an account</li>
        <li>Use our translation services</li>
        <li>Contact our customer support</li>
        <li>Subscribe to our newsletter</li>
        <li>Participate in surveys or promotions</li>
      </ul>
      <p>
        This information may include:
      </p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Billing information</li>
        <li>User preferences and settings</li>
      </ul>

      <h3>Translation Content</h3>
      <p>
        When you use our translation services, we collect the content you submit for translation,
        including text, images containing text, and audio recordings for speech-to-text translation.
      </p>

      <h3>Usage Information</h3>
      <p>
        We automatically collect certain information about your device and how you interact with our Service, including:
      </p>
      <ul>
        <li>IP address</li>
        <li>Device type and operating system</li>
        <li>Browser type</li>
        <li>Pages viewed and features used</li>
        <li>Time spent on the Service</li>
        <li>Referring website or application</li>
        <li>Language preferences</li>
      </ul>

      <h3>Cookies and Similar Technologies</h3>
      <p>
        We use cookies and similar tracking technologies to collect information about your browsing
        activities and to improve your experience on our Service. You can control cookies through
        your browser settings and other tools. For more details, please see our Cookie Policy.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We may use the information we collect for various purposes, including to:
      </p>
      <ul>
        <li>Provide, maintain, and improve our Service</li>
        <li>Process and complete transactions</li>
        <li>Send administrative information, such as updates, security alerts, and support messages</li>
        <li>Respond to your comments, questions, and requests</li>
        <li>Personalize your experience and deliver content relevant to your interests</li>
        <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
        <li>Detect, prevent, and address technical issues, fraud, and other illegal activities</li>
        <li>Develop new products, services, features, and functionality</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h3>Translation Content Processing</h3>
      <p>
        The content you submit for translation is processed to provide the translation service.
        This processing may include:
      </p>
      <ul>
        <li>Sending the content to our AI translation models</li>
        <li>Temporary storage to complete the translation</li>
        <li>Quality improvement of our translation algorithms</li>
      </ul>
      <p>
        By default, we do not permanently store your translation content after the translation is
        completed. However, if you enable the translation history feature, we will store your
        translation content in your account for your convenience.
      </p>

      <h2>How We Share Your Information</h2>
      <p>
        We may share your information in the following circumstances:
      </p>

      <h3>Service Providers</h3>
      <p>
        We may share your information with third-party vendors, service providers, contractors,
        or agents who perform services for us or on our behalf, such as payment processing, data
        analysis, email delivery, hosting services, customer service, and marketing assistance.
      </p>

      <h3>Business Transfers</h3>
      <p>
        If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale
        of company assets, your information may be transferred as part of that transaction.
      </p>

      <h3>Legal Requirements</h3>
      <p>
        We may disclose your information if required to do so by law or in response to valid requests
        by public authorities (e.g., a court or government agency).
      </p>

      <h3>Protection of Rights</h3>
      <p>
        We may disclose your information to protect the rights, property, or safety of PolyLingo,
        our users, or others.
      </p>

      <h3>With Your Consent</h3>
      <p>
        We may share your information with third parties when you have given us your consent to do so.
      </p>

      <h2>Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect the security of your
        personal information. However, please be aware that no method of transmission over the Internet
        or method of electronic storage is 100% secure. While we strive to use commercially acceptable
        means to protect your personal information, we cannot guarantee its absolute security.
      </p>

      <h2>Your Rights and Choices</h2>
      <p>
        Depending on your location, you may have certain rights regarding your personal information, including:
      </p>
      <ul>
        <li>Access to your personal information</li>
        <li>Correction of inaccurate or incomplete information</li>
        <li>Deletion of your personal information</li>
        <li>Restriction or objection to processing</li>
        <li>Data portability</li>
        <li>Withdrawal of consent</li>
      </ul>
      <p>
        To exercise these rights, please contact us using the information provided in the "Contact Us" section.
      </p>

      <h3>Account Information</h3>
      <p>
        You can review and update your account information by logging into your account settings.
        You may also deactivate your account by contacting us directly.
      </p>

      <h3>Marketing Communications</h3>
      <p>
        You can opt out of receiving promotional emails from us by following the instructions in those
        emails. If you opt out, we may still send you non-promotional emails, such as those about your
        account or our ongoing business relations.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        Our Service is not directed to children under the age of 13, and we do not knowingly collect
        personal information from children under 13. If we learn that we have collected personal
        information from a child under 13, we will promptly delete that information.
      </p>

      <h2>International Data Transfers</h2>
      <p>
        Your information may be transferred to, and processed in, countries other than the country in
        which you are resident. These countries may have data protection laws that are different from
        those of your country. We have taken appropriate safeguards to ensure that your personal
        information remains protected in accordance with this Privacy Policy.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be indicated by
        an updated "Last Updated" date at the top of this Privacy Policy. We encourage you to review
        this Privacy Policy frequently to stay informed about how we are protecting your information.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy or our privacy practices,
        please contact us at:
      </p>
      <p>
        Email: <a href="mailto:privacy@polylingo.app" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@polylingo.app</a>
      </p>
      <p>
        Postal Address:<br />
        PolyLingo Privacy Team<br />
        123 Translation Avenue<br />
        San Francisco, CA 94105<br />
        United States
      </p>
    </FooterPageTemplate>
  );
};

export default PrivacyPolicy;
