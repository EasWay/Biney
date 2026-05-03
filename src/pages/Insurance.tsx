import { motion } from 'motion/react';
import { CheckCircle2, Hospital } from 'lucide-react';
import { BINEY } from '../data/biney';

const Insurance = () => {
  return (
    <section className="bg-transparent px-4 py-14 pt-28 sm:px-10 sm:py-24 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-primary p-5 shadow-2xl sm:gap-12 sm:rounded-[3rem] sm:p-12 md:flex-row md:p-20"
        >
          <CheckCircle2 className="absolute right-0 top-0 size-32 p-4 text-white/10 sm:size-64 sm:p-8" />

          <div className="relative z-10 md:w-2/3">
            <h2 className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-white/70 sm:mb-4 sm:text-sm sm:tracking-widest">Insurance</h2>
            <h3 className="mb-3 text-2xl font-bold tracking-tight text-white sm:mb-6 sm:text-4xl">Clearer access for insured patients</h3>
            <p className="mb-5 text-xs leading-relaxed text-white/80 sm:mb-8 sm:text-xl">
              We welcome patients using {BINEY.acceptedInsurance.join(' and ')} and make it easier to know what to bring before arriving.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {BINEY.acceptedInsurance.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
                >
                  <CheckCircle2 className="size-4 text-white/70 sm:size-5" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', duration: 1.2 }}
            className="relative z-10 flex items-center justify-center md:w-1/3"
          >
            <div className="rounded-full border border-white/20 bg-white/10 p-5 shadow-inner backdrop-blur-xl sm:p-10">
              <Hospital className="size-16 text-white/50 sm:size-32" />
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:mt-20 sm:gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-xl sm:rounded-[2rem] sm:p-10">
            <h4 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-2xl">Before your visit</h4>
            <p className="text-xs leading-relaxed text-slate-500 sm:text-base">
              Bring your insurance card and call ahead if you need confirmation for a specific visit type. Our team can guide you before you come in.
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-xl sm:rounded-[2rem] sm:p-10">
            <h4 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-2xl">Contact</h4>
            <div className="space-y-2 sm:space-y-3">
              {BINEY.phoneNumbers.map((phone) => (
                <a key={phone.label} href={phone.href} className="block text-xs font-bold text-primary md:hover:underline sm:text-sm">
                  {phone.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Insurance;
