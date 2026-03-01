import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { const res = await api.get('/admin/orders'); setOrders(res.data.data || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await api.patch(`/admin/orders/${id}`, { status }); toast.success('Status updated'); fetchOrders(); }
    catch { toast.error('Failed to update'); }
  };

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return;
    try { await api.delete(`/admin/orders/${id}`); toast.success('Deleted'); fetchOrders(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const statusBadge = { pending: 'badge-orange', completed: 'badge-green', cancelled: 'bg-red-100 text-red-700' };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer orders</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${filter === s ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Pack</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                      {order.phone && <p className="text-xs text-gray-400">{order.phone}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{order.service_pack?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`badge cursor-pointer border-0 outline-none ${statusBadge[order.status] || 'badge-blue'}`}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => deleteOrder(order.id)} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="6" className="px-5 py-10 text-center text-gray-400 text-sm">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Orders;
