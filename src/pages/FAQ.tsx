import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: "Is Biney Medical Centre NHIS-accredited?",
    answer: "Yes, Biney Medical Centre is fully accredited by the National Health Insurance Scheme (NHIS).",
  },
  {
    question: "What are your opening hours?",
    answer: "Our maternity and emergency services are open 24/7. General consultations and pharmacy services are available daily.",
  },
  {
    question: "Where is the centre located?",
    answer: "We are located at Italian Flats, Community 2, Tema, Ghana. Our landmark is the famous Italian Flats residents area.",
  },
  {
    question: "Do I need to book an appointment?",
    answer: "While we accept walk-ins for general consultations, appointments are encouraged for specialty services to minimize waiting times.",
  },
  {
    question: "Does the centre provide surgical services?",
    answer: "We provide minor surgical procedures, wound dressing, and diagnostic biopsies. For major surgeries, we stabilize and refer patients to specialized surgical centres.",
  },
  {
    question: "Are laboratory services available on weekends?",
    answer: "Yes, our laboratory services are available 24/7 to support our maternity and emergency departments every day of the week.",
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-transparent pt-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4">Common Questions</h2>
          <h3 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h3>
          <p className="text-slate-500 leading-relaxed italic">Everything you need to know about visiting Biney Medical Centre.</p>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-white/40 backdrop-blur-[100px] rounded-2xl overflow-hidden border border-white/60 shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-lg font-bold text-slate-900 pr-4 tracking-tight">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-sky-600 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
           <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-4">Still have questions?</p>
           <a href="/contact" className="text-sky-600 font-bold text-lg hover:underline transition-all">Contact our help desk →</a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
