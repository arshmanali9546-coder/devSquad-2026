import React from 'react';
import { Search, Globe, User, Grid } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-left">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search store" />
          </div>
          <ul className="nav-links">
            <li><a href="#" className="active">Discover</a></li>
            <li><a href="#">Browse</a></li>
            <li><a href="#">News</a></li>
          </ul>
        </div>
        
        <div className="navbar-right">
          <a href="#" className="nav-action">Wishlist</a>
          <a href="#" className="nav-action">Cart</a>
          <button className="nav-btn-icon"><Globe size={20} /></button>
          <button className="nav-btn-icon profile-btn"><User size={20} /></button>
          <button className="download-btn">Download</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
