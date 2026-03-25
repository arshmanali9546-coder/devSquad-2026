import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, fetchCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    // Basic checkout flow integration
    try {
      await axios.post('http://localhost:5000/api/orders/place', { address: 'Default Address' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed successfully!');
      fetchCart();
      navigate('/collections');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order');
    }
  };

  const subtotal = cart.items?.reduce((acc, item) => {
    // We would need the variant price, cart items currently only have productId which is populated, 
    // but variantId needs to be matched to get price. The backend route we made populate('items.productId')
    // So item.productId is the product object, and it has variants array.
    const product = item.productId;
    const variant = product?.variants?.find(v => v._id === item.variantId);
    return acc + (variant ? variant.price * item.quantity : 0);
  }, 0) || 0;

  const delivery = subtotal > 0 ? 3.95 : 0;
  const total = subtotal + delivery;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-10 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-6">Your bag is empty</h2>
        <Link to="/collections">
           <button className="bg-brandDark text-white px-8 py-3 text-sm tracking-widest hover:bg-black transition-colors">BACK TO SHOPPING</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-10 py-10 flex flex-col md:flex-row gap-12">
        
        {/* Left Column: Items */}
        <div className="w-full md:w-2/3">
          <div className="flex gap-8 border-b-2 border-gray-100 pb-4 mb-8 text-xs font-semibold tracking-wider opacity-60">
            <span className="text-brandDark opacity-100">1. MY BAG</span>
            <span className="opacity-40">2. DELIVERY</span>
            <span className="opacity-40">3. REVIEW & PAYMENT</span>
          </div>

          <div className="flex flex-col gap-6">
            {cart.items.map(item => {
              const product = item.productId;
              const variant = product?.variants?.find(v => v._id === item.variantId);
              
              if (!product || !variant) return null;

              return (
                <div key={`${product._id}-${variant._id}`} className="border-t border-b border-dashed border-sky-400 py-6 pr-6 pl-2 flex gap-6 relative group">
                  <img src={product.image || "https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&q=80&w=200"} alt={product.title} className="w-20 h-20 object-cover mix-blend-multiply" />
                  
                  <div className="flex flex-col justify-between flex-grow">
                     <div>
                        <h4 className="text-sm font-semibold text-brandDark mb-1">{product.title}</h4>
                        <p className="text-xs opacity-60">{variant.size}</p>
                     </div>
                     <button onClick={() => removeFromCart(product._id, variant._id)} className="text-[10px] tracking-widest uppercase font-semibold text-left pt-2 opacity-50 hover:opacity-100 w-16">REMOVE</button>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 text-sm font-semibold">
                     <div className="flex gap-4 opacity-80 mb-2">
                        <button onClick={() => updateQuantity(product._id, variant._id, Math.max(1, item.quantity - 1))}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(product._id, variant._id, item.quantity + 1)}>+</button>
                     </div>
                     <div>€{(variant.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center py-6 border-b border-dashed border-sky-400 text-sm font-semibold opacity-80 mt-2">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          <div className="mt-8">
             <Link to="/collections">
                <button className="border border-brandDark px-8 py-3 text-xs tracking-widest font-semibold hover:bg-gray-50 transition-colors w-full md:w-auto">BACK TO SHOPPING</button>
             </Link>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="w-full md:w-1/3 flex flex-col gap-8">
           
           <div className="bg-[#f0f0f0] p-8 -mb-4">
              <h3 className="text-lg font-semibold mb-8 text-brandDark">Order summary</h3>
              <div className="flex flex-col gap-4 text-xs font-semibold tracking-wider opacity-80 uppercase border-b border-gray-300 pb-6 mb-6">
                 <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>€{delivery.toFixed(2)}</span>
                 </div>
              </div>
              <div className="flex justify-between text-base font-bold text-brandDark mb-6 uppercase tracking-wider">
                 <span>Total</span>
                 <span>€{total.toFixed(2)}</span>
              </div>
              <div className="text-[10px] opacity-60 mb-8 italic">Estimated shipping time: 2 days</div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-brandDark text-white py-4 text-xs font-semibold tracking-widest hover:bg-black transition-colors"
              >
                CHECK OUT
              </button>
           </div>

           <div className="bg-[#f9f9f9] p-8 pb-10">
              <h4 className="text-sm font-semibold tracking-wider mb-6 opacity-80">Payment type</h4>
              <div className="flex gap-4 text-2xl filter grayscale opacity-60 mix-blend-multiply">
                 <span>💳</span> <span>💵</span> <span>🪙</span> <span>💰</span>
              </div>
           </div>

           <div className="bg-[#f9f9f9] p-8">
              <h4 className="text-sm font-semibold tracking-wider mb-6 opacity-80">Delivery and retour</h4>
              <ul className="text-[10px] font-semibold opacity-60 leading-relaxed uppercase tracking-widest space-y-4">
                 <li>&gt; Order before 12:00 and we will ship the same day.</li>
                 <li>&gt; Orders made after Friday 12:00 are processed on Monday.</li>
                 <li>&gt; To return your articles, please contact us first.</li>
                 <li>&gt; Postal charges for retour are not reimbursed.</li>
              </ul>
           </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
