import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, cartDrawerOpen, setCartDrawerOpen } = useCart();

  if (!cartDrawerOpen) return null;

  const subtotal = cart.items?.reduce((acc, item) => {
    const product = item.productId;
    const variant = product?.variants?.find(v => v._id === item.variantId);
    return acc + (variant ? variant.price * item.quantity : 0);
  }, 0) || 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold uppercase tracking-widest">My Bag ({cart.items?.length || 0})</h2>
          <button onClick={() => setCartDrawerOpen(false)} className="text-2xl font-light hover:text-brandHighlight">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
          {(!cart.items || cart.items.length === 0) ? (
            <div className="text-center py-20 opacity-50 italic">Your bag is empty</div>
          ) : (
            cart.items.map(item => {
              const product = item.productId;
              const variant = product?.variants?.find(v => v._id === item.variantId);
              if (!product || !variant) return null;

              return (
                <div key={`${product._id}-${variant._id}`} className="flex gap-4 border-b border-gray-50 pb-6">
                  <div className="w-20 h-20 bg-gray-50 flex-shrink-0">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-sm font-bold leading-tight">{product.title}</h4>
                      <p className="text-[10px] opacity-60 uppercase tracking-wider">{variant.size}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                       <div className="flex border border-gray-200">
                          <button className="px-2 py-1" onClick={() => updateQuantity(product._id, variant._id, Math.max(1, item.quantity - 1))}>-</button>
                          <span className="px-2 py-1 border-x border-gray-200">{item.quantity}</span>
                          <button className="px-2 py-1" onClick={() => updateQuantity(product._id, variant._id, item.quantity + 1)}>+</button>
                       </div>
                       <button onClick={() => removeFromCart(product._id, variant._id)} className="opacity-40 hover:opacity-100 uppercase text-[10px]">Remove</button>
                    </div>
                  </div>
                  <div className="text-sm font-bold">€{(variant.price * item.quantity).toFixed(2)}</div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between text-base font-bold mb-6 uppercase tracking-widest">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <Link to="/cart" onClick={() => setCartDrawerOpen(false)}>
            <button className="w-full bg-brandDark text-white py-4 text-xs font-bold tracking-[0.2em] mb-3 hover:bg-black transition-colors uppercase">View Full Bag</button>
          </Link>
          <button className="w-full border border-brandDark text-brandDark py-4 text-xs font-bold tracking-[0.2em] hover:bg-gray-100 transition-colors uppercase">Checkout Now</button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
