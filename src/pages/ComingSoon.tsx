import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Compass, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#040810] text-[#f1eee7] flex flex-col justify-between overflow-hidden selection:bg-[#b89a62]/30 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(184,154,98,0.12)_0%,rgba(4,8,16,0)_70%)] pointer-events-none blur-2xl" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(4,8,16,0)_70%)] pointer-events-none blur-3xl" />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-8 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#b89a62]/50 text-[11px] uppercase tracking-[0.2em] text-[#b9b5ae] hover:text-white transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#b89a62]" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-3xl mx-auto">

        

        {/* Primary Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.18em] uppercase text-white mb-6 font-serif">
          Coming <span className="text-[#b89a62] italic font-normal">Soon</span>
        </h1>

        {/* Elegant Divider */}
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mb-8" />

        {/* Editorial Subtitle */}
        <p className="text-base sm:text-lg text-[#b9b5ae] font-light leading-relaxed max-w-xl mb-12">
          We are sculpting an extraordinary architectural chapter. This showcase is currently in progress and will be unveiled soon.
        </p>

        {/* Options to return to outer / other sections */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Option 1: Return to Home / Outer Section */}
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#b89a62] text-[#0d0e0e] font-medium text-xs uppercase tracking-[0.22em] hover:bg-[#cbb07a] transition-all duration-300 shadow-[0_10px_30px_rgba(184,154,98,0.25)] hover:shadow-[0_15px_40px_rgba(184,154,98,0.4)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          {/* Option 2: Explore Other Sections */}
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 hover:border-[#b89a62]/60 text-xs tracking-[0.22em] uppercase text-white hover:text-[#e6cb97] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#b89a62]" />
            <span>Explore Projects</span>
          </Link>
        </div>

        {/* Additional Outer Section Links */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-[#85817a]">
          <Link to="/products" className="hover:text-[#b89a62] transition-colors">
            Products
          </Link>
          <span className="text-white/20">•</span>
          <Link to="/interior-design" className="hover:text-[#b89a62] transition-colors">
            Interior Design
          </Link>
          <span className="text-white/20">•</span>
          <Link to="/brand-story" className="hover:text-[#b89a62] transition-colors">
            Brand Story
          </Link>
          <span className="text-white/20">•</span>
          <Link to="/contact" className="hover:text-[#b89a62] transition-colors">
            Contact
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full px-6 py-6 text-center border-t border-white/5">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#68655e]">
          &copy; {new Date().getFullYear()} Lunore Luxe Decor Studio &bull; All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

export default ComingSoon;
