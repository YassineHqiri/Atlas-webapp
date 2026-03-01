import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogPostBySlug, blogPosts } from '../../data/blogPosts';
import { products } from '../../data/products';

const BlogPost = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);
  const recentPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <Link to="/guide" className="text-purple-600 font-medium hover:underline">Back to Guides</Link>
      </div>
    );
  }

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith('- ')) return <li key={i} className="flex gap-2 text-gray-600 text-sm ml-1"><span className="text-purple-500 mt-0.5">•</span><span>{line.slice(2)}</span></li>;
      if (line.match(/^\*\*(.+?)\*\*\s*(.*)/)) { const m = line.match(/^\*\*(.+?)\*\*\s*(.*)/); return <p key={i} className="text-sm text-gray-600"><strong className="text-gray-900">{m[1]}</strong> {m[2]}</p>; }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-gray-600 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link to="/guide" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back to Guides
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <div className="aspect-[2/1] bg-gray-100 rounded-3xl overflow-hidden mb-6">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="badge badge-purple">{post.category}</span>
            <span className="text-sm text-gray-400">{post.date}</span>
            <span className="text-sm text-gray-400">{post.readTime}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>
          <div className="card p-6 sm:p-8 space-y-1">{renderContent(post.content)}</div>
        </motion.article>

        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Posts</h3>
            <div className="space-y-3">
              {recentPosts.map((p) => (
                <Link key={p.id} to={`/guide/${p.slug}`} className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <img src={p.image} alt="" className="w-14 h-10 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="gradient-pink rounded-3xl p-5 text-white relative overflow-hidden">
            <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/10"></div>
            <h3 className="font-bold mb-2">Top Tools</h3>
            <div className="space-y-2">
              {products.slice(0, 3).map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold border border-white/20" style={{ backgroundColor: p.logoColor }}>{p.logoInitials}</div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-white/70">★ {p.rating}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default BlogPost;
