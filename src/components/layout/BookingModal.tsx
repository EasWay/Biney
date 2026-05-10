import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { BINEY } from '../../data/biney';

/**
 * BookingModal — UX Laws applied:
 *  • Hick's Law / Miller's Law: Fields grouped into "Patient details" + "Appointment" sections
 *  • Display all options (2-3 values): care area uses toggle chips, not a dropdown
 *  • Don't use vague CTAs: "Request Appointment" instead of "Send Request"
 *  • Don't use placeholders as labels: labels are visible + readable at all times
 *  • Law of Proximity: label→input gap (mb-1) tighter than field→field gap (space-y-4)
 *  • Fitts's Law: submit button is full-width with generous padding
 *  • Von Restorff: primary CTA stands out with brand fill
 */

const CARE_AREAS = BINEY.listedServices as unknown as string[];

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [careArea, setCareArea] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCareArea('');
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Sheet — slides up on mobile, scales in on desktop */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-white/70 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl flex flex-col"
            style={{
              maxHeight: 'calc(92dvh - env(safe-area-inset-bottom, 0px))',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {/* Drag handle — mobile only */}
            <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-slate-200 sm:hidden shrink-0" aria-hidden />

            {/* Header — fixed, doesn't scroll */}
            <div className="relative border-b border-slate-100 px-6 pb-4 pt-3 sm:pt-5 shrink-0">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.26em] text-primary">Biney Medical Centre</p>
              <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Book a visit</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Fill in your details, then call {BINEY.phoneNumbers[0].label} to confirm.
              </p>
            </div>

            {/* Body — scrollable */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
              {submitted ? (
                <div className="space-y-3 py-10 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-600 shadow-lg shadow-green-100">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <h4 className="font-display text-xl font-semibold text-slate-900">Request received</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Please call {BINEY.phoneNumbers[0].label} to confirm your appointment.
                  </p>
                </div>
              ) : (
                <>
                  {/* ── Section 1: Patient details (Miller's Law grouping) ── */}
                  <fieldset className="space-y-3">
                    <legend className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Patient details
                    </legend>

                    {/* Name */}
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Full name
                      </label>
                      <input
                        required
                        type="text"
                        autoComplete="name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="e.g. Kwame Mensah"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Phone number
                      </label>
                      <input
                        required
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="+233 ..."
                      />
                    </div>
                  </fieldset>

                  {/* ── Section 2: Appointment (Miller's Law grouping) ── */}
                  <fieldset className="space-y-3">
                    <legend className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Appointment
                    </legend>

                    {/* Care area — Toggle chips (Display all options for 2-3 values) */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-600">
                        Care area
                      </label>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Care area">
                        {CARE_AREAS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            role="radio"
                            aria-checked={careArea === area}
                            onClick={() => setCareArea(area)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                              careArea === area
                                ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                      {/* Hidden required input to enforce selection */}
                      <input
                        type="text"
                        required
                        readOnly
                        value={careArea}
                        className="sr-only"
                        aria-hidden="true"
                        tabIndex={-1}
                      />
                    </div>

                    {/* Date + Time — single column on mobile, 2-col on sm+ */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                          Preferred date
                        </label>
                        <input
                          required
                          type="date"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                          Preferred time
                        </label>
                        <input
                          required
                          type="time"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* ── CTA — Fitts's Law: full-width, generous height, Von Restorff: visually distinct ── */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !careArea}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      'Request Appointment'
                    )}
                  </button>

                  <p className="pb-1 text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Call us to confirm availability
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
