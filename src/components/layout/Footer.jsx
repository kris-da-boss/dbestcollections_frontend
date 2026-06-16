import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-d">D</span>
              <span>Best Collections</span>
            </Link>
            <p className="footer__tagline">
              Curated luxury footwear & accessories for the discerning individual.
            </p>
            <div className="footer__socials">
              {[
                { href: '#', Icon: Instagram, label: 'Instagram' },
                { href: '#', Icon: Twitter, label: 'Twitter' },
                { href: '#', Icon: Facebook, label: 'Facebook' },
                { href: '#', Icon: Youtube, label: 'YouTube' }
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} aria-label={label} className="footer__social-link">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h6 className="footer__heading">Shop</h6>
            <ul className="footer__links">
              {[
                { to: '/shop?type=shoes', label: 'Shoes' },
                { to: '/shop?type=bags', label: 'Bags' },
                { to: '/shop?newArrivals=true', label: 'New Arrivals' },
                { to: '/shop?featured=true', label: 'Featured' },
                { to: '/shop?bestseller=true', label: 'Best Sellers' }
              ].map(link => (
                <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h6 className="footer__heading">Company</h6>
            <ul className="footer__links">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact' },
                { to: '/faq', label: 'FAQ' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms & Conditions' }
              ].map(link => (
                <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="footer__col">
            <h6 className="footer__heading">Get In Touch</h6>
            <ul className="footer__contact">
              <li><Mail size={14} /><span>hello@dbestcollections.com</span></li>
              <li><Phone size={14} /><span>+234 800 000 0000</span></li>
              <li><MapPin size={14} /><span>Lagos, Nigeria</span></li>
            </ul>
            <div className="footer__newsletter">
              <p className="footer__newsletter-text">Join for exclusive offers</p>
              <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your email address" />
                <button type="submit" aria-label="Subscribe"><ArrowRight size={16} /></button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Icons */}
      <div className="footer__payments">
        <div className="container">
          <p className="footer__payments-label">Secure Payments via</p>
          <div className="footer__payment-icons">
            <span className="footer__payment-badge">Paystack</span>
            <span className="footer__payment-badge">Visa</span>
            <span className="footer__payment-badge">Mastercard</span>
            <span className="footer__payment-badge">Verve</span>
            <span className="footer__payment-badge">Bank Transfer</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; {year} D Best Collections. All rights reserved.</p>
          <p>Made with ♥ in Nigeria</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
