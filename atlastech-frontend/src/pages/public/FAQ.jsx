import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'What services does AtlasTech offer?', a: 'We provide web development service packs for small and medium enterprises. Each pack includes responsive design, SEO optimization, CMS setup, and ongoing support tailored to your business needs.' },
  { q: 'How do I place an order?', a: 'Visit our Services page, choose a pack, and click "Order Now." Fill in your details and any specific requirements. Our team will contact you within 24 hours to confirm and get started.' },
  { q: 'What technologies do you use?', a: 'We use modern, industry-standard technologies including React, Laravel, Tailwind CSS, and MySQL. All projects are built with security, performance, and scalability in mind.' },
  { q: 'Do you offer custom solutions?', a: 'Yes! Beyond our standard service packs, we can tailor solutions to your specific needs. Contact us to discuss your project requirements.' },
  { q: 'What is your refund policy?', a: 'We offer a satisfaction guarantee. If you\'re not satisfied with our work, we\'ll revise it until you are. For specific refund terms, please refer to your project agreement.' },
  { q: 'How long does a project take?', a: 'Timelines vary based on the pack selected and project complexity. Our Starter pack typically takes 1–2 weeks, while the Enterprise pack may take 4–6 weeks.' },
  { q: 'Do you provide hosting?', a: 'We help set up hosting on your preferred provider and optimize the deployment. We recommend reliable providers and can manage the setup for you.' },
  { q: 'How can I contact support?', a: 'Visit our Contact page to send us a message, or email hello@atlastech.com. We respond within 24 hours on business days.' },
];

const AccordionItem = ({ faq, isOpen, toggle }) => (
  <div className="card overflow-hidden">
    <button onClick={toggle} className="w-full p-5 flex items-center justify-between text-left">
      <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isOpen ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-gray-100 text-gray-500'}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
          <div className="px-5 pb-5">
            <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg> Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">FAQ</h1>
        <p className="text-gray-500 mb-8">Everything you need to know about our services.</p>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} faq={faq} isOpen={openIndex === i} toggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8">
        <div className="gradient-blue rounded-3xl p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-3 left-6 w-8 h-8 rounded-full bg-white/10"></div>
          <div className="absolute bottom-3 right-6 w-12 h-12 rounded-full bg-white/10"></div>
          <h2 className="text-xl font-bold mb-2 relative z-10">Still have questions?</h2>
          <p className="text-white/80 text-sm mb-4 relative z-10">We'd love to help. Reach out to our team.</p>
          <Link to="/contact" className="inline-block px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors relative z-10">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;
