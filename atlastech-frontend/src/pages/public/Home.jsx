import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { publicApi } from '../../services/api';

/* ── animations ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay },
});

/* ── animated counter ── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(target);
    const duration = 1400;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── browser mockup (right-side hero visual) ── */
const BrowserMockup = () => (
  <div className="w-full max-w-lg mx-auto select-none">
    {/* Browser chrome */}
    <div className="bg-gray-800 rounded-t-2xl px-4 py-3 flex items-center gap-2">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 mx-3 bg-gray-700 rounded-full h-5 flex items-center px-3">
        <span className="text-gray-400 text-[10px]">atlastech.com · your-business.com</span>
      </div>
    </div>
    {/* Website preview inside */}
    <div className="bg-white rounded-b-2xl overflow-hidden shadow-2xl border-x border-b border-gray-200">
      {/* Fake nav */}
      <div className="bg-black px-4 py-2 flex items-center justify-between">
        <div className="w-16 h-2.5 bg-purple-400 rounded-full" />
        <div className="flex gap-2">
          {[1,2,3,4].map(i => <div key={i} className="w-8 h-1.5 bg-white/20 rounded-full" />)}
        </div>
        <div className="w-14 h-5 bg-white/20 rounded-full" />
      </div>
      {/* Hero fake section */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 px-5 py-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-28 h-28 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="w-32 h-3 bg-white/80 rounded-full mb-2" />
        <div className="w-20 h-2 bg-white/50 rounded-full mb-4" />
        <div className="w-16 h-6 bg-white/30 rounded-full" />
      </div>
      {/* Fake stats */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        {[['500+','blue'],['200+','green'],['99.9%','orange']].map(([v, c]) => (
          <div key={v} className={`bg-${c}-50 rounded-xl p-2 text-center`}>
            <p className={`text-xs font-bold text-${c}-700`}>{v}</p>
            <div className={`w-8 h-1 bg-${c}-200 rounded mx-auto mt-1`} />
          </div>
        ))}
      </div>
      {/* Fake cards row */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-4">
        {[['gradient-pink','Pack A','499 DH'],['gradient-blue','Pack B','999 DH']].map(([g, n, p]) => (
          <div key={n} className={`${g} rounded-xl p-3 text-white`}>
            <p className="text-[10px] font-bold opacity-70">{n}</p>
            <p className="text-sm font-extrabold">{p}</p>
            <div className="w-10 h-1 bg-white/30 rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── pack colors ── */
const PACK_COLORS = [
  { bg: 'gradient-pink' },
  { bg: 'gradient-blue' },
  { bg: 'gradient-purple' },
];

/* ─────────────────────────────── */
const Home = () => {
  const [packs, setPacks] = useState([]);

  useEffect(() => {
    publicApi.get('/public/service-packs')
      .then(r => setPacks(r.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO — full-width photo + floating cards
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80&fit=crop"
            alt="Team working"
            className="w-full h-full object-cover"
          />
          {/* Deep gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,10,20,0.92) 0%, rgba(10,10,30,0.75) 55%, rgba(10,10,20,0.30) 100%)' }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — text */}
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-full text-xs font-semibold mb-6 backdrop-blur">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                Trusted by 500+ SMEs worldwide
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-white mb-6">
                Build Your Business<br />
                <span className="relative">
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#c084fc,#f472b6,#fb923c)' }}>
                    Online.
                  </span>
                </span>{' '}
                <span className="text-white">All In One Place.</span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                Join 500+ businesses that trusted AtlasTech to build their digital presence — where professionalism meets performance, and every launch brings you closer to success.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/order" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg text-sm">
                  Start Your Own Journey
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link to="/categories" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 border border-white/20 transition-all text-sm backdrop-blur">
                  View Services
                </Link>
              </div>

              {/* Social proof row */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['bg-purple-500','bg-blue-500','bg-pink-500','bg-green-500','bg-orange-500'].map((c, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold shadow`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
                  <p className="text-gray-400 text-xs mt-0.5"><span className="text-white font-semibold">4.9/5</span> from 200+ reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Right — browser mockup + floating cards */}
            <motion.div {...fadeUp(0.2)} className="relative hidden lg:block">
              <BrowserMockup />

              {/* Floating metric: Order */}
              <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{delay:0.8}}
                className="absolute -left-8 top-1/3 bg-white rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 w-52">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Order Completed</p>
                  <p className="text-[10px] text-gray-400">2 min ago · Enterprise Pack</p>
                </div>
              </motion.div>

              {/* Floating metric: Projects */}
              <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:1.0}}
                className="absolute -right-6 top-8 bg-white rounded-2xl p-4 shadow-2xl text-center w-28">
                <p className="text-2xl font-extrabold text-gray-900">500<span className="text-purple-500">+</span></p>
                <p className="text-[10px] text-gray-400 font-medium">Projects Done</p>
              </motion.div>

              {/* Floating metric: Rating */}
              <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.1}}
                className="absolute -right-4 bottom-16 bg-black rounded-2xl p-4 shadow-2xl">
                <p className="text-2xl font-extrabold text-white">4.9<span className="text-yellow-400">★</span></p>
                <p className="text-[10px] text-gray-400">Average Rating</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BAR — "used by" tech / brand logos
      ═══════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 shrink-0">
              Built with trusted technologies
            </p>
            <div className="flex flex-wrap items-center gap-8">
              {[
                { name: 'React', color: '#61DAFB', bg: '#20232a' },
                { name: 'Laravel', color: '#FF2D20', bg: '#fff' },
                { name: 'Tailwind', color: '#38bdf8', bg: '#0f172a' },
                { name: 'MySQL', color: '#4479A1', bg: '#fff' },
                { name: 'HTTPS/SSL', color: '#22c55e', bg: '#f0fdf4' },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                  <span className="text-sm font-semibold text-gray-500">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT — photo left / text + cards right
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — real photo with overlaid cards */}
          <motion.div {...fadeUp(0)} className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl" />
            </div>
            {/* Floating card — projects */}
            <div className="absolute -bottom-5 -left-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900"><Counter target="500" suffix="+" /></p>
                <p className="text-xs text-gray-400">Projects Delivered</p>
              </div>
            </div>
            {/* Floating card — clients */}
            <div className="absolute -top-4 -right-4 bg-black rounded-2xl shadow-2xl p-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80'].map((src,i) => (
                  <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-black object-cover" />
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-extrabold"><Counter target="200" suffix="+" /></p>
                <p className="text-gray-400 text-[10px]">Happy Clients</p>
              </div>
            </div>
          </motion.div>

          {/* Right — story */}
          <motion.div {...fadeUp(0.15)}>
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">About AtlasTech</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-5 leading-tight">
              We don't just build websites —{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}>
                we build businesses.
              </span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5">
              Since our founding, AtlasTech Solutions has been the go-to web development partner for SMEs across every industry. We combine modern technology, clean design, and iron-clad security to deliver websites that work as hard as you do.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              From eager startups to seasoned enterprises — we've got a service pack built exactly for your stage of growth.
            </p>
            {/* Mini proof row */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { v:'99.9%', l:'Uptime SLA', bg:'bg-green-50', c:'text-green-700' },
                { v:'24/7', l:'Support', bg:'bg-blue-50', c:'text-blue-700' },
              ].map(s => (
                <div key={s.l} className={`${s.bg} rounded-2xl p-4 text-center`}>
                  <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:gap-3 transition-all">
              Learn More About Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BIG NUMBERS — photo left + stats right
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="rounded-3xl overflow-hidden relative">
          {/* Background photo */}
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80&fit=crop"
            alt="Team meeting"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 px-8 py-12 sm:px-14">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">A few facts about us in numbers</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { target:'500', suffix:'+', label:'Projects Delivered', sub:'across all industries', color:'text-purple-400' },
                { target:'200', suffix:'+', label:'Active Clients',     sub:'SMEs worldwide',       color:'text-pink-400' },
                { target:'3',   suffix:' yrs', label:'In Business',     sub:'since founding',       color:'text-blue-400' },
                { target:'125', suffix:'+', label:'Annual Orders',      sub:'and growing',          color:'text-green-400' },
              ].map((s) => (
                <motion.div key={s.label} {...fadeIn(0.1)}>
                  <p className={`font-display text-4xl sm:text-5xl font-extrabold ${s.color}`}>
                    <Counter target={s.target} suffix={s.suffix} />
                  </p>
                  <p className="font-semibold text-white mt-1 text-sm">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICE PACKS — image-backed cards
          (Horizon Courts bottom cards inspired)
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div {...fadeUp(0)} className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">Services</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              Explore our full range of<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#6366f1,#a855f7)' }}>
                service packs.
              </span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">From first page to final launch — we've got the right program for you.</p>
          </div>
          <Link to="/categories" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:gap-3 transition-all">
            Explore More →
          </Link>
        </motion.div>

        {/* Packs: first pack full-width photo card, rest below */}
        <div className="space-y-5">
          {/* First pack — wide */}
          {packs[0] && (
            <motion.div {...fadeUp(0.05)}>
              <div className="relative rounded-3xl overflow-hidden h-64 sm:h-72">
                <img src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=80&fit=crop" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(20,0,40,0.85) 0%,rgba(20,0,40,0.3) 100%)' }} />
                <div className="absolute inset-0 p-7 sm:p-10 flex flex-col justify-end">
                  <span className="badge bg-white/20 text-white mb-3 w-fit">Starter</span>
                  <h3 className="text-white text-2xl font-bold mb-1">{packs[0].name}</h3>
                  <p className="text-white/70 text-sm mb-4 max-w-sm">{packs[0].description?.slice(0,100)}...</p>
                  <div className="flex items-center gap-4">
                    <span className="text-white text-xl font-extrabold">{Number(packs[0].price).toLocaleString()} DH</span>
                    <Link to={`/order/${packs[0].id}`} className="px-5 py-2 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
                      Choose Plan
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Remaining packs — two columns */}
          <div className="grid sm:grid-cols-2 gap-5">
            {packs.slice(1).map((pack, i) => {
              const imgs = [
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fit=crop',
              ];
              return (
                <motion.div key={pack.id} {...fadeUp(0.08 * (i + 1))}>
                  <div className="relative rounded-3xl overflow-hidden h-60">
                    <img src={imgs[i % 2]} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg,rgba(20,0,40,0.88) 0%,rgba(20,0,40,0.25) 100%)' }} />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="badge bg-white/20 text-white mb-2 w-fit">{i === 0 ? 'Most Popular' : 'Enterprise'}</span>
                      <h3 className="text-white text-xl font-bold mb-0.5">{pack.name}</h3>
                      <p className="text-white/60 text-xs mb-3 max-w-xs">{pack.description?.slice(0,80)}...</p>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-extrabold">{Number(pack.price).toLocaleString()} DH</span>
                        <Link to={`/order/${pack.id}`} className="px-4 py-1.5 bg-white/20 backdrop-blur border border-white/30 text-white rounded-full text-xs font-bold hover:bg-white/30 transition-colors">
                          Choose Plan
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {packs.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
              Loading service packs...
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS  +  EVERYTHING YOU NEED
          — merged into one unified section
      ═══════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Shared header */}
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Process & Features</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              How It Works &amp;{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#ec4899,#f97316)' }}>
                Everything You Need
              </span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">From first click to live website — four steps to get there, four built-in essentials to keep you ahead.</p>
          </motion.div>

          {/* ── Steps row ── */}
          <div className="relative mb-5">
            <div className="hidden lg:block absolute top-[90px] left-[10%] right-[10%] h-px bg-gradient-to-r from-purple-200 via-blue-200 via-pink-200 to-green-200 z-10" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { n:'01', title:'Pick a Plan',  desc:'Choose the pack matching your business size and goals.',    stepColor:'bg-purple-100 text-purple-700', dot:'#a855f7',
                  img:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=75&fit=crop' },
                { n:'02', title:'Submit Order', desc:'Fill in your details. Our team confirms within 24 hours.',  stepColor:'bg-blue-100 text-blue-700',    dot:'#3b82f6',
                  img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=75&fit=crop' },
                { n:'03', title:'We Build It',  desc:'Developers craft your website with modern best practices.', stepColor:'bg-pink-100 text-pink-700',    dot:'#ec4899',
                  img:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=75&fit=crop' },
                { n:'04', title:'Go Live 🚀',   desc:'Your site launches. Full handover with support included.',  stepColor:'bg-green-100 text-green-700',  dot:'#22c55e',
                  img:'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=75&fit=crop' },
              ].map((step, i) => (
                <motion.div key={step.n} {...fadeUp(0.07 * i)}>
                  <div className="bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group overflow-hidden">
                    {/* Photo top */}
                    <div className="relative h-32 overflow-hidden">
                      <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/80" />
                      {/* Step badge */}
                      <div className={`absolute top-3 left-3 w-10 h-10 rounded-full ${step.stepColor} font-bold text-sm flex items-center justify-center shadow-lg z-10`}>
                        {step.n}
                      </div>
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{step.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Divider with label */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shrink-0">
              Why Choose Us
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
          </div>

          {/* ── Features row ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num:'01', title:'Responsive Design', desc:'Pixel-perfect on every device and screen size.',           bg:'bg-pink-100',   color:'text-pink-600',   border:'border-l-pink-300',
                img:'https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=300&q=70&fit=crop' },
              { num:'02', title:'SEO Optimized',     desc:'Built-in optimization so customers can always find you.',  bg:'bg-blue-100',   color:'text-blue-600',   border:'border-l-blue-300',
                img:'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&q=70&fit=crop' },
              { num:'03', title:'Secure & Fast',     desc:'HTTPS-ready, OWASP-compliant, with optimized loading.',    bg:'bg-green-100',  color:'text-green-600',  border:'border-l-green-300',
                img:'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=300&q=70&fit=crop' },
              { num:'04', title:'Ongoing Support',   desc:'Dedicated team to help you maintain and grow online.',     bg:'bg-orange-100', color:'text-orange-600', border:'border-l-orange-300',
                img:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&q=70&fit=crop' },
            ].map((feat, i) => (
              <motion.div key={feat.num} {...fadeUp(0.06 * i)}>
                <div className={`bg-white rounded-3xl border border-gray-100 border-l-4 ${feat.border} overflow-hidden hover:shadow-xl transition-all group`}>
                  {/* Small photo */}
                  <div className="h-24 overflow-hidden">
                    <img src={feat.img} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                  </div>
                  <div className="p-5">
                    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${feat.bg} ${feat.color} text-xs font-bold mb-3`}>{feat.num}</span>
                    <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{feat.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS — with real face photos
      ═══════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=60&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Reviews</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2">What Our Clients Say</h2>
            <p className="text-gray-400 mt-2">Real stories from real businesses.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { quote: '"AtlasTech transformed our online presence. Fast, beautiful, and our customers love it."',
                name:'Sarah M.', role:'CEO, Bloom Boutique',
                avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&fit=crop&crop=face',
                accent:'border-t-pink-500' },
              { quote: '"Professional team, transparent pricing. Got our e-commerce site live in under 3 weeks."',
                name:'James R.', role:'Founder, TechRetail',
                avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&fit=crop&crop=face',
                accent:'border-t-purple-500' },
              { quote: '"The SEO improvements alone paid for the entire project. Traffic up 180% in two months!"',
                name:'Linda K.', role:'Marketing Dir., GrowFast',
                avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&fit=crop&crop=face',
                accent:'border-t-blue-500' },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp(0.07 * i)}>
                <div className={`bg-white/10 backdrop-blur-md border-t-4 ${t.accent} rounded-3xl p-6 border border-white/10 hover:bg-white/15 transition-all h-full flex flex-col`}>
                  <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_,si) => <span key={si} className="text-yellow-400">★</span>)}</div>
                  {/* Quote */}
                  <p className="text-sm text-white/80 italic leading-relaxed flex-1 mb-6">{t.quote}</p>
                  {/* Author with real photo */}
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-white/30 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA  
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <motion.div {...fadeUp(0)}>
          <div className="relative overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg,#0f0f0f 0%,#1e0533 50%,#0f0f0f 100%)' }}>
            {/* Background photo layer */}
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=70&fit=crop"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            {/* Blobs */}
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle,#ec4899,transparent)' }} />

            <div className="relative z-10 px-8 py-16 sm:px-16 text-center text-white">
              <span className="inline-block px-4 py-1 mb-5 text-xs font-semibold uppercase tracking-wider bg-white/10 border border-white/20 rounded-full">
                Limited Spots Available
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
                Ready to Build Something<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#c084fc,#f472b6,#fb923c)' }}>
                  Amazing?
                </span>
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
                Join 500+ businesses. Choose a service pack and let us build your dream website. No hidden fees, no surprises.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/order" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl text-sm">
                  Get Started Today
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 border border-white/20 transition-all text-sm">
                  Talk to Us
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
