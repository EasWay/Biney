import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Baby,
  Building2,
  CalendarClock,
  CheckCircle2,
  Ear,
  HeartPulse,
  Hospital,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import ParallaxSection from '../components/ParallaxSection';
import SceneFlow from '../components/SceneFlow';
import { FlickeringGrid } from '../components/ui/FlickeringGrid';
import { BINEY, serviceHighlights } from '../data/biney';

const serviceIcons = [Stethoscope, Ear, Baby];
const Spline = lazy(() => import('@splinetool/react-spline'));

const Home = ({ onBookClick }: { onBookClick: () => void }) => {
  useEffect(() => {
    (window as any).openBookingModal = onBookClick;
    return () => {
      delete (window as any).openBookingModal;
    };
  }, [onBookClick]);

  return (
    <div className="flex flex-col bg-transparent font-manrope">
      <section id="book-visit" className="relative min-h-[92svh] overflow-hidden bg-transparent sm:min-h-screen">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ErrorBoundary
            fallback={
              <div className="flex size-full items-center justify-center bg-[#e5e5e5]">
                <Hospital className="size-14 text-primary/20" />
              </div>
            }
          >
            <Suspense fallback={<div className="size-full animate-pulse bg-slate-100" />}>
              <ParallaxSection zoom offset={100} className="size-full">
                <div className="relative size-full cursor-grab active:cursor-grabbing">
                  <div className="absolute inset-0">
                    <Spline
                      key="home-spline"
                      scene="https://prod.spline.design/MPahsWaY76fSaIYP/scene.splinecode"
                    />
                  </div>

                </div>
              </ParallaxSection>
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-end px-4 pb-5 pt-28 sm:min-h-screen sm:px-10 sm:pb-10 sm:pt-44">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto text-left"
          >
            <button
              onClick={onBookClick}
              className="group inline-flex items-center justify-center gap-2.5 px-0 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-900 transition-all duration-500 md:hover:-translate-y-0.5 sm:gap-4 sm:py-4 sm:text-[11px] sm:tracking-[0.28em]"
            >
              Book Visit
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/15 transition-transform duration-500 md:group-hover:translate-x-1 sm:size-8">
                <ArrowRight className="size-3.5 sm:size-4" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      <section id="quick-facts" className="-mt-8 bg-transparent px-4 pb-14 pt-12 edge-wavy-bottom sm:-mt-16 sm:px-10 sm:pb-28 sm:pt-24">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
          {[
            { icon: MapPin, label: 'Location', value: BINEY.shortAddress },
            { icon: ShieldCheck, label: 'Insurance', value: 'NHIS accepted' },
            { icon: CalendarClock, label: 'Hours', value: 'Daily 08:00-20:00' },
            { icon: Hospital, label: 'Facility', value: 'Private primary hospital' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-xl border border-white/60 bg-white/55 p-3 text-left shadow-sm backdrop-blur-xl sm:rounded-2xl sm:p-6"
            >
              <item.icon className="mb-3 size-4 text-primary sm:mb-5 sm:size-6" />
              <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-[0.22em]">{item.label}</p>
              <p className="font-display text-sm font-semibold leading-tight text-slate-900 sm:text-xl">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="care-highlights" className="relative overflow-hidden px-4 py-14 sm:px-10 sm:py-28">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <FlickeringGrid squareSize={3} gridGap={5} flickerChance={0.5} color="#575e61" maxOpacity={0.2} className="size-full" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-16 sm:gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl text-left">
              <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]">Our Care</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                The services patients look for first.
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
              This concept turns Biney Medical Centre’s known service areas into a full patient journey, ready to expand with real departments, clinicians, pricing, and facility photography.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
            {serviceHighlights.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-2xl border border-white/60 bg-white/55 p-4 text-left shadow-sm backdrop-blur-xl transition-transform duration-500 md:hover:-translate-y-2 sm:rounded-[1.5rem] sm:p-8"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary transition-colors md:group-hover:bg-primary md:group-hover:text-white sm:mb-8 sm:size-16 sm:rounded-2xl">
                    <Icon className="size-5 sm:size-8" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-slate-900 sm:mb-4 sm:text-2xl">{service.title}</h3>
                  <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:mb-8 sm:text-sm">{service.description}</p>
                  <button onClick={onBookClick} className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.18em] text-primary sm:text-[10px] sm:tracking-[0.2em]">
                    Start here <ArrowRight className="size-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SceneFlow
        bgImage="/context_care_1.png"
        title="Care begins with being heard"
        subtitle="Patient Experience"
        description="The best healthcare websites do more than list services. They reduce anxiety, explain the next step, and make patients feel that someone is ready to receive them."
      />

      <section id="patient-journey" className="px-4 py-14 edge-wavy-top sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="text-left">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]">Patient Journey</p>
            <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-slate-900 sm:mb-8 sm:text-4xl md:text-5xl">
              From the first call to the visit, every step should feel simple.
            </h2>
            <p className="mb-6 max-w-xl text-xs leading-relaxed text-slate-600 sm:mb-10 sm:text-base">
              For the final Biney website, we can connect appointment forms, WhatsApp, department pages, insurance guidance, Google Maps, real staff profiles, and patient education into one polished healthcare platform.
            </p>
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white sm:gap-3 sm:px-8 sm:py-4 sm:text-xs sm:tracking-[0.2em]"
            >
              Build the full flow <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: 'Call or request', desc: `Patients can call ${BINEY.phoneNumbers[0].label} or request an appointment online.` },
              { title: 'Choose care area', desc: 'General care, ENT care, pregnancy care, or insurance questions can be routed clearly.' },
              { title: 'Arrive prepared', desc: `Location, hours, insurance, and phone numbers stay visible across the site.` },
              { title: 'Follow up better', desc: 'The complete platform can add reminders, education, reports, and patient feedback.' },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="rounded-xl border border-white/60 bg-white/50 p-4 text-left shadow-sm backdrop-blur-xl sm:rounded-2xl sm:p-7"
              >
                <span className="mb-3 flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white sm:mb-5 sm:size-9 sm:text-xs">0{index + 1}</span>
                <h3 className="mb-2 font-display text-base font-bold text-slate-900 sm:mb-3 sm:text-xl">{step.title}</h3>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SceneFlow
        bgImage="/context_lab_work.png"
        title="Built for real clinical operations"
        subtitle="Platform Potential"
        description="This prototype can grow into a custom digital system for appointments, care information, insurance guidance, staff profiles, facility media, and patient communication."
      />

      <section id="insurance-access" className="px-4 py-14 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-7xl rounded-2xl bg-primary p-5 text-white shadow-2xl shadow-primary/20 sm:rounded-[3rem] sm:p-10 md:p-14">
          <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="text-left">
              <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-white/60 sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]">Insurance & Access</p>
              <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight sm:mb-5 sm:text-4xl md:text-5xl">We make access clear before patients arrive.</h2>
              <p className="max-w-2xl text-xs leading-relaxed text-white/75 sm:text-base">
                NHIS and Nationwide Medical Insurance are part of the known Biney Medical Centre data. In the full platform, patients can see accepted schemes, required documents, and billing guidance before they visit.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {BINEY.acceptedInsurance.map((scheme) => (
                <div key={scheme} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-bold backdrop-blur-xl sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base">
                  <CheckCircle2 className="size-4 text-white/70 sm:size-5" />
                  {scheme}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact-overview" className="px-4 pb-16 sm:px-10 sm:pb-32">
        <div className="mx-auto grid max-w-7xl gap-6 sm:gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div className="text-left">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]">Contact</p>
            <h2 className="mb-4 font-display text-2xl font-semibold text-slate-900 sm:mb-6 sm:text-4xl md:text-5xl">A better front desk starts online.</h2>
            <p className="mb-5 max-w-2xl text-xs leading-relaxed text-slate-600 sm:mb-8 sm:text-base">
              The site gives patients the basics immediately: where we are, when we open, what care areas we support, and how to call.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-700 sm:gap-4 sm:text-sm">
              <span className="rounded-full bg-white/60 px-3 py-2 sm:px-5 sm:py-3">{BINEY.address}</span>
              {BINEY.phoneNumbers.map((phone) => (
                <a key={phone.label} href={phone.href} className="rounded-full bg-white/60 px-3 py-2 md:hover:text-primary sm:px-5 sm:py-3">
                  {phone.label}
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/50 p-4 text-left shadow-sm backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
            <Users className="mb-4 size-7 text-primary sm:mb-6 sm:size-10" />
            <h3 className="mb-2 font-display text-lg font-bold text-slate-900 sm:mb-4 sm:text-2xl">Ready for real Biney content</h3>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Once the owner shares approved staff photos, department details, service pricing, insurance rules, patient testimonials, and facility images, this prototype can become a complete branded medical centre platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
