import React from 'react';
import { FaCookieBite } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const CookiePolicy = ({ darkMode, toggleDarkMode }) => {
  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="Cookie Policy"
      subtitle="How we use cookies and similar technologies"
      icon={<FaCookieBite size={24} />}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Last Updated: June 1, 2023
      </p>

      <h2>Introduction</h2>
      <p>
        This Cookie Policy explains how PolyLingo ("we," "our," or "us") uses cookies and similar
        technologies to recognize you when you visit our website and use our services (collectively,
        the "Service"). It explains what these technologies are and why we use them, as well as your
        rights to control our use of them.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small data files that are placed on your computer or mobile device when you visit
        a website. Cookies are widely used by website owners to make their websites work, or to work
        more efficiently, as well as to provide reporting information.
      </p>
      <p>
        Cookies set by the website owner (in this case, PolyLingo) are called "first-party cookies."
        Cookies set by parties other than the website owner are called "third-party cookies." Third-party
        cookies enable third-party features or functionality to be provided on or through the website
        (e.g., advertising, interactive content, and analytics). The parties that set these third-party
        cookies can recognize your computer both when it visits the website in question and also when
        it visits certain other websites.
      </p>

      <h2>Why Do We Use Cookies?</h2>
      <p>
        We use first-party and third-party cookies for several reasons. Some cookies are required for
        technical reasons in order for our Service to operate, and we refer to these as "essential" or
        "strictly necessary" cookies. Other cookies also enable us to track and target the interests of
        our users to enhance the experience on our Service. Third parties serve cookies through our
        Service for advertising, analytics, and other purposes.
      </p>

      <h2>Types of Cookies We Use</h2>
      <p>
        The specific types of first and third-party cookies served through our Service and the purposes
        they perform are described below:
      </p>

      <h3>Essential Cookies</h3>
      <p>
        These cookies are strictly necessary to provide you with services available through our Service
        and to use some of its features, such as access to secure areas. Because these cookies are
        strictly necessary to deliver the Service, you cannot refuse them without impacting how our
        Service functions.
      </p>
      <ul>
        <li><strong>Session Cookies:</strong> These cookies are used to maintain your session state and authentication status.</li>
        <li><strong>Security Cookies:</strong> These cookies help us detect and prevent security risks.</li>
      </ul>

      <h3>Performance and Functionality Cookies</h3>
      <p>
        These cookies are used to enhance the performance and functionality of our Service but are
        non-essential to its use. However, without these cookies, certain functionality may become
        unavailable.
      </p>
      <ul>
        <li><strong>Preference Cookies:</strong> These cookies remember your preferences and settings.</li>
        <li><strong>Language Cookies:</strong> These cookies remember your language preferences.</li>
      </ul>

      <h3>Analytics and Customization Cookies</h3>
      <p>
        These cookies collect information that is used either in aggregate form to help us understand
        how our Service is being used or how effective our marketing campaigns are, or to help us
        customize our Service for you.
      </p>
      <ul>
        <li><strong>Google Analytics:</strong> We use Google Analytics to understand how users interact with our Service.</li>
        <li><strong>Hotjar:</strong> We use Hotjar to analyze user behavior and improve our Service.</li>
      </ul>

      <h3>Advertising Cookies</h3>
      <p>
        These cookies are used to make advertising messages more relevant to you. They perform functions
        like preventing the same ad from continuously reappearing, ensuring that ads are properly
        displayed, and in some cases selecting advertisements that are based on your interests.
      </p>
      <ul>
        <li><strong>Google Ads:</strong> We use Google Ads cookies to track conversions and serve targeted advertisements.</li>
        <li><strong>Facebook Pixel:</strong> We use Facebook Pixel to measure the effectiveness of our advertising campaigns.</li>
      </ul>

      <h3>Social Media Cookies</h3>
      <p>
        These cookies are used to enable you to share pages and content that you find interesting on
        our Service through third-party social networking and other websites. These cookies may also
        be used for advertising purposes.
      </p>
      <ul>
        <li><strong>Facebook:</strong> We use Facebook cookies to enable social sharing functionality.</li>
        <li><strong>Twitter:</strong> We use Twitter cookies to enable social sharing functionality.</li>
        <li><strong>LinkedIn:</strong> We use LinkedIn cookies to enable social sharing functionality.</li>
      </ul>

      <h2>How Can You Control Cookies?</h2>
      <p>
        You have the right to decide whether to accept or reject cookies. You can exercise your cookie
        preferences by clicking on the appropriate opt-out links provided in the cookie table above.
      </p>
      <p>
        You can also set or amend your web browser controls to accept or refuse cookies. If you choose
        to reject cookies, you may still use our Service, but your access to some functionality and
        areas of our Service may be restricted. As the means by which you can refuse cookies through
        your web browser controls vary from browser to browser, you should visit your browser's help
        menu for more information.
      </p>
      <p>
        In addition, most advertising networks offer you a way to opt out of targeted advertising. If
        you would like to find out more information, please visit:
      </p>
      <ul>
        <li><a href="http://www.aboutads.info/choices/" className="text-blue-600 dark:text-blue-400 hover:underline">Digital Advertising Alliance</a></li>
        <li><a href="https://youradchoices.ca/" className="text-blue-600 dark:text-blue-400 hover:underline">Digital Advertising Alliance of Canada</a></li>
        <li><a href="http://www.youronlinechoices.com/" className="text-blue-600 dark:text-blue-400 hover:underline">European Interactive Digital Advertising Alliance</a></li>
      </ul>

      <h2>How Often Will We Update This Cookie Policy?</h2>
      <p>
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to
        the cookies we use or for other operational, legal, or regulatory reasons. Please therefore
        revisit this Cookie Policy regularly to stay informed about our use of cookies and related
        technologies.
      </p>
      <p>
        The date at the top of this Cookie Policy indicates when it was last updated.
      </p>

      <h2>Do Not Track</h2>
      <p>
        Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to
        have your online activities tracked. At this time, we do not respond to browser "Do Not Track"
        signals.
      </p>

      <h2>Cookie Consent Tool</h2>
      <p>
        When you first visit our Service, you will be presented with a cookie consent banner that allows
        you to accept or decline non-essential cookies. You can change your preferences at any time by
        clicking on the "Cookie Settings" link in the footer of our website.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about our use of cookies or other technologies, please contact us at:
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

export default CookiePolicy;
