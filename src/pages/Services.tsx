import { motion } from 'motion/react';
import { ArrowRight, Baby, Ear, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BINEY, serviceHighlights } from '../data/biney';
import { TextReveal } from '../components/ui/TextReveal';

const cardSpring = { type: 'spring' as const, stiffness: 380, damping: 28 };

const SERVICES = [
  {
    title: 'Everyday medical care',
    description: serviceHighlights[0].description,
    Icon: Stethoscope,
  },
  {
    title: 'ENT care',
    description: serviceHighlights[1].description,
    Icon: Ear,
  },
  {
    title: 'Pregnancy support',
    description: serviceHighlights[2].description,
    Icon: Baby,
  },
];

const Services = () => {
  return (
    <section id="services-overview" className="bg-transparent px-4 py-12 pt-24 sm:px-10 sm:py-20 sm:pt-28">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-3 sm:text-[10px] sm:tracking-widest"
          >
            Our Services
          </motion.h2>
          <TextReveal
            as="h3"
            className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-3xl"
            delay={0.05}
            stagger={0.06}
          >
            Care that starts where you are.
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mx-auto max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm"
          >
            Tell us what's going on. We'll listen, examine, and help you leave with a clear next step — not just a diagnosis.
          </motion.p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              id={service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -7, scale: 1.025, transition: cardSpring }}
              className="rounded-xl border border-white/60 bg-white/45 p-4 text-left shadow-sm backdrop-blur-xl cursor-default sm:rounded-2xl sm:p-6"
            >
              <motion.div
                className="mb-3 sm:mb-4"
                whileHover={{ rotate: 10, scale: 1.1, transition: cardSpring }}
              >
                <service.Icon className="size-5 text-primary sm:size-6" />
              </motion.div>
              <h3 className="mb-2 text-sm font-bold text-slate-900 sm:mb-2.5 sm:text-base">{service.title}</h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-500 sm:mb-5 sm:text-sm">{service.description}</p>
              <motion.div
                whileHover={{ scale: 1.04, transition: cardSpring }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-white sm:text-[10px] sm:tracking-widest"
                >
                  Book now <ArrowRight className="size-3" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* About the hospital */}
        <motion.div
          id="primary-hospital"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 rounded-2xl border border-white/60 bg-white/40 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-12 sm:rounded-[2rem] sm:p-8"
        >
          <TextReveal
            as="h4"
            className="mb-3 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl"
            stagger={0.06}
          >
            Your local private hospital in Tema
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 text-xs leading-relaxed text-slate-500 sm:mb-5 sm:text-sm"
          >
            Biney Medical Centre is close enough to walk to — and private enough to give you the attention you deserve. Whether you're coming for a routine check-up, an ENT problem, or pregnancy support, our team is here every day from 08:00 to 20:00. No long queues. No cold waiting rooms. Just clear, direct care.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="text-sm font-bold text-slate-900"
          >
            {BINEY.facilityType} · {BINEY.shortAddress}
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
