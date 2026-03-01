import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../../data/blogPosts';

const blogCategories = ['All', 'AI Tools', 'Web Hosting', 'VPN Services', 'Automation'];
const cardColors = ['border-l-pink-300', 'border-l-blue-300', 'border-l-green-300', 'border-l-orange-300', 'border-l-purple-300'];

const Guide = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return blogPosts;
    return blogPosts.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Guides & Blog</h1>
        <p className="text-gray-500 mb-6">In-depth reviews, tutorials, and comparisons for digital tools.</p>
      </motion.div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {blogCategories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
              activeCategory === cat ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >{cat}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredPosts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={`/guide/${post.slug}`} className="group block h-full">
              <div className={`card overflow-hidden h-full flex flex-col border-l-4 ${cardColors[i % cardColors.length]}`}>
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="badge badge-purple">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  <h2 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-purple-600 transition-colors">{post.title}</h2>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-3">{post.excerpt}</p>
                  <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Guide;
