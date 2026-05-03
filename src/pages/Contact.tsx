import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Clock, MapPin, Phone } from 'lucide-react';
import { BINEY } from '../data/biney';
import { DottedMap } from '../components/ui/DottedMap';

const Contact = ({ onBookClick }: { onBookClick: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="bg-transparent px-4 py-14 pt-28 sm:px-10 sm:py-24 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 sm:gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-4 sm:text-sm sm:tracking-widest">Contact</h2>
            <h3 className="mb-4 text-2xl font-bold italic tracking-tight text-slate-900 sm:mb-8 sm:text-4xl">{BINEY.name}</h3>
            <p className="mb-5 text-xs leading-relaxed text-slate-500 sm:mb-8 sm:text-lg">
              We are located in Tema and ready to help patients find the right next step before they arrive.
            </p>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBookClick}
              className="mb-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/10 transition-all sm:mb-12 sm:gap-3 sm:px-8 sm:py-4 sm:text-sm sm:tracking-widest"
            >
              <Clock className="size-4 sm:size-5" />
              Request Appointment
              <ChevronRight className="size-4" />
            </motion.button>

            <div className="space-y-3 sm:space-y-8">
              {[
                { icon: MapPin, title: 'Location', content: BINEY.address },
                {
                  icon: Phone,
                  title: 'Phone Numbers',
                  content: (
                    <>
                      {BINEY.phoneNumbers.map((phone) => (
                        <React.Fragment key={phone.label}>
                          <a href={phone.href} className="transition-colors hover:text-primary">{phone.label}</a>
                          <br />
                        </React.Fragment>
                      ))}
                    </>
                  ),
                },
                { icon: Clock, title: 'Listed Hours', content: BINEY.hours },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-xl transition-all sm:gap-6 sm:rounded-3xl sm:p-6"
                >
                  <div className="rounded-xl bg-primary p-2.5 text-white shadow-lg shadow-primary/10 sm:rounded-2xl sm:p-4">
                    <item.icon className="size-4 sm:size-6" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-slate-900 sm:text-lg">{item.title}</h4>
                    <div className="whitespace-pre-line text-xs leading-relaxed text-slate-500 sm:text-sm">{item.content}</div>
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
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:rounded-[3rem] sm:p-8 md:p-12"
          >
            <h4 className="mb-2 text-xl font-extrabold italic text-slate-900 sm:text-3xl">Appointment Request</h4>
            <p className="mb-5 text-xs leading-relaxed text-slate-500 sm:mb-10 sm:text-sm">
              Send a request and call our front desk to confirm availability for your preferred visit time.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 py-10 text-center sm:space-y-6 sm:py-16">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-xl shadow-green-100 ring-4 ring-white/10 sm:size-24">
                    <CheckCircle2 className="size-8 sm:size-12" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-black italic text-slate-900 sm:text-3xl">Request Noted</h4>
                    <p className="text-xs text-slate-500 sm:text-base">Please call {BINEY.phoneNumbers[0].label} to confirm your visit.</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">Patient Full Name</label>
                      <input required type="text" className="w-full rounded-xl border border-slate-200 bg-white/60 px-3.5 py-3 text-xs text-slate-900 outline-none transition-all focus:border-primary sm:rounded-2xl sm:px-6 sm:py-4 sm:text-sm" placeholder="Patient name" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">Phone</label>
                      <input required type="tel" className="w-full rounded-xl border border-slate-200 bg-white/60 px-3.5 py-3 text-xs text-slate-900 outline-none transition-all focus:border-primary sm:rounded-2xl sm:px-6 sm:py-4 sm:text-sm" placeholder="+233..." />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">Preferred Date</label>
                      <input required type="date" className="w-full rounded-xl border border-slate-200 bg-white/60 px-3.5 py-3 text-xs text-slate-600 outline-none transition-all focus:border-primary sm:rounded-2xl sm:px-6 sm:py-4 sm:text-sm" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">Listed Care Area</label>
                      <select required className="w-full rounded-xl border border-slate-200 bg-white/60 px-3.5 py-3 text-xs text-slate-600 outline-none transition-all focus:border-primary sm:rounded-2xl sm:px-6 sm:py-4 sm:text-sm">
                        <option value="">Select</option>
                        {BINEY.listedServices.map((service) => (
                          <option key={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    disabled={isSubmitting || submitted}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-primary/10 transition-all sm:gap-3 sm:rounded-2xl sm:py-5 sm:text-sm sm:tracking-widest ${isSubmitting || submitted ? 'cursor-not-allowed opacity-70' : 'md:hover:-translate-y-0.5'}`}
                  >
                    {isSubmitting ? 'Recording Request...' : 'Record Request'}
                    {!isSubmitting && <ChevronRight className="size-4" />}
                  </button>
                </>
              )}
            </form>
          </motion.div>
        </div>

        {/* Dotted Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-8 h-[300px] overflow-hidden rounded-2xl border border-white/60 bg-white/45 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-16 sm:h-[450px] sm:rounded-[3rem] sm:p-8"
        >
          <DottedMap
            width={180}
            height={90}
            mapSamples={16000}
            dotRadius={0.19}
            dotColor="rgba(15, 23, 42, 0.65)"
            markerColor="#0f172a"
            pulse
            markers={[
              { lat: 5.6667, lng: -0.0167, size: 0.9, pulse: true },
            ]}
            className="absolute inset-0 size-full"
            aria-label={`${BINEY.name} location map`}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/60 to-transparent" />
        </motion.div>

        {/* Real Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-8 h-[400px] overflow-hidden rounded-2xl border border-white/60 bg-white/45 p-2 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-16 sm:h-[500px] sm:rounded-[3rem] sm:p-4"
        >
          <iframe
            title="Biney Medical Centre Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.665971434316!2d-0.0192!3d5.6667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020790000000001%3A0x0!2zNcKwNDAnMDAuMSJOIDDCsDAxJzA5LjEiVw!5e0!3m2!1sen!2sgh!4v1714750000000!5m2!1sen!2sgh"
            className="rounded-xl grayscale-[0.2] transition-all hover:grayscale-0 sm:rounded-[2rem]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
