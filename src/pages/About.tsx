import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <section className="py-24 bg-transparent pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:order-1"
          >
            <h2 className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4">About the Centre</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight italic">Quality Healthcare for the <span className="text-sky-600">Tema Community.</span></h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Biney Medical Centre is a Ghanaian-owned healthcare facility located in the Italian Flats community of Tema. We provide comprehensive primary care, maternal and child health, and basic diagnostic services to the Greater Accra community.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our NHIS-accredited centre is staffed by qualified doctors and nurses, including <strong>Dr. Alexander Biney (MBChB)</strong>, ensuring professional and compassionate care for all patients.
            </p>
            
            <div className="space-y-4">
              {[
                "Fully accredited by Ghana's National Health Insurance Scheme (NHIS).",
                "Dedicated specialists in Maternity and ENT care."
              ].map((text, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={i} 
                  className="flex items-start gap-4"
                >
                  <div className="bg-sky-50 p-2 rounded-lg shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-sky-600" />
                  </div>
                  <p className="text-slate-700">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:order-2"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-sky-50 rounded-[3rem] rotate-2 scale-95 group-hover:scale-100 group-hover:rotate-0 transition-all duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&h=800" 
                alt="Clinic Interior" 
                className="rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover relative z-10 border-8 border-white/50 backdrop-blur-md"
                referrerPolicy="no-referrer"
              />
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 -left-8 bg-white/60 backdrop-blur-[100px] px-8 py-6 rounded-[2rem] shadow-2xl z-20 border border-white/60 max-w-[240px]"
              >
                <p className="text-sky-600 font-black text-2xl mb-1 italic">2010</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Established in Italian Flats, Tema</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Doctor Subsection */}
        <div className="mt-24 pt-16 border-t border-slate-200">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-sky-50 rounded-[4rem] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=2070&auto=format&fit=crop" 
                  alt="Dr. Alexander Biney" 
                  className="rounded-[3rem] shadow-2xl relative z-10 w-full aspect-square object-cover border-8 border-white/50 backdrop-blur-md"
                  referrerPolicy="no-referrer"
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                  className="absolute -bottom-6 -right-6 bg-sky-600 text-white p-6 rounded-3xl shadow-xl z-20 hover:scale-110 transition-transform"
                >
                  <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Experience</p>
                  <p className="text-xl font-bold">15+ Years</p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-2"
            >
              <h4 className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4">Medical Leadership</h4>
              <h5 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Dr. Alexander Biney</h5>
              <p className="text-lg font-semibold text-slate-500 mb-6 uppercase tracking-wider">MBChB / Medical Director</p>
              
              <div className="bg-white/40 backdrop-blur-[100px] p-8 rounded-3xl border border-white/60 relative mb-8">
                <span className="absolute top-4 right-8 text-6xl text-sky-100 font-serif leading-none">"</span>
                <p className="text-xl text-slate-700 italic leading-relaxed relative z-10">
                  I believe in treating every patient with dignity and providing medical guidance that is both clinically excellent and culturally sensitive. Our goal at Biney is to ensure that quality primary healthcare is accessible to everyone in Tema.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h6 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-widest">Specialization</h6>
                  <p className="text-slate-600 text-sm">General Medicine & Family Health</p>
                </div>
                <div>
                  <h6 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-widest">Commitment</h6>
                  <p className="text-slate-600 text-sm">Community-centered diagnostics</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
