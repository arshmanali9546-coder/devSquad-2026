import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import GameGrid from './components/GameGrid';
import GameFeatureGrid from './components/GameFeatureGrid';
import FreeGames from './components/FreeGames';
import ListsSection from './components/ListsSection';
import ExploreCatalog from './components/ExploreCatalog';
import Footer from './components/Footer';

// Achievements images
import val from './assets/1.jpg'; // Assuming Valorant is 1.jpg, if not it's a fallback
import acv from './assets/Game with acheivments/2.png';
import rdr2 from './assets/Game with acheivments/3.png';
import tr from './assets/Game with acheivments/4.png';
import cp2077 from './assets/Game with acheivments/5.png';

const MOCK_GAMES_SALE = [
  { id: 1, title: 'Alan Wake 2', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop', price: '₹3,419', discount: '-10%', originalPrice: '₹3,499' },
  { id: 2, title: 'EA SPORTS FC 24', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=300&auto=format&fit=crop', price: '₹1,349', discount: '-70%', originalPrice: '₹4,499' },
  { id: 3, title: 'Assassin\'s Creed Mirage', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=300&auto=format&fit=crop', price: '₹1,749', discount: '-30%', originalPrice: '₹2,499' },
  { id: 4, title: 'Lords of the Fallen', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=300&auto=format&fit=crop', price: '₹2,099', discount: '-30%', originalPrice: '₹2,999' },
  { id: 5, title: 'Star Wars Jedi: Survivor', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300&auto=format&fit=crop', price: '₹1,749', discount: '-50%', originalPrice: '₹3,499' },
];

const MOCK_GAMES_ACHIEVEMENTS = [
  { id: 1, title: 'Valorant', image: val, price: '₹850', discount: '-10%', originalPrice: '₹900' },
  { id: 2, title: 'Assassin\'s Creed Valhalla', image: acv, price: '₹2,999', discount: '-20%', originalPrice: '₹3,499' },
  { id: 3, title: 'Red Dead Redemption 2', image: rdr2, price: '₹1,599', discount: '-50%', originalPrice: '₹3,199' },
  { id: 4, title: 'The Tomb Raider', image: tr, price: '₹2,000', discount: '-20%', originalPrice: '₹2,195' },
  { id: 5, title: 'Cyberpunk 2077', image: cp2077, price: '₹2,000', discount: '-50%', originalPrice: '₹4,000' },
];

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <HeroCarousel />
        <GameGrid title="Games on sale" />
        <GameFeatureGrid />
        <FreeGames />
        <ListsSection />
        <GameGrid title="Game with Achivements" games={MOCK_GAMES_ACHIEVEMENTS} />
        <ExploreCatalog />
      </main>
      <Footer />
    </div>
  );
}

export default App;
