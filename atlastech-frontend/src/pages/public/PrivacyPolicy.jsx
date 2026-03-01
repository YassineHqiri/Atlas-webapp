import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto px-6 py-10">
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg> Home
    </Link>

    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
    </motion.div>

    <div className="card p-6 sm:p-8 space-y-6">
      {[
        { title: 'Information We Collect', items: ['Name, email, and phone number when you place an order or contact us.', 'Usage data (pages visited, time spent) through analytics.', 'Device and browser information for site optimization.'] },
        { title: 'How We Use Your Information', items: ['To process and fulfill service orders.', 'To respond to inquiries and provide support.', 'To improve our website and services.', 'To send relevant updates (with your consent).'] },
        { title: 'Data Protection', items: ['All data is encrypted in transit via HTTPS/SSL.', 'We never sell or share your personal data with third parties.', 'Access to customer data is restricted to authorized personnel only.', 'We implement industry-standard security measures.'] },
        { title: 'Cookies', items: ['We use essential cookies for site functionality.', 'Analytics cookies help us understand usage (anonymized).', 'You can disable cookies through your browser settings.'] },
        { title: 'Affiliate Disclosure', text: 'Some links on this site are affiliate links. We may earn a small commission if you make a purchase through these links. This does not affect our editorial integrity or the price you pay.' },
        { title: 'Your Rights', items: ['Request access to your personal data.', 'Request correction or deletion of your data.', 'Withdraw consent for data processing.', 'Lodge a complaint with a supervisory authority.'] },
        { title: 'Contact', text: 'For privacy-related questions, please contact us through our Contact page or email hello@atlastech.com.' },
      ].map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
          {section.text && <p className="text-sm text-gray-600 leading-relaxed">{section.text}</p>}
          {section.items && (
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600"><span className="text-purple-500 mt-0.5">•</span>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default PrivacyPolicy;
