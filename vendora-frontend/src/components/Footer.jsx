import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="font-black text-xl italic uppercase tracking-tighter">
            VEND<span className="text-orange-500">ORA</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Premium Shopping Experience</p>
        </div>

        <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
          <a href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</a>
        </div>

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          © {new Date().getFullYear()} Vendora Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
