import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { customerApi } from '../../services/api';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi
      .get('/customer/orders')
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/order" className="inline-flex px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800">
            Place an Order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">Order #{order.id}</span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {order.service_pack?.name || 'Service Pack'} · {Number(order.service_pack?.price || 0).toLocaleString()} DH
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to="/order"
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  Order again →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
