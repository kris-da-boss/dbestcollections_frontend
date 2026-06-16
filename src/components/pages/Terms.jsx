import React from 'react';
import './Pages.css';

const Terms = () => {
  const sections = [
    { title: 'Acceptance of Terms', content: 'By accessing and using D Best Collections website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.' },
    { title: 'Products and Pricing', content: 'We reserve the right to modify prices at any time. All prices are listed in Nigerian Naira and include applicable taxes. We make every effort to display accurate product information, but errors may occasionally occur.' },
    { title: 'Orders and Payment', content: 'Your order is confirmed once payment is successfully processed. We accept payment through Paystack. By placing an order, you represent that you are authorized to use the payment method provided.' },
    { title: 'Shipping and Delivery', content: 'Delivery timeframes are estimates and may vary based on location. We are not responsible for delays caused by external factors. Risk of loss passes to you upon delivery.' },
    { title: 'Returns and Refunds', content: 'Items may be returned within 14 days of receipt in original, unworn condition with all tags attached. Refunds are processed within 5 to 7 business days after we receive the returned item.' },
    { title: 'Intellectual Property', content: 'All content on this website, including images, text, logos, and design, is the property of D Best Collections and is protected by copyright law. Unauthorized use is strictly prohibited.' }
  ];

  return (
    <div className="page-enter section">
      <div className="container legal-page">
        <h1>Terms and Conditions</h1>
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

export default Terms;
