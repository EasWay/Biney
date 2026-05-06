import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BookingModal from './components/layout/BookingModal';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Insurance from './pages/Insurance';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import { ChevronDown } from 'lucide-react';
import { ChatBot } from './components/chatbot/ChatBot';
import { MobileAppLayout } from './components/layout/MobileAppLayout';


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
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
        <Routes location={location}>
          <Route path="/" element={<Home onBookClick={onBookClick} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact onBookClick={onBookClick} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-transparent font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        {isMobile ? (
          <MobileAppLayout>
            <main className="flex-grow flex flex-col">
              <AnimatedRoutes onBookClick={() => setIsBookingOpen(true)} />
              <Footer />
            </main>
          </MobileAppLayout>
        ) : (
          <>
            <Navbar onBookClick={() => setIsBookingOpen(true)} />
            <main className="flex-grow flex flex-col overflow-hidden">
              <AnimatedRoutes onBookClick={() => setIsBookingOpen(true)} />
            </main>
            <Footer />
          </>
        )}
        
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        <ChatBot />
      </div>
    </Router>
  );
}

