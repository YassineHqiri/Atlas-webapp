import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useCustomerAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((e2) => ({ ...e2, [e.target.name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      toast.success('Account created!');
      navigate('/order');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Registration failed';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const flat = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : v; });
        setErrors(flat);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Sign up to place orders and track your projects</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {['name', 'email', 'password', 'password_confirmation'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field === 'password_confirmation' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'password_confirmation' ? 'Re-enter password' : ''}
                  className={`w-full px-4 py-3 rounded-2xl border text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 ${errors[field] ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">Log in</Link>
          </p>
          <p className="text-center text-sm mt-2">
            <Link to="/" className="text-gray-400 hover:text-gray-600">← Back to Home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
