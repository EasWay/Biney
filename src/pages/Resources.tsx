import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  ShieldPlus, 
  Search, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Heart,
  Stethoscope,
  Activity,
  Zap,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { healthResources } from '../data/healthResources';
import { searchHealth } from '../services/healthService';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ results: string; simpleResults: string | null; source: string } | null>(null);
  const [showClinical, setShowClinical] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { name: "Malaria", icon: Activity },
    { name: "Hypertension", icon: Heart },
    { name: "Diabetes", icon: Zap },
    { name: "ENT Care", icon: Stethoscope },
    { name: "Pregnancy", icon: ShieldPlus },
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setShowClinical(false); // Default to simple view
    try {
      const data = await searchHealth(searchQuery);
      setSearchResults(data);
    } catch (err) {
      setError("Unable to search health guidelines right now. Please try again later.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Quick category search
  const quickSearch = (term: string) => {
    setSearchQuery(term);
    // We'll trigger the search in an effect
  };

  useEffect(() => {
    if (searchQuery.length > 3 && !isSearching) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  return (
    <section id="health-resources" className="min-h-screen bg-slate-50/30 px-4 py-14 pt-28 sm:px-10 sm:py-24 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8 text-center sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            <BookOpen className="size-4" />
            Health Education Hub
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Health answers you can understand.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl text-sm text-slate-500 sm:text-base"
          >
            Search symptoms, conditions, or medications. We pull from Ministry of Health guidelines and break them down into plain language — so you know what to do next.
          </motion.p>
        </div>

        {/* Search Bar Section */}
        <div className="relative mx-auto mb-10 max-w-2xl">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              {isSearching ? (
                <Loader2 className="size-5 animate-spin text-primary" />
              ) : (
                <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              )}
            </div>
            <input
              type="text"
              placeholder="Search symptoms (e.g., 'fever', 'sore throat', 'hypertension')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-28 text-sm shadow-lg shadow-slate-200/40 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Quick Categories */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => quickSearch(cat.name)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <cat.icon className="size-3.5" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Content (Search Results or Featured) */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {searchResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-slate-900">Search Results</h2>
                      <p className="text-xs text-slate-500">Based on Ministry of Health Guidelines</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg bg-slate-100 p-1">
                        <button 
                          onClick={() => setShowClinical(false)}
                          className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${!showClinical ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                        >
                          Simple Breakdown
                        </button>
                        <button 
                          onClick={() => setShowClinical(true)}
                          className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${showClinical ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                        >
                          Clinical Guidelines
                        </button>
                      </div>
                      <button 
                        onClick={() => setSearchResults(null)}
                        className="ml-2 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>

                  {searchResults.results === "No specific local guidelines found for this query." ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100">
                        <AlertCircle className="size-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No specific results found</h3>
                      <p className="text-slate-500">Try searching for broader terms like 'fever', 'cough', or 'pregnancy'.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {showClinical ? (
                        // Technical Clinical View
                        searchResults.results.split('---').map((section, idx) => (
                          <div key={idx} className="group relative border-l-2 border-primary/20 pl-6 transition-all hover:border-primary">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 font-mono bg-slate-50/50 p-4 rounded-xl">
                              {section.trim()}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Simplified Patient View
                        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
                          {searchResults.simpleResults ? (
                            searchResults.simpleResults.split('\n').map((line, i) => {
                              const trimmedLine = line.trim();
                              if (!trimmedLine) return <br key={i} />;
                              
                              // Headings
                              if (trimmedLine.startsWith('#')) {
                                return (
                                  <h3 key={i} className="text-xl font-bold text-slate-900 mb-4 mt-6">
                                    {trimmedLine.replace(/^#+\s*/, '')}
                                  </h3>
                                );
                              }
                              
                              // Bold lists or key-value pairs
                              if (trimmedLine.startsWith('**') || trimmedLine.includes('**:')) {
                                const parts = trimmedLine.split(/[:：]/);
                                if (parts.length > 1) {
                                  return (
                                    <div key={i} className="mb-3">
                                      <span className="font-bold text-slate-900">{parts[0].replace(/\*\*/g, '').trim()}:</span>
                                      <span className="ml-2 text-slate-600">{parts.slice(1).join(':').trim()}</span>
                                    </div>
                                  );
                                }
                              }
                              
                              // Bullet points
                              if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                                return (
                                  <li key={i} className="text-slate-600 mb-2 list-none flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                                    <span>{trimmedLine.replace(/^[-*]\s*/, '').trim()}</span>
                                  </li>
                                );
                              }
                              
                              // Regular text
                              return <p key={i} className="text-slate-600 leading-relaxed mb-4">{trimmedLine}</p>;
                            })
                          ) : (
                            <div className="rounded-xl bg-slate-50 p-6 text-center italic text-slate-500">
                              No simplified breakdown available. Please check the "Clinical Guidelines" tab for full details.
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-10 rounded-2xl bg-slate-50 p-6 border border-slate-100">
                        <div className="flex items-start gap-4">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                            <ShieldPlus className="size-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Verified Health Information</h4>
                            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                              {searchResults.source}
                            </p>
                            <p className="mt-3 text-[10px] text-slate-400 font-medium italic">
                              Note: The "Simple Breakdown" is an AI-assisted summary of official MoH guidelines designed for clarity. Always consult our medical team for actual diagnosis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-slate-900">Common Conditions</h2>
                  <div className="grid gap-6">
                    {healthResources.map((item, index) => (
                      <motion.article
                        key={item.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-primary/30 hover:shadow-lg"
                      >
                        <div className="p-6 sm:p-8">
                          <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                                <Activity className="size-4" />
                                Community Health Note
                              </div>
                              <h3 className="font-display text-2xl font-bold text-slate-900">{item.title}</h3>
                            </div>
                            <Link to={item.link} className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-primary group-hover:text-white">
                              <ChevronRight className="size-5" />
                            </Link>
                          </div>

                          <p className="mb-6 text-slate-600 leading-relaxed">{item.summary}</p>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <CheckCircle2 className="size-4 text-green-500" />
                                Recommended Care
                              </h4>
                              <ul className="space-y-2">
                                {item.whatToDo.map((point, i) => (
                                  <li key={i} className="text-sm text-slate-500 leading-relaxed pl-1">{point}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-xl bg-rose-50 p-4 border border-rose-100">
                              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-900">
                                <AlertCircle className="size-4 text-rose-500" />
                                Warning Signs
                              </h4>
                              <p className="text-xs text-rose-700 leading-relaxed">{item.urgent}</p>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgent Care CTA */}
            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/20">
              <ShieldPlus className="mb-6 size-10 text-primary" />
              <h3 className="mb-3 font-display text-xl font-bold">When to come in urgently</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Breathing difficulty, chest pain, sudden weakness, heavy bleeding, or severe pain during pregnancy — don't wait. Come straight to Biney Medical Centre or call us immediately.
              </p>
              <Link
                to="/contact#appointment-request"
                className="group flex items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-white transition-all hover:bg-primary/90"
              >
                Request Appointment
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Services Quick Links */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <h3 className="mb-6 font-display text-xl font-bold text-slate-900">Our Services</h3>
              <div className="space-y-3">
                {[
                  { name: "General Medicine", link: "/services#general-services" },
                  { name: "ENT Specialist Care", link: "/services#ent-problems" },
                  { name: "Maternity & Delivery", link: "/services#pregnancy" },
                  { name: "Laboratory Testing", link: "/services#general-services" },
                ].map((service) => (
                  <Link
                    key={service.name}
                    to={service.link}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-all hover:border-primary/20 hover:bg-slate-50 group"
                  >
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{service.name}</span>
                    <ExternalLink className="size-4 text-slate-300 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Note */}
            <div className="rounded-3xl border border-slate-200 bg-primary/5 p-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Loader2 className="size-6 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-slate-900">Have a quick question?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Use the chat button in the corner to ask about symptoms, our hours, directions, or to book a visit — available around the clock.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Resources;
