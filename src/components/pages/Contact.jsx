import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import './Pages.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1200);
  };

  return (
    <div className="page-enter">
      <div className="page-header container" style={{ padding: '48px 0 32px' }}>
        <span className="section-label">Get In Touch</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Contact Us</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>We would love to hear from you. Send us a message and we will respond promptly.</p>
      </div>

      <div className="container contact-layout">
        <div className="contact-info">
          {[
            { Icon: Phone, title: 'Phone', lines: ['+234 800 000 0000', 'Mon to Fri, 9am to 6pm'] },
            { Icon: Mail, title: 'Email', lines: ['hello@dbestcollections.com', 'support@dbestcollections.com'] },
            { Icon: MapPin, title: 'Address', lines: ['123 Victoria Island', 'Lagos, Nigeria'] },
            { Icon: Clock, title: 'Hours', lines: ['Monday to Friday: 9am to 6pm', 'Saturday: 10am to 4pm'] }
          ].map(({ Icon, title, lines }) => (
            <div key={title} className="contact-info__card">
              <div className="contact-info__icon"><Icon size={20} /></div>
              <div>
                <h5 style={{ color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{title}</h5>
                {lines.map((l) => (
                  <p key={l} style={{ fontSize: '0.88rem', color: 'var(--light-muted)', lineHeight: 1.7 }}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="contact-form card" style={{ padding: 36 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 24 }}>Send a Message</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="form-control" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea rows={6} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
            <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
