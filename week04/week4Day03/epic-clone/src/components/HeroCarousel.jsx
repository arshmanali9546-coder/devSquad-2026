import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';

import GOW from '../assets/GOW.png';
import H2 from '../assets/H2.png';
import h3 from '../assets/h3.png';
import h4 from '../assets/h4.png';

const MOCK_GAMES = [
  { id: 1, title: "God of War", subtitle: "Out Now", description: "Venture into the brutal Norse realms and fight to survive.", image: GOW, logo: "God Of War" },
  { id: 2, title: "Genshin Impact", subtitle: "Free to Play", description: "Step into a vast magical world of adventure.", image: H2, logo: "Genshin" },
  { id: 3, title: "FIFA 23", subtitle: "Play Now", description: "The World's Game.", image: h3, logo: "FIFA 23" },
  { id: 4, title: "The Witcher 3", subtitle: "On Sale", description: "Epic open world RPG.", image: h4, logo: "Witcher 3" },
];

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOCK_GAMES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeGame = MOCK_GAMES[activeIndex];

  return (
    <div className="hero-carousel">
      <div className="hero-main" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%), url(${activeGame.image})` }}>
        <div className="hero-content">
          <h2 className="hero-subtitle">{activeGame.subtitle}</h2>
          <p className="hero-description">{activeGame.description}</p>
          <div className="hero-actions">
            <button className="primary-btn">Buy Now</button>
            <button className="secondary-btn">Add to Wishlist</button>
          </div>
        </div>
      </div>

      <div className="hero-thumbnails">
        {MOCK_GAMES.map((game, index) => (
          <div
            key={game.id}
            className={`thumbnail-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <div className="thumbnail-img-container">
              <img src={game.image} alt={game.title} />
            </div>
            <span className="thumbnail-title">{game.logo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
