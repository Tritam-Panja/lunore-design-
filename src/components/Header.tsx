import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { useLenis } from './SmoothScroll';

interface NavItem {
  label: string;
  to: string;
  hash?: string;
  sublabel?: string;
}

const navLinks: NavItem[] = [
  { label: 'PROJECTS', to: '/dream-project', hash: '#projects', sublabel: 'Visionary Works' },
  { label: 'STUDIO', to: '/about', hash: '#about', sublabel: 'Legacy & Philosophy' },
  { label: 'SERVICES', to: '/interior-design', hash: '#services', sublabel: 'Turnkey & Stone' },
  { label: 'PROCESS', to: '/process', hash: '#process', sublabel: 'Master Craftsmanship' },
  { label: 'COLLECTION', to: '/products', sublabel: 'Signature Sculptures' },
  { label: 'EXHIBITIONS', to: '/exhibitions', sublabel: 'Gallery & Showcase' },
  { label: 'ABOUT', to: '/brand-story', sublabel: 'The Space For You' },
  { label: 'CONTACT', to: '/contact', hash: '#contact', sublabel: 'Start a Project' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollTo } = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  // Track scroll position: hide on first section (hero), show once scrolled to second section
  useEffect(() => {
    const handleScroll = () => {
      // On home page, show header once user scrolls past the hero into the next section
      const threshold = isHome ? Math.min(300, window.innerHeight * 0.45) : 40;
      const isScrolled = window.scrollY > threshold;
      setScrolled(isScrolled);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

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

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const isHeaderVisible = !isHome || scrolled || menuOpen;

  return (
    <>
      {/* MINIMAL TOP BAR: APPEARS WHEN SCROLLED PAST HERO */}
      <header
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-14 py-4 sm:py-6 md:py-8 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHeaderVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-8'
        }`}
      >
        {/* Brand / Logo in Top Left Corner */}
        <div className="pointer-events-auto">
          <NavLink
            to="/"
            onClick={(e) => handleLinkClick(e, { label: 'HOME', to: '/', hash: '#hero' })}
            className="flex flex-col group cursor-pointer select-none"
            aria-label="LUNORE Luxe Decor Studio"
          >
            <span className="font-[var(--font-heading)] text-lg sm:text-2xl md:text-3xl tracking-[0.22em] sm:tracking-[0.28em] uppercase text-[#f1eee7] font-semibold group-hover:text-white transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] leading-none">
              LU<span className="text-[#b89a62]">N</span>ORE
            </span>
            <span className="text-[7.5px] sm:text-[9px] md:text-[10px] tracking-[0.28em] sm:tracking-[0.34em] uppercase text-[#b89a62] font-light mt-1 group-hover:text-[#c4a86f] transition-colors leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Luxe Decor Studio
            </span>
          </NavLink>
        </div>

        {/* Hamburger Menu Trigger in Top Right Corner */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[#f1eee7] hover:text-white cursor-pointer group focus:outline-none focus:ring-1 focus:ring-[#b89a62]/50 shadow-2xl backdrop-blur-xl bg-black/40 border border-white/15 hover:border-[#b89a62]/60 hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between items-center overflow-hidden">
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-out origin-center ${
                  menuOpen ? 'translate-y-[7px] rotate-45 text-[#b89a62]' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transition-all duration-200 ease-out ${
                  menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-out origin-center ${
                  menuOpen ? '-translate-y-[7px] -rotate-45 text-[#b89a62]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* FULL-SCREEN LIQUID GLASS OVERLAY DRAWER */}
      <div
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-y-auto ${
          menuOpen
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-105'
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#b89a62]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="min-h-screen max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16 flex flex-col justify-between relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start my-auto">
            {/* Left Brand Identity Card */}
            <div className="lg:col-span-5 hidden lg:flex flex-col justify-between h-full liquid-glass-card p-8 md:p-10 rounded-3xl">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#b89a62]" />
                  <p className="text-xs tracking-[0.35em] uppercase text-[#b89a62] font-light">
                    Luxe Decor Studio
                  </p>
                </div>
                <h2 className="text-3xl xl:text-4xl font-light leading-tight text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
                  Architectural Elegance &amp; Fine Stone Monoliths
                </h2>
                <p className="mt-6 text-sm text-[#b9b5ae] font-light leading-relaxed max-w-sm">
                  Spaces with character shaped by light, rare imported monoliths, and bespoke turnkey interior architecture.
                </p>
              </div>

              <div className="pt-10">
                <div className="pt-6 border-t border-white/10 text-xs text-[#85817a] space-y-2">
                  <div className="flex items-center gap-2 text-[#b9b5ae]">
                    <MapPin className="w-4 h-4 text-[#b89a62]" />
                    <span>Mumbai, India</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#b9b5ae]">
                    <Phone className="w-4 h-4 text-[#b89a62]" />
                    <span>+91 97697 08628</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#b9b5ae]">
                    <Mail className="w-4 h-4 text-[#b89a62]" />
                    <span>support@lunoreluxedecorstudio.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Large Liquid Glass Navigation Items */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              {navLinks.map((link, index) => (
                <div
                  key={link.label}
                  className={`group transition-all duration-700 ease-out transform ${
                    menuOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: `${menuOpen ? 120 + index * 45 : 0}ms` }}
                >
                  <a
                    href={link.hash || link.to}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="flex items-center justify-between p-4 md:py-3.5 md:px-6 rounded-2xl liquid-glass-pill border border-white/10 group-hover:border-[#b89a62]/50 group-hover:bg-white/[0.07] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs tracking-[0.2em] text-[#b89a62] font-mono opacity-70 group-hover:opacity-100 transition-opacity">
                        0{index + 1}
                      </span>
                      <span
                        className="text-xl sm:text-2xl xl:text-3xl font-light tracking-[0.08em] text-[#f1eee7] group-hover:text-white group-hover:translate-x-2 transition-all duration-300 ease-out"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {link.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] tracking-[0.2em] uppercase text-[#85817a] group-hover:text-[#b89a62] transition-colors hidden sm:inline-block">
                        {link.sublabel}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#b89a62] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Footer inside menu for mobile/tablet */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-[#85817a]">
              © {new Date().getFullYear()} LUNORE Luxe Decor Studio
            </p>
            <div className="flex items-center gap-4 text-xs text-[#85817a]">
              <span>Residential</span>
              <span>•</span>
              <span>Commercial</span>
              <span>•</span>
              <span>Hospitality</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

