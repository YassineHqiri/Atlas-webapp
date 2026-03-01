import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { name: 'Orders', path: '/admin/orders', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
    { name: 'Service Packs', path: '/admin/service-packs', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )},
  ];

  const crmItems = [
    { name: 'Leads', path: '/admin/crm/leads', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { name: 'Pipeline', path: '/admin/crm/pipeline', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
    )},
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black text-white flex flex-col z-40">
        <div className="px-6 h-[60px] flex items-center border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-white font-bold text-xs">AT</span>
            </div>
            <span className="font-display font-bold text-lg">
              Atlas<span className="text-purple-300">Tech</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {/* CRM section */}
          <div className="pt-4 pb-1">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">CRM</p>
          </div>
          {crmItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 text-sm font-medium text-gray-400 hover:text-red-400 rounded-xl hover:bg-white/5 transition-all">
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8 pt-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
