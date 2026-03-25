import React from 'react';
import './GameFeatureGrid.css';

const FEATURE_GAMES = [
  {
    id: 1,
    title: "NFS UNBOUND",
    description: "Pre-purchase NFS Unbound and get an exclusive Driving Effect, License Plate, $150,000 Bank, and more.",
    price: "₹3,499",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "FIFA 23",
    description: "FIFA 23 brings The World's Game to the pitch, with HyperMotion2 Technology, men's and women's FIFA World Cup.",
    price: "₹3,699",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "UNCHARTED 4",
    description: "Get the definitive Uncharted 4 experience with all Season Pass content, the Ultimate Pack, and upcoming expansion.",
    price: "₹2,199",
    image: "../assets/Game on scale/8.jpg"
  }
];

const GameFeatureGrid = () => {
  return (
    <div className="game-feature-grid">
      <div className="feature-items-wrapper">
        {FEATURE_GAMES.map((game) => (
          <div key={game.id} className="feature-node">
            <div className="feature-visual">
              <img src={game.image} alt={game.title} />
            </div>
            <div className="feature-text-content">
              <h4 className="feature-game-header">{game.title}</h4>
              <p className="feature-game-desc">{game.description}</p>
              <span className="feature-game-price">{game.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameFeatureGrid;
