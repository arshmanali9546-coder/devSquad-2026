import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Accessories = () => {
  const { setCartDrawerOpen } = useCart();
  const accessories = [
    {
      id: 1,
      name: "Glass Teapot with Infuser",
      price: 34.90,
      image: "./4.jpg",
    },
    {
      id: 2,
      name: "Ceramic Tea Set",
      price: 59.00,
      image: "./7.jpg",
    },
    {
      id: 3,
      name: "Bamboo Tea Tray",
      price: 24.50,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    },
    
  ];

  return (
    <div className="max-w-7xl mx-auto px-10 py-16">
      <h1 className="text-4xl font-bold mb-4 text-brandDark">Tea Accessories</h1>
      <p className="text-sm opacity-60 mb-12 uppercase font-semibold tracking-widest">Everything you need for the perfect ritual</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {accessories.map(item => (
          <div key={item.id} className="group border border-gray-100 p-6 flex flex-col items-center hover:shadow-lg transition-all bg-white">
            <div className="w-full aspect-square overflow-hidden mb-6">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-sm font-bold text-center mb-2 uppercase tracking-wider">{item.name}</h3>
            <p className="text-sm font-semibold opacity-70 mb-4">€{item.price.toFixed(2)}</p>
            <button 
              onClick={() => setCartDrawerOpen(true)}
              className="w-full border border-brandDark text-brandDark font-bold text-[10px] uppercase tracking-[0.2em] py-3 hover:bg-brandDark hover:text-white transition-all focus:outline-none"
            >
              Add to Bag
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accessories;
