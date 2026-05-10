import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Clock, MapPin, Phone } from 'lucide-react';
import { BINEY } from '../data/biney';
import { DottedMap } from '../components/ui/DottedMap';

const CARE_AREAS = BINEY.listedServices as unknown as string[];

const Contact = ({ onBookClick }: { onBookClick: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showMaps, setShowMaps] = useState(false);
  const [careArea, setCareArea] = useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => setShowMaps(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="bg-transparent px-4 py-14 pt-28 sm:px-10 sm:py-24 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 sm:gap-16 lg:grid-cols-2">
          <motion.div
            id="contact-details"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-4 sm:text-sm sm:tracking-widest">Contact</h2>
            <h3 className="mb-3 text-2xl font-bold italic tracking-tight text-slate-900 sm:mb-5 sm:text-3xl">{BINEY.name}</h3>
            <p className="mb-5 text-xs leading-relaxed text-slate-500 sm:mb-8 sm:text-sm">
              Tell us who you are and when you'd like to come in. We'll confirm your appointment and have everything ready when you arrive.
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
            id="appointment-request"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:rounded-[3rem] sm:p-8 md:p-12"
          >
            <h4 className="mb-2 text-lg font-extrabold italic text-slate-900 sm:text-2xl">Request an Appointment</h4>
            <p className="mb-5 text-xs leading-relaxed text-slate-500 sm:mb-8 sm:text-sm">
              Fill in your details below, then call us to confirm. We're open every day from 08:00 to 20:00.
            </p>

            {/* UX Laws applied:
                 • Miller's Law: fields grouped into "Patient details" + "Appointment"
                 • Display all options for 2-3 values: care area uses toggle chips
                 • Don't use placeholders as labels: labels are always visible
                 • Single column on mobile (Don't stack two columns)
                 • Fitts's Law: full-width submit with generous height */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 py-10 text-center sm:space-y-6 sm:py-16">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-xl shadow-green-100 ring-4 ring-white/10 sm:size-24">
                    <CheckCircle2 className="size-8 sm:size-12" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-black italic text-slate-900 sm:text-2xl">Request received</h4>
                    <p className="text-xs text-slate-500 sm:text-sm">Please call {BINEY.phoneNumbers[0].label} to confirm your appointment time.</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Section 1: Patient details */}
                  <fieldset className="space-y-3">
                    <legend className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Patient details</legend>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Full name</label>
                      <input required type="text" autoComplete="name"
                        className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:rounded-2xl"
                        placeholder="e.g. Kwame Mensah" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Phone number</label>
                      <input required type="tel" autoComplete="tel" inputMode="tel"
                        className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:rounded-2xl"
                        placeholder="+233 ..." />
                    </div>
                  </fieldset>

                  {/* Section 2: Appointment details */}
                  <fieldset className="space-y-3">
                    <legend className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Appointment</legend>

                    {/* Care area — toggle chips (Display all options for 2-3 values) */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-600">Care area</label>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Care area">
                        {CARE_AREAS.map((area) => (
                          <button key={area} type="button" role="radio" aria-checked={careArea === area}
                            onClick={() => setCareArea(area)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                              careArea === area
                                ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                                : 'border-slate-200 bg-white/70 text-slate-600 hover:border-primary/40 hover:text-primary'
                            }`}
                          >{area}</button>
                        ))}
                      </div>
                      <input type="text" required readOnly value={careArea} className="sr-only" aria-hidden="true" tabIndex={-1} />
                    </div>

                    {/* Date — single column on mobile, 2-col on sm */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">Preferred date</label>
                        <input required type="date"
                          className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 sm:rounded-2xl" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">Preferred time</label>
                        <input required type="time"
                          className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 sm:rounded-2xl" />
                      </div>
                    </div>
                  </fieldset>

                  {/* CTA — Fitts's Law: full-width, generous height */}
                  <button
                    type="submit"
                    disabled={isSubmitting || submitted || !careArea}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-primary/10 transition-all sm:rounded-2xl sm:py-5 ${isSubmitting || submitted || !careArea ? 'cursor-not-allowed opacity-60' : 'md:hover:-translate-y-0.5'}`}
                  >
                    {isSubmitting ? 'Sending…' : 'Request Appointment'}
                    {!isSubmitting && <ChevronRight className="size-4" />}
                  </button>
                </>
              )}
            </form>
          </motion.div>
        </div>

        {/* Dotted Map Section */}
        <motion.div
          id="location-map"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-8 h-[300px] overflow-hidden rounded-2xl border border-white/60 bg-white/45 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-16 sm:h-[450px] sm:rounded-[3rem] sm:p-8"
        >
          {showMaps ? (
            <DottedMap
              width={180}
              height={90}
              mapSamples={typeof window !== 'undefined' && window.innerWidth < 768 ? 4000 : 8000}
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
          ) : (
            <div className="absolute inset-0 bg-slate-50 animate-pulse rounded-2xl" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/60 to-transparent" />
        </motion.div>

        {/* Real Map Section */}
        <motion.div
          id="google-map"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-8 h-[400px] overflow-hidden rounded-2xl border border-white/60 bg-white/45 p-2 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-16 sm:h-[500px] sm:rounded-[3rem] sm:p-4"
        >
          {showMaps ? (
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
          ) : (
            <div className="h-full w-full bg-slate-50 animate-pulse rounded-xl" />
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
