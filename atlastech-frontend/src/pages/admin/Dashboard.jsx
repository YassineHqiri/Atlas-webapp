import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats?.statistics?.total_orders || 0, bg: 'bg-blue-100', numColor: 'text-blue-900', labelColor: 'text-blue-700' },
    { label: 'Pending', value: stats?.statistics?.pending_orders || 0, bg: 'bg-orange-100', numColor: 'text-orange-900', labelColor: 'text-orange-700' },
    { label: 'Completed', value: stats?.statistics?.completed_orders || 0, bg: 'bg-green-100', numColor: 'text-green-900', labelColor: 'text-green-700' },
    { label: 'Service Packs', value: stats?.statistics?.total_service_packs || 0, bg: 'bg-purple-100', numColor: 'text-purple-900', labelColor: 'text-purple-700' },
  ];

  const crmStats = stats?.crm || {};

  const statusBadge = {
    pending: 'badge-orange',
    completed: 'badge-green',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's your platform overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`stat-card ${stat.bg}`}>
              <p className={`text-3xl font-bold ${stat.numColor}`}>{stat.value}</p>
              <p className={`text-sm font-medium ${stat.labelColor} mt-1`}>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CRM Widget */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">CRM Overview</h2>
            <Link to="/admin/crm/leads" className="text-sm text-purple-600 font-medium hover:underline">View CRM →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-purple-700">{crmStats.total_leads ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Leads</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-blue-600">{crmStats.new_leads_this_week ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">New This Week</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-green-600">{crmStats.won_leads ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">Won</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-green-700">{Number(crmStats.won_value || 0).toLocaleString()} DH</p>
              <p className="text-xs text-gray-500 mt-0.5">Won Value</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="card overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-purple-600 font-medium hover:underline">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Pack</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recent_orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{order.service_pack?.name || '—'}</td>
                    <td className="px-5 py-3.5"><span className={`badge ${statusBadge[order.status] || 'badge-blue'}`}>{order.status}</span></td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!stats?.recent_orders || stats.recent_orders.length === 0) && (
                  <tr><td colSpan="4" className="px-5 py-10 text-center text-gray-400 text-sm">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
