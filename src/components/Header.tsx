import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { useLenis, useScrollSubscriber, scrollCoordinator } from './SmoothScroll';
import FlowingMenu, { type FlowingMenuItem } from './FlowingMenu';

interface NavItem {
  label: string;
  to: string;
  sublabel?: string;
}

interface ServiceSubItem {
  name: string;
  sub: string;
  to: string;
}

const navLinks: NavItem[] = [
  { label: 'PROJECTS', to: '/projects', sublabel: 'Visionary Works' },
  { label: 'SERVICES', to: '/#interior-experience', sublabel: 'Turnkey & Stone' },
  { label: 'ABOUT', to: '/brand-story', sublabel: 'The Space For You' },
  { label: 'CONTACT', to: '/contact', sublabel: 'Start a Project' },
  { label: 'CAREERS', to: '/careers', sublabel: 'Join The Studio' },
];


const flowingMenuItems: FlowingMenuItem[] = [
  {
    text: 'PROJECTS',
    link: '/projects',
    image: '/assets/THE SKYLINE RESIDENCE/1.webp',
  },
  {
    text: 'SERVICES',
    link: '/the-engawa-line',
    image: '/assets/Marbles/Avocado Green.webp',
  },
  {
    text: 'ABOUT',
    link: '/brand-story',
    image: '/assets/images/hero.webp',
  },
  {
    text: 'CONTACT',
    link: '/contact',
    image: '/assets/images/imagetrail1.webp',
  },
  {
    text: 'CAREERS',
    link: '/careers',
    image: '/assets/images/carrousel 1 (1).webp',
  }
];

const serviceSubItems: ServiceSubItem[] = [
  { name: 'Interior', sub: 'Turnkey Architecture', to: '/the-engawa-line' },
  { name: 'Marble', sub: 'Rare Stone Monoliths', to: '/marble-stack' },
  { name: 'Sculptures', sub: 'Monumental Art', to: '/sculptures-carousel' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lenis } = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [inFooter, setInFooter] = useState(false);

  const isHome = location.pathname === '/';

  // Detect footer visibility on mobile with high-performance IntersectionObserver (no layout reflows)
  useEffect(() => {
    const checkFooter = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setInFooter(false);
        return;
      }
      const footerEl = document.getElementById('site-footer') || document.querySelector('footer');
      if (!footerEl) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setInFooter(entry.isIntersecting);
        },
        { rootMargin: '0px 0px -25% 0px' }
      );

      observer.observe(footerEl);
      return observer;
    };

    const observer = checkFooter();
    return () => observer?.disconnect();
  }, [location.pathname]);

  const scrolledRef = useRef(false);

  // Track scroll position: hide on first section (hero), show on content
  // Single-source subscription (Lenis on desktop, passive RAF on mobile - zero duplicate listeners)
  useScrollSubscriber(
    (scrollY) => {
      const threshold = isHome ? Math.min(300, scrollCoordinator.getViewportHeight() * 0.45) : 40;
      const isScrolled = scrollY > threshold;
      if (scrolledRef.current !== isScrolled) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    },
    [isHome]
  );

  // Close overlay on route change
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  // Reset dropdown when menu closes
  useEffect(() => {
    if (!menuOpen) {
      setServicesOpen(false);
    }
  }, [menuOpen]);

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

  const handleServiceSubClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    document.body.style.overflow = '';
    setMenuOpen(false);
    setServicesOpen(false);
    if (location.pathname === to) {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(to);
    }
  };

    const handleFlowingItemClick = (item: FlowingMenuItem, _index: number, event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (item.text === 'SERVICES') {
      setServicesOpen((prev) => !prev);
      return;
    }
    if (item.link) {
      document.body.style.overflow = '';
      setMenuOpen(false);
      setServicesOpen(false);

      if (item.link.includes('#')) {
        const [path, hash] = item.link.split('#');
        const targetPath = path || '/';
        if (location.pathname === targetPath) {
          const el = document.getElementById(hash);
          if (el) {
            if (lenis) {
              lenis.scrollTo(el, { offset: 0, duration: 1.2 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
          window.history.replaceState(null, '', `/#${hash}`);
        } else {
          navigate(`/#${hash}`);
        }
        return;
      }

      if (location.pathname === item.link) {
        if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigate(item.link);
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavItem) => {
    document.body.style.overflow = '';
    setMenuOpen(false);
    setServicesOpen(false);

    if (link.to) {
      e.preventDefault();
      if (link.to.includes('#')) {
        const [path, hash] = link.to.split('#');
        const targetPath = path || '/';
        if (location.pathname === targetPath) {
          const el = document.getElementById(hash);
          if (el) {
            if (lenis) {
              lenis.scrollTo(el, { offset: 0, duration: 1.2 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
          window.history.replaceState(null, '', `/#${hash}`);
        } else {
          navigate(`/#${hash}`);
        }
        return;
      }

      if (location.pathname === link.to) {
        if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigate(link.to);
      }
    }
  };

  const isHeaderVisible = ((!isHome || scrolled) && !inFooter) || menuOpen;

  return (
    <>
      {/* MINIMAL TOP BAR: APPEARS WHEN SCROLLED PAST HERO */}
      <header
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-14 pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-3 sm:py-5 md:py-8 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          isHeaderVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-8'
        }`}
      >
        {/* Brand / Logo in Top Left Corner */}
        <div className="pointer-events-auto">
          <NavLink
            to="/"
            onClick={(e) => handleLinkClick(e, { label: 'HOME', to: '/' })}
            className="flex flex-col group cursor-pointer select-none py-1"
            aria-label="LUNORE Luxe Decor Studio"
          >
            <span className="font-[var(--font-heading)] text-lg sm:text-2xl md:text-3xl tracking-[0.2em] sm:tracking-[0.28em] uppercase text-[#f1eee7] font-semibold group-hover:text-white transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] leading-none">
              LU<span className="text-[#b89a62]">N</span>ORE
            </span>
            <span className="text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.24em] sm:tracking-[0.34em] uppercase text-[#b89a62] font-light mt-1 group-hover:text-[#c4a86f] transition-colors leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
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
            className="w-12 h-12 rounded-full flex items-center justify-center text-[#f1eee7] hover:text-white cursor-pointer group focus:outline-none focus:ring-1 focus:ring-[#b89a62]/50 liquid-glass-menu-btn"
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

      {/* FULL-SCREEN FLOWING MENU OVERLAY DRAWER */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0d0e0e]/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden transform-gpu opacity-100 pointer-events-auto"
          aria-hidden={false}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_top_right,rgba(184,154,98,0.12)_0%,transparent_70%)] pointer-events-none" />

          <div className="h-[100dvh] w-full flex flex-col justify-between relative z-10 pt-[max(4.5rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+1rem))]">
            {/* The Full Screen Flowing Menu taking the main viewport area */}
            <div className="flex-1 w-full flex flex-col justify-center min-h-0">
              <div className="w-full h-full relative min-h-0">
                <FlowingMenu
                  items={flowingMenuItems}
                  speed={60}
                  stretch={0.6}
                  magnet={0.25}
                  followCursor={0.4}
                  textColor="#ffffff"
                  bgColor="transparent"
                  marqueeBgColor="#ffffff"
                  marqueeTextColor="#120F17"
                  direction="left"
                  duration={0.5}
                  bandInset={0}
                  bandRadius={0}
                  carryContent={false}
                  dividers
                  dimInactive={false}
                  align="center"
                  showIndex={false}
                  showArrow={false}
                  imageShape="pill"
                  intro
                  onItemClick={handleFlowingItemClick}
                />
              </div>
            </div>

            {/* Minimal Luxury Footer inside full screen menu */}
            <div className="px-6 sm:px-12 md:px-16 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#85817a]">
              <p className="text-[11px] sm:text-xs">
                © {new Date().getFullYear()} LUNORE Luxe Decor Studio
              </p>
              <div className="flex items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-[#85817a]">
                <span>Residential</span>
                <span>•</span>
                <span>Commercial</span>
                <span>•</span>
                <span>Hospitality</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

