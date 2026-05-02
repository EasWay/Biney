import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const Contact = ({ onBookClick }: { onBookClick: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-24 bg-transparent pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4">Contact Us</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight italic">Visit Us or Get in Touch</h3>
            <p className="text-lg text-slate-500 mb-8">
              For any inquiries, appointments, or emergency guidance, please reach out to us using the details below or visit us directly at our Tema centre.
            </p>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookClick}
              className="mb-12 inline-flex items-center gap-3 bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 group border border-white/20"
            >
              <Clock className="w-5 h-5" />
              Book an Appointment
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <div className="space-y-8">
              {[
                { icon: MapPin, title: 'Our Location', content: 'Italian Flats, Community 2,\nTema, Greater Accra, Ghana.' },
                { icon: Phone, title: 'Phone Numbers', content: <><a href="tel:+233303204368" className="hover:text-sky-600 transition-colors">+233 30 320 4368</a><br /><a href="tel:+233303202201" className="hover:text-sky-600 transition-colors">+233 30 320 2201</a></> },
                { icon: Clock, title: 'Opening Hours', content: 'Mon – Sun: Open 24 Hours\n(Maternity and Emergency services available daily)' }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-6 p-6 rounded-3xl bg-white/40 backdrop-blur-[100px] border border-white/60 hover:shadow-lg hover:shadow-sky-100/50 transition-all group"
                >
                  <div className="bg-sky-600 p-4 rounded-2xl text-white shadow-lg shadow-sky-100 group-hover:scale-110 transition-transform border border-white/20">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                    <div className="text-slate-500 leading-relaxed text-sm whitespace-pre-line">
                      {item.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/40 backdrop-blur-[100px] p-8 md:p-12 rounded-[3.5rem] border border-white/60 shadow-xl shadow-sky-100/20 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover:bg-sky-200/40 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <h4 className="text-3xl font-extrabold text-slate-900 mb-2 italic">Book an Appointment</h4>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                Schedule your clinical consultation directly. Our team will contact you within 60 minutes to confirm your slot.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-xl shadow-green-100 ring-4 ring-white/10">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-slate-900 mb-2 italic">Request Received!</h4>
                      <p className="text-slate-500 text-base">We've reserved your interest and will call <br/> shortly to confirm details.</p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Patient Full Name</label>
                        <input required type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100/20 outline-none transition-all placeholder:text-slate-300 bg-white/50 backdrop-blur-3xl text-sm text-slate-900" placeholder="e.g. John Mensah" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">WhatsApp / Phone</label>
                        <input required type="tel" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100/20 outline-none transition-all placeholder:text-slate-300 bg-white/50 backdrop-blur-3xl text-sm text-slate-900" placeholder="+233..." />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Preferred Date</label>
                        <div className="relative">
                          <input required type="date" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100/20 outline-none transition-all bg-white/50 backdrop-blur-3xl text-sm text-slate-600 appearance-none" />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Clock className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Service Type</label>
                        <select required className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100/20 outline-none transition-all bg-white/50 backdrop-blur-3xl text-sm text-slate-600 appearance-none">
                          <option value="" className="bg-white">Select Department</option>
                          <option className="bg-white">General Outpatient</option>
                          <option className="bg-white">Maternity Care</option>
                          <option className="bg-white">ENT Specialist</option>
                          <option className="bg-white">Laboratory Services</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Health Concern (Optional)</label>
                      <textarea rows={3} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100/20 outline-none transition-all placeholder:text-slate-300 bg-white/50 backdrop-blur-3xl resize-none text-sm text-slate-900" placeholder="Briefly describe your reason for visit..."></textarea>
                    </div>

                    <button 
                      disabled={isSubmitting || submitted}
                      className={`w-full bg-sky-600 text-white rounded-2xl py-5 font-bold text-sm uppercase tracking-widest transition-all shadow-2xl shadow-sky-100 flex items-center justify-center gap-3 border border-white/20 ${isSubmitting || submitted ? 'opacity-70 cursor-not-allowed' : 'hover:bg-sky-700 hover:-translate-y-0.5'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Confirming Slot...
                        </>
                      ) : (
                        <>
                          Reserve Now
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                      No upfront payment required for booking
                    </p>
                  </>
                )}
              </form>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 h-[400px] rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.672522765872!2d-0.011888924024345262!3d5.615277794365778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf704259b1397b%3A0x6ec040510526e0e0!2sItaly%20Flats!5e0!3m2!1sen!2sgh!4v1714659000000!5m2!1sen!2sgh" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Biney Medical Centre Location"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
