import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Home, HandHeart, BookOpen, Phone } from "lucide-react";
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
  { id: "resources", label: "Resources", path: "/resources", icon: BookOpen },
  { id: "contact", label: "Contact", path: "/contact", icon: Phone },
];






export const MobileAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const ACTIVE_COLOR = "#111111";


  useEffect(() => {
    const index = TABS.findIndex((tab) => tab.path === location.pathname);
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  const handleTabChange = (index: number) => {
    setActiveIndex(index);
    navigate(TABS[index].path);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col md:hidden z-[1000]">
      {/* Top Title Bar — grows into iOS status-bar area when in standalone/PWA mode */}
      <div
        className="shrink-0 px-6 flex items-end bg-white border-b border-slate-100 z-50"
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))',
          paddingBottom: '0.75rem',
        }}
      >
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {TABS[activeIndex].label}
        </h1>
      </div>

      {/* Scrollable Content Area — no horizontal drag so vertical scroll is never hijacked */}
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="h-full overflow-y-auto overscroll-y-contain"
        >
          {children}
        </motion.div>
      </div>

      {/* Bottom Dock — expands into home-indicator safe area on notched phones */}
      <div
        className="shrink-0 bg-white border-t border-slate-100 flex items-center justify-around px-4"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          minHeight: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <LayoutGroup>
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeIndex === idx;

            // Fitts's Law: min 48x48px tappable area for each tab
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(idx)}
                className="relative flex min-h-[48px] min-w-[48px] items-center justify-center transition-all duration-300"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
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

