// BlogList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../utils/api';
import { formatDate, truncate } from '../../utils/helpers';
import { Clock, ArrowRight, Search } from 'lucide-react';
import './Blog.css';

export const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = (pg = 1, q = '') => {
    setLoading(true);
    blogAPI.getAll({ page: pg, limit: 9, search: q })
      .then(({ data }) => { setBlogs(data.blogs || []); setPages(data.pages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); load(1, search); };

  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <div className="blog-page page-enter">
      {/* Header */}
      <div className="blog-header">
        <div className="container">
          <span className="section-label">Insights & Style</span>
          <h1 className="blog-header__title">The Journal</h1>
          <p className="blog-header__subtitle">Style guides, trends, and stories from the world of luxury fashion.</p>
          <form className="blog-search" onSubmit={handleSearch}>
            <Search size={16} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <p>No articles found.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="blog-featured">
                <div className="blog-featured__image">
                  <img src={featured.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80'} alt={featured.title} />
                </div>
                <div className="blog-featured__content">
                  <span className="blog-category-badge">{featured.category}</span>
                  <h2 className="blog-featured__title">{featured.title}</h2>
                  <p className="blog-featured__excerpt">{featured.excerpt || truncate(featured.title, 160)}</p>
                  <div className="blog-featured__meta">
                    <span>{featured.author?.firstName} {featured.author?.lastName}</span>
                    <span>{formatDate(featured.publishedAt)}</span>
                    <span><Clock size={13} /> {featured.readTime} min read</span>
                  </div>
                  <span className="btn btn-outline btn-sm">Read Article <ArrowRight size={14} /></span>
                </div>
              </Link>
            )}

            {/* Blog Grid */}
            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map(blog => <BlogCard key={blog._id} blog={blog} />)}
              </div>
            )}

            {pages > 1 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 48 }}>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} className={`shop__page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const BlogCard = ({ blog }) => (
  <Link to={`/blog/${blog.slug}`} className="blog-card">
    <div className="blog-card__image">
      <img src={blog.coverImage || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80'} alt={blog.title} loading="lazy" />
    </div>
    <div className="blog-card__content">
      <span className="blog-category-badge">{blog.category?.replace('-', ' ')}</span>
      <h3 className="blog-card__title">{blog.title}</h3>
      <p className="blog-card__excerpt">{truncate(blog.excerpt || blog.title, 110)}</p>
      <div className="blog-card__meta">
        <span>{formatDate(blog.publishedAt)}</span>
        <span><Clock size={12} /> {blog.readTime} min</span>
      </div>
    </div>
  </Link>
);

// BlogPost.jsx
export const BlogPost = () => {
  const { slug } = require('react-router-dom').useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getOne(slug).then(({ data }) => { setBlog(data.blog); setRelated(data.related || []); })
      .catch(() => {}).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!blog) return <div className="loading-page"><p style={{ color: 'var(--muted)' }}>Article not found.</p></div>;

  return (
    <div className="blog-post page-enter">
      {/* Hero */}
      <div className="blog-post__hero">
        <img src={blog.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80'} alt={blog.title} />
        <div className="blog-post__hero-overlay" />
        <div className="container blog-post__hero-content">
          <span className="blog-category-badge">{blog.category?.replace('-', ' ')}</span>
          <h1 className="blog-post__title">{blog.title}</h1>
          <div className="blog-post__meta">
            <span>By {blog.author?.firstName} {blog.author?.lastName}</span>
            <span>{formatDate(blog.publishedAt)}</span>
            <span><Clock size={14} /> {blog.readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="container blog-post__layout">
        {/* Content */}
        <article className="blog-post__content" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />

        {/* Sidebar */}
        {related.length > 0 && (
          <aside className="blog-post__sidebar">
            <h4 className="blog-post__sidebar-title">Related Articles</h4>
            {related.map(r => (
              <Link key={r._id} to={`/blog/${r.slug}`} className="blog-related-card">
                <p className="blog-related-card__title">{r.title}</p>
                <p className="blog-related-card__date">{formatDate(r.publishedAt)}</p>
              </Link>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
};

export default BlogList;
