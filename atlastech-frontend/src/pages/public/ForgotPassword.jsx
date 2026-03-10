import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { publicApi } from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Enter your email');
      return;
    }
    setLoading(true);
    try {
      await publicApi.post('/auth/forgot-password', { email });
      setCodeSent(true);
      toast.success('Verification code sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6) {
      toast.error('Enter a valid 6-digit code');
      return;
    }
    setVerifyingCode(true);
    try {
      await publicApi.post('/auth/verify-reset-code', { 
        email, 
        code 
      });
      setCodeVerified(true);
      toast.success('Code verified! Redirecting to password reset...');
      
      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&verified=true`);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
    } finally {
      setVerifyingCode(false);
    }
  };

  // Show code verification form after code is sent
  if (codeSent && !codeVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-gray-900">Enter Verification Code</h1>
              <p className="text-gray-500 text-sm mt-1">We sent a 6-digit code to <strong>{email}</strong></p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  type="text"
                  maxLength="6"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                />
                <p className="text-gray-500 text-xs mt-2">Code expires in 15 minutes</p>
              </div>
              <button
                type="submit"
                disabled={verifyingCode || code.length !== 6}
                className="w-full py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {verifyingCode ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <p className="text-center text-sm mt-6">
              <button
                type="button"
                onClick={() => {
                  setCodeSent(false);
                  setCode('');
                  setEmail('');
                }}
                className="text-purple-600 hover:text-purple-700"
              >
                ← Use different email
              </button>
            </p>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-center text-gray-500 text-xs">
                Code expires in 15 minutes. Check your spam folder if you don't see the email.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Initial form to enter email
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send you a verification code</p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-4">
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
              {loading ? 'Sending...' : 'Send Verification Code'}
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
