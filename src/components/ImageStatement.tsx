/**
 * ImageStatement
 * ─────────────────────────────────────────────────────────────────
 * Minimal, mobile-first full-bleed image section.
 *
 * Animation (intentionally restrained):
 *   - Image: starts at scale 1.06 → settles to 1.0 on entry (Ken Burns lite)
 *   - Overlay: fades in from 0 → 1 on entry
 *   - Text: slides up 16px + fades in, staggered per element
 *
 * Zero scroll listeners, zero spring physics — uses whileInView only.
 * Identical behaviour on mobile and desktop.
 * ─────────────────────────────────────────────────────────────────
 */

import { motion } from 'motion/react';

interface ImageStatementProps {
  /** Primary WebP src (preferred) */
  imageSrc: string;
  /** PNG / JPG fallback for older browsers */
  imageFallback?: string;
  /** Short label above the headline */
  eyebrow: string;
  /** Main headline */
  headline: string;
  /** Supporting body copy */
  body: string;
  /** Flip image / text side on desktop */
  reverse?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function ImageStatement({
  imageSrc,
  imageFallback,
  eyebrow,
  headline,
  body,
  reverse = false,
}: ImageStatementProps) {
  return (
    <div className="relative w-full overflow-hidden bg-[#0c0c0c]">
      {/* ── Image layer ── */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.1, ease }}
        className="absolute inset-0 z-0"
      >
        <picture className="block h-full w-full">
          <source srcSet={imageSrc} type="image/webp" />
          <img
            src={imageFallback ?? imageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      </motion.div>

      {/* ── Gradient overlay — deeper at bottom so text pops ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease }}
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
      />

      {/* ── Text content ── */}
      <div
        className={`relative z-20 mx-auto flex min-h-[56vw] max-h-[520px] min-h-[280px] max-w-7xl items-end px-6 pb-10 sm:px-10 sm:pb-14 ${
          reverse ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className={`max-w-xs sm:max-w-md ${reverse ? 'text-right' : 'text-left'}`}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
            className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-white/50 sm:text-[10px]"
          >
            {eyebrow}
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.2, ease }}
            className="mb-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl"
          >
            {headline}
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            className="text-xs leading-relaxed text-white/70 sm:text-sm"
          >
            {body}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
