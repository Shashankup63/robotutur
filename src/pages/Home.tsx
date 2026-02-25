import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Cpu, Bot, Zap, Radio, Layers, ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    api.get('/products').then(res => setFeatured(res.data.slice(0, 3)));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center bg-zinc-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b981,transparent_50%)]"></div>
          <div className="grid grid-cols-10 h-full w-full">
            {[...Array(100)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/5"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 border border-emerald-500/20">
              Next-Gen Robotics Hardware
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              BUILD THE <span className="text-emerald-500">FUTURE</span> PIECE BY PIECE.
            </h1>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
              From high-torque servos to advanced LiDAR sensors, we provide the 
              industrial-grade hardware you need for your next breakthrough.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="bg-emerald-500 text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-emerald-400 transition-all group">
                EXPLORE SHOP <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-white/10 transition-all">
                JOIN COMMUNITY
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Quality Assured", desc: "Every component is tested for precision and durability in our lab." },
              { icon: Truck, title: "Global Shipping", desc: "Fast and secure delivery to over 150 countries worldwide." },
              { icon: Headphones, title: "Expert Support", desc: "Our engineers are available 24/7 to help with your technical queries." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:border-emerald-500/30 transition-colors">
                <f.icon className="w-10 h-10 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">FEATURED HARDWARE</h2>
              <p className="text-zinc-400">Our most popular modules this month.</p>
            </div>
            <Link to="/products" className="text-emerald-500 font-bold flex items-center hover:underline">
              VIEW ALL <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -10 }}
                className="group bg-zinc-900 rounded-3xl overflow-hidden border border-white/5"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img src={p.image} alt={p.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    {p.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{p.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-400">₹{p.price}</span>
                    <Link to={`/product/${p.id}`} className="p-3 bg-white text-black rounded-xl hover:bg-emerald-500 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">EXPLORE BY CATEGORY</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Bot, name: "Robotics" },
              { icon: Radio, name: "IoT" },
              { icon: Zap, name: "Drones" },
              { icon: Cpu, name: "Embedded" },
              { icon: Layers, name: "Sensors" }
            ].map((c, i) => (
              <Link 
                key={i} 
                to={`/products?cat=${c.name}`}
                className="flex flex-col items-center justify-center p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:bg-emerald-500 hover:text-black transition-all group"
              >
                <c.icon className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-bold tracking-wider text-xs uppercase">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
