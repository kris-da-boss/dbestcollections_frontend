import React from 'react';
import './Pages.css';

const Privacy = () => {
  const sections = [
    { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email address, phone number, shipping address, and payment information processed securely through Paystack.' },
    { title: 'How We Use Your Information', content: 'We use the information we collect to process transactions, send order confirmations and shipping updates, provide customer support, improve our services, send promotional communications with your consent, and comply with legal obligations.' },
    { title: 'Information Sharing', content: 'We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. We may share information with service providers who assist in our operations, such as payment processors and delivery companies.' },
    { title: 'Data Security', content: 'We implement appropriate security measures to protect your personal information. All payment transactions are encrypted using SSL technology. We regularly review our security procedures to ensure they remain effective.' },
    { title: 'Cookies', content: 'We use cookies to enhance your experience on our site. Cookies help us understand how you use our site, remember your preferences, and provide relevant offers. You can control cookie settings through your browser.' },
    { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us at privacy@dbestcollections.com.' }
  ];

  return (
    <div className="page-enter section">
      <div className="container legal-page">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 2025</p>
        {sections.map(({ title, content }) => (
          <div key={title} className="legal-section">
            <h2>{title}</h2>
            <p>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
