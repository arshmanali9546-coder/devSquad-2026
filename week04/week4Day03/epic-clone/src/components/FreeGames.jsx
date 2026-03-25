import React from 'react';
import { Gift } from 'lucide-react';
import './FreeGames.css';

const FREE_GAMES = [
  {
    id: 1,
    title: "Darkwood",
    dateRange: "Free Now - Jul 25",
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Assassin's Creed Black Flag",
    dateRange: "Free Now - Jul 25",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "NFS : Shift",
    dateRange: "Free Jul 27 - Aug 5",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Warface",
    dateRange: "Free Jul 27 - Aug 5",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300&auto=format&fit=crop"
  }
];

const FreeGames = () => {
  return (
    <div className="free-games-container">
      <div className="free-games-header">
        <div className="header-left">
          <Gift className="gift-icon" size={24} />
          <h3>Free Games</h3>
        </div>
        <button className="view-more-btn">view More</button>
      </div>
      <div className="free-games-grid">
        {FREE_GAMES.map(game => (
          <div key={game.id} className="free-game-card">
            <div className="free-game-image-container">
              <img src={game.image} alt={game.title} />
            </div>
            <div className="free-game-info">
              <h4 className="free-game-title">{game.title}</h4>
              <p className="free-game-date">{game.dateRange}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeGames;
