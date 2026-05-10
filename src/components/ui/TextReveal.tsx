/**
 * TextReveal — word-by-word slide-up reveal
 *
 * Each word sits inside an overflow:hidden wrapper so it appears to
 * "rise from below the line" as the section enters the viewport.
 * Uses staggerChildren so only one whileInView trigger is needed on
 * the parent — all words fire in sequence automatically.
 *
 * Usage:
 *   <TextReveal as="h2" className="text-3xl font-bold">
 *     Your heading text here
 *   </TextReveal>
 */

import React, { ElementType } from 'react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const wordVariants = {
  hidden: { y: '108%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.62,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  /** Gap between each word animation (seconds) */
  stagger?: number;
  as?: ElementType;
  margin?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = '',
  delay = 0,
  stagger = 0.055,
  as: Tag = 'h2',
  margin = '-8% 0px',
}) => {
  const words = children.split(' ');

  return (
    /* Semantic tag wraps everything for correct HTML hierarchy */
    <Tag className={className} aria-label={children}>
      {/* motion.span orchestrates the stagger — display:inline keeps words flowing */}
      <motion.span
        custom={stagger}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin }}
        style={{ display: 'inline', transitionDelay: delay ? `${delay}s` : undefined }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              /* Extra bottom clearance so descenders (y, g, p) aren't clipped */
              paddingBottom: '0.1em',
              marginBottom: '-0.1em',
              verticalAlign: 'bottom',
            }}
          >
            <motion.span variants={wordVariants} style={{ display: 'inline-block' }}>
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};
