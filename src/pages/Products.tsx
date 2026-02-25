import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, Search, ShoppingCart, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { addToCart } from '../store/slices/cartSlice';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  const categoryFilter = searchParams.get('cat');

  useEffect(() => {
    setLoading(true);
    api.get('/products').then(res => {
      let data = res.data;
      if (categoryFilter) {
        data = data.filter((p: any) => p.category === categoryFilter);
      }
      setProducts(data);
      setLoading(false);
    });
  }, [categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {categoryFilter ? `${categoryFilter.toUpperCase()} HARDWARE` : 'ALL COMPONENTS'}
          </h1>
          <p className="text-zinc-400">Browse our professional-grade inventory.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search components..." 
              className="bg-zinc-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-zinc-950 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-zinc-950 rounded-3xl h-96 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all"
            >
              <Link to={`/product/${p.id}`} className="block aspect-square relative overflow-hidden">
                <img src={p.image} alt={p.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 uppercase tracking-widest">
                  {p.category}
                </div>
              </Link>
              <div className="p-6">
                <Link to={`/product/${p.id}`} className="block">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors">{p.name}</h3>
                </Link>
                <p className="text-zinc-500 text-xs mb-6 line-clamp-1">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">₹{p.price}</span>
                  <button 
                    onClick={() => dispatch(addToCart(p))}
                    className="p-2.5 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-24">
          <p className="text-zinc-500 text-xl">No products found in this category.</p>
          <Link to="/products" className="text-emerald-500 mt-4 inline-block hover:underline">View all products</Link>
        </div>
      )}
    </div>
  );
}
