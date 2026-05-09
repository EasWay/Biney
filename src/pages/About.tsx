import { motion } from 'motion/react';
import { Building2, ClipboardCheck, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Globe } from '../components/ui/Globe';
import { FlickeringGrid } from '../components/ui/FlickeringGrid';
import { BINEY, serviceHighlights, staffPlaceholders } from '../data/biney';

const DoctorAvatar = ({ index }: { index: number }) => {
  const accents = ['#575e61', '#6f7a7d', '#4f5f66', '#73706b'];
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
      <section id="overview" className="relative flex flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-32 text-center sm:px-10 sm:pb-32 sm:pt-60">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
          <FlickeringGrid
            squareSize={4}
            gridGap={6}
            flickerChance={0.1}
            color="#000000"
            maxOpacity={0.1}
            className="size-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 mb-10 max-w-3xl sm:mb-20"
        >
          <span className="mb-4 block text-[8px] font-bold uppercase tracking-[0.28em] text-primary sm:mb-6 sm:text-[10px] sm:tracking-[0.4em]">About</span>
          <h1 className="mb-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:mb-8 sm:text-5xl md:text-7xl">
            {BINEY.name}
          </h1>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-500 sm:text-lg">
            We are a private primary hospital serving patients from Italian Flats, Community 2, and the wider Tema community.
          </p>
        </motion.div>

        <div className="relative mx-auto my-6 flex aspect-square w-full max-w-[340px] items-center justify-center pointer-events-auto sm:my-10 sm:max-w-[600px]">
          <Globe className="z-20 size-full" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <div className="relative z-20 mt-8 grid w-full grid-cols-3 gap-2 px-0 text-center sm:mt-14 sm:gap-8 sm:px-10">
          {[
            { label: 'Facility Type', value: 'Primary', desc: BINEY.facilityType },
            { label: 'Location', value: 'Tema', desc: BINEY.shortAddress },
            { label: 'Insurance', value: 'NHIS', desc: BINEY.acceptedInsurance.join(' and ') },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="mb-1 font-display text-lg font-bold text-slate-900 sm:mb-2 sm:text-3xl">{stat.value}</h3>
              <p className="mb-1 text-[7px] font-bold uppercase tracking-[0.12em] text-primary sm:text-[10px] sm:tracking-widest">{stat.label}</p>
              <p className="text-[9px] leading-tight text-slate-400 sm:text-xs">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="care-areas" className="border-t border-slate-100 px-4 py-16 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl sm:mb-16">
          <span className="mb-3 block text-[8px] font-bold uppercase tracking-[0.28em] text-primary sm:mb-6 sm:text-[10px] sm:tracking-[0.4em]">Our Care</span>
          <h2 className="font-display text-2xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Healthcare feels better when patients know where to go, who to call, and what to expect.
          </h2>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {[
              { icon: MapPin, title: 'Rooted in Tema', desc: `Our centre is located at ${BINEY.address}.` },
              { icon: Building2, title: 'Private primary hospital', desc: 'We are positioned for accessible first-line care in the community.' },
              { icon: ClipboardCheck, title: 'Focused care areas', desc: serviceHighlights.map((item) => item.title).join(', ') },
              { icon: ShieldCheck, title: 'Insurance support', desc: `We accept ${BINEY.acceptedInsurance.join(' and ')}.` },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-slate-100 p-4 transition-colors md:hover:bg-slate-50 sm:rounded-2xl sm:p-8"
              >
                <item.icon className="mb-4 size-5 text-primary sm:mb-6 sm:size-7" />
                <h3 className="mb-2 font-display text-base font-bold text-slate-900 sm:mb-3 sm:text-xl">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="bg-slate-50/50 px-4 py-16 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-20">
            <span className="mb-3 block text-[8px] font-bold uppercase tracking-[0.28em] text-primary sm:mb-6 sm:text-[10px] sm:tracking-[0.4em]">Our Team</span>
            <h2 className="mb-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-4xl md:text-5xl">A team page ready for real Biney profiles.</h2>
            <p className="text-xs leading-relaxed text-slate-500 sm:text-base">
              We did not find approved public staff photos, so this prototype uses clean SVG placeholders. The final site can replace these with real doctors, nurses, and administrators once the centre provides approved details.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-12 lg:grid-cols-4">
            {staffPlaceholders.map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative mb-4 size-28 overflow-hidden rounded-full border border-slate-100 bg-white transition-all duration-700 sm:mb-8 sm:size-48">
                  <DoctorAvatar index={i} />
                </div>
                <h4 className="mb-1 font-display text-sm font-bold text-slate-900 sm:text-lg">{role}</h4>
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[10px] sm:tracking-widest">Profile ready</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="location-summary" className="border-t border-slate-100 px-4 py-16 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Users className="mx-auto mb-5 size-8 text-primary opacity-50 sm:mb-10 sm:size-12" />
          <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900 sm:mb-8 sm:text-4xl md:text-6xl">{BINEY.shortAddress}</h2>
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-base">
            We are building the digital front door Biney Medical Centre deserves: clear, warm, and easy for patients to act on.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
