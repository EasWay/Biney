import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, HandHeart, BookOpen, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "home",      label: "Home",      path: "/",          icon: Home },
  { id: "services",  label: "Services",  path: "/services",  icon: HandHeart },
  { id: "resources", label: "Resources", path: "/resources", icon: BookOpen },
  { id: "contact",   label: "Contact",   path: "/contact",   icon: Phone },
];

export const MobileAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
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
      {/* Top Title Bar */}
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

      {/* Scrollable Content Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        {/* Single lightweight fade — no Y movement, no mode="wait" */}
        <AnimatePresence mode="sync">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute inset-0 overflow-y-auto overscroll-y-contain"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Dock */}
      <div
        className="shrink-0 bg-white border-t border-slate-100 flex items-center justify-around px-4"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          minHeight: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeIndex === idx;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(idx)}
              className="relative flex min-h-[48px] min-w-[48px] items-center justify-center"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                <motion.div
                  layoutId="active-pill"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md"
                  style={{ backgroundColor: ACTIVE_COLOR }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                >
                  <Icon className="size-5 text-white" />
                  <span className="text-white font-bold text-sm">{tab.label}</span>
                </motion.div>
              ) : (
                <div className="p-3 text-slate-400">
                  <Icon className="size-6" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
