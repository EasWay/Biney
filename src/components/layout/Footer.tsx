const Footer = () => {
  return (
    <footer className="bg-transparent text-slate-400 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-3 gap-16">
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-sky-600 font-bold mb-6">Visit Our Centre</h4>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Italian Flats, Community 2,<br />
            Tema, Greater Accra, Ghana
          </p>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-white border border-slate-200 p-1 shadow-sm flex items-center justify-center text-[8px] text-sky-600 font-bold">BINEY</div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Est. Quality Care</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-sky-600 font-bold mb-6">Operating Hours</h4>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-slate-500">Main Facility</span>
            <span className="text-slate-900 font-mono text-xs text-right font-bold">Open 24/7</span>
            <span className="text-slate-500">Emergency</span>
            <span className="text-sky-600 font-mono text-xs text-right italic font-bold">Always On Call</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-sky-600 font-bold mb-6">Clinical Staff</h4>
          <div className="flex items-center gap-4 p-6 bg-white/40 backdrop-blur-[100px] rounded-[2rem] border border-white/60 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-sky-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sm font-bold text-sky-600 shadow-sm ring-1 ring-sky-50 relative z-10">AB</div>
            <div className="relative z-10">
              <p className="text-sm font-bold leading-tight text-slate-900">Dr. Alexander Biney</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1 tracking-wider">Medical Director</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-10 pt-10 mt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
        <p>© {new Date().getFullYear()} Biney Medical Centre.</p>
        <div className="flex gap-8 text-neutral-500">
          <a href="#" className="hover:text-sky-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-sky-600 transition-colors">Compliance</a>
          <a href="#" className="hover:text-sky-600 transition-colors">NHIS Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
