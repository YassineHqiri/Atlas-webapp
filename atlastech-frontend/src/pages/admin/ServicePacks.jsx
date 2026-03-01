import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

const gradients = ['gradient-pink', 'gradient-blue', 'gradient-purple'];

const ServicePacks = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', features: [''], is_active: true });

  useEffect(() => { fetchPacks(); }, []);

  const fetchPacks = async () => {
    try { const res = await api.get('/admin/service-packs'); setPacks(res.data.data || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFeature = (i, val) => { const f = [...form.features]; f[i] = val; setForm((s) => ({ ...s, features: f })); };
  const addFeature = () => setForm((s) => ({ ...s, features: [...s.features, ''] }));
  const removeFeature = (i) => setForm((s) => ({ ...s, features: s.features.filter((_, idx) => idx !== i) }));

  const openModal = (pack = null) => {
    setEditingPack(pack);
    setForm(pack ? { name: pack.name, description: pack.description || '', price: pack.price, features: pack.features || [''], is_active: pack.is_active } : { name: '', description: '', price: '', features: [''], is_active: true });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price), features: form.features.filter((f) => f.trim()) };
    try {
      if (editingPack) { await api.put(`/admin/service-packs/${editingPack.id}`, payload); toast.success('Updated'); }
      else { await api.post('/admin/service-packs', payload); toast.success('Created'); }
      setShowModal(false); setEditingPack(null); fetchPacks();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deletePack = async (id) => {
    if (!confirm('Delete this service pack?')) return;
    try { await api.delete(`/admin/service-packs/${id}`); toast.success('Deleted'); fetchPacks(); }
    catch { toast.error('Failed'); }
  };

  const toggleActive = async (id, active) => {
    try { await api.put(`/admin/service-packs/${id}`, { is_active: !active }); toast.success(active ? 'Deactivated' : 'Activated'); fetchPacks(); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Service Packs</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your service packages</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">+ Add Pack</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packs.map((pack, i) => (
          <motion.div key={pack.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`${gradients[i % 3]} rounded-3xl p-6 text-white relative overflow-hidden ${!pack.is_active ? 'opacity-50' : ''}`}>
              <div className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-white/10"></div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{pack.name}</h3>
                <span className={`badge text-xs ${pack.is_active ? 'bg-white/25 text-white' : 'bg-black/20 text-white/70'}`}>
                  {pack.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-2xl font-extrabold mb-2">{pack.price} DH</p>
              <p className="text-sm text-white/70 mb-3">{pack.description?.slice(0, 80)}</p>

              <ul className="space-y-1 mb-4">
                {pack.features?.slice(0, 4).map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-sm text-white/90">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 relative z-10">
                <button onClick={() => toggleActive(pack.id, pack.is_active)} className="px-3 py-1.5 text-xs font-medium bg-white/15 rounded-full hover:bg-white/25 transition-colors">
                  {pack.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openModal(pack)} className="px-3 py-1.5 text-xs font-medium bg-white/15 rounded-full hover:bg-white/25 transition-colors">Edit</button>
                <button onClick={() => deletePack(pack.id)} className="px-3 py-1.5 text-xs font-medium bg-white/15 rounded-full hover:bg-red-400/40 transition-colors">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
        {packs.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 text-sm">No service packs yet.</div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => { setShowModal(false); setEditingPack(null); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-5">{editingPack ? 'Edit Pack' : 'New Pack'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="input-field resize-none" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (DH)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" step="0.01" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Features</label>
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={f} onChange={(e) => handleFeature(i, e.target.value)} className="input-field" placeholder={`Feature ${i + 1}`} />
                      {form.features.length > 1 && (
                        <button type="button" onClick={() => removeFeature(i)} className="px-3 text-red-400 hover:text-red-600 transition-colors">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addFeature} className="text-purple-600 text-sm font-medium hover:underline">+ Add Feature</button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded text-purple-600" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setEditingPack(null); }} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editingPack ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicePacks;
