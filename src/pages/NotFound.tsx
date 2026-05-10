import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white font-manrope flex flex-col md:flex-row items-end overflow-hidden">

      {/* Character image — slides up from the bottom edge */}
      <div className="w-full md:w-[46%] flex items-end justify-center md:justify-end overflow-hidden shrink-0">
        <motion.img
          src="/404.webp"
          alt=""
          aria-hidden="true"
          className="w-[72%] max-w-[320px] md:w-full md:max-w-[480px] object-contain select-none"
          initial={{ y: '45%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </div>

      {/* Text — right side, vertically centered */}
      <motion.div
        className="w-full md:w-[54%] flex flex-col justify-center px-8 pb-20 pt-6 md:pb-32 md:pl-10 md:pr-16 text-center md:text-left"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
      >
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-slate-400">
          404
        </p>

        <h1 className="mb-8 font-display text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-[3.4rem]">
          We can't find what<br className="hidden sm:block" /> you're looking for.
        </h1>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline transition-colors md:self-start mx-auto md:mx-0"
        >
          ← Back to home
        </Link>
      </motion.div>

    </div>
  );
};

export default NotFound;
