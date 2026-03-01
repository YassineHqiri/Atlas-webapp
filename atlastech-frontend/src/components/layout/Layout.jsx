import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { customer, isCustomer, logout } = useCustomerAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Black Header */}
      <header className="sticky top-0 z-50 bg-black rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-bold text-xs">AT</span>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Atlas<span className="text-purple-300">Tech</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* CTA - Customer login/register or Get Started */}
            <div className="hidden md:flex items-center gap-3">
              {isCustomer ? (
                <>
                  <Link to="/account" className="text-sm text-gray-400 hover:text-white transition-colors">My Account</Link>
                  <span className="text-sm text-gray-500">|</span>
                  <button type="button" onClick={() => logout()} className="text-sm text-gray-400 hover:text-white transition-colors">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Log in</Link>
                  <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">Register</Link>
                </>
              )}
              <Link
                to="/order"
                className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </nav>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm rounded-xl transition-colors ${
                      isActive ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="flex flex-wrap gap-3 pt-2 px-4">
                {isCustomer ? (
                  <>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400">My Account</Link>
                    <button type="button" onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-gray-400">Log out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400">Log in</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400">Register</Link>
                  </>
                )}
                <Link to="/order" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-full">Get Started</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black rounded-t-3xl mt-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AT</span>
                </div>
                <span className="font-display font-bold text-lg text-white">
                  Atlas<span className="text-purple-300">Tech</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                Professional web development service packs for small and medium enterprises. Secure, modern, scalable solutions.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Navigation</h4>
              <ul className="space-y-2.5">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Services', path: '/categories' },
                  { name: 'About', path: '/about' },
                  { name: 'Contact', path: '/contact' },
                ].map((l) => (
                  <li key={l.name}><Link to={l.path} className="text-sm text-gray-400 hover:text-white transition-colors">{l.name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { name: 'Privacy Policy', path: '/privacy' },
                  { name: 'Terms of Service', path: '/terms' },
                  { name: 'FAQ', path: '/faq' },
                ].map((l) => (
                  <li key={l.name}><Link to={l.path} className="text-sm text-gray-400 hover:text-white transition-colors">{l.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} AtlasTech Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
