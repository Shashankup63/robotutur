import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, Shield, Zap, RefreshCw, Truck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { addToCart } from '../store/slices/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data);
      setLoading(false);
    }).catch(() => {
      navigate('/products');
    });
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO SHOP
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-3xl overflow-hidden bg-zinc-950 border border-white/5"
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-4">{product.category}</span>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">{product.name}</h1>
          <p className="text-3xl font-bold text-white mb-8">₹{product.price}</p>
          
          <div className="prose prose-invert mb-10">
            <p className="text-zinc-400 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={() => dispatch(addToCart(product))}
              className="flex-grow bg-emerald-500 text-black py-4 rounded-xl font-bold flex items-center justify-center hover:bg-emerald-400 transition-all"
            >
              <ShoppingCart className="w-5 h-5 mr-2" /> ADD TO CART
            </button>
            <button className="px-8 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
              WISHLIST
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-bold text-sm">2 Year Warranty</h4>
                <p className="text-xs text-zinc-500">Full replacement guarantee.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-bold text-sm">Express Delivery</h4>
                <p className="text-xs text-zinc-500">Ships within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-bold text-sm">Tech Support</h4>
                <p className="text-xs text-zinc-500">Direct engineer access.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RefreshCw className="w-5 h-5 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-bold text-sm">Easy Returns</h4>
                <p className="text-xs text-zinc-500">30-day no-questions return.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
