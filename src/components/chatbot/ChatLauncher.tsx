import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ChatLauncher: React.FC<{ onClick: () => void; isOpen: boolean }> = ({ onClick, isOpen }) => {
  const [expression, setExpression] = useState<"idle" | "hover" | "love" | "blink">("idle");
  
  // Bobo's vibrant teal colors
  const BOBO_TEAL = "#00d1b2";
  const BOBO_ACCENT = "#00bfa5";

  useEffect(() => {
    const interval = setInterval(() => {
      if (expression === "idle") {
        setExpression("blink");
        setTimeout(() => setExpression("idle"), 150);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [expression]);

  return (
    <motion.button
      onClick={() => {
        setExpression("love");
        setTimeout(() => {
          onClick();
          setExpression("idle");
        }, 500);
      }}
      onMouseEnter={() => setExpression("hover")}
      onMouseLeave={() => setExpression("idle")}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-[9999] group"
    >
      {/* Floating Bubbles around Bobo (from images) */}
      <AnimatePresence>
        {!isOpen && [1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2], 
              scale: [1, 1.2, 1],
              y: [0, -20 - (i * 10), 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{ 
              backgroundColor: BOBO_TEAL,
              width: i * 4 + "px",
              height: i * 4 + "px",
              left: (i * 15) + "%",
              top: (i * 10) + "%"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Bobo Character Body */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20 drop-shadow-2xl"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Outer Body / Helmet */}
          <circle cx="100" cy="100" r="80" fill="white" stroke={BOBO_TEAL} strokeWidth="6" />
          
          {/* Ears / Antennas */}
          <path d="M30,80 Q10,80 10,100 L10,120 Q10,140 30,140" fill="white" stroke={BOBO_TEAL} strokeWidth="6" />
          <path d="M170,80 Q190,80 190,100 L190,120 Q190,140 170,140" fill="white" stroke={BOBO_TEAL} strokeWidth="6" />
          
          {/* Top Details */}
          <rect x="80" y="30" width="40" height="15" rx="7" fill="white" stroke={BOBO_TEAL} strokeWidth="4" />
          <circle cx="75" cy="55" r="6" fill={BOBO_TEAL} />
          <circle cx="100" cy="50" r="8" fill={BOBO_TEAL} />
          <circle cx="125" cy="55" r="6" fill={BOBO_TEAL} />

          {/* Black Faceplate */}
          <rect x="45" y="70" width="110" height="80" rx="40" fill="#2d3436" />

          {/* Eyes Logic */}
          <g>
            {expression === "love" ? (
              // Heart Eyes
              <g fill={BOBO_TEAL}>
                <path d="M60,95 Q70,80 80,95 Q70,115 60,95" transform="translate(5, 5)" />
                <path d="M120,95 Q130,80 140,95 Q130,115 120,95" transform="translate(-5, 5)" />
              </g>
            ) : expression === "hover" ? (
              // Pleading / Shiny Eyes
              <g>
                <circle cx="75" cy="110" r="15" fill={BOBO_TEAL} />
                <circle cx="125" cy="110" r="15" fill={BOBO_TEAL} />
                <circle cx="70" cy="105" r="6" fill="white" />
                <circle cx="120" cy="105" r="6" fill="white" />
                <circle cx="78" cy="115" r="3" fill="white" opacity="0.6" />
                <circle cx="128" cy="115" r="3" fill="white" opacity="0.6" />
              </g>
            ) : expression === "blink" ? (
              // Blinking
              <g fill={BOBO_TEAL}>
                <rect x="60" y="108" width="30" height="4" rx="2" />
                <rect x="110" y="108" width="30" height="4" rx="2" />
              </g>
            ) : (
              // Idle Eyes
              <g fill={BOBO_TEAL}>
                <circle cx="75" cy="110" r="12" />
                <circle cx="125" cy="110" r="12" />
              </g>
            )}
          </g>

          {/* Small Mouth Circle */}
          <circle cx="100" cy="135" r="6" fill={BOBO_TEAL} />
        </svg>
      </motion.div>

      {/* Interactive Label */}
      <AnimatePresence>
        {expression === "hover" && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-24 top-1/2 -translate-y-1/2 bg-white border-2 border-[#00d1b2] text-[#00d1b2] font-bold py-2 px-4 rounded-xl whitespace-nowrap shadow-xl"
          >
            Ask Bobo!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
