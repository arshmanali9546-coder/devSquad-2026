import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

/* ─── Collapsible Filter Section ─── */
const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-1 text-sm font-bold uppercase tracking-wider text-brandDark"
      >
        {title}
        <span className="text-lg leading-none select-none">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-3 flex flex-col gap-2">{children}</div>}
    </div>
  );
};

/* ─── Checkbox Item ─── */
const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-brandDark transition-colors">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-gray-300 accent-brandDark focus:ring-brandDark"
    />
    {label}
  </label>
);

/* ─── Toggle Switch ─── */
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-brandDark' : 'bg-gray-300'
      }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''
        }`}
    />
  </button>
);

/* ─── Filter Data ─── */
const COLLECTIONS = [
  'Black teas', 'Green teas', 'White teas', 'Chai',
  'Matcha', 'Herbal teas', 'Oolong', 'Rooibos', 'Teaware'
];

const ORIGINS = ['India', 'Iran', 'South Africa'];

const FLAVORS = [
  'Spicy', 'Sweet', 'Citrus', 'Smooth', 'Fruity',
  'Floral', 'Grassy', 'Minty', 'Bitter', 'Creamy'
];

const QUALITIES = ['Detox', 'Energy', 'Relax', 'Digestion'];

const CAFFEINE_LEVELS = ['No Caffeine', 'Low Caffeine', 'Medium Caffeine', 'High Caffeine'];

const ALLERGENS = ['Lactose-free', 'Gluten-free', 'Nuts-free', 'Soy-free'];


/* ─── Collections Page ─── */
const Collections = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [flavor, setFlavor] = useState(searchParams.get('flavor') || '');
  const [origin, setOrigin] = useState(searchParams.get('origin') || '');
  const [organic, setOrganic] = useState(searchParams.get('organic') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [q, setQ] = useState(searchParams.get('q') || '');

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/products', {
        params: {
          page,
          limit: 9,
          category,
          flavor,
          origin,
          organic,
          q,
          sort
        }
      });
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [category, flavor, origin, organic, sort, q]);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setFlavor(searchParams.get('flavor') || '');
    setOrigin(searchParams.get('origin') || '');
    setOrganic(searchParams.get('organic') === 'true');
    setQ(searchParams.get('q') || '');
  }, [searchParams]);

  const updateFilters = (updates) => {
    const newParams = Object.fromEntries(searchParams.entries());
    Object.keys(updates).forEach(key => {
      if (updates[key]) newParams[key] = updates[key];
      else delete newParams[key];
    });
    setSearchParams(newParams);
  };

  /* Map display label to API value for category filter */
  const categoryMap = {
    'Black teas': 'Black Tea',
    'Green teas': 'Green Tea',
    'White teas': 'White Tea',
    'Chai': 'Chai',
    'Matcha': 'Matcha',
    'Herbal teas': 'Herbal Tea',
    'Oolong': 'Oolong',
    'Rooibos': 'Rooibos',
    'Teaware': 'Teaware'
  };

  return (
    <div className="w-full">
      {/* Hero Header */}
      <div className="w-full h-48 md:h-64 object-cover overflow-hidden relative">
        {/* Replace with your own banner image */}
        <img src="./11.jpg" alt="Tea Header" className="w-full h-full bg-cover  object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-10 pt-6 pb-2">
        <p className="text-xs tracking-wider text-gray-500 uppercase">
          <Link to="/" className="hover:text-brandDark transition-colors">HOME</Link>
          <span className="mx-1">/</span>
          <Link to="/collections" className="hover:text-brandDark transition-colors">COLLECTIONS</Link>
          {category && (
            <>
              <span className="mx-1">/</span>
              <span className="text-brandDark font-semibold">{category}</span>
            </>
          )}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-6 flex flex-col md:flex-row gap-10">

        {/* ─── Sidebar Filters ─── */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-5">

          {/* COLLECTIONS */}
          <FilterSection title="COLLECTIONS">
            {COLLECTIONS.map(c => (
              <CheckboxItem
                key={c}
                label={c}
                checked={category === categoryMap[c]}
                onChange={() =>
                  updateFilters({ category: category === categoryMap[c] ? '' : categoryMap[c] })
                }
              />
            ))}
          </FilterSection>

          {/* ORIGIN */}
          <FilterSection title="ORIGIN">
            {ORIGINS.map(o => (
              <CheckboxItem
                key={o}
                label={o}
                checked={origin === o}
                onChange={() => updateFilters({ origin: origin === o ? '' : o })}
              />
            ))}
          </FilterSection>

          {/* FLAVOR */}
          <FilterSection title="FLAVOR">
            {FLAVORS.map(f => (
              <CheckboxItem
                key={f}
                label={f}
                checked={flavor === f}
                onChange={() => updateFilters({ flavor: flavor === f ? '' : f })}
              />
            ))}
          </FilterSection>

          {/* QUALITIES (visual only — backend can be wired later) */}
          <FilterSection title="QUALITIES">
            {QUALITIES.map(q => (
              <CheckboxItem key={q} label={q} checked={false} onChange={() => { }} />
            ))}
          </FilterSection>

          {/* CAFFEINE (visual only — backend can be wired later) */}
          <FilterSection title="CAFFEINE">
            {CAFFEINE_LEVELS.map(c => (
              <CheckboxItem key={c} label={c} checked={false} onChange={() => { }} />
            ))}
          </FilterSection>

          {/* ALLERGENS (visual only — backend can be wired later) */}
          <FilterSection title="ALLERGENS">
            {ALLERGENS.map(a => (
              <CheckboxItem key={a} label={a} checked={false} onChange={() => { }} />
            ))}
          </FilterSection>

          {/* ORGANIC */}
          <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
            <span className="text-sm font-bold uppercase tracking-wider text-brandDark">ORGANIC</span>
            <ToggleSwitch
              checked={organic}
              onChange={() => updateFilters({ organic: !organic ? 'true' : '' })}
            />
          </div>

        </aside>

        {/* ─── Product Grid ─── */}
        <div className="flex-1">
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider opacity-60 uppercase">SORT BY</span>
              <select
                value={sort}
                onChange={e => updateFilters({ sort: e.target.value })}
                className="bg-transparent text-sm border-none outline-none font-semibold uppercase opacity-80 cursor-pointer"
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="w-full py-20 text-center text-gray-400">Loading products...</div>
          ) : (
            <>
              {products.length === 0 ? (
                /* ── 9 Placeholder product cards — put your images in public/collections/1.jpg … 9.jpg ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <div key={n} className="group flex flex-col items-center cursor-pointer">
                      <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-gray-100 mb-3">
                        {/* Drop your image at public/collections/{n}.jpg */}
                        <img
                          src={`./${n}.jpg`}
                          alt={`Ceylon Ginger ${n}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              alert('This is a placeholder product. Please add real products from the admin panel.');
                            }}
                            className="bg-brandDark text-white px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-center mt-1 leading-snug group-hover:text-brandHighlight transition-colors">Ceylon Ginger</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Cinnamon chai tea</p>
                      <p className="text-sm font-medium mt-1">€4.85 / 50 g</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(p => (
                    <Link
                      to={`/product/${p._id}`}
                      key={p._id}
                      className="group flex flex-col items-center"
                    >
                      <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-gray-50 mb-3">
                        <img
                          src={p.image || "https://images.unsplash.com/photo-1563822249548-9a72b6353cad?auto=format&fit=crop&q=80&w=400"}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (p.variants && p.variants.length > 0) {
                                addToCart(p._id, p.variants[0]._id, 1);
                              } else {
                                alert('Product has no variants available');
                              }
                            }}
                            className="bg-brandDark text-white px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-center mt-1 group-hover:text-brandHighlight transition-colors leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{p.category || 'Cinnamon chai tea'}</p>
                      <p className="text-sm font-medium mt-1">
                        €{p.variants?.[0]?.price?.toFixed(2) || 'N/A'} / {p.variants?.[0]?.size || ''}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => fetchProducts(currentPage - 1)}
                    className="px-4 py-2 border border-gray-300 disabled:opacity-50 text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    PREV
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => fetchProducts(i + 1)}
                      className={`px-4 py-2 border ${currentPage === i + 1 ? 'bg-brandDark text-white border-brandDark' : 'border-gray-300 hover:bg-gray-50'} text-xs font-semibold transition-colors`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => fetchProducts(currentPage + 1)}
                    className="px-4 py-2 border border-gray-300 disabled:opacity-50 text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Collections;
