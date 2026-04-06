import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, setCartDrawerOpen } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <nav className="flex justify-between items-center py-6 px-10 border-b border-gray-200 bg-white relative">
        {/* Brand */}
        <div className="flex items-center gap-2 text-xl font-semibold cursor-pointer">
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-7v4h3l-4 7z"/>
            </svg>
            Netixsol
          </Link>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-xs font-semibold tracking-wide uppercase">
          <Link to="/collections" className="hover:text-brandHighlight transition-colors">Tea Collections</Link>
          <Link to="/accessories" className="hover:text-brandHighlight transition-colors">Accessories</Link>
          <Link to="/blog" className="hover:text-brandHighlight transition-colors">Blog</Link>
          <Link to="/contact" className="hover:text-brandHighlight transition-colors">Contact Us</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative flex items-center">
            {showSearch && (
              <form onSubmit={handleSearch} className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search teas..." 
                  className="border-b border-brandDark focus:outline-none text-xs p-1 w-32 md:w-48 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            )}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search" 
              className="hover:text-brandHighlight transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>

          {/* User icon / menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hover:text-brandHighlight transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v-1m-7 8a10 10 0 0114 0"/></svg>
                {user.name && (
                  <span className="text-xs font-semibold hidden md:inline">{user.name}</span>
                )}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-lg z-50 rounded-md py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold truncate">{user.name || 'User'}</p>
                    <p className="text-[10px] opacity-50 truncate">{user.email || ''}</p>
                  </div>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <Link 
                      to="/admin" 
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-brandHighlight transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v-1m-7 8a10 10 0 0114 0"/></svg>
               <span className="hidden md:inline">Login</span>
            </Link>
          )}

          {/* Cart */}
          <button 
            onClick={() => setCartDrawerOpen(true)}
            className="relative hover:text-brandHighlight transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brandHighlight text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
