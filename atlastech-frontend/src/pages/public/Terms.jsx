import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Terms = () => (
  <div className="max-w-4xl mx-auto px-6 py-10">
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg> Home
    </Link>

    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
    </motion.div>

    <div className="card p-6 sm:p-8 space-y-6">
      {[
        { title: '1. Acceptance of Terms', text: 'By accessing and using the AtlasTech Solutions platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
        { title: '2. Services', items: ['AtlasTech provides web development service packs for SMEs.', 'Service details, features, and pricing are described on our Services page.', 'We reserve the right to modify service offerings at any time.'] },
        { title: '3. Orders & Payment', items: ['Orders submitted through our platform are subject to confirmation.', 'Pricing is in USD and excludes applicable taxes unless stated.', 'Payment terms will be communicated upon order confirmation.', 'We reserve the right to decline orders at our discretion.'] },
        { title: '4. Intellectual Property', text: 'All website content, designs, and branding are the intellectual property of AtlasTech Solutions. Upon project completion and full payment, clients receive rights to their custom deliverables.' },
        { title: '5. Limitation of Liability', text: 'AtlasTech Solutions shall not be liable for indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service.' },
        { title: '6. Affiliate Links', text: 'This website may contain affiliate links. We earn commissions when purchases are made through these links. This does not affect prices or our editorial recommendations.' },
        { title: '7. Termination', text: 'We reserve the right to terminate or suspend access to our platform for any user who violates these terms or engages in harmful activity.' },
        { title: '8. Changes to Terms', text: 'We may update these terms from time to time. Continued use of the platform constitutes acceptance of the updated terms.' },
        { title: '9. Contact', text: 'For questions about these terms, please visit our Contact page or email hello@atlastech.com.' },
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

export default Terms;
