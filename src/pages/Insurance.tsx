import { motion } from 'motion/react';
import { CheckCircle2, Hospital } from 'lucide-react';

const Insurance = () => {
  return (
    <section className="py-24 bg-transparent pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-sky-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-2xl"
        >
          <motion.div 
            animate={{ 
              rotate: [12, 15, 12],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 p-8 text-sky-500/20"
          >
            <CheckCircle2 className="w-64 h-64 opacity-10" />
          </motion.div>
          
          <div className="md:w-2/3 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sky-200 font-bold tracking-widest uppercase text-sm mb-4"
            >
              Insurance & Payments
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-6 tracking-tight"
            >
              NHIS Accredited Facility
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-sky-100 leading-relaxed mb-8"
            >
              We accept the National Health Insurance Scheme (NHIS) to ensure healthcare is affordable for all members of the community. Bring your valid NHIS card for seamless processing.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'NHIS Member', icon: CheckCircle2 },
                { label: 'Private Patients', icon: CheckCircle2 },
                { label: 'Cashless Payments', icon: CheckCircle2 }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-sky-500/30 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2 border border-sky-400/30 cursor-default"
                >
                  <item.icon className="w-5 h-5 text-sky-200" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1.5 }}
            className="md:w-1/3 flex justify-center items-center"
          >
            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-full border border-white/20 shadow-inner group cursor-help">
              <Hospital className="w-32 h-32 text-white/50 group-hover:scale-110 group-hover:text-white transition-all duration-500" />
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-20 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold text-slate-900 mb-6">Accepted Schemes</h4>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Beyond NHIS, Biney Medical Centre works with various private insurance providers and corporate schemes in Ghana. If your provider is not listed below, please contact our billing department.
            </p>
            <div className="space-y-4">
               {['NHIS (National Health Insurance)', 'Glico Healthcare', 'Nationwide Health', 'Metabolic Health', 'Private Self-Pay'].map((item, i) => (
                 <motion.div 
                   key={item} 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   whileHover={{ x: 10 }}
                   className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-[100px] rounded-xl border border-white/60 transition-all shadow-sm"
                 >
                    <div className="w-2 h-2 rounded-full bg-sky-600"></div>
                    <span className="text-sm font-bold text-slate-900">{item}</span>
                 </motion.div>
               ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/40 backdrop-blur-[100px] p-12 rounded-[3.5rem] border border-white/60 shadow-xl shadow-sky-100/20 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h4 className="text-xl font-bold text-slate-900 mb-4">Patient Billing Notice</h4>
             <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Consultation fees and diagnostic costs vary based on the service provided. For NHIS members, basic services are covered under the scheme. Special procedures or medications outside the NHIS list may attract a small co-pay.
             </p>
             <motion.div 
               whileHover={{ y: -5 }}
               className="p-6 bg-sky-50 backdrop-blur-3xl rounded-2xl border border-sky-100 shadow-sm"
             >
                <p className="text-xs font-bold text-sky-600/60 uppercase tracking-widest mb-2">Preferred Payments</p>
                <p className="text-sm font-bold text-slate-900">Momo (Mobile Money), Cash, and Visa/Bank Transfer.</p>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Insurance;
