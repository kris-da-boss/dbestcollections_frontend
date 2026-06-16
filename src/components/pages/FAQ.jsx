import React, { useState } from 'react';
import './Pages.css';

const FAQ = () => {
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: 'What is your shipping policy?', a: 'We offer free shipping on all orders over 50,000 Naira. For orders below this amount, a flat fee of 2,500 Naira applies. We deliver within 1 to 3 business days within Lagos and 3 to 5 days for other states.' },
    { q: 'Are your products authentic?', a: 'Absolutely. Every product on D Best Collections is 100% authentic. We source directly from premium brands and authorized distributors, and every purchase comes with an authenticity guarantee.' },
    { q: 'What is your return policy?', a: 'We offer a 14-day return policy. Items must be in their original condition, unworn, and with all tags attached. Please contact our support team to initiate a return.' },
    { q: 'How do I know my shoe size?', a: 'Each product page includes a detailed size guide. We recommend measuring your foot in centimeters and comparing to our size chart. If you are between sizes, we recommend going up.' },
    { q: 'How can I track my order?', a: 'Once your order ships, you will receive a tracking number via email. You can also track your order from the My Orders section of your dashboard.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major debit and credit cards (Visa, Mastercard, Verve), bank transfers, and USSD payments through our secure Paystack gateway.' },
    { q: 'Do you ship internationally?', a: 'Currently, we ship within Nigeria only. We are working on expanding our delivery coverage. Sign up for our newsletter to be notified when international shipping becomes available.' },
    { q: 'How do I care for my luxury items?', a: 'Each product comes with care instructions. Generally, store shoes in dust bags away from direct sunlight, and clean leather goods with appropriate leather conditioner. Our blog also has detailed care guides.' }
  ];

  return (
    <div className="page-enter section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="section-header">
          <span className="section-label">Help Center</span>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <div className="divider" />
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button className="faq-item__question" onClick={() => setOpen(open === i ? null : i)}>
                {faq.q}
                <span className="faq-item__icon">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <div className="faq-item__answer">{faq.a}</div>}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48, padding: 32, background: 'var(--off-black)', border: '1px solid var(--dark-3)', borderRadius: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>Still Have Questions?</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Our team is here to help 24/7.</p>
          <a href="/contact" className="btn btn-primary">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
