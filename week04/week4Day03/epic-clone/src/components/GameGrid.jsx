import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import h3 from '../assets/h3.png';
import './GameGrid.css';

import sale1 from '../assets/Game on scale/6.jpg';
import sale2 from '../assets/Game on scale/2.png';
import sale3 from '../assets/Game on scale/3.png';
import sale4 from '../assets/Game on scale/4.png';
import sale5 from '../assets/Game on scale/5.png';

const MOCK_GAMES_SALE = [
  { id: 1, title: 'Valorant', image: sale1, price: '₹850', discount: '-10%', originalPrice: '₹900' },
  { id: 2, title: "Assassin's creed Valhalla", image: sale2, price: '₹2,999', discount: '-20%', originalPrice: '₹3,499' },
  { id: 3, title: 'Red Dead Redemption 2', image: sale3, price: '₹1,599', discount: '-50%', originalPrice: '₹3,199' },
  { id: 4, title: 'The Tomb Raider', image: sale4, price: '₹2,000', discount: '-20%', originalPrice: '₹2,195' },
  { id: 5, title: 'Cyberpunk 2077', image: sale5, price: '₹2,000', discount: '-50%', originalPrice: '₹4,000' },
];

const GameGrid = ({ title, games = MOCK_GAMES_SALE }) => {
  return (
    <div className="game-grid-section">
      <div className="section-header">
        <h3 className="section-title-text">
          {title} <span className="title-arrow">›</span>
        </h3>
        <div className="carousel-nav">
          <button className="nav-circle-btn"><ChevronLeft size={16} /></button>
          <button className="nav-circle-btn"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="grid-display">
        {games.map((game) => (
          <div key={game.id} className="game-item">
            <div className="game-img-wrapper">
              <img src={game.image} alt={game.title} />
            </div>
            <div className="game-details">
              <h4 className="game-name">{game.title}</h4>
              <div className="game-price-tag">
                {game.discount && <span className="badge-discount">{game.discount}</span>}
                <div className="price-stack">
                  {game.originalPrice && <span className="old-price">{game.originalPrice}</span>}
                  <span className="new-price">{game.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
