import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShieldCheck, CreditCard, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import api from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/orders', { items, total });
      const { razorpayOrderId, orderId } = res.data;

      // Mocking Razorpay if no keys
      if (!razorpayOrderId) {
        setTimeout(() => {
          setSuccess(true);
          dispatch(clearCart());
          setLoading(false);
        }, 1500);
        return;
      }

      const options = {
        key: "YOUR_RAZORPAY_KEY", // Should come from env
        amount: total * 100,
        currency: "INR",
        name: "Robotutur",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: function (response: any) {
          setSuccess(true);
          dispatch(clearCart());
          setLoading(false);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment failed');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-6 bg-emerald-500/10 rounded-full mb-8">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </div>
        <h2 className="text-4xl font-bold mb-4">ORDER PLACED!</h2>
        <p className="text-zinc-400 mb-12 text-lg">Your hardware is being prepared for shipment. You'll receive a confirmation email shortly.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-emerald-500 text-black px-12 py-4 rounded-xl font-bold hover:bg-emerald-400 transition-colors"
        >
          RETURN HOME
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12 tracking-tight">CHECKOUT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-950 p-8 rounded-3xl border border-white/5">
            <div className="flex items-center space-x-3 mb-8">
              <Truck className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-bold">SHIPPING ADDRESS</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                <input type="text" defaultValue={user?.name} className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Phone Number</label>
                <input type="text" placeholder="+91 98765 43210" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Street Address</label>
                <input type="text" placeholder="123 Tech Park, Silicon Valley" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">City</label>
                <input type="text" placeholder="Bangalore" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">PIN Code</label>
                <input type="text" placeholder="560001" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </section>

          <section className="bg-zinc-950 p-8 rounded-3xl border border-white/5">
            <div className="flex items-center space-x-3 mb-8">
              <CreditCard className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-bold">PAYMENT METHOD</h3>
            </div>
            <div className="p-6 border-2 border-emerald-500 bg-emerald-500/5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold">Razorpay Secure</h4>
                  <p className="text-xs text-zinc-400">Cards, UPI, NetBanking, Wallets</p>
                </div>
              </div>
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 sticky top-24">
            <h3 className="text-xl font-bold mb-8">ORDER SUMMARY</h3>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{item.name} x {item.quantity}</span>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-emerald-500">₹{total}</span>
              </div>
            </div>
            <button 
              disabled={loading}
              onClick={handlePayment}
              className="w-full bg-emerald-500 text-black py-4 rounded-xl font-bold flex items-center justify-center hover:bg-emerald-400 transition-all disabled:opacity-50 group"
            >
              {loading ? 'PROCESSING...' : 'PAY NOW'} <ShieldCheck className="ml-2 w-5 h-5" />
            </button>
            <p className="text-center text-zinc-500 text-[10px] uppercase tracking-widest mt-6">
              100% Secure Transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
