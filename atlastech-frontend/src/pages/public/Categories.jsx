import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api';
import { products } from '../../data/products';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

const ServiceIllustration = ({ type, color }) => {
  const illustrations = {
    security: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill={`${color}15`} />
        <circle cx="60" cy="60" r="36" fill={`${color}20`} />
        <path d="M60 28C52 28 44 31 44 31V58C44 72 60 82 60 82C60 82 76 72 76 58V31C76 31 68 28 60 28Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M52 58L57 63L68 52" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="90" cy="30" r="4" fill={color} opacity="0.2" />
        <circle cx="30" cy="85" r="3" fill={color} opacity="0.15" />
        <rect x="82" y="75" width="8" height="8" rx="2" fill={color} opacity="0.1" transform="rotate(15 86 79)" />
      </svg>
    ),
    management: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill={`${color}15`} />
        <circle cx="60" cy="60" r="36" fill={`${color}20`} />
        <rect x="38" y="35" width="44" height="50" rx="4" fill="white" stroke={color} strokeWidth="2" />
        <rect x="38" y="35" width="44" height="14" rx="4" fill={color} opacity="0.2" />
        <circle cx="47" cy="42" r="2.5" fill={color} opacity="0.6" />
        <circle cx="55" cy="42" r="2.5" fill={color} opacity="0.4" />
        <circle cx="63" cy="42" r="2.5" fill={color} opacity="0.2" />
        <rect x="44" y="56" width="24" height="3" rx="1.5" fill={color} opacity="0.3" />
        <rect x="44" y="63" width="32" height="3" rx="1.5" fill={color} opacity="0.2" />
        <rect x="44" y="70" width="18" height="3" rx="1.5" fill={color} opacity="0.15" />
        <path d="M68 70L72 74L78 66" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="92" cy="38" r="3" fill={color} opacity="0.2" />
        <rect x="26" y="70" width="6" height="6" rx="1.5" fill={color} opacity="0.1" />
      </svg>
    ),
    consultancy: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill={`${color}15`} />
        <circle cx="60" cy="60" r="36" fill={`${color}20`} />
        <circle cx="60" cy="48" r="16" fill="white" stroke={color} strokeWidth="2" />
        <path d="M52 45C52 45 55 52 60 52C65 52 68 45 68 45" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="55" cy="44" r="1.5" fill={color} />
        <circle cx="65" cy="44" r="1.5" fill={color} />
        <path d="M44 72C44 64 51 58 60 58C69 58 76 64 76 72" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <rect x="48" y="68" width="24" height="16" rx="3" fill="white" stroke={color} strokeWidth="2" />
        <path d="M54 74H66M54 78H62" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M78 38L84 32M84 38L78 32" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
        <circle cx="34" cy="76" r="4" fill={color} opacity="0.12" />
        <path d="M88 68L92 64" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
        <circle cx="92" cy="62" r="3" fill={color} opacity="0.15" />
      </svg>
    ),
    cloud: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill={`${color}15`} />
        <circle cx="60" cy="60" r="36" fill={`${color}20`} />
        <path d="M40 68C36 68 32 64 32 60C32 56 36 52 40 52C40 44 46 38 54 38C60 38 66 42 68 48C70 46 72 45 75 45C80 45 84 49 84 54C84 55 84 56 83.5 57C87 58 90 62 90 66C90 70 87 74 82 74H40C36 74 32 72 32 68" fill="white" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M52 62V54M52 54L48 58M52 54L56 58" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 58V66M68 66L64 62M68 66L72 62" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="56" y="80" width="8" height="10" rx="2" fill={color} opacity="0.15" />
        <rect x="48" y="88" width="24" height="4" rx="2" fill={color} opacity="0.1" />
        <circle cx="28" cy="42" r="3" fill={color} opacity="0.15" />
        <circle cx="94" cy="78" r="4" fill={color} opacity="0.1" />
      </svg>
    ),
    software: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill={`${color}15`} />
        <circle cx="60" cy="60" r="36" fill={`${color}20`} />
        <rect x="30" y="34" width="60" height="42" rx="4" fill="white" stroke={color} strokeWidth="2" />
        <rect x="30" y="34" width="60" height="10" rx="4" fill={color} opacity="0.15" />
        <circle cx="38" cy="39" r="2" fill={color} opacity="0.5" />
        <circle cx="44" cy="39" r="2" fill={color} opacity="0.35" />
        <circle cx="50" cy="39" r="2" fill={color} opacity="0.2" />
        <path d="M42 54L38 58L42 62" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M54 54L58 58L54 62" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 52L46 64" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <rect x="62" y="52" width="20" height="2.5" rx="1" fill={color} opacity="0.2" />
        <rect x="62" y="58" width="14" height="2.5" rx="1" fill={color} opacity="0.15" />
        <rect x="62" y="64" width="18" height="2.5" rx="1" fill={color} opacity="0.1" />
        <rect x="46" y="78" width="28" height="6" rx="2" fill={color} opacity="0.12" />
        <rect x="56" y="76" width="8" height="4" fill={color} opacity="0.08" />
        <circle cx="92" cy="32" r="3" fill={color} opacity="0.15" />
        <rect x="24" y="68" width="5" height="5" rx="1" fill={color} opacity="0.1" transform="rotate(20 26.5 70.5)" />
      </svg>
    ),
    marketing: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill={`${color}15`} />
        <circle cx="60" cy="60" r="36" fill={`${color}20`} />
        <rect x="34" y="82" width="12" height="0" rx="2" fill={color} opacity="0.3">
          <animate attributeName="height" from="0" to="30" dur="0.8s" fill="freeze" begin="0.2s" />
          <animate attributeName="y" from="82" to="52" dur="0.8s" fill="freeze" begin="0.2s" />
        </rect>
        <rect x="50" y="82" width="12" height="0" rx="2" fill={color} opacity="0.5">
          <animate attributeName="height" from="0" to="42" dur="0.8s" fill="freeze" begin="0.4s" />
          <animate attributeName="y" from="82" to="40" dur="0.8s" fill="freeze" begin="0.4s" />
        </rect>
        <rect x="66" y="82" width="12" height="0" rx="2" fill={color} opacity="0.35">
          <animate attributeName="height" from="0" to="24" dur="0.8s" fill="freeze" begin="0.6s" />
          <animate attributeName="y" from="82" to="58" dur="0.8s" fill="freeze" begin="0.6s" />
        </rect>
        <rect x="82" y="82" width="12" height="0" rx="2" fill={color} opacity="0.6">
          <animate attributeName="height" from="0" to="46" dur="0.8s" fill="freeze" begin="0.8s" />
          <animate attributeName="y" from="82" to="36" dur="0.8s" fill="freeze" begin="0.8s" />
        </rect>
        <line x1="30" y1="82" x2="98" y2="82" stroke={color} strokeWidth="1.5" opacity="0.2" />
        <path d="M38 50L56 38L72 56L90 34" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" opacity="0.4" />
        <circle cx="90" cy="34" r="4" fill={color} opacity="0.3" />
        <path d="M86 30L90 34L94 30" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        <circle cx="26" cy="44" r="3" fill={color} opacity="0.12" />
      </svg>
    ),
  };
  return illustrations[type] || null;
};

const services = [
  { type: 'security', title: 'Cyber Security', desc: 'Protect your business with secure authentication, data encryption, and OWASP-compliant code practices.', color: '#22c55e', bgLight: 'from-green-50 to-emerald-50', borderHover: 'hover:border-green-300' },
  { type: 'management', title: 'IT Management', desc: 'End-to-end project management with structured workflows, version control, and deployment pipelines.', color: '#3b82f6', bgLight: 'from-blue-50 to-sky-50', borderHover: 'hover:border-blue-300' },
  { type: 'consultancy', title: 'IT Consultancy', desc: 'Expert guidance on technology choices, architecture design, and digital transformation strategy.', color: '#a855f7', bgLight: 'from-purple-50 to-violet-50', borderHover: 'hover:border-purple-300' },
  { type: 'cloud', title: 'Cloud Computing', desc: 'Scalable cloud hosting, automated backups, and infrastructure management for reliable uptime.', color: '#f97316', bgLight: 'from-orange-50 to-amber-50', borderHover: 'hover:border-orange-300' },
  { type: 'software', title: 'Software Developer', desc: 'Custom web applications built with React, Laravel, and modern frameworks tailored to your needs.', color: '#ec4899', bgLight: 'from-pink-50 to-rose-50', borderHover: 'hover:border-pink-300' },
  { type: 'marketing', title: 'Marketing Strategy', desc: 'SEO optimization, analytics integration, and conversion-focused design to grow your online presence.', color: '#eab308', bgLight: 'from-yellow-50 to-amber-50', borderHover: 'hover:border-yellow-300' },
];

const Categories = () => {
  const [packs, setPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);

  useEffect(() => {
    publicApi.get('/public/service-packs')
      .then((res) => setPacks(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingPacks(false));
  }, []);

  const packAccents = [
    { border: 'border-green-400', btn: 'bg-green-500 hover:bg-green-600', price: 'text-green-600' },
    { border: 'border-purple-400', btn: 'bg-purple-500 hover:bg-purple-600', price: 'text-purple-600' },
    { border: 'border-blue-400', btn: 'bg-blue-500 hover:bg-blue-600', price: 'text-blue-600' },
  ];

  return (
    <div>
      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 40%, #0d1117 100%)' }}>
        {/* Animated green glow blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #a3e635 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Horizontal accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        {/* Floating shapes */}
        <div className="absolute top-8 left-12 w-8 h-8 border border-green-500/20 rounded-lg rotate-12" />
        <div className="absolute top-16 right-16 w-5 h-5 bg-green-500/10 rounded-full" />
        <div className="absolute bottom-10 left-20 w-4 h-4 border border-purple-400/20 rounded rotate-45" />
        <div className="absolute top-10 right-1/3 w-3 h-3 bg-blue-400/15 rounded-full" />
        <div className="absolute bottom-8 right-24 w-6 h-6 border border-white/10 rounded-full" />

        <div className="max-w-7xl mx-auto px-6 py-16 text-center relative z-10">
          <motion.div {...fadeUp(0)}>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-widest border border-green-500/30 bg-green-500/10 text-green-400 rounded-full backdrop-blur">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              What We Offer
            </span>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Our{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #a3e635)' }}>Services</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Professional web development solutions designed for small and medium enterprises.
            </p>

            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <span className="text-gray-500 hover:text-white transition-colors cursor-pointer">Home</span>
              <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <span className="text-green-500">Services</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full block" preserveAspectRatio="none">
            <path d="M0 40 Q720 0 1440 40 L1440 40 L0 40Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ─── Mission Statement ─── */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <motion.div {...fadeUp(0.05)}>
          <span className="text-xs font-semibold uppercase tracking-wider text-green-600">Our Services</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 leading-snug">
            Our Mission Is To Make Your{' '}
            <span className="relative inline-block">
              <span className="relative z-10 px-2 text-white">Business</span>
              <span className="absolute inset-0 bg-black rounded-lg -skew-x-2" />
            </span>{' '}
            Better Through Technology
          </h2>
        </motion.div>
      </section>

      {/* ─── Services Grid (3×2) with Illustrations ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {/* Top row connector bar */}
        <div className="hidden lg:block relative mb-0">
          <div className="absolute top-[90px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div key={svc.title} {...fadeUp(0.06 * i)}>
              <div className={`bg-white rounded-3xl border border-gray-100 ${svc.borderHover} p-6 h-full group hover:shadow-xl transition-all duration-300 text-center`}>
                {/* Illustration */}
                <div className={`w-32 h-32 mx-auto mb-5 rounded-full bg-gradient-to-br ${svc.bgLight} p-2 group-hover:scale-105 transition-transform duration-300`}>
                  <ServiceIllustration type={svc.type} color={svc.color} />
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{svc.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Pricing Plans ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-green-600">Pricing Plan</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
            We Make IT Simple, Faster, And Less Expensive
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Choose a service pack that fits your business needs. Transparent pricing with no hidden fees.
          </p>
        </motion.div>

        {loadingPacks ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {packs.map((pack, i) => {
              const accent = packAccents[i % packAccents.length];
              const isFeatured = i === 1;
              return (
                <motion.div key={pack.id} {...fadeUp(0.06 * i)}>
                  <div className={`bg-white rounded-3xl border overflow-hidden h-full flex flex-col border-t-4 ${accent.border} ${isFeatured ? 'ring-2 ring-purple-200 shadow-2xl relative scale-[1.02]' : 'border-gray-100 hover:shadow-lg'} transition-all duration-300`}>
                    {isFeatured && (
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <span className="inline-flex items-center px-4 py-1 bg-purple-600 text-white text-[11px] font-semibold rounded-full shadow-lg">Most Popular</span>
                      </div>
                    )}

                    <div className="p-7 pb-5 text-center border-b border-gray-100">
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{pack.name}</h3>
                      <div className="flex items-baseline justify-center gap-1 mb-1">
                        <span className={`text-4xl font-extrabold ${accent.price}`}>{Number(pack.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} DH</span>
                        <span className="text-sm text-gray-400 font-medium">/Project</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {i === 0 ? 'Good For Personal Portfolio' :
                         i === 1 ? 'Good For Small Company' :
                         'Good For Big Company'}
                      </p>
                    </div>

                    <div className="p-7 flex-1 flex flex-col">
                      <p className="text-sm text-gray-500 leading-relaxed mb-5">
                        {pack.description?.slice(0, 130)}{pack.description?.length > 130 ? '...' : ''}
                      </p>

                      <ul className="space-y-3 mb-7 flex-1">
                        {pack.features?.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={`/order/${pack.id}`}
                        className={`block text-center py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg ${accent.btn}`}
                      >
                        Choose Plan
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {packs.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 text-sm">No service packs available.</div>
            )}
          </div>
        )}
      </section>

      {/* ─── Digital Tools ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">Recommended Tools</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
            Digital Tools We Trust & Recommend
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <motion.div key={product.id} {...fadeUp(0.04 * i)}>
              <Link to={`/product/${product.slug}`} className="block h-full">
                <div className="bg-white rounded-3xl border border-gray-100 hover:border-gray-200 p-5 h-full flex flex-col group hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: product.logoColor }}>
                      {product.logoInitials}
                    </div>
                    <div className="flex gap-1.5">
                      {product.badges.slice(0, 1).map((b) => (
                        <span key={b} className="badge badge-green">{b}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">★ {product.rating}</p>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-3">{product.shortDescription}</p>
                  <span className="text-xs font-semibold text-green-600 group-hover:underline">{product.pricing} →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Categories;
