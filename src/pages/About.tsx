import { motion } from 'motion/react';
import { Building2, ClipboardCheck, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Globe } from '../components/ui/Globe';
import { FlickeringGrid } from '../components/ui/FlickeringGrid';
import { TextReveal } from '../components/ui/TextReveal';
import { BINEY, serviceHighlights, staffPlaceholders } from '../data/biney';

const cardSpring = { type: 'spring' as const, stiffness: 380, damping: 28 };

const DoctorAvatar = ({ index }: { index: number }) => {
  const accents = ['#111111', '#2a2a2a', '#1a1a1a', '#333333'];
  const accent = accents[index % accents.length];
  return (
    <svg viewBox="0 0 220 220" role="img" className="size-full" aria-label="Doctor profile illustration">
      <rect width="220" height="220" rx="110" fill="#f8fafc" />
      <circle cx="110" cy="78" r="36" fill="#d8c4ad" />
      <path d="M68 76c4-31 25-48 50-44 26 4 40 22 37 51-13-11-27-16-43-16-17 0-31 3-44 9Z" fill="#2f3437" />
      <path d="M62 181c5-39 25-62 48-62s43 23 48 62H62Z" fill="#ffffff" />
      <path d="M78 129 110 181l32-52c28 11 47 33 51 67H27c4-34 23-56 51-67Z" fill="#eef2f4" />
      <path d="M93 124h34l-17 30-17-30Z" fill={accent} />
      <path d="M83 133c-8 16-11 34-10 54M137 133c8 16 11 34 10 54" stroke="#cbd5da" strokeWidth="6" strokeLinecap="round" />
      <path d="M82 162h21" stroke={accent} strokeWidth="7" strokeLinecap="round" />
      <path d="M138 162a12 12 0 1 0 0 .1" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      <path d="M94 91c8 8 24 8 32 0" stroke="#7b5f4a" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-manrope selection:bg-primary/10">

      {/* ── Hero ── */}
      <section id="overview" className="relative flex flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-28 text-center sm:px-10 sm:pb-24 sm:pt-48">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
          <FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.1} color="#000000" maxOpacity={0.1} className="size-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-8 max-w-2xl sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 block text-[8px] font-bold uppercase tracking-[0.28em] text-primary sm:mb-5 sm:text-[10px] sm:tracking-[0.4em]"
          >
            About
          </motion.span>

          <TextReveal
            as="h1"
            className="mb-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:mb-6 sm:text-4xl md:text-5xl"
            delay={0.1}
            stagger={0.07}
          >
            Biney Medical Centre
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto max-w-xl text-xs leading-relaxed text-slate-500 sm:text-base"
          >
            We are a private primary hospital serving patients from Italian Flats, Community 2, and the wider Tema community.
          </motion.p>
        </motion.div>

        {/* Globe — scales in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto my-4 flex aspect-square w-full max-w-[300px] items-center justify-center pointer-events-auto sm:my-8 sm:max-w-[480px]"
        >
          <Globe className="z-20 size-full" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-white via-transparent to-transparent" />
        </motion.div>

        {/* Stats — staggered fade in */}
        <div className="relative z-20 mt-6 grid w-full grid-cols-3 gap-2 px-0 text-center sm:mt-10 sm:gap-6 sm:px-10">
          {[
            { label: 'Facility Type', value: 'Primary', desc: BINEY.facilityType },
            { label: 'Location', value: 'Tema', desc: BINEY.shortAddress },
            { label: 'Insurance', value: 'NHIS', desc: BINEY.acceptedInsurance.join(' and ') },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="mb-1 font-display text-lg font-bold text-slate-900 sm:mb-1.5 sm:text-2xl">{stat.value}</h3>
              <p className="mb-1 text-[7px] font-bold uppercase tracking-[0.12em] text-primary sm:text-[10px] sm:tracking-widest">{stat.label}</p>
              <p className="text-[9px] leading-tight text-slate-400 sm:text-xs">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Care areas ── */}
      <section id="care-areas" className="border-t border-slate-100 px-4 py-12 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl sm:mb-12">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-3 block text-[8px] font-bold uppercase tracking-[0.28em] text-primary sm:mb-5 sm:text-[10px] sm:tracking-[0.4em]"
            >
              What to expect
            </motion.span>
            <TextReveal
              as="h2"
              className="font-display text-2xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
              stagger={0.04}
            >
              Healthcare feels better when you know where to go, who to call, and what to expect.
            </TextReveal>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {[
              { icon: MapPin, title: 'Right here in Tema', desc: `We serve families in Community 2, Italian Flats, and the surrounding Tema neighbourhoods. When you're nearby, we're nearby too.` },
              { icon: Building2, title: 'Private, personal care', desc: 'As a private primary hospital, we offer personal attention without the long waits of a public facility. Your time matters to us.' },
              { icon: ClipboardCheck, title: 'The care most families reach for', desc: 'General medicine, ENT care, and pregnancy support — the three areas that most Tema families need first.' },
              { icon: ShieldCheck, title: 'Insurance sorted before you arrive', desc: `We accept ${BINEY.acceptedInsurance.join(' and ')}. If you have questions about your coverage, call us — we'll sort it before you visit.` },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02, transition: cardSpring }}
                className="rounded-xl border border-slate-100 p-4 cursor-default sm:rounded-2xl sm:p-6"
              >
                <item.icon className="mb-3 size-5 text-primary sm:mb-5 sm:size-6" />
                <h3 className="mb-2 font-display text-sm font-bold text-slate-900 sm:mb-2.5 sm:text-base">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section id="team" className="bg-slate-50/50 px-4 py-12 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-14">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-3 block text-[8px] font-bold uppercase tracking-[0.28em] text-primary sm:mb-5 sm:text-[10px] sm:tracking-[0.4em]"
            >
              Our Team
            </motion.span>
            <TextReveal
              as="h2"
              className="mb-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-3xl"
              stagger={0.06}
            >
              The team behind your care.
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xs leading-relaxed text-slate-500 sm:text-sm"
            >
              Our clinical, nursing, reception, and patient care teams are here to help you every day. They're the reason patients come back.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
            {staffPlaceholders.map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 24, scale: 0.93 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.03, transition: cardSpring }}
                className="group flex cursor-default flex-col items-center text-center"
              >
                <div className="relative mb-3 size-24 overflow-hidden rounded-full border border-slate-100 bg-white sm:mb-6 sm:size-36">
                  <DoctorAvatar index={i} />
                </div>
                <h4 className="mb-1 font-display text-sm font-bold text-slate-900 sm:text-base">{role}</h4>
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[9px] sm:tracking-widest">Biney Medical Centre</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location-summary" className="border-t border-slate-100 px-4 py-12 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Users className="mx-auto mb-4 size-7 text-primary opacity-50 sm:mb-7 sm:size-9" />
          </motion.div>
          <TextReveal
            as="h2"
            className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-3xl md:text-4xl"
            stagger={0.07}
          >
            Italian Flats, Community 2, Tema
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm"
          >
            Right in the heart of Community 2, Tema. Our door is open Monday to Sunday, 08:00 – 20:00. Come in whenever you need us.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default About;
