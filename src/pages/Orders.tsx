import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(res => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12 tracking-tight">MY ORDERS</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-zinc-950 rounded-3xl border border-white/5">
          <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-zinc-900 rounded-2xl">
                  <Package className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Order #{order.id}</h3>
                  <p className="text-zinc-500 text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-white">₹{order.total}</p>
              </div>

              <div className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 rounded-full border border-white/5">
                {order.status === 'PENDING' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-orange-500 uppercase">Pending</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500 uppercase">Completed</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
