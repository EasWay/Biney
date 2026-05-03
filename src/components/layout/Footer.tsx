import { Activity, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BINEY, serviceHighlights } from '../../data/biney';

const Footer = () => {
  return (
    <footer className="w-full bg-transparent pb-16 pt-32 font-manrope edge-dotted-top">
      <div className="mx-auto max-w-[1440px] px-10 md:px-margin-page">
        {/* Desktop Footer */}
        <div className="mb-24 hidden grid-cols-1 gap-16 md:grid md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="mb-8 flex items-center gap-3 group">
              <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                <Activity className="size-6" />
              </div>
              <span className="text-xl font-bold uppercase tracking-tight text-on-surface">{BINEY.name}</span>
            </Link>
            <p className="mb-8 text-sm leading-relaxed text-on-surface-variant opacity-70">
              Private primary hospital care in Tema, designed around clear access, patient guidance, and practical next steps.
            </p>
          </div>

          <div>
            <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-primary">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Insurance', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-primary">Care Areas</h4>
            <ul className="space-y-4">
              {serviceHighlights.map((item) => (
                <li key={item.title}>
                  <Link to="/services" className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-primary">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="size-5 shrink-0 text-primary" />
                <span className="text-sm text-on-surface-variant opacity-70">{BINEY.address}</span>
              </li>
              {BINEY.phoneNumbers.map((phone) => (
                <li key={phone.label} className="flex items-center gap-4">
                  <Phone className="size-5 shrink-0 text-primary" />
                  <a href={phone.href} className="text-sm text-on-surface-variant opacity-70 transition-colors hover:text-primary">
                    {phone.label}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-4">
                <ShieldCheck className="size-5 shrink-0 text-primary" />
                <span className="text-sm text-on-surface-variant opacity-70">{BINEY.acceptedInsurance.join(' and ')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Footer (Divided into two) */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:hidden">
          <div className="space-y-8">
            <div>
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Menu</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', icon: Activity },
                  { name: 'About', icon: ShieldCheck },
                  { name: 'Services', icon: Activity },
                  { name: 'Insurance', icon: ShieldCheck },
                  { name: 'Contact', icon: MapPin }
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={`/${item.name.toLowerCase() === 'home' ? '' : item.name.toLowerCase()}`} className="flex items-center gap-2 text-xs text-on-surface-variant transition-colors hover:text-primary">
                      <item.icon className="size-3.5 opacity-50" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Care</h4>
              <ul className="space-y-3">
                {serviceHighlights.map((item) => (
                  <li key={item.title}>
                    <Link to="/services" className="flex items-center gap-2 text-xs text-on-surface-variant transition-colors hover:text-primary">
                      <Activity className="size-3.5 opacity-50" />
                      <span className="truncate">{item.title.split(' ')[0]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Reach</h4>
              <ul className="space-y-3">
                {BINEY.phoneNumbers.slice(0, 1).map((phone) => (
                  <li key={phone.label}>
                    <a href={phone.href} className="flex items-center gap-2 text-xs text-on-surface-variant transition-colors hover:text-primary">
                      <Phone className="size-3.5 opacity-50" />
                      {phone.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link to="/contact" className="flex items-center gap-2 text-xs text-on-surface-variant transition-colors hover:text-primary">
                    <MapPin className="size-3.5 opacity-50" />
                    Find Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-outline-variant pt-12 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-40">
            © {new Date().getFullYear()} {BINEY.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
