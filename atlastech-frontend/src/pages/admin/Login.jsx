import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <span className="text-white font-bold text-xl">AT</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@atlastech.com"
              className={`w-full px-4 py-3 text-sm bg-white/5 border rounded-2xl text-white placeholder-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 ${errors.email ? 'border-red-500' : 'border-white/10'}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 text-sm bg-white/5 border rounded-2xl text-white placeholder-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 ${errors.password ? 'border-red-500' : 'border-white/10'}`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Back to Website</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
