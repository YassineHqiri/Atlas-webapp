import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { publicApi } from '../../services/api';

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: null })); };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await publicApi.post('/public/contact', form);
      toast.success('Message sent!');
      setSubmitted(true);
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error('Failed to send message.');
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h1>
          <p className="text-gray-500 mb-6">We'll get back to you shortly.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }} className="text-purple-600 text-sm font-medium hover:underline">Send another</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">Have a question or project in mind? We'd love to hear from you.</p>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="lg:col-span-3">
          <div className="card p-6 sm:p-8 space-y-4">
            {[
              { name: 'name', label: 'Your Name', placeholder: 'John Doe', type: 'text' },
              { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input name={field.name} type={field.type} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder}
                  className={`input-field ${errors[field.name] ? 'border-red-300' : ''}`} />
                {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows="5" placeholder="Tell us about your project..."
                className={`input-field resize-none ${errors.message ? 'border-red-300' : ''}`} />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50">
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </motion.form>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
          {[
            { icon: '✉️', bg: 'bg-blue-100', title: 'Email', value: 'hello@atlastech.com' },
            { icon: '📍', bg: 'bg-pink-100', title: 'Location', value: 'Available Worldwide' },
            { icon: '⚡', bg: 'bg-green-100', title: 'Response Time', value: 'Within 24 hours' },
          ].map((item) => (
            <div key={item.title} className="card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center text-lg`}>{item.icon}</div>
              <div>
                <p className="text-xs text-gray-400">{item.title}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="gradient-purple rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-white/10"></div>
            <h3 className="font-bold mb-2">Need a Custom Solution?</h3>
            <p className="text-white/80 text-sm mb-3">Check out our service packs for tailored web development.</p>
            <a href="/order" className="inline-block px-4 py-2 bg-white text-purple-700 text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors">View Packs</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
