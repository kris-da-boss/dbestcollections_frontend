import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { blogAPI } from '../../utils/api';
import { formatDate, truncate } from '../../utils/helpers';
import './Blog.css';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getOne(slug)
      .then(({ data }) => {
        setBlog(data.blog);
        setRelated(data.related || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="loading-page">
        <p style={{ color: 'var(--muted)' }}>Article not found.</p>
      </div>
    );
  }

  return (
    <div className="blog-post page-enter">
      <div className="blog-post__hero">
        <img
          src={blog.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80'}
          alt={blog.title}
        />
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
        <article
          className="blog-post__content"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
        />

        {related.length > 0 && (
          <aside className="blog-post__sidebar">
            <h4 className="blog-post__sidebar-title">Related Articles</h4>
            {related.map((r) => (
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

export default BlogPost;
