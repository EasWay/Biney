import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  offset?: number;
  className?: string;
  zoom?: boolean;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  speed = 0.5, 
  direction = 'up', 
  offset = 0,
  className = "",
  zoom = false
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothYProgress = useSpring(scrollYProgress, springConfig);

  const y = useTransform(
    smoothYProgress, 
    [0, 1], 
    direction === 'up' ? [offset, -offset * speed] : [-offset, offset * speed]
  );
  
  const scale = useTransform(smoothYProgress, [0, 0.5, 1], zoom ? [1, 1.1, 1] : [1, 1, 1]);
  const opacity = useTransform(smoothYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale, opacity }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
