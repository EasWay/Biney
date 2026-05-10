import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BookingModal from './components/layout/BookingModal';
import { MobileAppLayout } from './components/layout/MobileAppLayout';
import LoadingScreen from './components/LoadingScreen';

// Module-level flag: show the loading screen on every hard page load,
// but skip it during SPA navigations (the component stays mounted).
let _hasBooted = false;

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Insurance = lazy(() => import('./pages/Insurance'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Resources = lazy(() => import('./pages/Resources'));
import NotFound from './pages/NotFound';
const ChatBot = lazy(() => import('./components/chatbot/ChatBot').then((module) => ({ default: module.ChatBot })));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
    <div className="size-8 animate-pulse rounded-full bg-primary/20" />
  </div>
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function AnimatedRoutes({ onBookClick }: { onBookClick: () => void }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex-grow flex flex-col"
      >
        <Routes>
          <Route path="/" element={<Home onBookClick={onBookClick} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact onBookClick={onBookClick} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!_hasBooted);
  const isMobile = useIsMobile();

  return (
    <Router>
      {/* Loading screen sits outside the page layout so it overlays everything.
          AnimatePresence drives the exit animation when isLoading → false. */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            key="loading-screen"
            onComplete={() => {
              _hasBooted = true;
              setIsLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      <ScrollToTop />
      <div className="min-h-screen bg-transparent font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        {isMobile ? (
          <MobileAppLayout>
            <main className="flex-grow flex flex-col">
              <Suspense fallback={<RouteFallback />}>
                <AnimatedRoutes onBookClick={() => setIsBookingOpen(true)} />
              </Suspense>
              <Footer />
            </main>
          </MobileAppLayout>
        ) : (
          <>
            <Navbar onBookClick={() => setIsBookingOpen(true)} />
            <main className="flex-grow flex flex-col overflow-hidden">
              <Suspense fallback={<RouteFallback />}>
                <AnimatedRoutes onBookClick={() => setIsBookingOpen(true)} />
              </Suspense>
            </main>
            <Footer />
          </>
        )}
        
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      </div>
    </Router>
  );
}

