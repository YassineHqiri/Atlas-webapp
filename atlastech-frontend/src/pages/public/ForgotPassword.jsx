import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { publicApi } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Enter your email');
      return;
    }
    setLoading(true);
    try {
      await publicApi.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Check your email for the reset link');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-display text-xl font-bold text-gray-900">Check your email</h1>
            <p className="text-gray-500 text-sm mt-2">We sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="inline-block mt-6 text-purple-600 font-semibold hover:text-purple-700">Back to Log in</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send you a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            <Link to="/login" className="text-purple-600 hover:text-purple-700">← Back to Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
