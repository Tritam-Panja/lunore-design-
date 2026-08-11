import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useLenis } from './SmoothScroll';

interface NavItem {
  label: string;
  to: string;
  hash?: string;
  sublabel?: string;
}

const navLinks: NavItem[] = [
  { label: 'HOME', to: '/', hash: '#hero', sublabel: 'LUNORE Entrance' },
  { label: 'ABOUT US', to: '/about', hash: '#about', sublabel: 'Legacy & Philosophy' },
  { label: 'SERVICES', to: '/interior-design', hash: '#services', sublabel: 'Turnkey & Monoliths' },
  { label: 'COLLECTION', to: '/products', hash: '#projects', sublabel: 'Signature Sculptures' },
  { label: 'PROJECTS', to: '/dream-project', sublabel: 'Visionary Concepts' },
  { label: 'PROCESS', to: '/process', hash: '#process', sublabel: 'Master Craftsmanship' },
  { label: 'EXHIBITIONS', to: '/exhibitions', sublabel: 'Gallery & Showcase' },
  { label: 'CONTACT US', to: '/contact', hash: '#contact', sublabel: 'Studio Consultations' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollTo } = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Track scroll position for header blur backdrop
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close overlay on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavItem) => {
    setMenuOpen(false);
    if (location.pathname === '/' && link.hash) {
      const targetEl = document.querySelector(link.hash);
      if (targetEl) {
        e.preventDefault();
        scrollTo(targetEl as HTMLElement);
        return;
      }
    } else if (location.pathname !== '/' && link.hash) {
      e.preventDefault();
      navigate(`/${link.hash}`);
    }
  };

  const headerBg = scrolled
    ? 'bg-[#0d0e0e]/85 backdrop-blur-xl shadow-2xl shadow-black/60 border-b border-[rgba(184,154,98,0.16)]'
    : 'bg-transparent border-b border-transparent';

  const headerHeight = scrolled ? 'h-16 md:h-18' : 'h-20 md:h-24';

  return (
    <>
      {/* UNIVERSAL HEADER */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${headerBg}`}>
        <div className={`w-full max-w-none px-6 md:px-12 transition-all duration-500 ease-out ${headerHeight}`}>
          <div className="flex items-center justify-between h-full">
            {/* Logo on Left */}
            <div className={scrolled ? 'scale-90 origin-left transition-transform duration-500' : 'scale-100 transition-transform duration-500'}>
              <NavLink to="/" onClick={(e) => handleLinkClick(e, { label: 'HOME', to: '/', hash: '#hero' })}>
                <Logo />
              </NavLink>
            </div>

            {/* Universal Right Action Cluster (Universal Hamburger Trigger) */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Refined Universal Hamburger Trigger (All Breakpoints) */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label="Toggle Navigation Menu"
                className="group relative inline-flex items-center gap-3 px-3.5 py-2 rounded-full border border-[rgba(184,154,98,0.25)] bg-[#181917]/80 backdrop-blur-md text-[#f1eee7] hover:border-[#b89a62] hover:text-[#b89a62] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#b89a62]/50"
              >
                <span className="text-[10px] tracking-[0.25em] uppercase font-light pl-1 hidden xs:inline-block">
                  {menuOpen ? 'CLOSE' : 'MENU'}
                </span>

                {/* Minimal Animated Hamburger / X Transformation */}
                <div className="relative w-4 h-3.5 flex flex-col justify-between items-center overflow-hidden">
                  <span
                    className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-out origin-center ${
                      menuOpen ? 'translate-y-[6px] rotate-45 text-[#b89a62]' : ''
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-200 ease-out ${
                      menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-out origin-center ${
                      menuOpen ? '-translate-y-[6px] -rotate-45 text-[#b89a62]' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN OVERLAY NAVIGATION (ALL SCREEN SIZES) */}
      <div
        className={`fixed inset-0 z-40 bg-[#0d0e0e]/98 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-y-auto ${
          menuOpen
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-105'
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b89a62]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="min-h-screen max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-16 flex flex-col justify-between relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start my-auto">
            {/* Left Brand Identity & Atmosphere Info (Desktop) */}
            <div className="lg:col-span-5 hidden lg:flex flex-col justify-between h-full border-r border-[rgba(184,154,98,0.16)] pr-12">
              <div>
                <p className="text-xs tracking-[0.35em] uppercase text-[#b89a62] mb-4 font-light">
                  Luxe Decor Studio
                </p>
                <h2 className="text-4xl xl:text-5xl font-light leading-tight text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
                  Architectural Elegance &amp; Fine Stone Sculpture
                </h2>
                <p className="mt-6 text-sm text-[#b9b5ae] font-light leading-relaxed max-w-sm">
                  Blending modern luxury interior design with rare imported monoliths, creating enduring legacy for bespoke spaces.
                </p>
              </div>

              <div className="pt-12">
                <div className="pt-6 border-t border-[rgba(184,154,98,0.15)] text-xs text-[#85817a]">
                  <p>Mumbai, India</p>
                  <p className="mt-1">+91 97697 08628</p>
                </div>
              </div>
            </div>

            {/* Right Large Editorial Navigation Items */}
            <div className="lg:col-span-7 flex flex-col space-y-3 lg:pl-8">
              {navLinks.map((link, index) => (
                <div
                  key={link.label}
                  className={`group transition-all duration-700 ease-out transform ${
                    menuOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: `${menuOpen ? 150 + index * 50 : 0}ms` }}
                >
                  <a
                    href={link.hash || link.to}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="flex items-center justify-between py-2.5 border-b border-[rgba(184,154,98,0.12)] group-hover:border-[#b89a62]/60 transition-colors"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs tracking-[0.2em] text-[#b89a62] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                        0{index + 1}
                      </span>
                      <span
                        className="text-2xl sm:text-4xl xl:text-5xl font-light tracking-[0.08em] text-[#f1eee7] group-hover:text-[#b89a62] group-hover:translate-x-3 transition-all duration-500 ease-out"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {link.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] tracking-[0.2em] uppercase text-[#85817a] group-hover:text-[#b9b5ae] transition-colors hidden sm:inline-block">
                        {link.sublabel}
                      </span>
                      <ArrowRight className="w-5 h-5 text-[#b89a62] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Footer inside menu for mobile/tablet */}
          <div className="lg:hidden pt-8 border-t border-[rgba(184,154,98,0.16)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-[#85817a]">
              © {new Date().getFullYear()} LUNORE Luxe Decor Studio
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
