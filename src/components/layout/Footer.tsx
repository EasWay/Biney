/**
 * Footer — Large-type Footer style (dark edition)
 *
 * Dark black background with white text — high contrast inversion
 * that anchors every page with a bold brand endpoint.
 *
 *   – Top zone: 4-column nav/contact grid (desktop) / 2-column (mobile)
 *   – Bottom zone: "Biney" in large Pacifico — echoes the loading screen
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Activity, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BINEY, serviceHighlights } from '../../data/biney';

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });
  // logotype moves UP at ~half the scroll speed — creates parallax depth
  const logotypeY = useTransform(scrollYProgress, [0, 1], ['6%', '-4%']);
  // logotype also brightens very subtly as it comes into full view
  const logotypeOpacity = useTransform(scrollYProgress, [0.4, 0.85], [0.04, 0.08]);
  return (
    <footer ref={footerRef} className="w-full overflow-hidden rounded-t-3xl bg-[#0d0d0d] font-manrope sm:rounded-t-[2.5rem]">

      {/* ── Top grid zone ── */}
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-16 sm:px-10 sm:pb-14 sm:pt-24">

        {/* Desktop: 4-col grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-10 mb-16">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="mb-6 flex items-center gap-3 group">
              <div className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                <Activity className="size-5" />
              </div>
              <span className="text-base font-bold uppercase tracking-tight text-white">{BINEY.name}</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              Private primary hospital care in Tema, designed around clear access, patient guidance, and practical next steps.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Navigation</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Insurance', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Care Areas */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Care Areas</h4>
            <ul className="space-y-3">
              {serviceHighlights.map((item) => (
                <li key={item.title}>
                  <Link to="/services" className="text-sm text-white/55 transition-colors hover:text-white">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Contact</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-white/40" />
                <span className="text-sm leading-relaxed text-white/55">{BINEY.address}</span>
              </li>
              {BINEY.phones.map((phone) => (
                <li key={phone.label} className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-white/40" />
                  <a href={phone.tel} className="text-sm text-white/55 transition-colors hover:text-white">
                    {phone.label}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-white/40" />
                <span className="text-sm text-white/55">{BINEY.acceptedInsurance.join(' · ')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile: 2-col compact grid */}
        <div className="grid grid-cols-2 gap-8 mb-10 md:hidden">
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Menu</h4>
              <ul className="space-y-2.5">
                {['Home', 'About', 'Services', 'Insurance', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                      className="text-xs text-white/55 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Contact</h4>
              <ul className="space-y-2.5">
                {BINEY.phones.map((phone) => (
                  <li key={phone.label}>
                    <a href={phone.tel} className="flex items-center gap-2 text-xs text-white/55 hover:text-white">
                      <Phone className="size-3 text-white/35" />
                      {phone.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link to="/contact" className="flex items-center gap-2 text-xs text-white/55 hover:text-white">
                    <MapPin className="size-3 text-white/35" />
                    Find us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright — above the large type */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6 pb-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
            © {new Date().getFullYear()} {BINEY.name}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
            Tema, Ghana
          </p>
        </div>
      </div>

      {/* ── Large-type zone — "Biney" echoing the loading screen ── */}
      <div
        className="relative select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Fade gradient — blends the type into the dark footer background */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0d0d0d] to-transparent z-10 pointer-events-none" />

        <motion.p
          style={{
            y: logotypeY,
            opacity: logotypeOpacity,
            fontFamily: "'Pacifico', cursive",
            fontSize: 'clamp(80px, 22vw, 280px)',
            letterSpacing: '0.05em',
            marginTop: '-0.08em',
            marginBottom: '-0.12em',
            paddingBottom: '0.1em',
          }}
          className="text-center leading-[0.82] text-white"
        >
          Biney
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
