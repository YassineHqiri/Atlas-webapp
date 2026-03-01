import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { publicApi } from '../../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !email) {
      toast.error('Invalid reset link');
      return;
    }
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await publicApi.post('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation,
      });
      setDone(true);
      toast.success('Password reset! You can now log in.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired link');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <div className="text-center">
          <h1 className="font-display text-xl font-bold text-gray-900">Invalid Reset Link</h1>
          <p className="text-gray-500 mt-2">Please request a new password reset.</p>
          <Link to="/forgot-password" className="inline-block mt-4 text-purple-600 font-semibold">Request new link</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-bold text-gray-900">Password Reset!</h1>
          <p className="text-gray-500 mt-2">You can now log in with your new password.</p>
          <Link to="/login" className="inline-block mt-6 px-6 py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800">Log In</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                placeholder="Re-enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
