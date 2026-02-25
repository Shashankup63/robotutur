import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

export default function Cart() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-6 bg-zinc-950 rounded-full mb-8">
          <ShoppingBag className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-zinc-400 mb-8">Looks like you haven't added any hardware yet.</p>
        <Link to="/products" className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors">
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12 tracking-tight">SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center bg-zinc-950 p-6 rounded-3xl border border-white/5 gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                <p className="text-emerald-500 font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-white/10">
                <button 
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                  className="p-2 hover:text-emerald-500 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button 
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  className="p-2 hover:text-emerald-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => dispatch(removeFromCart(item.id))}
                className="p-3 text-zinc-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 sticky top-24">
            <h3 className="text-xl font-bold mb-8">ORDER SUMMARY</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold uppercase text-xs">Free</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-emerald-500">₹{total}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(isAuthenticated ? '/checkout' : '/login?redirect=checkout')}
              className="w-full bg-emerald-500 text-black py-4 rounded-xl font-bold flex items-center justify-center hover:bg-emerald-400 transition-all group"
            >
              PROCEED TO CHECKOUT <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-zinc-500 text-xs mt-6">
              Secure checkout powered by Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
