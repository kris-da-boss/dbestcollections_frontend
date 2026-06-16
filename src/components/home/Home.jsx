import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RefreshCw, Headphones, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { productAPI, categoryAPI } from '../../utils/api';
import ProductCard from '../common/ProductCard';
import { formatPrice } from '../../utils/helpers';
import './Home.css';

/* ─── Hero Section ───────────────────────────────────────────── */
const Hero = () => {
  const slides = [
    {
      tag: 'New Arrivals 2025',
      title: 'Step Into\nLuxury',
      subtitle: 'Discover our curated collection of premium shoes and bags crafted for the discerning individual.',
      cta: 'Shop Now',
      ctaLink: '/shop',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
      accent: 'Shoes'
    },
    {
      tag: 'Premium Bags',
      title: 'Carry Your\nStyle',
      subtitle: 'Handcrafted luxury bags that make a statement. From totes to clutches, find your perfect companion.',
      cta: 'Explore Bags',
      ctaLink: '/shop?type=bags',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      accent: 'Bags'
    },
    {
      tag: 'Exclusive Collection',
      title: 'Define Your\nElegance',
      subtitle: 'Where craftsmanship meets contemporary design. Each piece tells a story of refinement.',
      cta: 'View Collection',
      ctaLink: '/shop?featured=true',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      accent: 'Collection'
    }
  ];

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const slide = slides[current];

  return (
    <section className="hero">
      <div className="hero__bg">
        {slides.map((s, i) => (
          <div key={i} className={`hero__slide-bg ${i === current ? 'active' : ''}`}>
            <img src={s.image} alt={s.title} />
            <div className="hero__overlay" />
          </div>
        ))}
      </div>

      <div className="container hero__content">
        <div className={`hero__text ${animating ? 'hero__text--exit' : 'hero__text--enter'}`}>
          <span className="hero__tag">{slide.tag}</span>
          <h1 className="hero__title">
            {slide.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i < slide.title.split('\n').length - 1 && <br />}</React.Fragment>
            ))}
          </h1>
          <p className="hero__subtitle">{slide.subtitle}</p>
          <div className="hero__actions">
            <Link to={slide.ctaLink} className="btn btn-primary btn-lg">{slide.cta} <ArrowRight size={18} /></Link>
            <Link to="/about" className="btn btn-outline btn-lg">Our Story</Link>
          </div>
        </div>

        {/* Slide counter */}
        <div className="hero__counter">
          <span className="hero__counter-current">{String(current + 1).padStart(2, '0')}</span>
          <div className="hero__counter-bar">
            <div className="hero__counter-progress" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
          </div>
          <span className="hero__counter-total">{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="hero__controls">
        <button className="hero__ctrl-btn" onClick={prev} aria-label="Previous"><ChevronLeft size={20} /></button>
        <button className="hero__ctrl-btn" onClick={next} aria-label="Next"><ChevronRight size={20} /></button>
      </div>

      {/* Dots */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero__dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
};

/* ─── Features Strip ─────────────────────────────────────────── */
const Features = () => {
  const features = [
    { Icon: Truck, title: 'Free Shipping', desc: 'On orders over ₦50,000' },
    { Icon: Shield, title: 'Authentic Luxury', desc: '100% genuine products' },
    { Icon: RefreshCw, title: 'Easy Returns', desc: '14-day return policy' },
    { Icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' }
  ];
  return (
    <section className="features-strip">
      <div className="container features-strip__grid">
        {features.map(({ Icon, title, desc }) => (
          <div key={title} className="features-strip__item">
            <div className="features-strip__icon"><Icon size={22} /></div>
            <div>
              <h6 className="features-strip__title">{title}</h6>
              <p className="features-strip__desc">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Category Showcase ──────────────────────────────────────── */
const CategoryShowcase = ({ categories }) => (
  <section className="section category-showcase">
    <div className="container">
      <div className="section-header">
        <span className="section-label">Browse By Category</span>
        <h2 className="section-title">Shop Your Style</h2>
        <div className="divider" />
      </div>
      <div className="category-showcase__grid">
        <Link to="/shop?type=shoes" className="category-card category-card--shoes">
          <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=80" alt="Shoes" />
          <div className="category-card__overlay" />
          <div className="category-card__content">
            <span className="category-card__label">Collection</span>
            <h3 className="category-card__title">Shoes</h3>
            <span className="category-card__cta">Shop Now <ArrowRight size={14} /></span>
          </div>
        </Link>
        <div className="category-card__right">
          <Link to="/shop?type=bags" className="category-card category-card--bags">
            <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80" alt="Bags" />
            <div className="category-card__overlay" />
            <div className="category-card__content">
              <span className="category-card__label">Collection</span>
              <h3 className="category-card__title">Bags</h3>
              <span className="category-card__cta">Shop Now <ArrowRight size={14} /></span>
            </div>
          </Link>
          <Link to="/shop?gender=women" className="category-card category-card--women">
            <img src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=700&q=80" alt="Women" />
            <div className="category-card__overlay" />
            <div className="category-card__content">
              <span className="category-card__label">Collection</span>
              <h3 className="category-card__title">Women</h3>
              <span className="category-card__cta">Shop Now <ArrowRight size={14} /></span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Featured Products ──────────────────────────────────────── */
const FeaturedProducts = ({ products, title, label, link }) => (
  <section className="section">
    <div className="container">
      <div className="section-header">
        <span className="section-label">{label}</span>
        <h2 className="section-title">{title}</h2>
        <div className="divider" />
      </div>
      <div className="products-grid">
        {products.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <Link to={link} className="btn btn-outline btn-lg">View All <ArrowRight size={18} /></Link>
      </div>
    </div>
  </section>
);

/* ─── Brand Story Banner ─────────────────────────────────────── */
const StoryBanner = () => (
  <section className="story-banner">
    <div className="story-banner__bg">
      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" alt="Luxury fashion" />
      <div className="story-banner__overlay" />
    </div>
    <div className="container story-banner__content">
      <span className="section-label">Our Philosophy</span>
      <h2 className="story-banner__title">Luxury Is Not a<br />Luxury — It's a Standard</h2>
      <p className="story-banner__text">
        At D Best Collections, we believe that every detail matters.
        From the stitching on our bags to the sole of our shoes,
        we curate only the finest pieces that embody timeless elegance.
      </p>
      <Link to="/about" className="btn btn-primary btn-lg">Discover Our Story <ArrowRight size={18} /></Link>
    </div>
  </section>
);

/* ─── Testimonials ───────────────────────────────────────────── */
const Testimonials = () => {
  const testimonials = [
    { name: 'Amara Okafor', role: 'Fashion Blogger', rating: 5, text: 'Absolutely stunning quality! The shoes I ordered arrived perfectly packaged and the craftsmanship is extraordinary. D Best Collections has become my go-to for luxury footwear.' },
    { name: 'Chidi Eze', role: 'Business Executive', rating: 5, text: 'The leather bag I purchased is impeccable. You can feel the quality in every stitch. Fast delivery and excellent customer service. Highly recommend!' },
    { name: 'Ngozi Williams', role: 'Style Consultant', rating: 5, text: 'I\'ve shopped at many luxury stores but D Best Collections offers something truly special. The curation is perfect and prices are fair for the quality you get.' },
    { name: 'Taiwo Adebayo', role: 'Entrepreneur', rating: 5, text: 'Ordered three pairs of shoes and they all exceeded my expectations. The attention to detail is remarkable. Will definitely be a returning customer!' }
  ];
  const [active, setActive] = useState(0);
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Client Love</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="divider" />
        </div>
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={i} className={`testimonial-card ${i === active ? 'testimonial-card--active' : ''}`} onClick={() => setActive(i)}>
              <div className="testimonial-card__stars">
                {[...Array(t.rating)].map((_, s) => <Star key={s} size={14} fill="var(--gold)" stroke="none" />)}
              </div>
              <p className="testimonial-card__text">"{t.text}"</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{t.name[0]}</div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Newsletter Section ─────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); if (email) { alert(`Thanks for subscribing: ${email}`); setEmail(''); } };
  return (
    <section className="newsletter-section">
      <div className="container newsletter-section__inner">
        <div>
          <span className="section-label">Stay Connected</span>
          <h2 className="newsletter-section__title">Join the Exclusive Circle</h2>
          <p className="newsletter-section__text">Subscribe for early access to new arrivals, exclusive offers, and style inspiration.</p>
        </div>
        <form className="newsletter-section__form" onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required className="newsletter-section__input" />
          <button type="submit" className="btn btn-primary">Subscribe <ArrowRight size={16} /></button>
        </form>
      </div>
    </section>
  );
};

/* ─── Main Home Component ─────────────────────────────────────── */
const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll()
        ]);
        setFeatured(featuredRes.data.featured || []);
        setNewArrivals(featuredRes.data.newArrivals || []);
        setBestsellers(featuredRes.data.bestsellers || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="home page-enter">
      <Hero />
      <Features />
      <CategoryShowcase categories={categories} />
      {featured.length > 0 && (
        <FeaturedProducts products={featured.slice(0, 4)} title="Featured Pieces" label="Hand Picked" link="/shop?featured=true" />
      )}
      <StoryBanner />
      {newArrivals.length > 0 && (
        <FeaturedProducts products={newArrivals.slice(0, 4)} title="New Arrivals" label="Just Landed" link="/shop?newArrivals=true" />
      )}
      <Testimonials />
      {bestsellers.length > 0 && (
        <FeaturedProducts products={bestsellers.slice(0, 4)} title="Best Sellers" label="Most Loved" link="/shop?bestseller=true" />
      )}
      <Newsletter />
    </div>
  );
};

export default Home;
