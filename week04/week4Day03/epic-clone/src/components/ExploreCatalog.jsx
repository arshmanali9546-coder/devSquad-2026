import React from 'react';
import './ExploreCatalog.css';
import GOW from '../assets/GOW.png';
import DL2 from '../assets/Top Sellers/15.jpg';
import Warhammer from '../assets/Top Sellers/17.jpg';
import Sifu from '../assets/Top Sellers/18.jpg';

const ExploreCatalog = () => {
  return (
    <div className="explore-catalog">
      <div className="catalog-container">
        <div className="catalog-left">
          <div className="images-stack">
            <div className="catalog-img-wrapper item-1">
              <img src={DL2} alt="Dying Light 2 Placeholder" />
            </div>
            <div className="catalog-img-wrapper item-2">
              <img src={Warhammer} alt="Warhammer III Placeholder" />
            </div>
            <div className="catalog-img-wrapper item-3">
              <img src={GOW} alt="God of War" />
            </div>
            <div className="catalog-img-wrapper item-4">
              <img src={Sifu} alt="Sifu Placeholder" />
            </div>
          </div>
        </div>
        <div className="catalog-right">
          <h2 className="catalog-heading">Explore our Catalog</h2>
          <p className="catalog-desc">
            Browse by genre, features, price, and more to find your next favorite game.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploreCatalog;
