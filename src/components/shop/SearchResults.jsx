import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { productAPI } from '../../utils/api';
import ProductCard from '../common/ProductCard';
import LoadingPage from '../common/LoadingPage';
import './Pages.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputVal, setInputVal] = useState(query);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    productAPI.getAll({ search: query, limit: 12 })
      .then(({ data }) => { setProducts(data.products || []); setTotal(data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) setSearchParams({ q: inputVal.trim() });
  };

  return (
    <div className="search-results page-enter">
      <div className="container">
        <div className="search-results__header">
          <span className="section-label">Search</span>
          <h1 className="search-results__title">
            {query ? <>Results for "<span className="search-results__query">{query}</span>"</> : 'Search Products'}
          </h1>
          {query && <p className="search-results__count">{total} product{total !== 1 ? 's' : ''} found</p>}
        </div>

        <form onSubmit={handleSearch} className="search-results__form">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search for shoes, bags..."
            className="search-results__input"
            autoFocus
          />
          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Search
          </button>
        </form>

        {loading ? (
          <LoadingPage />
        ) : !query ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <Search size={48} strokeWidth={1} style={{ margin: '0 auto 16px' }} />
            <p>Enter a search term to find products.</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: 24 }}>
              No products found for "<strong style={{ color: 'var(--off-white)' }}>{query}</strong>"
            </p>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Try a different search term or browse our collections.</p>
            <Link to="/shop" className="btn btn-outline btn-lg">Browse All Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
