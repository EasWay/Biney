import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 60, damping: 20 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Background expansion and zoom
  const bgScale = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  // Midground parallax (Doctor/Staff)
  const midY = useTransform(smoothProgress, [0, 1], [100, -100]);
  const midScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);

  // Foreground parallax (Equipment/Details)
  const fgY = useTransform(smoothProgress, [0, 1], [200, -200]);
  const fgScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 1]);

  // Text animations
  const textY = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [100, 0, 0, -100]);
  const textOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex h-[95vh] w-full items-center justify-center overflow-hidden bg-slate-900 edge-wavy-top edge-wavy-bottom sm:h-[150vh]"
    >
      {/* Background Layer */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0"
      >
        <picture className="block h-full w-full">
          {bgImageWebp && <source srcSet={bgImageWebp} type="image/webp" />}
          <img
            src={bgImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-75"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/60" />
      </motion.div>

      {/* Midground Layer */}
      {midImage && (
        <motion.div
          style={{ y: midY, scale: midScale }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <img
            src={midImage}
            alt="Midground"
            className="w-auto h-3/4 object-contain drop-shadow-2xl opacity-90"
          />
        </motion.div>
      )}

      {/* Foreground Layer */}
      {fgImage && (
        <motion.div
          style={{ y: fgY, scale: fgScale }}
          className="absolute bottom-[-10%] right-[-5%] z-30 w-1/3 pointer-events-none"
        >
          <img
            src={fgImage}
            alt="Foreground"
            className="w-full h-auto drop-shadow-3xl"
          />
        </motion.div>
      )}

      {/* Content Layer */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 max-w-4xl px-4 text-center sm:px-6"
      >
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

      {/* Depth Shadow */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900 to-transparent z-40" />
    </section>
  );
};

export default SceneFlow;
