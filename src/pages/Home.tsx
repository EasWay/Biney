import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Baby,
  CalendarClock,
  CheckCircle2,
  Ear,
  Hospital,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import ParallaxSection from '../components/ParallaxSection';
import { FlickeringGrid } from '../components/ui/FlickeringGrid';
import { TextReveal } from '../components/ui/TextReveal';
import { BINEY, serviceHighlights } from '../data/biney';
import { useIsMobile } from '../lib/useIsMobile';

const serviceIcons = [Stethoscope, Ear, Baby];

// Spline is ~1MB+ of 3D assets — only load on desktop
const Spline = lazy(() => import('@splinetool/react-spline'));

/* ─── spring config for card hovers ─── */
const cardSpring = { type: 'spring' as const, stiffness: 380, damping: 28 };

const Home = ({ onBookClick }: { onBookClick: () => void }) => {
  const isMobile = useIsMobile();
  const [splineReady, setSplineReady] = useState(false);

  /* hero parallax: text drifts up as user scrolls down — desktop only */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 500], [0, -55]);

  useEffect(() => {
    (window as any).openBookingModal = onBookClick;
    return () => { delete (window as any).openBookingModal; };
  }, [onBookClick]);

  useEffect(() => {
    const activate = () => setSplineReady(true);
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(activate, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback(id);
    }
    const id = setTimeout(activate, 600);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex flex-col bg-transparent font-manrope">

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="book-visit"
        className="relative min-h-[92svh] overflow-hidden bg-transparent sm:min-h-screen"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ErrorBoundary
            fallback={
              <div className="flex size-full items-center justify-center bg-[#e5e5e5]">
                <Hospital className="size-14 text-primary/20" />
              </div>
            }
          >
            {splineReady ? (
              <Suspense fallback={<div className="size-full bg-gradient-to-br from-[#e5e5e5] via-[#eceef0] to-[#e0e2e4]" />}>
                <ParallaxSection zoom offset={100} className="size-full">
                  <div className="relative size-full cursor-grab active:cursor-grabbing">
                    <div className="absolute inset-0">
                      <Spline key="home-spline" scene="https://prod.spline.design/MPahsWaY76fSaIYP/scene.splinecode" />
                    </div>
                  </div>
                </ParallaxSection>
              </Suspense>
            ) : (
              <div className="size-full bg-gradient-to-br from-[#e5e5e5] via-[#eceef0] to-[#e0e2e4]" />
            )}
          </ErrorBoundary>
        </div>

        {/* Hero text — scroll-linked parallax */}
        <motion.div
          style={{ y: heroTextY }}
          className="pointer-events-none relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-end px-4 pb-5 pt-28 sm:min-h-screen sm:px-10 sm:pb-10 sm:pt-44"
        >
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
              Book a Visit
              <motion.span
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={cardSpring}
                className="flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/15 sm:size-8"
              >
                <ArrowRight className="size-3.5 sm:size-4" />
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Quick facts ── */}
      <section id="quick-facts" className="-mt-8 bg-transparent px-4 pb-12 pt-10 edge-wavy-bottom sm:-mt-16 sm:px-10 sm:pb-20 sm:pt-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {[
            { icon: MapPin, label: 'Location', value: BINEY.shortAddress },
            { icon: ShieldCheck, label: 'Insurance', value: 'NHIS accepted' },
            { icon: CalendarClock, label: 'Hours', value: 'Daily 08:00–20:00' },
            { icon: Hospital, label: 'Facility', value: 'Private primary hospital' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, scale: 1.02, transition: cardSpring }}
              className="rounded-xl border border-white/60 bg-white/55 p-3 text-left shadow-sm backdrop-blur-xl cursor-default sm:rounded-2xl sm:p-5"
            >
              <item.icon className="mb-2.5 size-4 text-primary sm:mb-4 sm:size-5" />
              <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">{item.label}</p>
              <p className="font-display text-sm font-semibold leading-tight text-slate-900 sm:text-base">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Care highlights ── */}
      <section id="care-highlights" className="relative overflow-hidden px-4 py-12 sm:px-10 sm:py-20">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <FlickeringGrid squareSize={3} gridGap={5} flickerChance={0.5} color="#111111" maxOpacity={0.18} className="size-full" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 sm:gap-6 md:flex-row md:items-end">
            <div className="max-w-xl text-left">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]"
              >
                Our Care
              </motion.p>
              <TextReveal
                as="h2"
                className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
                stagger={0.05}
              >
                The care you need, close to home.
              </TextReveal>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-sm text-xs leading-relaxed text-slate-600 sm:text-sm"
            >
              Whatever brings you in — a check-up, an ENT concern, or pregnancy care — you'll find a team ready to listen and give you a clear next step.
            </motion.p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {serviceHighlights.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, scale: 1.025, transition: cardSpring }}
                  className="group rounded-2xl border border-white/60 bg-white/55 p-4 text-left shadow-sm backdrop-blur-xl cursor-default sm:p-6"
                >
                  <motion.div
                    className="mb-4 flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary sm:mb-5 sm:size-12"
                    whileHover={{ rotate: 8, scale: 1.1, transition: cardSpring }}
                  >
                    <Icon className="size-5" />
                  </motion.div>
                  <h3 className="mb-2 font-display text-base font-bold text-slate-900 sm:mb-3 sm:text-lg">{service.title}</h3>
                  <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:mb-5 sm:text-sm">{service.description}</p>
                  <motion.button
                    onClick={onBookClick}
                    whileHover={{ scale: 1.04, transition: cardSpring }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-primary sm:text-[10px]"
                  >
                    Book now <ArrowRight className="size-3" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Patient journey ── */}
      <section id="patient-journey" className="px-4 py-12 edge-wavy-top sm:px-10 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]"
            >
              Your Visit
            </motion.p>
            <TextReveal
              as="h2"
              className="mb-4 font-display text-2xl font-semibold tracking-tight text-slate-900 sm:mb-6 sm:text-3xl"
              stagger={0.045}
            >
              From your first call to leaving with answers — we keep it simple.
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 max-w-xl text-xs leading-relaxed text-slate-600 sm:mb-8 sm:text-sm"
            >
              We want every patient to feel at ease before they arrive. Call us, book online, or just walk in — we'll take care of the rest.
            </motion.p>
            <motion.button
              onClick={onBookClick}
              whileHover={{ scale: 1.04, y: -2, transition: cardSpring }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white sm:gap-3 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.2em]"
            >
              Book your visit <ArrowRight className="size-4" />
            </motion.button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 sm:gap-4">
            {[
              { title: 'Call or walk in', desc: `Call ${BINEY.phones[0].label}, walk in, or request your visit here — whichever is easiest for you.` },
              { title: 'Tell us your concern', desc: "Let us know if you're coming for general care, an ENT issue, or pregnancy-related support. We'll be ready." },
              { title: 'Arrive prepared', desc: 'Our address, opening hours, and insurance details are always visible. No surprises when you get here.' },
              { title: "We're still here after", desc: "Have questions after your visit? Call us anytime. Your care doesn't stop when you leave." },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02, transition: cardSpring }}
                className="rounded-xl border border-white/60 bg-white/50 p-4 text-left shadow-sm backdrop-blur-xl cursor-default sm:rounded-2xl sm:p-5"
              >
                <span className="mb-2.5 flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white sm:mb-4 sm:size-8 sm:text-xs">0{index + 1}</span>
                <h3 className="mb-1.5 font-display text-sm font-bold text-slate-900 sm:mb-2 sm:text-base">{step.title}</h3>
                <p className="text-xs leading-relaxed text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Insurance ── */}
      <section id="insurance-access" className="px-4 py-12 sm:px-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-7xl rounded-2xl bg-primary p-5 text-white shadow-2xl shadow-primary/20 sm:rounded-[2.5rem] sm:p-8 md:p-12"
        >
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="text-left">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-white/60 sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]"
              >
                Insurance & Access
              </motion.p>
              <TextReveal
                as="h2"
                className="mb-3 font-display text-2xl font-semibold tracking-tight sm:mb-4 sm:text-3xl"
                delay={0.1}
                stagger={0.06}
              >
                Your insurance is welcome here.
              </TextReveal>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="max-w-xl text-xs leading-relaxed text-white/75 sm:text-sm"
              >
                We accept NHIS and Nationwide Medical Insurance. Bring your card — or call us first if you're not sure about your coverage. We'll walk you through it.
              </motion.p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {BINEY.acceptedInsurance.map((scheme, i) => (
                <motion.div
                  key={scheme}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-bold backdrop-blur-xl sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                >
                  <CheckCircle2 className="size-4 text-white/70" />
                  {scheme}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Contact overview ── */}
      <section id="contact-overview" className="px-4 pb-14 sm:px-10 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-primary sm:mb-3 sm:text-[10px] sm:tracking-[0.3em]"
            >
              Find Us
            </motion.p>
            <TextReveal
              as="h2"
              className="mb-4 font-display text-2xl font-semibold text-slate-900 sm:mb-5 sm:text-3xl"
              stagger={0.055}
            >
              We're here when you need us.
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-5 max-w-xl text-xs leading-relaxed text-slate-600 sm:mb-6 sm:text-sm"
            >
              Open every day from 08:00 to 20:00 — including weekends. Find our address, call directly, or request an appointment online.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-700 sm:gap-3 sm:text-sm"
            >
              <span className="rounded-full bg-white/60 px-3 py-2 sm:px-4">{BINEY.address}</span>
              {BINEY.phones.map((phone) => (
                <motion.a
                  key={phone.label}
                  href={phone.tel}
                  whileHover={{ scale: 1.04, y: -1, transition: cardSpring }}
                  className="rounded-full bg-white/60 px-3 py-2 md:hover:text-primary sm:px-4"
                >
                  {phone.label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, scale: 1.02, transition: cardSpring }}
            className="rounded-2xl border border-white/60 bg-white/50 p-4 text-left shadow-sm backdrop-blur-xl cursor-default sm:rounded-2xl sm:p-6"
          >
            <Users className="mb-3 size-6 text-primary sm:mb-4 sm:size-8" />
            <h3 className="mb-2 font-display text-base font-bold text-slate-900 sm:mb-3 sm:text-xl">Come find us in Tema</h3>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Italian Flats, Community 2, Tema. Close to home, ready to help. Our team is here every day from 08:00 to 20:00 — including weekends.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
