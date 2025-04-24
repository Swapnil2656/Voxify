import React from 'react';
import { FaFileContract } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const TermsOfService = ({ darkMode, toggleDarkMode }) => {
  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="Terms of Service"
      subtitle="The agreement governing your use of PolyLingo"
      icon={<FaFileContract size={24} />}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Last Updated: June 1, 2023
      </p>

      <h2>Agreement to Terms</h2>
      <p>
        These Terms of Service ("Terms") constitute a legally binding agreement between you and
        PolyLingo ("we," "our," or "us") governing your access to and use of the PolyLingo website,
        mobile application, and translation services (collectively, the "Service").
      </p>
      <p>
        By accessing or using the Service, you agree to be bound by these Terms. If you do not agree
        to these Terms, you may not access or use the Service.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. If we make changes, we will provide
        notice by updating the "Last Updated" date at the top of these Terms and, in some cases, we
        may provide additional notice (such as adding a statement to our website or sending you a
        notification). Your continued use of the Service after such notice constitutes your acceptance
        of the revised Terms.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 13 years old to use the Service. By using the Service, you represent and
        warrant that you meet this requirement and that you have the right, authority, and capacity to
        enter into these Terms.
      </p>

      <h2>Account Registration</h2>
      <p>
        To access certain features of the Service, you may need to register for an account. When you
        register, you agree to provide accurate, current, and complete information and to update this
        information to maintain its accuracy. You are responsible for safeguarding your password and
        for all activities that occur under your account. You agree to notify us immediately if you
        suspect any unauthorized use of your account.
      </p>

      <h2>Service Description</h2>
      <p>
        PolyLingo provides machine translation services that allow users to translate text, speech,
        and images between multiple languages. The Service may include features such as:
      </p>
      <ul>
        <li>Text translation</li>
        <li>Speech-to-text translation</li>
        <li>Text-to-speech conversion</li>
        <li>Image-based translation</li>
        <li>Conversation mode</li>
        <li>AI Learning Hub</li>
      </ul>
      <p>
        We strive to provide accurate translations, but machine translation has inherent limitations.
        The Service is not intended to replace human translators for critical communications where
        perfect accuracy is required.
      </p>

      <h2>Subscription and Payments</h2>
      <p>
        Some features of the Service may require a subscription. By subscribing to a paid plan, you
        agree to pay the subscription fees as described at the time of purchase. Subscription fees
        are billed in advance and are non-refundable except as required by law or as explicitly
        stated in these Terms.
      </p>
      <p>
        Subscriptions automatically renew for the same term at the then-current rate unless you
        cancel before the renewal date. You can cancel your subscription at any time through your
        account settings or by contacting customer support.
      </p>

      <h2>Free Trial</h2>
      <p>
        We may offer a free trial of our subscription plans. At the end of the trial period, you
        will be automatically charged the applicable subscription fee unless you cancel before the
        trial expires.
      </p>

      <h2>User Content</h2>
      <p>
        The Service allows you to submit content for translation, including text, images, and audio
        recordings (collectively, "User Content"). You retain all rights to your User Content, but
        you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify,
        adapt, publish, and display your User Content solely for the purpose of providing and
        improving the Service.
      </p>
      <p>
        You are solely responsible for your User Content and represent that you have all necessary
        rights to submit it to the Service. You agree not to submit User Content that:
      </p>
      <ul>
        <li>Violates any law or regulation</li>
        <li>Infringes the intellectual property rights of others</li>
        <li>Contains viruses or malicious code</li>
        <li>Is harmful, abusive, defamatory, obscene, or otherwise objectionable</li>
        <li>Invades the privacy of others</li>
      </ul>
      <p>
        We reserve the right to remove any User Content that violates these Terms or that we
        determine is harmful to the Service or other users.
      </p>

      <h2>Prohibited Uses</h2>
      <p>
        You agree not to use the Service to:
      </p>
      <ul>
        <li>Violate any law or regulation</li>
        <li>Infringe the rights of others</li>
        <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
        <li>Interfere with or disrupt the Service</li>
        <li>Collect or store personal information about other users without their consent</li>
        <li>Impersonate any person or entity</li>
        <li>Engage in any activity that could damage, disable, or overburden the Service</li>
        <li>Use the Service for any commercial purpose without our prior written consent</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are owned by PolyLingo
        and are protected by international copyright, trademark, patent, trade secret, and other
        intellectual property laws. You may not copy, modify, distribute, sell, or lease any part
        of the Service without our prior written consent.
      </p>

      <h2>Third-Party Links and Services</h2>
      <p>
        The Service may contain links to third-party websites or services that are not owned or
        controlled by PolyLingo. We have no control over, and assume no responsibility for, the
        content, privacy policies, or practices of any third-party websites or services. You
        acknowledge and agree that PolyLingo shall not be responsible or liable for any damage
        or loss caused by your use of any such websites or services.
      </p>

      <h2>Disclaimer of Warranties</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
        EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE
        WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE
        OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, POLYLINGO SHALL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
        WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
        INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR
        USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (C) ANY
        CONTENT OBTAINED FROM THE SERVICE; OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR
        TRANSMISSIONS OR CONTENT.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless PolyLingo and its officers, directors,
        employees, and agents from and against any claims, liabilities, damages, losses, and expenses,
        including, without limitation, reasonable legal and accounting fees, arising out of or in any
        way connected with your access to or use of the Service, your User Content, or your violation
        of these Terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the State of
        California, without regard to its conflict of law provisions. Any dispute arising from or
        relating to these Terms or the Service shall be subject to the exclusive jurisdiction of
        the state and federal courts located in San Francisco County, California.
      </p>

      <h2>Severability</h2>
      <p>
        If any provision of these Terms is held to be invalid or unenforceable, such provision shall
        be struck and the remaining provisions shall be enforced to the fullest extent under law.
      </p>

      <h2>Entire Agreement</h2>
      <p>
        These Terms, together with the Privacy Policy and any other legal notices published by
        PolyLingo on the Service, constitute the entire agreement between you and PolyLingo
        concerning the Service.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at:
      </p>
      <p>
        Email: <a href="mailto:legal@polylingo.app" className="text-blue-600 dark:text-blue-400 hover:underline">legal@polylingo.app</a>
      </p>
      <p>
        Postal Address:<br />
        PolyLingo Legal Department<br />
        123 Translation Avenue<br />
        San Francisco, CA 94105<br />
        United States
      </p>
    </FooterPageTemplate>
  );
};

export default TermsOfService;
