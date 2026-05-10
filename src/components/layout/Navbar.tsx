import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Activity } from 'lucide-react';
import { BINEY } from '../../data/biney';

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
    { name: 'Resources', href: '/resources' },
    { name: 'Insurance', href: '/insurance' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed left-1/2 top-3 z-50 w-[94%] max-w-6xl -translate-x-1/2 rounded-2xl font-manrope text-xs font-medium tracking-tight transition-all duration-500 sm:top-6 sm:rounded-full sm:text-sm ${
        scrolled 
          ? 'border border-white/50 bg-white/85 px-3 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.05)] backdrop-blur-[20px] sm:px-8 sm:py-3' 
          : 'border border-white/20 bg-white/50 px-3 py-2.5 backdrop-blur-[10px] sm:px-10 sm:py-4'
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <Link to="/" className="flex min-w-0 items-center gap-2 text-sm font-bold tracking-tight text-on-surface group sm:text-lg">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-lg transition-transform md:group-hover:scale-110 sm:size-8">
            <Activity className="size-4 sm:size-5" />
          </div>
          <span className="max-w-[150px] truncate text-[9px] font-bold uppercase tracking-[0.16em] text-on-surface sm:max-w-none sm:text-[11px] sm:tracking-[0.2em]">{BINEY.name}</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4 items-center bg-white/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/40 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`transition-all duration-300 hover:text-primary ${
                isActive(link.href) 
                  ? 'text-primary font-bold' 
                  : 'text-on-surface-variant'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onBookClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white hover:bg-black transition-all duration-300 shadow-lg shadow-black/20 active:scale-95"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Book Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle — Fitts's Law: min 44×44px touch target */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-on-surface transition-colors active:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute left-0 top-[calc(100%+8px)] w-full overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1.5 p-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href) ? 'bg-primary/5 text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onBookClick();
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
