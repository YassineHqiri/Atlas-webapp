import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const About = () => (
  <div className="overflow-x-hidden">

    {/* ══════════════════════════════════════
        HERO — full photo + overlay
    ══════════════════════════════════════ */}
    <section className="relative h-[60vh] min-h-[420px] flex items-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&fit=crop"
        alt="Team collaboration"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(8,8,20,0.88) 0%,rgba(8,8,20,0.55) 60%,rgba(8,8,20,0.30) 100%)' }} />
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle,#a78bfa 1px,transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-full text-xs font-semibold mb-5 backdrop-blur">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
            Who We Are
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            About{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#c084fc,#f472b6,#fb923c)' }}>
              AtlasTech
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
            We build secure, modern, and scalable web solutions for small and medium enterprises — designed to grow with your business.
          </p>
        </motion.div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full block" preserveAspectRatio="none">
          <path d="M0 40 Q720 0 1440 40 L1440 40 L0 40Z" fill="#ffffff" />
        </svg>
      </div>
    </section>

    {/* ══════════════════════════════════════
        MISSION — text left / photo right
    ══════════════════════════════════════ */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <motion.div {...fadeUp(0)}>
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">Our Mission</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-5 leading-tight">
            Empowering businesses with a{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}>
              professional digital presence.
            </span>
          </h2>
          <p className="text-gray-500 leading-relaxed mb-4">
            AtlasTech Solutions exists to empower SMEs with the web presence they deserve. We believe every business —
            no matter the size — should have access to a website that is fast, secure, and beautiful, without the enterprise price tag.
          </p>
          <p className="text-gray-500 leading-relaxed mb-8">
            Our service packs are designed to provide everything a growing business needs: responsive design,
            SEO optimization, content management, and ongoing support — all in one place.
          </p>
          {/* Pill tags */}
          <div className="flex flex-wrap gap-2">
            {['Modern Tech Stack','Secure by Default','Mobile-First','SEO Ready','24/7 Support'].map(t => (
              <span key={t} className="px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full border border-purple-100">{t}</span>
            ))}
          </div>
        </motion.div>

        {/* Right — photo with overlaid quote */}
        <motion.div {...fadeUp(0.15)} className="relative">
          <div className="rounded-3xl overflow-hidden aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=85&fit=crop"
              alt="Office team meeting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          {/* Quote card */}
          <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-w-[220px]">
            <p className="text-xs italic text-gray-500 leading-relaxed mb-3">"Every SME deserves a world-class website."</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-xs font-bold">A</div>
              <p className="text-xs font-bold text-gray-800">AtlasTech Team</p>
            </div>
          </div>
          {/* Stat badge */}
          <div className="absolute -top-4 -left-4 bg-black rounded-2xl shadow-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-white">500<span className="text-purple-400">+</span></p>
            <p className="text-[10px] text-gray-400">Projects Done</p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ══════════════════════════════════════
        HOW WE WORK — 3 photo cards
    ══════════════════════════════════════ */}
    <section className="bg-gray-50 border-y border-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Our Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">How We Work</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Three focused stages — from your first conversation to your live website.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { num:'01', title:'Discover',        desc:'We learn about your business, goals, and target audience through a detailed onboarding session.',
              img:'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80&fit=crop',
              bg:'bg-pink-100', color:'text-pink-600', border:'border-t-pink-400' },
            { num:'02', title:'Build',            desc:'Our team designs and develops your website using modern best-practice tools and clean, maintainable code.',
              img:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80&fit=crop',
              bg:'bg-blue-100', color:'text-blue-600', border:'border-t-blue-400' },
            { num:'03', title:'Launch & Support', desc:'We deploy, optimize for speed and SEO, and provide ongoing maintenance to keep your site performing.',
              img:'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&q=80&fit=crop',
              bg:'bg-green-100', color:'text-green-600', border:'border-t-green-400' },
          ].map((step, i) => (
            <motion.div key={step.num} {...fadeUp(0.08 * i)}>
              <div className={`bg-white rounded-3xl border-t-4 ${step.border} overflow-hidden shadow-sm hover:shadow-xl transition-all group`}>
                {/* Photo */}
                <div className="h-44 overflow-hidden">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl ${step.bg} ${step.color} text-sm font-bold mb-3`}>{step.num}</span>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════
        TEAM — real face photos
    ══════════════════════════════════════ */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div {...fadeUp(0)} className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">The People</span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Meet the Team</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">The passionate minds behind every project we deliver.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name:'Alex Carter',    role:'Lead Developer',      img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face', accent:'bg-purple-100 text-purple-700' },
          { name:'Sarah Johnson',  role:'UI/UX Designer',      img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fit=crop&crop=face', accent:'bg-pink-100 text-pink-700' },
          { name:'Linda Torres',   role:'Project Manager',     img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&fit=crop&crop=face', accent:'bg-blue-100 text-blue-700' },
          { name:'Marcus Lee',     role:'Backend Engineer',    img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&fit=crop&crop=face', accent:'bg-green-100 text-green-700' },
        ].map((member, i) => (
          <motion.div key={member.name} {...fadeUp(0.07 * i)}>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group text-center">
              {/* Photo */}
              <div className="relative h-52 overflow-hidden">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-5">
                <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                <span className={`inline-block mt-1 px-3 py-0.5 text-xs font-semibold rounded-full ${member.accent}`}>{member.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ══════════════════════════════════════
        SECURITY — split: photo left / list right
    ══════════════════════════════════════ */}
    <section className="bg-gray-50 border-y border-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — photo */}
          <motion.div {...fadeUp(0)} className="relative">
            <div className="rounded-3xl overflow-hidden aspect-video">
              <img
                src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=900&q=85&fit=crop"
                alt="Security"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 to-transparent" />
            </div>
            {/* Floating shield badge */}
            <div className="absolute -bottom-5 -right-4 bg-green-600 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
              </svg>
              <div>
                <p className="text-white text-sm font-bold">OWASP Secure</p>
                <p className="text-green-200 text-[10px]">Every single project</p>
              </div>
            </div>
          </motion.div>

          {/* Right — checklist */}
          <motion.div {...fadeUp(0.15)}>
            <span className="text-xs font-semibold uppercase tracking-widest text-green-600">Security First</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-5 leading-tight">
              Built secure{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#16a34a,#4ade80)' }}>
                from day one.
              </span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-7">
              Security is not an afterthought — it's the foundation. Our platform follows OWASP secure coding standards
              and implements industry best practices across every layer of every project.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'HTTPS & SSL encryption',
                'Input validation & sanitization',
                'Role-based access control',
                'Rate limiting & CSRF protection',
                'Secure password hashing',
                'Activity logging & audits',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 bg-green-50 rounded-2xl p-3 border border-green-100">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════
        STATS — photo background
    ══════════════════════════════════════ */}
    <section className="relative py-20 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=70&fit=crop"
        alt="Office"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/72" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">By the Numbers</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2">Our Track Record</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { value:'500+',  label:'Projects',      sub:'Across all industries',   color:'border-t-purple-500', num:'text-purple-400' },
            { value:'200+',  label:'Happy Clients',  sub:'SMEs worldwide',          color:'border-t-pink-500',   num:'text-pink-400' },
            { value:'3',     label:'Service Packs',  sub:'Tailored to every stage', color:'border-t-blue-500',   num:'text-blue-400' },
            { value:'24/7',  label:'Support',        sub:'Always here for you',     color:'border-t-green-500',  num:'text-green-400' },
          ].map((s, i) => (
            <motion.div key={s.label} {...fadeUp(0.07 * i)}>
              <div className={`bg-white/10 backdrop-blur-md border-t-4 ${s.color} rounded-3xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all`}>
                <p className={`text-4xl font-extrabold ${s.num} mb-1`}>{s.value}</p>
                <p className="text-white font-semibold text-sm">{s.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════
        DISCLOSURE + CTA
    ══════════════════════════════════════ */}
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Disclosure */}
        <motion.div {...fadeUp(0)} className="lg:col-span-2">
          <div className="bg-purple-50 border border-purple-100 rounded-3xl p-7">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-purple-200 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">Affiliate Disclosure</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Some links on our site may earn us a commission at no extra cost to you.
                  This does not influence our recommendations. Read our{' '}
                  <Link to="/privacy" className="text-purple-600 hover:underline font-medium">privacy policy</Link> and{' '}
                  <Link to="/terms" className="text-purple-600 hover:underline font-medium">terms of service</Link>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA card */}
        <motion.div {...fadeUp(0.1)}>
          <div className="relative overflow-hidden rounded-3xl h-full min-h-[160px]">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=70&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/65" />
            <div className="relative z-10 p-7 flex flex-col justify-between h-full">
              <p className="text-white font-bold text-lg leading-snug">Ready to get started?</p>
              <Link
                to="/order"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-gray-100 transition-all w-fit"
              >
                View Plans
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>

  </div>
);

export default About;
