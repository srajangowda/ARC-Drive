import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Purchase() {
  const [capacity, setCapacity] = useState('128GB');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const prices = {
    '128GB': 5000
  };

  const currentPrice = prices[capacity];

  const handleAddToCart = () => {
    addToCart({
      id: `arc-drive-${capacity}`,
      name: `ARC Drive - ${capacity}`,
      price: currentPrice,
      capacity,
      quantity,
      image: "placeholder-usb"
    });
    navigate('/cart');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="glass-panel rounded-2xl p-12 flex items-center justify-center relative overflow-hidden h-[500px]">
            <div className="absolute inset-0 bg-cyber-neon/10 rounded-full blur-3xl animate-pulse"></div>
            {/* Simple CSS representation of the drive */}
            <div className="relative w-32 h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl border border-white/20 shadow-2xl flex flex-col items-center justify-between py-6 floating-animation z-10">
               {/* Scanner Ring */}
               <div className="relative w-12 h-12 rounded-full border-2 border-cyber-neon/30 flex items-center justify-center mb-auto mt-4">
                  <Shield className="text-cyber-neon w-6 h-6" />
                  <div className="absolute top-0 w-full h-0.5 bg-cyber-neon shadow-[0_0_8px_#00f0ff] scan-line-anim"></div>
               </div>
               {/* Brand */}
               <div className="bg-black/50 w-full py-2 text-center border-y border-white/10 mt-auto">
                  <span className="font-heading font-black tracking-widest text-white">ARC</span>
               </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-neon/10 border border-cyber-neon/30 text-cyber-neon text-xs font-semibold uppercase mb-4">
              Enterprise Ready
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">ARC Drive Pre-Release</h1>
            <p className="text-xl text-gray-400 mb-6">Hardware-enforced secure USB. Zero data exposure.</p>
            <div className="text-3xl font-bold text-white mb-8">₹{currentPrice}</div>

            {/* Capacity Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Capacity</h3>
              <div className="grid grid-cols-1 gap-3 max-w-xs">
                <button 
                  className="py-3 rounded-lg border border-cyber-neon bg-cyber-neon/10 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center transition-all cursor-default"
                >
                  128GB
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Quantity</h3>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg w-max p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded">-</button>
                <span className="w-10 text-center text-white font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded">+</button>
              </div>
            </div>

            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              className="w-full py-4 bg-cyber-neon text-black font-bold text-lg rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] flex justify-center items-center gap-2"
            >
              <Package /> Add to Cart
            </button>

            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400"><CheckCircle className="w-4 h-4 text-cyber-neon" /> 30-Day Money Back Guarantee</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><CheckCircle className="w-4 h-4 text-cyber-neon" /> 5-Year Hardware Warranty</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><CheckCircle className="w-4 h-4 text-cyber-neon" /> Free Enterprise Support Included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
