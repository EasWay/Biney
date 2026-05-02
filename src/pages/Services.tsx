import { motion } from 'motion/react';
import { Stethoscope, Baby, Ear, FlaskConical, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    title: "General Outpatient",
    description: "Primary diagnostics, wound care, and routine health screenings for all ages.",
    icon: <Stethoscope className="w-8 h-8 text-sky-600" />,
  },
  {
    title: "Maternity & Child",
    description: "Antenatal care, delivery support, and postnatal health for mothers and infants.",
    icon: <Baby className="w-8 h-8 text-sky-600" />,
  },
  {
    title: "ENT Care",
    description: "Specialized treatment for ear, nose, and throat conditions by expert clinicians.",
    icon: <Ear className="w-8 h-8 text-sky-600" />,
  },
  {
    title: "Lab & Pharmacy",
    description: "Full-service laboratory and dispensing pharmacy for immediate prescription care.",
    icon: <FlaskConical className="w-8 h-8 text-sky-600" />,
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-transparent pt-32">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-16">
          <h2 className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4">Our Services</h2>
          <h3 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Comprehensive Medical Solutions</h3>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We provide a diverse range of specialized and general medical services designed to meet your family's health needs with expertise and compassion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.05)" }}
              className="service-card"
            >
              <div className="mb-4 text-sky-600">
                {service.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{service.title}</h3>
              <p className="text-xs text-slate-500 leading-normal mb-4">{service.description}</p>
              <Link to="/contact" className="text-[10px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Details <ChevronRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-white/40 backdrop-blur-[100px] rounded-[3.5rem] border border-white/60 flex flex-col md:flex-row items-center gap-12 shadow-xl shadow-sky-100/20">
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-slate-900 mb-4">Emergency Support</h4>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Our clinical staff is on call 24/7 for emergency guidance. If you are experiencing a life-threatening emergency, please call our direct hotline immediately.
            </p>
            <div className="flex items-center gap-4">
              <a href="tel:+233303204368" className="bg-sky-600 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-sky-100 hover:bg-sky-700 transition-colors">Call Now</a>
              <p className="text-sm font-bold text-slate-900">+233 30 320 4368</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
             <div className="bg-white/50 backdrop-blur-3xl p-6 rounded-2xl border border-white/80 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Vaccinations</p>
                <p className="text-sm font-bold text-slate-800">Routine immunizations for all ages.</p>
             </div>
             <div className="bg-white/50 backdrop-blur-3xl p-6 rounded-2xl border border-white/80 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Minor Surgery</p>
                <p className="text-sm font-bold text-slate-800">Wound care and basic surgical procedures.</p>
             </div>
             <div className="bg-white/50 backdrop-blur-3xl p-6 rounded-2xl border border-white/80 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Pharmacy</p>
                <p className="text-sm font-bold text-slate-800">Dispensing medications 24/7.</p>
             </div>
             <div className="bg-white/50 backdrop-blur-3xl p-6 rounded-2xl border border-white/80 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Diagnostics</p>
                <p className="text-sm font-bold text-slate-800">Laboratory testing on-site.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
