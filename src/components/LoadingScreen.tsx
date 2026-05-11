/**
 * LoadingScreen — Biney Medical Centre
 *
 * Layout:
 *   – Hospital building Lottie  → top-centre, absolute
 *   – "Biney" Pacifico script   → screen-centre (main focal point)
 *   – Progress number + bar     → bottom-centre
 *
 * Letter reveal: single-word clip-path sweep (Spylt technique)
 *   – inset(0 102% 0 0) → inset(0 0% 0 0)  with Spylt expo-out easing
 *   – pb-[0.18em] on span so Y descender isn't clipped
 *   – Shimmer drifts slowly after reveal
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Lottie from 'lottie-react';
import bineyAnimation from '../assets/biney-loader.json';

interface Props {
  onComplete: () => void;
}


export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const DURATION = 1000;
    const start    = performance.now();
    let raf: number;

    function tick(now: number) {
      const t     = Math.min((now - start) / DURATION, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else        { setTimeout(onComplete, 420); }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes bmcReveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        @keyframes bmcShimmer {
          from { transform: translateX(-140%); }
          to   { transform: translateX(140%);  }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: '-4%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#1a1c1e]"
      >
        {/* Dot-grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* ── Hospital building — top centre, absolute ── */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Lottie
            animationData={bineyAnimation}
            loop={false}
            autoplay={true}
            style={{ width: 'clamp(100px, 22vw, 160px)', height: 'clamp(100px, 22vw, 160px)' }}
            aria-hidden
          />
        </motion.div>

        {/* ── "Biney" — screen centre ── */}
        <div className="relative z-10 flex flex-col items-center gap-4">

          {/* Clip-path sweep reveal */}
          <div
            className="relative"
            aria-label="Biney"
          >
            <span
              className="block text-white select-none"
              style={{
                fontFamily: "'Pacifico', cursive",
                fontSize: 'clamp(72px, 10vw, 118px)',
                lineHeight: 1.3,
                letterSpacing: '0.18em',
                textAlign: 'center',
                paddingBottom: '0.18em', /* room for Y descender */
                animation: 'bmcReveal 1.4s cubic-bezier(0.539, 0, 0.082, 1) 0.9s both',
              }}
            >
              Biney
            </span>

            {/* Shimmer — slow gloss drift */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.28) 50%, transparent 85%)',
                  transform: 'translateX(-140%)',
                  animation: 'bmcShimmer 3.5s cubic-bezier(0.16,1,0.3,1) 2.5s forwards',
                }}
              />
            </div>
          </div>

          {/* MEDICAL CENTRE */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[9px] sm:text-[11px] font-semibold tracking-[0.52em] text-white/35 select-none uppercase"
            style={{ fontFamily: "'Syne', Inter, sans-serif" }}
          >
            Medical Centre
          </motion.p>
        </div>

        {/* ── Progress — large number + thin bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.75, duration: 0.45 }}
          className="absolute inset-x-0 flex flex-col items-center gap-3"
          style={{ bottom: 'max(2.5rem, env(safe-area-inset-bottom, 2.5rem))' }}
        >
          <div className="flex items-baseline gap-[0.05em]">
            <span
              className="font-mono tabular-nums leading-none text-white/50 font-light"
              style={{ fontSize: 'clamp(40px, 5vw, 58px)' }}
            >
              {progress}
            </span>
            <span className="font-mono text-[15px] text-white/22 font-light">%</span>
          </div>

          <div className="w-[200px] sm:w-[240px]">
            <div className="relative h-px w-full bg-white/[0.07] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white/40 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-[3px] w-[3px] rounded-full bg-white/60 transition-all duration-75 ease-linear"
                style={{ left: `calc(${progress}% - 1.5px)` }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
