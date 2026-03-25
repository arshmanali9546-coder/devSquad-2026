import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
           setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product Not Found</div>;

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen">
       {/* Breadcrumb */}
       <div className="max-w-7xl mx-auto px-10 py-6 text-[10px] tracking-widest font-semibold uppercase opacity-40">
          <Link to="/" className="hover:text-brandHighlight">HOME</Link> / 
          <Link to="/collections" className="hover:text-brandHighlight"> COLLECTIONS</Link> / 
          {product.category} / 
          <span className="text-brandDark opacity-100 italic"> {product.title}</span>
       </div>
       
       <div className="max-w-7xl mx-auto px-10 pt-4 pb-20 flex flex-col md:flex-row gap-16">
          {/* Image */}
          <div className="w-full md:w-1/2 aspect-square flex items-center justify-center relative">
             <div className="absolute inset-0 bg-[#F4F4F4] rounded-sm -z-10"></div>
             <img src={product.image || "./1.jpg"} alt={product.title} className="w-5/6 h-5/6 object-cover mix-blend-multiply" />
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col pt-8">
             <h1 className="text-4xl font-bold text-brandDark mb-4 leading-tight font-serif italic">{product.title}</h1>
             <p className="text-sm opacity-60 mb-10 font-medium leading-relaxed max-w-lg">{product.description || "A lovely warming Chai tea with ginger cinnamon flavours."}</p>
             
             <div className="flex gap-8 mb-10 text-[10px] font-bold tracking-[0.15em] uppercase opacity-70">
                <span className="flex items-center gap-2">🌐 Origin: <span className="opacity-100">{product.origin || "Iran"}</span></span>
                <span className="flex items-center gap-2">🍃 {product.organic ? "Organic" : "Non-Organic"}</span>
                <span className="flex items-center gap-2">🌱 {product.vegan ? "Vegan" : "Not Vegan"}</span>
             </div>

             <div className="text-3xl font-bold mb-10 text-brandDark">
               €{selectedVariant ? selectedVariant.price.toFixed(2) : "0.00"}
             </div>

             {/* Variants */}
             <div className="mb-12">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Variants</h4>
               <div className="flex flex-wrap gap-4">
                 {product.variants.map(v => (
                   <button 
                     key={v._id} 
                     onClick={() => setSelectedVariant(v)}
                     className={`group relative border border-gray-200 w-16 h-20 flex flex-col items-center justify-center p-2 text-[8px] font-bold uppercase tracking-tighter transition-all ${selectedVariant?._id === v._id ? 'bg-[#fcf8f6] border-brandHighlight ring-[0.5px] ring-brandHighlight' : 'hover:border-gray-400 bg-white'}`}
                   >
                     <div className="mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg className={`w-6 h-8 ${selectedVariant?._id === v._id ? 'text-brandHighlight' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                     </div>
                     <span className="text-center leading-none">{v.size}</span>
                   </button>
                 ))}
                 
                 {/* Visual Mock Variants if none exist */}
                 {(!product.variants || product.variants.length === 0) && ["50 g bag", "100 g bag", "170 g bag", "Sampler"].map(v => (
                    <div key={v} className="border border-gray-200 w-16 h-20 flex flex-col items-center justify-center p-2 text-[8px] font-bold uppercase opacity-50 grayscale">
                        <svg className="w-6 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        {v}
                    </div>
                 ))}
               </div>
             </div>

             <div className="flex items-stretch gap-4 h-14">
                <div className="flex items-center border border-gray-300 w-24 justify-center gap-4 bg-white">
                   <button className="text-lg hover:text-brandHighlight px-2" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                   <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                   <button className="text-lg hover:text-brandHighlight px-2" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <button 
                  onClick={() => selectedVariant && addToCart(product._id, selectedVariant._id, quantity)}
                  disabled={!selectedVariant || selectedVariant.stock < quantity}
                  className="flex-grow bg-brandDark text-white font-bold text-[10px] tracking-[0.3em] px-10 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  ADD TO BAG
                </button>
             </div>
          </div>
       </div>

       {/* Details Sections */}
       <div className="bg-[#f0f0f0] py-20">
          <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-20">
             {/* Steeping instructions */}
             <div>
                <h3 className="text-2xl font-bold mb-10 text-brandDark font-serif italic">Steeping instructions</h3>
                <div className="flex flex-col gap-6 text-[10px] tracking-[0.15em] font-bold uppercase">
                   <div className="flex justify-between items-center border-b border-gray-200 pb-3 opacity-80">
                       <span className="flex items-center gap-3">☕ SERVING SIZE: <span className="opacity-60 lowercase font-medium tracking-normal text-xs">2 tsp per cup, 6 tsp per pot</span></span>
                   </div>
                   <div className="flex justify-between items-center border-b border-gray-200 pb-3 opacity-80">
                       <span className="flex items-center gap-3">🌡 WATER TEMPERATURE: <span className="opacity-60 lowercase font-medium tracking-normal text-xs">100°C</span></span>
                   </div>
                   <div className="flex justify-between items-center border-b border-gray-200 pb-3 opacity-80">
                       <span className="flex items-center gap-3">⏳ STEEPING TIME: <span className="opacity-60 lowercase font-medium tracking-normal text-xs">3 - 5 minutes</span></span>
                   </div>
                   <div className="flex flex-col gap-4 mt-2">
                       <span className="flex items-center gap-3 opacity-80 text-brandHighlight">🔴 COLOR AFTER 3 MINUTES</span>
                       <div className="w-full h-1 bg-gradient-to-r from-orange-200 to-brandHighlight opacity-30"></div>
                   </div>
                </div>
             </div>

             {/* About this tea */}
             <div className="flex flex-col">
                <h3 className="text-2xl font-bold mb-10 text-brandDark font-serif italic">About this tea</h3>
                <div className="grid grid-cols-4 gap-0 mb-12 border-l border-gray-200">
                   <div className="flex flex-col border-r border-gray-200 px-6 gap-2">
                       <span className="text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase">FLAVOR</span>
                       <span className="text-xs font-bold text-brandDark">{product.flavor || "Spicy"}</span>
                   </div>
                   <div className="flex flex-col border-r border-gray-200 px-6 gap-2">
                       <span className="text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase">QUALITIES</span>
                       <span className="text-xs font-bold text-brandDark italic">Smoothing</span>
                   </div>
                   <div className="flex flex-col border-r border-gray-200 px-6 gap-2">
                       <span className="text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase">CAFFEINE</span>
                       <span className="text-xs font-bold text-brandDark">{product.caffeine || "Medium"}</span>
                   </div>
                   <div className="flex flex-col px-6 gap-2">
                       <span className="text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase">ALLERGENS</span>
                       <span className="text-xs font-bold text-brandDark">{product.allergens || "Nuts-free"}</span>
                   </div>
                </div>

                <h3 className="text-2xl font-bold mb-6 text-brandDark font-serif italic">Ingredient</h3>
                <p className="text-xs opacity-60 leading-relaxed font-semibold max-w-lg italic">
                  {product.ingredients || "Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces."}
                </p>
             </div>
          </div>
       </div>
       
       {/* Recommendation Section */}
       <div className="max-w-7xl mx-auto px-10 py-24 text-center">
          <h2 className="text-4xl font-bold text-brandDark mb-20 font-serif italic">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
             {[1, 5, 8].map(n => (
                <div key={n} className="flex flex-col items-center group cursor-pointer">
                   <div className="w-full aspect-[4/5] bg-[#F4F4F4] mb-8 overflow-hidden flex items-center justify-center p-12">
                      <img src={`./${n}.jpg`} alt="Recom" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <h4 className="text-sm font-bold uppercase tracking-widest mb-2 font-serif">Ceylon Ginger</h4>
                   <p className="text-[10px] opacity-40 mb-3 tracking-widest">Cinnamon chai tea</p>
                   <p className="text-sm font-bold font-serif italic">€4.85 / 50 g</p>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default ProductDetail;
