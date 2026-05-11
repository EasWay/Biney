import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useIsMobile } from '../lib/useIsMobile';

interface SceneFlowProps {
  bgImage: string;
  bgImageWebp?: string;
  midImage?: string;
  fgImage?: string;
  title: string;
  subtitle: string;
  description: string;
}

const SceneFlow: React.FC<SceneFlowProps> = ({
  bgImage,
  bgImageWebp,
  midImage,
  fgImage,
  title,
  subtitle,
  description
}) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Always call hooks — never conditionally. On mobile we ignore the values.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const springConfig = { stiffness: 60, damping: 20 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const bgScale   = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const midY      = useTransform(smoothProgress, [0, 1], [100, -100]);
  const midScale  = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);
  const fgY       = useTransform(smoothProgress, [0, 1], [200, -200]);
  const fgScale   = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const textY     = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [100, 0, 0, -100]);
  const textOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // On mobile: skip all motion transforms — render as a lightweight static section
  if (isMobile) {
    return (
      <section className="relative flex h-[70vw] min-h-[260px] max-h-[420px] w-full items-center justify-center overflow-hidden bg-slate-900">
        <picture className="absolute inset-0 block h-full w-full">
          {bgImageWebp && <source srcSet={bgImageWebp} type="image/webp" />}
          <img
            src={bgImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover brightness-75"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/70" />
        <div className="relative z-10 max-w-xs px-6 text-center">
          <span className="mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
            {subtitle}
          </span>
          <h2 className="mb-2 font-display text-2xl font-semibold italic text-white">{title}</h2>
          <p className="text-xs leading-relaxed text-white/75">{description}</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900 to-transparent" />
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative flex h-[95vh] w-full items-center justify-center overflow-hidden bg-slate-900 sm:h-[150vh]"
    >
      {/* Background Layer */}
      <motion.div style={{ scale: bgScale, opacity: bgOpacity }} className="absolute inset-0 z-0">
        <picture className="block h-full w-full">
          {bgImageWebp && <source srcSet={bgImageWebp} type="image/webp" />}
          <img
            src={bgImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover filter brightness-75"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/60" />
      </motion.div>

      {midImage && (
        <motion.div style={{ y: midY, scale: midScale }} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <img src={midImage} alt="" className="w-auto h-3/4 object-contain drop-shadow-2xl opacity-90" />
        </motion.div>
      )}

      {fgImage && (
        <motion.div style={{ y: fgY, scale: fgScale }} className="absolute bottom-[-10%] right-[-5%] z-30 w-1/3 pointer-events-none">
          <img src={fgImage} alt="" className="w-full h-auto drop-shadow-3xl" />
        </motion.div>
      )}

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-20 max-w-4xl px-4 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.28em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[8px] font-bold uppercase text-white backdrop-blur-md sm:mb-6 sm:px-4 sm:py-2 sm:text-[10px]"
        >
          {subtitle}
        </motion.span>
        <h2 className="mb-4 font-display text-3xl font-semibold italic tracking-tight text-white sm:mb-8 sm:text-5xl md:text-7xl">
          {title}
        </h2>
        <p className="mx-auto max-w-xl text-xs leading-relaxed text-white/80 sm:max-w-2xl sm:text-lg">
          {description}
        </p>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900 to-transparent z-40" />
    </section>
  );
};

export default SceneFlow;
