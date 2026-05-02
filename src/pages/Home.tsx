import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  Hospital, CheckCircle2, Heart, Newspaper, ArrowRight, Activity, Sparkles, Clock, X, Calendar, Tag,
  ShieldCheck, Stethoscope, Baby, Microscope, Users, Quote, Plus, PhoneCall, HeartPulse, MapPin
} from 'lucide-react';
import { fetchHealthTips, fetchHealthNews, HealthTip, HealthNews } from '../services/geminiService';

const NewsModal: React.FC<{ news: HealthNews | null; onClose: () => void }> = ({ news, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const placeholder = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&h=600";

  useEffect(() => {
    setImageError(false);
  }, [news]);

  return (
    <AnimatePresence>
      {news && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white/40 backdrop-blur-[100px] w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/60"
          >
            <div className="relative h-64 shrink-0">
              <img 
                src={imageError ? placeholder : `https://loremflickr.com/1200/600/medical,${encodeURIComponent(news.imageKeyword)}?random=${news.title.length}`}
                alt={news.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/40 backdrop-blur-xl hover:bg-white/60 rounded-full text-slate-900 transition-colors shadow-lg border border-white/60"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 pt-4 overflow-y-auto custom-scrollbar">
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-4 py-2 rounded-full border border-sky-100">
                  <Tag className="w-3 h-3" />
                  {news.category}
                </span>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <Calendar className="w-3 h-3" />
                  {news.date}
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-slate-900 mb-6 leading-tight italic">
                {news.title}
              </h3>

              <div className="prose max-w-none">
                <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
                  {news.summary}
                </p>
                <p className="text-slate-500 leading-relaxed text-base whitespace-pre-line">
                  {news.content}
                </p>
              </div>

              <div className="mt-12 p-8 bg-sky-50 rounded-3xl border border-sky-100 flex items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Need medical advice?</h4>
                  <p className="text-xs text-sky-600/60">Book a consultation with our clinicians for personalized care.</p>
                </div>
                <button 
                  onClick={() => { onClose(); (window as any).openBookingModal?.(); }}
                  className="shrink-0 bg-sky-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-lg shadow-sky-100"
                >
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const NewsCard: React.FC<{ news: HealthNews; onReadMore: () => void }> = ({ news, onReadMore }) => {
  const [imageError, setImageError] = useState(false);
  const placeholder = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=450";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/40 backdrop-blur-[100px] rounded-[2.5rem] border border-white/60 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-500 group overflow-hidden flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageError ? placeholder : `https://loremflickr.com/800/450/medical,${encodeURIComponent(news.imageKeyword)}?random=${news.title.length}`}
          alt={news.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-sky-600 px-3 py-1 rounded-full shadow-lg">
            {news.category}
          </span>
        </div>
      </div>
    
      <div className="p-6 flex flex-col flex-grow text-left">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {news.date}
          </span>
        </div>
        
        <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors leading-tight min-h-[3.5rem] line-clamp-2">
          {news.title}
        </h4>
        
        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">
          {news.summary}
        </p>
        
        <button 
          onClick={onReadMore}
          className="w-full mt-auto bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all group/btn flex items-center justify-center gap-2 border border-sky-100"
        >
          Read Full Update 
          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const TipCard: React.FC<{ tip: HealthTip; index: number }> = ({ tip, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex gap-6 items-start p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-[100px] border border-white/60 shadow-sm transition-all hover:bg-white/60 hover:shadow-xl hover:shadow-sky-100/50 text-left"
  >
    <div className="bg-sky-50 p-4 rounded-2xl shadow-sm text-sky-600 ring-1 ring-sky-100 shrink-0">
      <Heart className="w-6 h-6 fill-sky-600/20" />
    </div>
    <div>
      <h4 className="font-bold text-slate-900 mb-1">{tip.title}</h4>
      <p className="text-sm text-slate-500 mb-2 leading-relaxed">{tip.description}</p>
      <div className="inline-flex items-center gap-2 text-[10px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-tighter border border-sky-100">
        <Sparkles className="w-3 h-3" />
        Benefit: {tip.benefit}
      </div>
    </div>
  </motion.div>
);

const ServiceCard: React.FC<{ icon: any; title: string; description: string; delay: number }> = ({ icon: Icon, title, description, delay }) => (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="p-8 bg-white/40 backdrop-blur-[100px] border border-white/60 rounded-[2.5rem] hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 group text-left"
  >
    <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-500 border border-sky-100">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 group-hover:text-sky-600 transition-colors uppercase tracking-widest">
      Details <Plus className="w-3 h-3" />
    </div>
  </motion.div>
);

const Hero: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [news, setNews] = useState<HealthNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<HealthNews | null>(null);

  useEffect(() => {
    (window as any).openBookingModal = onBookClick;
    return () => { delete (window as any).openBookingModal; };
  }, [onBookClick]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tipsData, newsData] = await Promise.all([
          fetchHealthTips(),
          fetchHealthNews()
        ]);
        setTips(tipsData);
        setNews(newsData);
      } catch (error) {
        console.error("Failed to load health insights:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center pt-24 overflow-hidden bg-transparent">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0 text-left">
          <ErrorBoundary fallback={
            <div className="w-full h-full bg-slate-50 flex items-center justify-center">
              <div className="text-center p-8">
                <Hospital className="w-12 h-12 text-sky-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Medical Centre Portal</p>
              </div>
            </div>
          }>
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-transparent animate-pulse">
                <div className="text-sky-600 font-bold uppercase tracking-widest text-sm">Initializing 3D Environment...</div>
              </div>
            }>
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Spline 
                  scene="https://prod.spline.design/MPahsWaY76fSaIYP/scene.splinecode" 
                />
              </div>
            </Suspense>
          </ErrorBoundary>
          {/* Subtle Overlay to ensure text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 via-transparent to-transparent pointer-events-none"></div>
        </div>

        <div className="absolute bottom-24 left-10 z-10 w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onBookClick}
                className="text-white font-medium text-xs uppercase tracking-[0.4em] flex items-center gap-4 group transition-all"
              >
                <span className="relative pb-2">
                  Book Appointment
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 group-hover:bg-sky-400 group-hover:w-full transition-all duration-500 origin-left"></span>
                  <span className="block h-[1px] bg-white w-1/3 group-hover:w-full transition-all duration-700"></span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500 text-sky-400" />
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-10 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pointer-events-none"
        >
          <div className="w-8 h-[1px] bg-sky-600/40"></div>
          Scroll to explore
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-10 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-sky-600 font-bold tracking-widest uppercase text-xs mb-3">
                <Stethoscope className="w-4 h-4" />
                Comprehensive Medical Care
              </div>
              <h2 className="font-display text-4xl font-semibold text-slate-900 tracking-tight">Elite healthcare for all your <span className="text-sky-600 italic">family needs.</span></h2>
            </div>
            <p className="text-slate-500 text-base max-w-sm leading-relaxed">
              From specialized maternity support to advanced laboratory diagnostics, our expert team is here 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={Stethoscope}
              title="General Medicine"
              description="Primary care consultations, chronic disease management, and preventive health screenings for children and adults."
              delay={0.1}
            />
            <ServiceCard 
              icon={Baby}
              title="Maternity Excellence"
              description="Full-spectrum prenatal support, safe delivery services, and comprehensive postnatal care for mother and baby."
              delay={0.2}
            />
            <ServiceCard 
              icon={Microscope}
              title="Advanced Labs"
              description="State-of-the-art diagnostic laboratory offering blood tests, malaria screenings, and specialized medical diagnostics."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-transparent text-slate-900 rounded-[4rem] mx-4 my-20 border border-white/60 backdrop-blur-[2px] bg-white/10 shadow-sky-100/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="text-left">
              <h2 className="font-display text-4xl font-semibold mb-8">The Biney Standard: <br/> Professionalism <span className="text-sky-600 italic">delivered.</span></h2>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "NHIS Accredited", desc: "Seamless national insurance integration for stress-free billing." },
                  { icon: Clock, title: "24/7 Emergency", desc: "Round-the-clock emergency care and pharmacy services for all patients." },
                  { icon: Users, title: "Patient-First Culture", desc: "Focused on compassionate communication and community well-being." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-white/40 backdrop-blur-[100px] border border-white/60 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <item.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="h-64 bg-white/40 rounded-3xl overflow-hidden shadow-2xl border border-white/60 backdrop-blur-sm">
                  <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=600" className="w-full h-full object-cover" />
                </div>
                <div className="p-8 bg-sky-600 shadow-2xl shadow-sky-200 text-white rounded-3xl text-left border border-white/20 backdrop-blur-md">
                  <span className="text-4xl font-black italic">14+</span>
                  <p className="text-xs uppercase font-bold tracking-widest mt-2 opacity-80 text-sky-100">Years Excellence</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-8 bg-white/40 backdrop-blur-[100px] text-slate-900 rounded-3xl text-left shadow-xl border border-white/60">
                  <span className="text-4xl font-black italic text-sky-600">100%</span>
                  <p className="text-xs uppercase font-bold tracking-widest mt-2 text-slate-400">Trusted Care</p>
                </div>
                <div className="h-80 bg-white/40 rounded-3xl overflow-hidden shadow-2xl border border-white/60 backdrop-blur-sm">
                  <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400&h=800" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-10 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 text-sky-600 font-bold tracking-widest uppercase text-xs mb-4">
              <Users className="w-4 h-4" />
              Patient Experiences
            </div>
            <h2 className="font-display text-4xl font-semibold text-slate-900 tracking-tight">Trusted by the residents <br/> of <span className="text-sky-600 italic">Italian Flats, Tema.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "Biney Medical Centre has been our family hospital for 5 years. Their maternity care is handled with so much love.", author: "Mary A.", role: "Maternity Patient" },
              { text: "The diagnostic lab is fast and efficient. Most professional medical laboratory in this area.", author: "John K.", role: "Resident" },
              { text: "Compassionate doctors who truly listen to your concerns. Highly recommended for general medicine.", author: "Grace T.", role: "NHIS Member" }
            ].map((t, i) => (
              <div key={i} className="p-10 bg-white/40 backdrop-blur-[100px] rounded-[3rem] text-left relative group hover:bg-white transition-all duration-500 border border-white/60 shadow-sm hover:shadow-xl hover:shadow-sky-100/50">
                <Quote className="absolute top-10 right-10 w-10 h-10 text-sky-100 group-hover:text-sky-600/10 transition-colors" />
                <p className="text-slate-600 italic text-lg leading-relaxed mb-8 relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-50 p-2 rounded-full flex items-center justify-center text-sky-600 font-bold shadow-sm ring-1 ring-sky-100">
                    {t.author[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{t.author}</h5>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tips */}
      <section className="py-24 bg-transparent text-left">
        <div className="max-w-7xl mx-auto px-10 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
            <div>
              <div className="inline-flex items-center gap-2 text-sky-600 font-bold tracking-widest uppercase text-xs mb-3">
                <Activity className="w-4 h-4" />
                Expert Wellness Guidance
              </div>
              <h2 className="font-display text-4xl font-semibold text-slate-900 tracking-tight">Wellness Tips & <span className="text-sky-600 italic">Daily Health.</span></h2>
            </div>
            <p className="text-slate-500 text-sm max-w-md italic leading-relaxed">
              Curated healthcare insights focused on preventive well-being and community health improvement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-white animate-pulse rounded-[2.5rem] border border-slate-100"></div>
              ))
            ) : (
              tips.map((tip, index) => (
                <TipCard key={index} tip={tip} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Medical News */}
      <section className="py-24 bg-transparent pb-32">
        <div className="max-w-7xl mx-auto px-10 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 text-sky-600 font-bold tracking-widest uppercase text-xs mb-4">
              <Newspaper className="w-4 h-4" />
              Latest Health Trends
            </div>
            <h2 className="font-display text-4xl font-semibold text-slate-900 tracking-tight mb-4">Clinical Intelligence & <span className="text-sky-600 italic">Updates.</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto mb-8">
              Stay ahead with the latest clinical development, medical research, and global health announcements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-white animate-pulse rounded-3xl border border-slate-100"></div>
              ))
            ) : (
              news.map((item, index) => (
                <NewsCard key={index} news={item} onReadMore={() => setSelectedNews(item)} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Final CTA Bar */}
      <div className="max-w-7xl mx-auto px-10 -mt-20 mb-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-sky-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl shadow-sky-100"
        >
          <div className="text-left">
            <h3 className="font-display text-3xl font-semibold mb-4 leading-tight">Experience the <br/> Biney Standard.</h3>
            <p className="text-sky-100/80 max-w-md">Schedule your clinical consultation today and join our community of healthy families.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button 
              onClick={onBookClick}
              className="bg-white text-sky-600 px-10 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-sky-50 transition-all shadow-xl"
            >
              Book Now
            </button>
                  <a href="tel:+233303204368" className="flex items-center justify-center gap-3 bg-sky-700/60 backdrop-blur-xl px-10 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-sky-700 transition-all border border-white/20">
              <PhoneCall className="w-5 h-5" /> Emergency
            </a>
          </div>
        </motion.div>

        {/* Location Info Footer Strip */}
        <div className="flex flex-wrap justify-center gap-12 mt-12 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] opacity-60">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Italian Flats, Tema</div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Open 24/7 for Emergencies</div>
          <div className="flex items-center gap-2"><Hospital className="w-4 h-4" /> NHIS Accredited</div>
        </div>
      </div>

      <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
};

export default Hero;
