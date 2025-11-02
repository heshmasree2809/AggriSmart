import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-green-50 via-white to-farm-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-farm-green-500 p-4 rounded-full shadow-lg">
              <span className="text-4xl">🔒</span>
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: November 1, 2025</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-slide-up">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📖</span>
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At AgriSmart, we are committed to protecting your privacy and personal information. This Privacy Policy 
              outlines how we collect, use, and safeguard your data when you use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Information We Collect
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Personal identification information (Name, email address, phone number)</li>
              <li>Account credentials and authentication data</li>
              <li>Usage data and interaction with our platform</li>
              <li>Location data for weather and crop recommendations</li>
              <li>Payment and transaction information</li>
              <li>Device information and IP addresses</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>To provide and improve our services</li>
              <li>To personalize your experience</li>
              <li>To process transactions and send notifications</li>
              <li>To communicate important updates and information</li>
              <li>To analyze usage patterns and optimize our platform</li>
              <li>To ensure security and prevent fraud</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🛡️</span>
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information from unauthorized 
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 
              100% secure.
            </p>
          </section>

          {/* Security Warnings */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg my-6">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
              <span className="mr-2">🚨</span>
              Important Security Notices
            </h3>
            
            <div className="space-y-4">
              {/* Hacking Warning */}
              <div className="bg-red-100 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Anti-Hacking Policy
                </h4>
                <p className="text-red-800 leading-relaxed">
                  <strong>DO NOT attempt to hack, breach, or compromise our website or systems.</strong> Any unauthorized 
                  access, penetration testing, or security exploitation attempts are strictly prohibited and will be 
                  immediately reported to law enforcement authorities. We maintain comprehensive security logs and will 
                  pursue legal action against violators.
                </p>
              </div>

              {/* False Information Warning */}
              <div className="bg-red-100 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2 flex items-center">
                  <span className="mr-2">🚫</span>
                  False Information & Defamation Policy
                </h4>
                <p className="text-red-800 leading-relaxed mb-3">
                  <strong>Spreading false information, negativity, or defamatory content about AgriSmart is strictly prohibited.</strong>
                </p>
                <div className="bg-white p-3 rounded border-2 border-red-300">
                  <p className="text-red-900 font-bold mb-2">⚖️ Legal Consequences:</p>
                  <ul className="list-disc list-inside text-red-800 space-y-1 ml-2">
                    <li>Individuals found spreading false information, misinformation, or negativity about our platform will be subject to a fine of <strong className="text-xl">$10,000 USD</strong></li>
                    <li>We reserve the right to pursue legal action against violators</li>
                    <li>Civil and criminal proceedings may be initiated</li>
                    <li>Damages and legal fees will be sought</li>
                  </ul>
                </div>
                <p className="text-red-800 mt-3">
                  This includes but is not limited to: false reviews, defamatory statements, malicious rumors, 
                  misleading information, or any content intended to damage our reputation or business.
                </p>
              </div>

              {/* User Conduct */}
              <div className="bg-red-100 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2 flex items-center">
                  <span className="mr-2">📢</span>
                  Acceptable User Conduct
                </h4>
                <p className="text-red-800 leading-relaxed">
                  Users are expected to maintain professional and respectful conduct. Any form of harassment, abuse, 
                  trolling, or malicious behavior towards AgriSmart, its staff, or other users will result in immediate 
                  account termination and potential legal action.
                </p>
              </div>
            </div>
          </div>

          {/* Third-Party Sharing */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🤝</span>
              Third-Party Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell your personal information to third parties. We may share data with trusted service providers 
              who assist in operating our platform, conducting business, or serving our users, provided they agree to 
              keep information confidential.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🍪</span>
              Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and 
              remember your preferences. You can control cookie settings through your browser preferences.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">✋</span>
              Your Rights
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👶</span>
              Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately.
            </p>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔄</span>
              Policy Updates
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated 
              revision date. We encourage you to review this policy regularly to stay informed about how we protect 
              your information.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📧</span>
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:{' '}
              <a href="mailto:privacy@agrismart.com" className="text-farm-green-600 hover:text-farm-green-700 font-medium">
                privacy@agrismart.com
              </a>
            </p>
          </section>

          {/* Acceptance */}
          <div className="bg-farm-green-50 border-l-4 border-farm-green-500 p-6 rounded-r-lg mt-8">
            <p className="text-farm-green-800 font-semibold">
              ✓ By using AgriSmart, you acknowledge that you have read and understood this Privacy Policy and consent 
              to the collection and use of your information as described herein.
            </p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-6">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-farm-green-600 text-white rounded-lg hover:bg-farm-green-700 transition duration-150 shadow-md"
            >
              <span className="mr-2">←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
