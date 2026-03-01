import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { publicApi, customerApi } from '../../services/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const OrderForm = () => {
  const { packId } = useParams();
  const { customer, isCustomer, logout } = useCustomerAuth();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    selected_pack_id: packId || '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    publicApi.get('/public/service-packs')
      .then((res) => { setPacks(res.data.data || []); if (packId) setForm((f) => ({ ...f, selected_pack_id: packId })); })
      .catch(() => toast.error('Failed to load service packs'))
      .finally(() => setLoading(false));
  }, [packId]);

  useEffect(() => {
    if (isCustomer && customer) {
      setForm((f) => ({
        ...f,
        customer_name: customer.name,
        email: customer.email,
      }));
    }
  }, [isCustomer, customer]);

  const handleChange = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); if (errors[e.target.name]) setErrors((e2) => ({ ...e2, [e.target.name]: null })); };

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim()) errs.customer_name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.selected_pack_id) errs.selected_pack_id = 'Select a pack';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const api = isCustomer ? customerApi : publicApi;
      await api.post('/public/orders', form);
      toast.success('Order placed successfully!');
      setSubmitted(true);
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error('Failed to place order.');
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Placed!</h1>
          <p className="text-gray-500 mb-6">We'll contact you shortly to get started on your project.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </motion.div>
      </div>
    );
  }

  const packColors = ['bg-pink-100 border-pink-300', 'bg-blue-100 border-blue-300', 'bg-purple-100 border-purple-300'];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back
      </Link>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Place an Order</h1>
      <p className="text-gray-500 mb-4">Select your service pack and fill in your details.</p>

      {/* Checkout options */}
      <div className="mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
        {isCustomer ? (
          <p className="text-sm text-gray-600">
            ✓ Signed in as <strong>{customer?.email}</strong>. Your order will be linked to your account.
            <button type="button" onClick={() => logout()} className="ml-2 text-purple-600 hover:text-purple-700 text-sm font-medium">(Not you? Log out)</button>
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-600">Checkout as:</span>
            <span className="text-sm text-gray-900 font-medium">Guest</span>
            <span className="text-gray-300">|</span>
            <Link to="/register" className="text-sm font-semibold text-purple-600 hover:text-purple-700">Create account</Link>
            <span className="text-gray-400">or</span>
            <Link to="/login" className="text-sm font-semibold text-purple-600 hover:text-purple-700">Log in</Link>
            <span className="text-sm text-gray-500">to link orders to your account</span>
          </div>
        )}
      </div>

      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-5">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Your Details</h2>
            {[
              { name: 'customer_name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
              { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
              { name: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input name={field.name} type={field.type} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder}
                  className={`input-field ${errors[field.name] ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`} />
                {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder="Any special requirements..." className="input-field resize-none" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50">
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>

        {/* Pack selection */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Select a Pack</h2>
            {errors.selected_pack_id && <p className="text-red-500 text-xs mb-3">{errors.selected_pack_id}</p>}
            {loading ? <p className="text-gray-400 text-sm py-8 text-center">Loading...</p> : (
              <div className="space-y-3">
                {packs.map((pack, i) => (
                  <label key={pack.id} className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    String(form.selected_pack_id) === String(pack.id) ? `${packColors[i % 3]} border-2` : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}>
                    <input type="radio" name="selected_pack_id" value={pack.id} checked={String(form.selected_pack_id) === String(pack.id)} onChange={handleChange} className="sr-only" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{pack.name}</span>
                      <span className="font-bold text-gray-900 text-sm">{pack.price} DH</span>
                    </div>
                    <ul className="space-y-1 mt-2">
                      {pack.features?.slice(0, 3).map((f, fi) => (
                        <li key={fi} className="text-xs text-gray-500 flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default OrderForm;
