import { useState, useEffect, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { RootState } from '../store';
import api from '../services/api';

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString()
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">ADMIN CONSOLE</h1>
          <p className="text-zinc-400">Manage your inventory and store operations.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
            setIsModalOpen(true);
          }}
          className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold flex items-center hover:bg-emerald-400 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> ADD PRODUCT
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: '₹1.2M', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Total Orders', value: '482', icon: ShoppingBag, color: 'text-blue-500' },
          { label: 'Products', value: products.length.toString(), icon: Package, color: 'text-purple-500' },
          { label: 'Customers', value: '1.2K', icon: Users, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 p-6 rounded-3xl border border-white/5">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Product Table */}
      <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <span className="font-bold">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">{p.category}</td>
                <td className="px-6 py-4 font-bold text-emerald-500">₹{p.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {p.stock} IN STOCK
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(p)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-2xl rounded-3xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-8">{editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 h-24" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Price (₹)</label>
                <input 
                  type="number" 
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Stock</label>
                <input 
                  type="number" 
                  required
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select Category</option>
                  <option value="Robotics">Robotics</option>
                  <option value="IoT">IoT</option>
                  <option value="Drones">Drones</option>
                  <option value="Embedded">Embedded</option>
                  <option value="Sensors">Sensors</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Image URL</label>
                <input 
                  type="text" 
                  required
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors"
                >
                  {editingProduct ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
