import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/order');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-gray-900">Log In</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to place orders and track your projects</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <Link to="/forgot-password" className="block text-sm text-purple-600 hover:text-purple-700 mt-2">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-700">Create one</Link>
          </p>
          <p className="text-center text-sm mt-2">
            <Link to="/" className="text-gray-400 hover:text-gray-600">← Back to Home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
