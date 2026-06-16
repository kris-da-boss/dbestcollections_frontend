// About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, Globe, Users } from 'lucide-react';
import './Pages.css';

export const About = () => (
  <div className="page-enter">
    {/* Hero */}
    <div className="page-hero">
      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80" alt="About Us" />
      <div className="page-hero__overlay" />
      <div className="container page-hero__content">
        <span className="section-label">Our Story</span>
        <h1 className="page-hero__title">About D Best Collections</h1>
        <p className="page-hero__subtitle">Redefining luxury fashion in Africa</p>
      </div>
    </div>

    {/* Story Section */}
    <section className="section">
      <div className="container about-grid">
        <div className="about-grid__text">
          <span className="section-label">Who We Are</span>
          <h2>Born from a Passion for Elegance</h2>
          <div className="divider" style={{ margin: '16px 0' }} />
          <p>D Best Collections was founded with a singular vision: to bring world-class luxury footwear and accessories to discerning individuals who appreciate the finer things in life. We believe that true luxury is not just about a label — it's about the feeling of wearing something exceptional.</p>
          <p style={{ marginTop: 16 }}>From our flagship Nigerian base, we curate pieces that blend timeless craftsmanship with contemporary design. Every product in our collection is hand-selected by our expert team, ensuring that only the finest makes it to our shelves.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 28 }}>Shop Our Collection <ArrowRight size={16} /></Link>
        </div>
        <div className="about-grid__image">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" alt="Our Story" />
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section" style={{ background: 'var(--off-black)', borderTop: '1px solid var(--dark-3)', borderBottom: '1px solid var(--dark-3)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">What Drives Us</span>
          <h2 className="section-title">Our Core Values</h2>
          <div className="divider" />
        </div>
        <div className="values-grid">
          {[
            { Icon: Award, title: 'Uncompromising Quality', desc: 'We never settle. Every product is rigorously vetted to meet our exacting standards of craftsmanship and material excellence.' },
            { Icon: Heart, title: 'Customer First', desc: 'Our clients are at the heart of everything we do. From seamless shopping to white-glove service, your satisfaction is our priority.' },
            { Icon: Globe, title: 'Authentic Luxury', desc: 'We guarantee the authenticity of every item. Our direct relationships with premium brands ensure you receive only genuine luxury products.' },
            { Icon: Users, title: 'Inclusive Elegance', desc: 'Luxury should be accessible. We offer a wide range of premium products to suit various budgets without compromising on quality.' }
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="value-card">
              <div className="value-card__icon"><Icon size={24} /></div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="section">
      <div className="container">
        <div className="stats-row">
          {[['2019', 'Year Founded'], ['10,000+', 'Happy Customers'], ['500+', 'Premium Products'], ['98%', 'Satisfaction Rate']].map(([val, label]) => (
            <div key={label} className="stat-item">
              <span className="stat-item__value">{val}</span>
              <span className="stat-item__label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section" style={{ background: 'var(--off-black)', borderTop: '1px solid var(--dark-3)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="section-label">Ready to Experience Luxury?</span>
        <h2 style={{ margin: '12px 0 20px' }}>Start Your Journey Today</h2>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" className="btn btn-primary btn-lg">Shop Now <ArrowRight size={16} /></Link>
          <Link to="/contact" className="btn btn-outline btn-lg">Get In Touch</Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;
