import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white/40 backdrop-blur-[120px] w-full max-w-xl rounded-[2.5rem] shadow-3xl overflow-hidden border border-white/60"
          >
            <div className="bg-sky-600 p-8 text-white relative border-b border-white/20">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-3xl font-bold tracking-tight mb-2">Book an Appointment</h3>
              <p className="text-sky-100">Quality healthcare tailored to your schedule.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-100 shadow-xl shadow-green-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900">Request Sent!</h4>
                  <p className="text-slate-500">We will call you shortly to confirm your slot.</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                      <input required type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-sky-600 outline-none transition-all placeholder:text-slate-300 bg-white/50 backdrop-blur-3xl text-sm text-slate-900" placeholder="Patient Name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                      <input required type="tel" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-sky-600 outline-none transition-all placeholder:text-slate-300 bg-white/50 backdrop-blur-3xl text-sm text-slate-900" placeholder="+233..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Service</label>
                    <select required className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-sky-600 outline-none transition-all bg-white/50 backdrop-blur-3xl text-sm text-slate-600">
                      <option value="" className="bg-white">Choose a specialized department</option>
                      <option className="bg-white">General Outpatient</option>
                      <option className="bg-white">Maternity & Child Health</option>
                      <option className="bg-white">ENT Procedures</option>
                      <option className="bg-white">Laboratory/Diagnostics</option>
                      <option className="bg-white">Pharmacy Consultation</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Preferred Date</label>
                      <input required type="date" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-sky-600 outline-none transition-all bg-white/50 backdrop-blur-3xl text-sm text-slate-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Preferred Time</label>
                      <input required type="time" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-sky-600 outline-none transition-all bg-white/50 backdrop-blur-3xl text-sm text-slate-600" />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-sky-600 text-white rounded-xl py-5 font-bold text-sm uppercase tracking-widest hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 flex items-center justify-center gap-3 border border-white/20"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Request Appointment'
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Note: Same-day appointments depend on availability.
                  </p>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
