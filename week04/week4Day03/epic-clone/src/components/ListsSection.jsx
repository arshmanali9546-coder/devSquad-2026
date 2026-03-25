import React from 'react';
import './ListsSection.css';
import GOW from '../assets/GOW.png';
import h3 from '../assets/h3.png';
import h4 from '../assets/h4.png';

const MOCK_TOP_SELLERS = [
  { id: 1, title: 'Ghostbusters: Spirits Unleashed', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop', price: '₹939' },
  { id: 2, title: 'GTA V : Premier edition', image: h3, price: '₹2,499' },
  { id: 3, title: 'Daysgone', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=200&auto=format&fit=crop', price: '₹2,699' },
  { id: 4, title: 'Last of Us', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=200&auto=format&fit=crop', price: '₹1,499' },
  { id: 5, title: 'God of War 4', image: GOW, price: '₹2,659' },
];

const MOCK_BEST_SELLER = [
  { id: 1, title: 'Fortnite', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop', price: 'Free' },
  { id: 2, title: 'GTA V : Premier edition', image: h3, price: '₹2,499' },
  { id: 3, title: 'IGI 2', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=200&auto=format&fit=crop', price: '₹499' },
  { id: 4, title: 'Tomb Raider', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=200&auto=format&fit=crop', price: '₹2,499' },
  { id: 5, title: 'Uncharted 4', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200&auto=format&fit=crop', price: '₹3,499' },
];

const MOCK_UPCOMING = [
  { id: 1, title: 'Hogwarts Legacy', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=200&auto=format&fit=crop', price: '₹2,999' },
  { id: 2, title: 'Uncharted Legacy of Thieves', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200&auto=format&fit=crop', price: '₹4,499' },
  { id: 3, title: "Assassin's Creed Mirage", image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=200&auto=format&fit=crop', price: '₹3,499' },
  { id: 4, title: 'Outlast II', image: h4, price: '₹3,999' },
  { id: 5, title: 'Dead by Daylight', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200&auto=format&fit=crop', price: 'coming soon' },
];

const GameList = ({ title, games }) => (
  <div className="list-column">
    <div className="section-header">
      <h3 className="list-title">{title}</h3>
      <button className="view-more-list">view more</button>
    </div>
    <div className="list-items">
      {games.map((game) => (
        <div key={game.id} className="list-card">
          <div className="list-image">
            <img src={game.image} alt={game.title} />
          </div>
          <div className="list-info">
            <h4 className="list-game-title">{game.title}</h4>
            <span className="list-price">{game.price}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ListsSection = () => {
  return (
    <div className="lists-section">
      <GameList title="Top Sellers" games={MOCK_TOP_SELLERS} />
      <GameList title="Best Seller" games={MOCK_BEST_SELLER} />
      <GameList title="Top Upcoming game" games={MOCK_UPCOMING} />
    </div>
  );
};

export default ListsSection;
