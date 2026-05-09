import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { BINEY } from '../data/biney';

const FAQS = [
  {
    question: `Where are we located?`,
    answer: `We are at ${BINEY.address}.`,
  },
  {
    question: 'How can patients call us?',
    answer: BINEY.phoneNumbers.map((phone) => phone.label).join(' / '),
  },
  {
    question: 'What kind of facility are we?',
    answer: `We are a ${BINEY.facilityType.toLowerCase()} serving Tema and nearby communities.`,
  },
  {
    question: 'What care areas do we highlight?',
    answer: BINEY.listedServices.join(', '),
  },
  {
    question: 'What insurance do we support?',
    answer: BINEY.acceptedInsurance.join(' and '),
  },
  {
    question: 'Can the final website include real staff profiles?',
    answer: `Yes. This prototype uses doctor SVG placeholders, and the final website can include approved doctor, nurse, and administration profiles from ${BINEY.name}.`,
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="common-questions" className="bg-transparent px-10 py-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Common Questions</h2>
          <h3 className="mb-6 text-4xl font-bold tracking-tight text-slate-900">Answers patients need before visiting</h3>
          <p className="leading-relaxed text-slate-500 italic">Clear questions, direct answers, and fewer phone calls for the front desk.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div key={faq.question} className="overflow-hidden rounded-2xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-xl">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-50/50"
              >
                <span className="pr-4 text-lg font-bold tracking-tight text-slate-900">{faq.question}</span>
                <ChevronDown className={`size-5 text-primary transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
