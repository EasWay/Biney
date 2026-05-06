import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Home, HandHeart, UserRound, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "home", label: "Home", path: "/", icon: Home },
  { id: "services", label: "Services", path: "/services", icon: HandHeart },
  { id: "about", label: "About", path: "/about", icon: UserRound },
  { id: "contact", label: "Contact", path: "/contact", icon: Phone },
];






export const MobileAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const ACTIVE_COLOR = "#1a1c1e";


  useEffect(() => {
    const index = TABS.findIndex((tab) => tab.path === location.pathname);
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  const handleTabChange = (index: number) => {
    setActiveIndex(index);
    navigate(TABS[index].path);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && activeIndex > 0) {
      handleTabChange(activeIndex - 1);
    } else if (info.offset.x < -swipeThreshold && activeIndex < TABS.length - 1) {
      handleTabChange(activeIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col md:hidden z-[1000]">
      {/* Top Title Bar */}
      <div className="h-16 px-6 flex items-center bg-white border-b border-slate-100 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {TABS[activeIndex].label}
        </h1>
      </div>

      {/* Swipeable Content Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        <motion.div
          key={location.pathname}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full overflow-y-auto"
        >
          {children}
        </motion.div>
      </div>

      {/* Modern Pill Dock (Reverting to previous style) */}
      <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-around px-4 pb-safe">
        <LayoutGroup>
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeIndex === idx;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(idx)}
                className="relative flex items-center justify-center transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      layoutId="active-pill"
                      className="flex items-center gap-2 px-6 py-3 rounded-full shadow-lg"
                      style={{ backgroundColor: ACTIVE_COLOR }}
                      initial={{ scale: 0.9, opacity: 0 }}

                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <Icon className="size-5 text-white" />
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-white font-bold text-sm"
                      >
                        {tab.label}
                      </motion.span>
                    </motion.div>
                  ) : (
                    <motion.div
                      layout
                      className="p-3 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <Icon className="size-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </LayoutGroup>
      </div>
    </div>
  );
};


