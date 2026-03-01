import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { customerApi } from '../../services/api';

const AccountLayout = () => {
  const { customer, isCustomer } = useCustomerAuth();
  const location = useLocation();

  if (!isCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-xl font-bold text-gray-900 mb-2">Sign in required</h1>
          <p className="text-gray-500 mb-4">Please log in to access your account.</p>
          <Link to="/login" className="inline-flex px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const nav = [
    { path: '/account', label: 'Profile' },
    { path: '/account/orders', label: 'My Orders' },
    { path: '/account/password', label: 'Change Password' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 pb-4">
        {nav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              location.pathname === item.path
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

const ProfileTab = () => {
  const { customer, updateCustomer } = useCustomerAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    customerApi.get('/customer/profile').then((res) => {
      const d = res.data.data;
      setForm({ name: d.name, email: d.email });
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customerApi.put('/customer/profile', form);
      updateCustomer({ name: form.name, email: form.email });
      setSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md"
    >
      <h2 className="font-semibold text-gray-900 mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>
    </motion.form>
  );
};

const PasswordTab = () => {
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) return;
    setLoading(true);
    try {
      await customerApi.put('/customer/password', form);
      setDone(true);
      setForm({ current_password: '', password: '', password_confirmation: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md"
    >
      <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
      {done && <p className="text-green-600 text-sm mb-4">Password updated successfully.</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={form.current_password}
            onChange={(e) => setForm((f) => ({ ...f, current_password: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={form.password_confirmation}
            onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </motion.form>
  );
};

export { AccountLayout, ProfileTab, PasswordTab };
