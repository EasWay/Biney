import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ onBookClick }: { onBookClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Insurance', href: '/insurance' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || location.pathname !== '/' ? 'bg-white/40 backdrop-blur-[100px] shadow-sm py-3 border-b border-white/60' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center border border-white/40">
              <div className="w-4 h-4 border-2 border-white"></div>
            </div>
            <span className={`text-xl font-bold tracking-tight text-slate-900`}>
              BINEY <span className="text-sky-600">MEDICAL</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-8 text-sm font-medium text-slate-500">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`transition-colors hover:text-sky-600 ${isActive(link.href) ? 'text-sky-600 font-bold' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="w-[1px] h-6 bg-slate-200 hidden lg:block"></div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Emergency Line</p>
                <p className="text-sm font-bold text-slate-900">+233 30 320 4368</p>
              </div>
              <button
                onClick={onBookClick}
                className="bg-sky-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-sky-700 transition-colors shadow-sm"
              >
                Book Consultation
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/80 backdrop-blur-[100px] border-t border-slate-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 text-base font-medium rounded-lg transition-colors ${
                    isActive(link.href) 
                      ? 'bg-sky-50 text-sky-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onBookClick();
                  }}
                  className="w-full bg-sky-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-sky-100"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
