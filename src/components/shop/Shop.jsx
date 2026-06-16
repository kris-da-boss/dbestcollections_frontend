import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutList, ChevronDown, X } from 'lucide-react';
import { productAPI, categoryAPI } from '../../utils/api';
import ProductCard from '../common/ProductCard';
import { debounce } from '../../utils/helpers';
import './Shop.css';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' }
];

const TYPES = ['shoes', 'bags', 'accessories'];
const GENDERS = ['men', 'women', 'unisex', 'kids'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState('grid'); // grid | list

  // Filter state
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || '-createdAt',
    type: searchParams.get('type') || '',
    gender: searchParams.get('gender') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') || '',
    newArrivals: searchParams.get('newArrivals') || '',
    bestseller: searchParams.get('bestseller') || '',
    page: Number(searchParams.get('page')) || 1
  });

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await productAPI.getAll(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
    // Sync URL
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== '1') params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters, fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ sort: '-createdAt', type: '', gender: '', category: '', minPrice: '', maxPrice: '', featured: '', newArrivals: '', bestseller: '', page: 1 });
  };

  const activeFilterCount = [filters.type, filters.gender, filters.category, filters.minPrice, filters.maxPrice, filters.featured, filters.newArrivals, filters.bestseller].filter(Boolean).length;

  return (
    <div className="shop page-enter">
      {/* Page Header */}
      <div className="shop__header">
        <div className="container shop__header-inner">
          <div>
            <span className="section-label">Our Collection</span>
            <h1 className="shop__title">
              {filters.type ? filters.type.charAt(0).toUpperCase() + filters.type.slice(1) :
               filters.featured ? 'Featured' : filters.newArrivals ? 'New Arrivals' :
               filters.bestseller ? 'Best Sellers' : 'All Products'}
            </h1>
            <p className="shop__count">{total} items found</p>
          </div>
          {/* Breadcrumb */}
          <nav className="shop__breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Shop</span>
            {filters.type && <><span>/</span><span>{filters.type}</span></>}
          </nav>
        </div>
      </div>

      <div className="container shop__layout">
        {/* Sidebar Filters */}
        <aside className={`shop__filters ${filtersOpen ? 'shop__filters--open' : ''}`}>
          <div className="shop__filters-header">
            <h6>Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}</h6>
            {activeFilterCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
            )}
            <button className="shop__filters-close" onClick={() => setFiltersOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Category */}
          <FilterSection title="Category">
            <button className={`filter-option ${!filters.category ? 'active' : ''}`} onClick={() => updateFilter('category', '')}>All Categories</button>
            {categories.map(cat => (
              <button key={cat._id} className={`filter-option ${filters.category === cat._id ? 'active' : ''}`} onClick={() => updateFilter('category', cat._id)}>
                {cat.name}
              </button>
            ))}
          </FilterSection>

          {/* Type */}
          <FilterSection title="Type">
            <button className={`filter-option ${!filters.type ? 'active' : ''}`} onClick={() => updateFilter('type', '')}>All Types</button>
            {TYPES.map(t => (
              <button key={t} className={`filter-option ${filters.type === t ? 'active' : ''}`} onClick={() => updateFilter('type', t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </FilterSection>

          {/* Gender */}
          <FilterSection title="Gender">
            <button className={`filter-option ${!filters.gender ? 'active' : ''}`} onClick={() => updateFilter('gender', '')}>All</button>
            {GENDERS.map(g => (
              <button key={g} className={`filter-option ${filters.gender === g ? 'active' : ''}`} onClick={() => updateFilter('gender', g)}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="price-range">
              <input type="number" placeholder="Min ₦" value={filters.minPrice}
                onChange={e => updateFilter('minPrice', e.target.value)}
                className="form-control" style={{ marginBottom: 8 }} />
              <input type="number" placeholder="Max ₦" value={filters.maxPrice}
                onChange={e => updateFilter('maxPrice', e.target.value)}
                className="form-control" />
            </div>
          </FilterSection>

          {/* Tags */}
          <FilterSection title="Collections">
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'newArrivals', label: 'New Arrivals' },
              { key: 'bestseller', label: 'Best Sellers' }
            ].map(({ key, label }) => (
              <button key={key} className={`filter-option ${filters[key] === 'true' ? 'active' : ''}`}
                onClick={() => updateFilter(key, filters[key] === 'true' ? '' : 'true')}>
                {label}
              </button>
            ))}
          </FilterSection>
        </aside>

        {/* Backdrop */}
        {filtersOpen && <div className="shop__filters-backdrop" onClick={() => setFiltersOpen(false)} />}

        {/* Main Content */}
        <div className="shop__main">
          {/* Toolbar */}
          <div className="shop__toolbar">
            <button className="btn btn-dark btn-sm shop__filter-toggle" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={16} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            <div className="shop__toolbar-right">
              <div className="shop__sort">
                <ChevronDown size={14} />
                <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="shop__sort-select">
                  {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="shop__view-toggle">
                <button className={`shop__view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><Grid3X3 size={16} /></button>
                <button className={`shop__view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><LayoutList size={16} /></button>
              </div>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className={`shop__products-grid ${view === 'list' ? 'shop__products-list' : ''}`}>
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="shop__empty">
              <p>No products found matching your filters.</p>
              <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`shop__products-grid ${view === 'list' ? 'shop__products-list' : ''}`}>
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="shop__pagination">
              {[...Array(pages)].map((_, i) => (
                <button key={i} className={`shop__page-btn ${filters.page === i + 1 ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <button className="filter-section__title" onClick={() => setOpen(!open)}>
        {title} <ChevronDown size={14} className={open ? 'rotated' : ''} />
      </button>
      {open && <div className="filter-section__content">{children}</div>}
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="product-skeleton">
    <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 12 }} />
    <div style={{ padding: '16px' }}>
      <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 16, width: '30%' }} />
    </div>
  </div>
);

export default Shop;
