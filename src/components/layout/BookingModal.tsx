import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { BINEY } from '../../data/biney';

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
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl"
          >
            <div className="relative border-b border-slate-200/70 px-6 pb-5 pt-6 text-slate-900">
              <button 
                onClick={onClose}
                className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close appointment modal"
              >
                <X className="size-4" />
              </button>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.26em] text-primary">Biney Medical Centre</p>
              <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight">Book a visit</h3>
              <p className="max-w-sm text-xs leading-relaxed text-slate-500">Share your preferred details, then call {BINEY.phoneNumbers[0].label} to confirm.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {submitted ? (
                <div className="space-y-3 py-10 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-600 shadow-lg shadow-green-100">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <h4 className="font-display text-xl font-semibold text-slate-900">Request noted</h4>
                  <p className="text-xs text-slate-500">Please call {BINEY.phoneNumbers[0].label} to confirm directly.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Full Name</label>
                      <input required type="text" className="w-full rounded-xl border border-slate-200 bg-white/65 px-3.5 py-3 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder="Patient name" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Phone</label>
                      <input required type="tel" className="w-full rounded-xl border border-slate-200 bg-white/65 px-3.5 py-3 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder="+233..." />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Care Area</label>
                    <select required className="w-full rounded-xl border border-slate-200 bg-white/65 px-3.5 py-3 text-xs text-slate-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10">
                      <option value="" className="bg-white">Choose a listed care area</option>
                      {BINEY.listedServices.map((service) => (
                        <option key={service} className="bg-white">{service}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Date</label>
                      <input required type="date" className="w-full rounded-xl border border-slate-200 bg-white/65 px-3.5 py-3 text-xs text-slate-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Time</label>
                      <input required type="time" className="w-full rounded-xl border border-slate-200 bg-white/65 px-3.5 py-3 text-xs text-slate-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10" />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-primary bg-primary py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing
                      </>
                    ) : (
                      'Send Request'
                    )}
                  </button>
                  <p className="text-center text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Confirm appointment availability by phone.
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
