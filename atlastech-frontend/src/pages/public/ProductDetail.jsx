import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductBySlug, products } from '../../data/products';
import { getRecentPosts } from '../../data/blogPosts';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const recentPosts = getRecentPosts(3);
  const related = products.filter((p) => p.id !== product?.id).slice(0, 3);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link to="/" className="text-purple-600 font-medium hover:underline">Back to Home</Link>
      </div>
    );
  }

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith('- **')) {
        const m = line.match(/^- \*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
        if (m) return <li key={i} className="flex gap-2 text-gray-600 text-sm"><span className="text-purple-500 mt-0.5">•</span><span><strong className="text-gray-900">{m[1]}</strong> — {m[2]}</span></li>;
        const m2 = line.match(/^- \*\*(.+?)\*\*(.*)$/);
        if (m2) return <li key={i} className="flex gap-2 text-gray-600 text-sm"><span className="text-purple-500 mt-0.5">•</span><span><strong className="text-gray-900">{m2[1]}</strong>{m2[2]}</span></li>;
      }
      if (line.startsWith('- ')) return <li key={i} className="flex gap-2 text-gray-600 text-sm"><span className="text-purple-500 mt-0.5">•</span><span>{line.slice(2)}</span></li>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-gray-600 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link to="/categories" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back to all tools
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          {/* Header card */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: product.logoColor }}>{product.logoInitials}</div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-700">★ {product.rating}</span>
                  {product.badges.map((b) => (
                    <span key={b} className={`badge ${b === "Editor's Pick" ? 'badge-purple' : b === 'Free Tier' ? 'badge-green' : b === 'New' ? 'badge-pink' : b === 'Top Rated' ? 'badge-orange' : 'badge-blue'}`}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {product.tags.map((t) => <span key={t} className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-xl">{t}</span>)}
            </div>
            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Visit {product.name}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>

          {/* Features */}
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  <span className="text-sm text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6 sm:p-8 space-y-1">{renderMarkdown(product.description)}</div>
        </motion.div>

        {/* Sidebar */}
        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
            <p className="text-purple-600 font-bold text-lg mb-4">{product.pricing}</p>
            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center text-sm">Get Started</a>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">You Might Also Like</h3>
            <div className="space-y-3">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: p.logoColor }}>{p.logoInitials}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">★ {p.rating}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="gradient-purple rounded-3xl p-5 text-white relative overflow-hidden">
            <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/10"></div>
            <h3 className="font-bold mb-2">Latest Guides</h3>
            {recentPosts.map((p) => (
              <Link key={p.id} to={`/guide/${p.slug}`} className="block p-2 rounded-xl hover:bg-white/10 transition-colors">
                <p className="text-sm font-medium leading-snug">{p.title}</p>
                <p className="text-xs text-white/60 mt-0.5">{p.readTime}</p>
              </Link>
            ))}
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default ProductDetail;
