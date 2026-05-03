import { motion } from 'motion/react';
import { Baby, ChevronRight, Ear, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BINEY, serviceHighlights } from '../data/biney';

const SERVICES = [
  {
    title: 'General services',
    description: serviceHighlights[0].description,
    icon: <Stethoscope className="size-8 text-primary" />,
  },
  {
    title: 'ENT Problems',
    description: serviceHighlights[1].description,
    icon: <Ear className="size-8 text-primary" />,
  },
  {
    title: 'Pregnancy',
    description: serviceHighlights[2].description,
    icon: <Baby className="size-8 text-primary" />,
  },
];

const Services = () => {
  return (
    <section className="bg-transparent px-4 py-14 pt-28 sm:px-10 sm:py-24 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-16">
          <h2 className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-4 sm:text-sm sm:tracking-widest">Our Services</h2>
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-4xl">Care that starts where patients are.</h3>
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-lg">
            We keep the patient journey direct: call, visit, get heard, and leave with a clearer next step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: 0 }}
              className="rounded-xl border border-white/60 bg-white/45 p-4 text-left shadow-sm backdrop-blur-xl transition-transform md:hover:-translate-y-1 md:hover:shadow-xl sm:rounded-2xl sm:p-8"
            >
              <div className="mb-3 [&_svg]:size-5 sm:mb-5 sm:[&_svg]:size-8">{service.icon}</div>
              <h3 className="mb-2 text-base font-bold text-slate-900 sm:mb-3 sm:text-lg">{service.title}</h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-500 sm:mb-6 sm:text-sm">{service.description}</p>
              <Link to="/contact" className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.16em] text-primary transition-all md:hover:gap-2 sm:text-[10px] sm:tracking-widest">
                Contact <ChevronRight className="size-3" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/60 bg-white/40 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-20 sm:rounded-[2rem] sm:p-10">
          <h4 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-2xl">A primary hospital for the community</h4>
          <p className="mb-4 text-xs leading-relaxed text-slate-500 sm:mb-6 sm:text-base">
            Biney Medical Centre is positioned as a private primary hospital in Tema. A full custom platform can expand these care areas into department pages, doctor profiles, patient education, insurance guidance, and direct appointment workflows.
          </p>
          <p className="text-sm font-bold text-slate-900">{BINEY.facilityType}</p>
        </div>
      </div>
    </section>
  );
};

export default Services;
