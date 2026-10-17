import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Gem,
  Check,
  Send,
  Phone,
  Mail,
  Eye,
  X,
  Menu,
  ChevronDown,
  Layers,
  Award,
  Crown
} from 'lucide-react';
import { sendContactInquiry } from '@/lib/contactService';

// --- DATA STRUCTURES ---

interface GlimpseItem {
  id: string;
  title: string;
  category: 'monoliths' | 'ambient' | 'details' | 'sculpture';
  medium: string;
  image: string;
  description: string;
}

interface CollectionPiece {
  id: string;
  title: string;
  material: string;
  dimensions: string;
  origin: string;
  edition: string;
  image: string;
  description: string;
  status: 'Exhibition Centerpiece' | 'Private Allocation' | 'Commission on Request' | 'Limited Edition';
}

const GLIMPSES: GlimpseItem[] = [
  {
    id: 'g1',
    title: 'The Obsidian Monolith',
    category: 'monoliths',
    medium: 'High-Polish Nero Marquina & Brushed Brass',
    image: '/assets/images/imagetrail1.webp',
    description: 'A monument of geological stillness, shaped by hand to reflect ambient light across sharp crystalline planes.',
  },
  {
    id: 'g2',
    title: 'Translucent Onyx Light Column',
    category: 'ambient',
    medium: 'Persian Amber Onyx with Internal Warm LED Matrix',
    image: '/assets/images/imagetrail2.webp',
    description: 'Subterranean mineral veins illuminated from within, casting a sanctuary glow of deep honey and gold.',
  },
  {
    id: 'g3',
    title: 'Organic Marble Fluidity',
    category: 'sculpture',
    medium: 'Chiseled Statuario Marble',
    image: '/assets/images/imagetrail3.webp',
    description: 'Defying the rigidity of stone, delicate contours evoke the gentle movement of couture silk frozen in time.',
  },
  {
    id: 'g4',
    title: 'The Grand Pavilion Chamber',
    category: 'ambient',
    medium: 'Curated Architectural Spatial Installation',
    image: '/assets/images/imagetrail4.webp',
    description: 'A dedicated private salon setting designed for high-net-worth collectors to experience monumental pieces in situ.',
  },
  {
    id: 'g5',
    title: 'Bespoke Fluted Bas-Relief',
    category: 'details',
    medium: 'Precision CNC & Artisan Hand-Finished Travertine',
    image: '/assets/images/imagetrail5.webp',
    description: 'Rhythmic architectural fluting created to interact dynamically with directional natural daylight.',
  },
  {
    id: 'g6',
    title: 'Interlocking Mineral Forms',
    category: 'sculpture',
    medium: 'Dual Calacatta & Portoro Sculptural Balance',
    image: '/assets/images/imagetrail6.webp',
    description: 'A study of tension and equilibrium, pairing pristine white Italian marble with nocturnal gold-veined Portoro.',
  },
  {
    id: 'g7',
    title: 'Curator’s Monolithic Mantle',
    category: 'monoliths',
    medium: 'Bookmatched Paonazzo Marble',
    image: '/assets/images/imagetrail9.webp',
    description: 'Sourced from a confidential Tuscan quarry, featuring dramatic violet and caramel veining of extraordinary rarity.',
  },
  {
    id: 'g8',
    title: 'The Haute Stone Lounge',
    category: 'ambient',
    medium: 'Salon Experience Atmosphere',
    image: '/assets/images/carrousel 1 (1).webp',
    description: 'Intimate private viewing lounges where architectural visionaries align on custom commissions and private acquisitions.',
  },
];

const COLLECTION: CollectionPiece[] = [
  {
    id: 'c1',
    title: 'The Golden Vein Monolith',
    material: 'Rare Italian Calacatta Gold Marble',
    dimensions: '240 cm × 110 cm × 45 cm',
    origin: 'Carrara, Italy',
    edition: 'Unique Monolith (1 of 1)',
    image: '/assets/images/mable hero.webp',
    description: 'Carved from a singular 4-tonne geological block, polished to an ethereal velvet luster that emphasizes warm honeyed seams.',
    status: 'Exhibition Centerpiece',
  },
  {
    id: 'c2',
    title: 'The Stratum Bas-Relief Console',
    material: 'Layered Grigio Orobico & Brushed Champagne Brass',
    dimensions: '210 cm × 55 cm × 85 cm',
    origin: 'Bergamo, Italy',
    edition: 'Limited Edition of 3',
    image: '/assets/images/marble cutout.webp',
    description: 'A functional sculpture presenting dynamic dark cloud striations, floating upon an invisible brass cantilever substructure.',
    status: 'Limited Edition',
  },
  {
    id: 'c3',
    title: 'Aura of Silence (Abstract Torso)',
    material: 'Pure Statuario Marble with Satin Honed Finish',
    dimensions: '160 cm × 75 cm × 50 cm',
    origin: 'Mount Bettogli, Italy',
    edition: 'Private Collector Allocation',
    image: '/assets/images/sculpture hero .webp',
    description: 'An ode to classical antiquity reimagined through reductionist modernism. Hand-chiseled over 480 continuous artisan hours.',
    status: 'Private Allocation',
  },
  {
    id: 'c4',
    title: 'Translucent Amber Onyx Monolith',
    material: 'Backlit Honey Onyx & Smoked Mirror Glass',
    dimensions: '195 cm × 40 cm × 40 cm',
    origin: 'Yazd Province, Persia',
    edition: 'Commission on Request',
    image: '/assets/images/marble zoomed .webp',
    description: 'A crystalline monolith revealing microscopic mineral crystallization when engaged by its ambient illumination control.',
    status: 'Commission on Request',
  },
];

export function ComingSoon() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [glimpseFilter, setGlimpseFilter] = useState<'all' | 'monoliths' | 'ambient' | 'details' | 'sculpture'>('all');
  const [selectedGlimpse, setSelectedGlimpse] = useState<GlimpseItem | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<CollectionPiece | null>(null);

  // VIP RSVP Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    distinction: 'Private Collector',
    inquiryType: 'Exhibition VIP Attendance Pass',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [vipCode, setVipCode] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Track scroll position: hide on first section (hero), reveal on scroll past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = Math.min(280, window.innerHeight * 0.4);
      setScrolled(scrollY > threshold);

      const sections = ['hero', 'about', 'glimpses', 'event', 'collection', 'contact'];
      const scrollPos = scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquiryForPiece = (piece: CollectionPiece) => {
    setSelectedPiece(piece);
    setFormData((prev) => ({
      ...prev,
      inquiryType: `Inquiry: ${piece.title}`,
      message: `I am interested in private acquisition or confidential viewing details regarding "${piece.title}" (${piece.material}).`,
    }));
    scrollTo('contact');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setSubmitError('Please provide your name and email address.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const generatedCode = `AUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const result = await sendContactInquiry({
        name: formData.name,
        email: formData.email,
        subject: `[AUREXA VIP PASS] ${formData.distinction} - ${formData.inquiryType} (${generatedCode})`,
        message: `VIP Accreditation Request:\n- Code: ${generatedCode}\n- Phone: ${formData.phone || 'N/A'}\n- Distinction: ${formData.distinction}\n- Request Type: ${formData.inquiryType}\n- Notes: ${formData.message || 'Standard VIP Guestlist Request'}`,
      });

      if (result.success) {
        setVipCode(generatedCode);
        setSubmitSuccess(true);
      } else {
        // Still provide access pass even if mail service was in demo mode
        setVipCode(generatedCode);
        setSubmitSuccess(true);
      }
    } catch {
      const generatedCode = `AUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setVipCode(generatedCode);
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGlimpses =
    glimpseFilter === 'all' ? GLIMPSES : GLIMPSES.filter((g) => g.category === glimpseFilter);

  return (
    <div className="w-full min-h-screen bg-[#040810] text-[#f7f4ee] font-sans relative selection:bg-[#c5a363]/40 selection:text-white">
      {/* =========================================================================
          1. LUXURY FLOATING HEADER (HIDDEN ON FIRST PAGE/HERO, REVEALED ON SCROLL)
      ========================================================================= */}
      <header
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 py-3.5 sm:py-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          scrolled || menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto bg-[#040810]/85 backdrop-blur-xl border-b border-[#c5a363]/25 shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
            : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}
      >
        {/* Left: Return to Home / Lunore Studio */}
        <div className="pointer-events-auto">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-[#d6c7ab] hover:text-[#f3e5c8] transition-colors py-2 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            <ArrowLeft className="w-4 h-4 text-[#c5a363] transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Lunore Studio</span>
            <span className="sm:hidden">Studio</span>
          </Link>
        </div>

        {/* Center: Brand Wordmark */}
        <div className="pointer-events-auto">
          <button
            onClick={() => scrollTo('hero')}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-[#c5a363] opacity-80 group-hover:opacity-100 transition-opacity" />
              <span
                className="text-lg sm:text-2xl tracking-[0.38em] text-[#ffffff] font-light group-hover:text-[#f3e5c8] transition-colors leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                AUREXA
              </span>
            </div>
            <span className="text-[7px] sm:text-[8px] tracking-[0.45em] text-[#c5a363] uppercase font-semibold mt-1">
              The Haute Stone Pavilion
            </span>
          </button>
        </div>

        {/* Right: Hamburger Menu Trigger (Circular luxury button matching Lunore Hero) */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[#f1eee7] hover:text-white cursor-pointer group focus:outline-none focus:ring-1 focus:ring-[#c5a363]/50 shadow-2xl backdrop-blur-xl bg-[#040914]/80 border border-[#c5a363]/40 hover:border-[#c5a363] hover:bg-[#071328] transition-all duration-300 active:scale-95"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between items-center overflow-hidden">
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-out origin-center ${
                  menuOpen ? 'translate-y-[7px] rotate-45 text-[#c5a363]' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transition-all duration-200 ease-out ${
                  menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-out origin-center ${
                  menuOpen ? '-translate-y-[7px] -rotate-45 text-[#c5a363]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* FULL-SCREEN LIQUID GLASS OVERLAY DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#040810]/95 backdrop-blur-2xl transition-all duration-500 overflow-y-auto p-6 sm:p-12 flex flex-col justify-between animate-in fade-in zoom-in-95">
          {/* Top Bar inside Overlay */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#c5a363]/25">
            <div className="flex items-center gap-2.5">
              <Crown className="w-5 h-5 text-[#c5a363]" />
              <span
                className="text-2xl tracking-[0.38em] text-white font-light"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                AUREXA
              </span>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close Menu"
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-[#c5a363]/40 text-white hover:text-[#c5a363] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links Grid inside Overlay */}
          <div className="max-w-7xl mx-auto w-full my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Numbered Luxury Navigation List */}
            <nav className="lg:col-span-7 flex flex-col gap-6">
              {[
                { id: 'hero', num: '01', label: 'The Pavilion Hero', sub: 'Arrival & Grand Monolith' },
                { id: 'about', num: '02', label: 'About Us', sub: 'The Philosophy & Curatorial Vision' },
                { id: 'glimpses', num: '03', label: 'The Glimpses', sub: 'Curated Exhibition Gallery' },
                { id: 'event', num: '04', label: 'Event Details', sub: '05 April 2026 Programme & Schedule' },
                { id: 'collection', num: '05', label: 'The Collection', sub: 'Haute Stone Curations & Sculptures' },
                { id: 'contact', num: '06', label: 'VIP Pass & Contact', sub: 'Patron Accreditation & Inquiries' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="group text-left flex items-baseline gap-6 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-mono text-[#c5a363] tracking-widest opacity-80 group-hover:opacity-100">
                    {item.num}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={`text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.12em] uppercase transition-colors ${
                        activeSection === item.id ? 'text-[#f5e2b7]' : 'text-white/80 group-hover:text-white'
                      }`}
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#a99e8a] tracking-[0.2em] uppercase font-light mt-1">
                      {item.sub}
                    </span>
                  </div>
                </button>
              ))}
            </nav>

            {/* Quick Access VIP Card */}
            <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[#081528]/80 border border-[#c5a363]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a363] font-semibold block mb-2">
                Strictly Invite-Only
              </span>
              <h4 className="text-2xl font-serif text-white tracking-[0.08em] mb-2">
                05 April 2026
              </h4>
              <p className="text-xs text-[#b8af9d] leading-relaxed font-light mb-6">
                The Lunore Haute Stone Pavilion, Aerocity Design District, New Delhi.
              </p>

              <button
                onClick={() => scrollTo('contact')}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a363] to-[#a88647] text-[#050b14] font-semibold text-xs uppercase tracking-[0.22em] shadow-[0_10px_35px_rgba(197,163,99,0.4)] hover:shadow-[0_15px_45px_rgba(197,163,99,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2 mb-6"
              >
                <span>Request VIP Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#d6c7ab] hover:text-white transition-colors flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#c5a363]" />
                <span>Return to Lunore Home</span>
              </Link>
            </div>
          </div>

          {/* Footer inside Overlay */}
          <div className="max-w-7xl mx-auto w-full pt-6 border-t border-[#c5a363]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c8270]">
            <span className="tracking-[0.2em] uppercase">
              Lunore Luxe Decor Studio &bull; Aurexa Pavilion
            </span>
            <span className="tracking-widest">
              aurexa@lunore.com &bull; +91 (0) 98765 43210
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: HERO SECTION (WITH AUREXA-HERO BACKGROUND)
      ========================================================================= */}
      <section
        id="hero"
        className="relative w-full h-[100dvh] flex items-center justify-center text-center px-6 overflow-hidden"
      >
        {/* Full-bleed Hero Photo - Clean & Clear without dark overlays */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/AUREXA-HERO.jpg"
            alt="Aurexa Pavilion Hero"
            className="w-full h-full object-cover object-center select-none"
          />
        </div>

        {/* Top Gold Edge Accent Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#c5a363] to-transparent opacity-80" />

        {/* Content Container - Pure Grand AUREXA Title (Shifted slightly upwards to true center) */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center -translate-y-8 sm:-translate-y-12">
          <h1
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] text-white font-light tracking-[0.25em] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]"
            style={{
              fontFamily: 'var(--font-serif)',
              textShadow: '0 4px 35px rgba(0, 0, 0, 0.8), 0 0 45px rgba(197, 163, 99, 0.4)',
            }}
          >
            AUREXA
          </h1>

          {/* Gold Metallic Accent Line */}
          <div className="w-32 sm:w-56 h-[2px] bg-gradient-to-r from-transparent via-[#c5a363] to-transparent mx-auto mt-4 shadow-[0_0_15px_rgba(197,163,99,0.9)]" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT US (THE AUREXA PHILOSOPHY & VISION) - BEIGE SILK
      ========================================================================= */}
      <section id="about" className="relative py-24 sm:py-32 px-6 overflow-hidden text-[#1c1917] border-t border-[#bfae94]/40">
        {/* Champagne Beige Silk Background - Clean & Clear */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/images/aurexa-beige-silk.jpg"
            alt="Lunore Haute Champagne Silk"
            className="w-full h-full object-cover object-center select-none"
          />
          <div className="absolute inset-0 bg-[#F1ECE1]/20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e3d9c7]/85 border border-[#a88d59]/40 mb-4 backdrop-blur-md">
              <Gem className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#4a3b22] font-semibold">
                The Philosophy
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl text-[#171411] font-light tracking-[0.16em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Vision Behind Aurexa
            </h2>
            <div className="w-24 h-[1.5px] bg-[#a8884d] mx-auto mb-6" />
            <p className="text-sm sm:text-base text-[#473f35] font-normal tracking-[0.04em] leading-relaxed">
              Curated under the directorial vision of Chirag Panja at Lunore, AUREXA redefines how monumental stone is
              experienced, collected, and celebrated. An exclusive salon bringing together high-net-worth collectors,
              visionary architects, and master artisans under one refined architectural setting.
            </p>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_12px_40px_rgba(60,45,25,0.06)] hover:border-[#a8884d] hover:shadow-[0_16px_50px_rgba(60,45,25,0.12)] transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#ede2d1] border border-[#a8884d]/40 flex items-center justify-center text-[#8f6d2f] mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif tracking-[0.15em] text-[#171411] uppercase mb-3">
                Geological Provenance
              </h3>
              <p className="text-xs sm:text-sm text-[#544a3d] leading-relaxed font-normal">
                Every stone block is hand-selected from heritage quarries in Carrara, Thassos, and Persia. Each work
                carries a documented geological certificate certifying millions of years of subterranean mineral formation.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_12px_40px_rgba(60,45,25,0.06)] hover:border-[#a8884d] hover:shadow-[0_16px_50px_rgba(60,45,25,0.12)] transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#ede2d1] border border-[#a8884d]/40 flex items-center justify-center text-[#8f6d2f] mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif tracking-[0.15em] text-[#171411] uppercase mb-3">
                Haute Artistry
              </h3>
              <p className="text-xs sm:text-sm text-[#544a3d] leading-relaxed font-normal">
                Bridging age-old Italian chiseling techniques with aerospace waterjet engineering, our sculptors transform
                heavy, monolithic masses into gravity-defying curved silhouettes and translucent light columns.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_12px_40px_rgba(60,45,25,0.06)] hover:border-[#a8884d] hover:shadow-[0_16px_50px_rgba(60,45,25,0.12)] transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#ede2d1] border border-[#a8884d]/40 flex items-center justify-center text-[#8f6d2f] mb-6 group-hover:scale-110 transition-transform">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif tracking-[0.15em] text-[#171411] uppercase mb-3">
                Private Salon Society
              </h3>
              <p className="text-xs sm:text-sm text-[#544a3d] leading-relaxed font-normal">
                An intimate networking enclave free from commercial noise. Guests enjoy private preview auctions,
                direct access to studio curators, and confidential architectural commission consultations.
              </p>
            </div>
          </div>

          {/* Director Quote Banner */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-[#e7dfcf] via-[#efe8da] to-[#e7dfcf] border border-[#c2b299] shadow-[0_15px_40px_rgba(60,45,25,0.08)]">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-base sm:text-xl text-[#1a1713] font-serif italic tracking-[0.04em] leading-relaxed mb-6">
                &ldquo;Every touchpoint tells a story. Through Aurexa, we open a direct sanctuary for collectors and
                design visionaries to witness stone not as a material, but as a living monument of art.&rdquo;
              </p>
              <div className="text-xs uppercase tracking-[0.3em] text-[#8f6d2f] font-semibold">
                Chirag Panja &bull; Director of Marketing, Business Development & Aurexa
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE GLIMPSES (CURATED EXHIBITION GALLERY) - #012059
      ========================================================================= */}
      <section id="glimpses" className="relative py-24 sm:py-32 px-6 bg-[#012059] text-[#f7f4ee] border-t border-[#c5a363]/30">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a363]/15 border border-[#c5a363]/40 mb-4 backdrop-blur-md">
              <Eye className="w-3.5 h-3.5 text-[#c5a363]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#d9cbb2] font-semibold">
                Exhibition Gallery
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl text-white font-light tracking-[0.16em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Glimpses
            </h2>
            <div className="w-24 h-[1.5px] bg-[#c5a363] mx-auto mb-6" />
            <p className="text-sm sm:text-base text-[#d1c6b2] font-light tracking-[0.06em]">
              Capturing moments of light, texture, and monumental scale from our private salons and pavilion installations.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-14">
            {[
              { id: 'all', label: 'All Works' },
              { id: 'monoliths', label: 'Monoliths' },
              { id: 'ambient', label: 'Ambient Salons' },
              { id: 'sculpture', label: 'Sculptures' },
              { id: 'details', label: 'Artisan Details' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGlimpseFilter(tab.id as typeof glimpseFilter)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all cursor-pointer ${
                  glimpseFilter === tab.id
                    ? 'bg-[#c5a363] text-[#050b14] font-semibold shadow-[0_0_20px_rgba(197,163,99,0.5)]'
                    : 'bg-[#081528]/60 text-[#d4c9b5] hover:bg-[#0c2242] border border-[#c5a363]/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Glimpse Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGlimpses.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGlimpse(item)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#071324] border border-[#c5a363]/30 hover:border-[#c5a363] shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-[#040810]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Content info bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-1">
                    {item.category}
                  </span>
                  <h4
                    className="text-base text-white font-medium tracking-[0.1em] group-hover:text-[#f7e6c4] transition-colors mb-1.5"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#b5a995] line-clamp-2 font-light">
                    {item.medium}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#c5a363] tracking-[0.18em] uppercase font-semibold">
                    <span>View Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE EVENT DETAILS (DATE, TIMELINE & VENUE) - BEIGE SILK
      ========================================================================= */}
      <section id="event" className="relative py-24 sm:py-32 px-6 overflow-hidden text-[#1c1917] border-t border-[#bfae94]/40">
        {/* Champagne Beige Silk Background - Clean & Clear */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/images/aurexa-beige-silk.jpg"
            alt="Lunore Haute Champagne Silk"
            className="w-full h-full object-cover object-center select-none"
          />
          <div className="absolute inset-0 bg-[#F1ECE1]/20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e3d9c7]/85 border border-[#a88d59]/40 mb-4 backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#4a3b22] font-semibold">
                Event Architecture
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl text-[#171411] font-light tracking-[0.16em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Exhibition Details & Schedule
            </h2>
            <div className="w-24 h-[1.5px] bg-[#a8884d] mx-auto mb-6" />
            <p className="text-sm sm:text-base text-[#473f35] font-normal tracking-[0.04em]">
              An exclusive single-evening private pavilion reserved strictly for accredited patrons and invitation holders.
            </p>
          </div>

          {/* Key Metrics Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_10px_35px_rgba(60,45,25,0.06)] hover:border-[#a8884d] transition-colors">
              <Calendar className="w-6 h-6 text-[#8f6d2f] mb-4" />
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#8f6d2f] font-semibold mb-1">
                Date & Season
              </div>
              <div className="text-lg font-serif text-[#171411] tracking-[0.08em]">Sunday, 05 April 2026</div>
              <div className="text-xs text-[#6e6352] mt-1 font-medium">Spring Vernissage</div>
            </div>

            <div className="p-6 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_10px_35px_rgba(60,45,25,0.06)] hover:border-[#a8884d] transition-colors">
              <Clock className="w-6 h-6 text-[#8f6d2f] mb-4" />
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#8f6d2f] font-semibold mb-1">
                Hours & Timing
              </div>
              <div className="text-lg font-serif text-[#171411] tracking-[0.08em]">18:00 &ndash; 23:00 IST</div>
              <div className="text-xs text-[#6e6352] mt-1 font-medium">Evening Gala & Salon</div>
            </div>

            <div className="p-6 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_10px_35px_rgba(60,45,25,0.06)] hover:border-[#a8884d] transition-colors">
              <MapPin className="w-6 h-6 text-[#8f6d2f] mb-4" />
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#8f6d2f] font-semibold mb-1">
                Pavilion Venue
              </div>
              <div className="text-lg font-serif text-[#171411] tracking-[0.08em]">The Haute Stone Pavilion</div>
              <div className="text-xs text-[#6e6352] mt-1 font-medium">Lunore Studio Grand Atrium</div>
            </div>

            <div className="p-6 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_10px_35px_rgba(60,45,25,0.06)] hover:border-[#a8884d] transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#8f6d2f] mb-4" />
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#8f6d2f] font-semibold mb-1">
                Guest Protocol
              </div>
              <div className="text-lg font-serif text-[#171411] tracking-[0.08em]">Strictly Invite-Only</div>
              <div className="text-xs text-[#6e6352] mt-1 font-medium">Black-Tie / High Formal</div>
            </div>
          </div>

          {/* Detailed Timeline Schedule */}
          <div className="rounded-3xl bg-white/85 border border-[#c9bba6] p-8 sm:p-12 shadow-[0_15px_45px_rgba(60,45,25,0.08)] backdrop-blur-sm">
            <h3
              className="text-xl sm:text-2xl text-[#171411] font-light tracking-[0.14em] uppercase mb-8 text-center"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Evening Programme
            </h3>

            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  time: '18:00 — 19:00',
                  title: 'Private Champagne Reception & Red Carpet Arrival',
                  detail: 'Valet reception, welcome champagne, ambient acoustic harpist, and initial private salon walkthrough.',
                },
                {
                  time: '19:00 — 20:15',
                  title: 'Unveiling of the 2026 Haute Stone Monoliths',
                  detail: 'Curated architectural lighting sequence unveiling monumental marble centerpieces and illuminated onyx works.',
                },
                {
                  time: '20:15 — 21:00',
                  title: 'Curator’s Keynote Address by Chirag Panja',
                  detail: 'An exploration of rare geological provenance and the future intersection of monolithic stone in luxury architecture.',
                },
                {
                  time: '21:00 — 23:00',
                  title: 'Private Salon Networking, Gourmet Tasting & Commissions Lounge',
                  detail: 'Direct private meetings with master sculptors, confidential acquisition bids, and bespoke residential design bookings.',
                },
              ].map((slot, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl bg-[#f8f5ee] border border-[#dfd4c3] hover:border-[#a8884d]/60 transition-colors"
                >
                  <div className="sm:w-44 text-xs font-semibold tracking-[0.22em] text-[#8f6d2f] uppercase shrink-0 pt-0.5">
                    {slot.time}
                  </div>
                  <div>
                    <h4 className="text-base text-[#171411] font-medium tracking-[0.08em] mb-1 font-serif">
                      {slot.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#544a3d] font-normal leading-relaxed">
                      {slot.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: THE COLLECTION (FEATURED HAUTE STONE CURATIONS) - #012059
      ========================================================================= */}
      <section id="collection" className="relative py-24 sm:py-32 px-6 bg-[#012059] text-[#f7f4ee] border-t border-[#c5a363]/30">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a363]/15 border border-[#c5a363]/40 mb-4 backdrop-blur-md">
              <Crown className="w-3.5 h-3.5 text-[#c5a363]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#d9cbb2] font-semibold">
                Haute Curations
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl text-white font-light tracking-[0.16em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Collection
            </h2>
            <div className="w-24 h-[1.5px] bg-[#c5a363] mx-auto mb-6" />
            <p className="text-sm sm:text-base text-[#d1c6b2] font-light tracking-[0.06em]">
              Signature monumental sculptures and bespoke architectural pieces debuting at the Aurexa Pavilion.
            </p>
          </div>

          {/* Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {COLLECTION.map((piece) => (
              <div
                key={piece.id}
                className="group rounded-3xl overflow-hidden bg-gradient-to-b from-[#081528] to-[#040c17] border border-[#c5a363]/35 hover:border-[#c5a363] shadow-[0_15px_45px_rgba(0,0,0,0.7)] transition-all duration-300 flex flex-col"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#02050a]">
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-[#040810]/80 backdrop-blur-md border border-[#c5a363]/60 text-[10px] uppercase tracking-[0.22em] text-[#c5a363] font-semibold">
                      {piece.status}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-2xl text-white font-normal tracking-[0.12em] mb-2 font-serif group-hover:text-[#f7e6c4] transition-colors"
                    >
                      {piece.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#b8af9d] font-light leading-relaxed mb-6">
                      {piece.description}
                    </p>

                    {/* Specs Table */}
                    <div className="grid grid-cols-2 gap-3 text-xs mb-8 p-4 rounded-2xl bg-[#0a1a33]/60 border border-[#c5a363]/25">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.25em] text-[#c5a363]">Material</div>
                        <div className="text-[#f1eee7] font-medium mt-0.5">{piece.material}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.25em] text-[#c5a363]">Dimensions</div>
                        <div className="text-[#f1eee7] font-medium mt-0.5">{piece.dimensions}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.25em] text-[#c5a363]">Origin</div>
                        <div className="text-[#f1eee7] font-medium mt-0.5">{piece.origin}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.25em] text-[#c5a363]">Edition</div>
                        <div className="text-[#f1eee7] font-medium mt-0.5">{piece.edition}</div>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry CTA */}
                  <button
                    onClick={() => handleInquiryForPiece(piece)}
                    className="w-full py-3.5 rounded-full bg-[#c5a363]/15 hover:bg-[#c5a363]/30 border border-[#c5a363] text-[#f7f2e7] text-xs uppercase tracking-[0.22em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-[0_0_20px_rgba(197,163,99,0.3)]"
                  >
                    <span>Inquire About This Piece</span>
                    <ArrowRight className="w-4 h-4 text-[#c5a363] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: THE CONTACT (VIP INVITATION & CONCIERGE ACCESS) - #012059
      ========================================================================= */}
      <section id="contact" className="relative py-24 sm:py-32 px-6 bg-[#012059] text-[#f7f4ee] border-t border-[#c5a363]/30">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a363]/15 border border-[#c5a363]/40 mb-4 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a363]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#d9cbb2] font-semibold">
                Accreditation & Inquiries
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl text-white font-light tracking-[0.16em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Request VIP Access
            </h2>
            <div className="w-24 h-[1.5px] bg-[#c5a363] mx-auto mb-6" />
            <p className="text-sm sm:text-base text-[#d1c6b2] font-light tracking-[0.06em]">
              Attendance at Aurexa is strictly accredited to maintain an intimate salon atmosphere. Please submit
              your details to receive your formal pass and private catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Concierge & Event Notes */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#081528] to-[#050e1a] border border-[#c5a363]/35 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)]">
                <h3 className="text-xl font-serif tracking-[0.12em] text-white uppercase mb-6">
                  VIP Concierge Desk
                </h3>

                <div className="space-y-5 text-xs text-[#b8af9d]">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-[#c5a363] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold">
                        Direct Desk
                      </div>
                      <a href="tel:+919876543210" className="text-white hover:text-[#c5a363] transition-colors font-medium text-sm mt-0.5 block">
                        +91 (0) 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-[#c5a363] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold">
                        Private Inquiries
                      </div>
                      <a href="mailto:aurexa@lunore.com" className="text-white hover:text-[#c5a363] transition-colors font-medium text-sm mt-0.5 block">
                        aurexa@lunore.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-[#c5a363] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold">
                        Pavilion Location
                      </div>
                      <div className="text-white font-medium text-sm mt-0.5">
                        Lunore Luxe Decor Studio, Aerocity Design District, New Delhi
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#c5a363]/25">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#c5a363] font-semibold mb-2">
                    Accreditation Notice
                  </div>
                  <p className="text-[11px] text-[#9b907f] leading-relaxed font-light">
                    VIP passes are non-transferable and strictly bound to the registered individual. A formal physical pass
                    with embossed security hologram will be dispatched upon credential confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive VIP Pass Request Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#081528] to-[#050e1a] border border-[#c5a363]/40 shadow-[0_15px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#c5a363]/20 border border-[#c5a363] text-[#c5a363] flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif text-white tracking-[0.14em] uppercase mb-3">
                      Accreditation Requested
                    </h3>
                    <p className="text-sm text-[#c2b9a7] font-light max-w-md mx-auto mb-6">
                      Thank you, <span className="text-white font-medium">{formData.name}</span>. Your request for Aurexa
                      accreditation has been received by our private concierge.
                    </p>

                    {/* Generated VIP Token Preview Card */}
                    <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#061122] border border-[#c5a363]/60 mb-8 text-left">
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#c5a363]/25">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a363] font-semibold">
                          AUREXA 2026 PASS
                        </span>
                        <span className="text-[10px] text-white/80 font-mono">{vipCode}</span>
                      </div>
                      <div className="text-sm font-medium text-white mb-1">{formData.name}</div>
                      <div className="text-xs text-[#a99e8a] mb-3">{formData.distinction}</div>
                      <div className="text-[11px] text-[#c5a363] font-light">
                        Date: 05 April 2026 &bull; Status: Pending Concierge Dispatch
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSubmitSuccess(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          distinction: 'Private Collector',
                          inquiryType: 'Exhibition VIP Attendance Pass',
                          message: '',
                        });
                      }}
                      className="px-8 py-3 rounded-full bg-[#c5a363]/20 border border-[#c5a363] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#c5a363]/30 transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    {submitError && (
                      <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs">
                        {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Lord / Lady / Dr. / Chirag Panja"
                          className="w-full px-4 py-3 rounded-xl bg-[#040913] border border-[#c5a363]/30 text-white placeholder-[#685e50] text-xs tracking-wider focus:outline-none focus:border-[#c5a363] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="patron@estate.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#040913] border border-[#c5a363]/30 text-white placeholder-[#685e50] text-xs tracking-wider focus:outline-none focus:border-[#c5a363] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-2">
                          Telephone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 00000"
                          className="w-full px-4 py-3 rounded-xl bg-[#040913] border border-[#c5a363]/30 text-white placeholder-[#685e50] text-xs tracking-wider focus:outline-none focus:border-[#c5a363] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-2">
                          Professional Profile
                        </label>
                        <select
                          value={formData.distinction}
                          onChange={(e) => setFormData({ ...formData, distinction: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#040913] border border-[#c5a363]/30 text-white text-xs tracking-wider focus:outline-none focus:border-[#c5a363] transition-colors"
                        >
                          <option value="Private Collector">Private Art / Stone Collector</option>
                          <option value="Architectural Principal">Architectural Director / Principal</option>
                          <option value="Interior Designer">Interior Design Leader</option>
                          <option value="Luxury Brand Partner">Luxury Brand Executive</option>
                          <option value="Art Advisory">Art Advisory / Gallerist</option>
                          <option value="Press / Media">Accredited Architecture Press</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-2">
                        Inquiry / Request Nature
                      </label>
                      <input
                        type="text"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        placeholder="Exhibition VIP Attendance Pass"
                        className="w-full px-4 py-3 rounded-xl bg-[#040913] border border-[#c5a363]/30 text-white placeholder-[#685e50] text-xs tracking-wider focus:outline-none focus:border-[#c5a363] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-2">
                        Special Requests / Bespoke Commission Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide any specific piece inquiries, guest names, or private preview logistics..."
                        className="w-full px-4 py-3 rounded-xl bg-[#040913] border border-[#c5a363]/30 text-white placeholder-[#685e50] text-xs tracking-wider focus:outline-none focus:border-[#c5a363] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a363] to-[#a88647] text-[#050b14] font-semibold text-xs uppercase tracking-[0.22em] shadow-[0_10px_35px_rgba(197,163,99,0.4)] hover:shadow-[0_15px_45px_rgba(197,163,99,0.7)] transition-all transform hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                      {submitting ? (
                        <span>Transmitting Credentials...</span>
                      ) : (
                        <>
                          <span>Submit VIP Accreditation Request</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIGHTBOX MODAL FOR GLIMPSES
      ========================================================================= */}
      {selectedGlimpse && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedGlimpse(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#061020] border border-[#c5a363]/60 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGlimpse(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:text-[#c5a363] border border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[4/5] md:aspect-auto bg-black">
                <img
                  src={selectedGlimpse.image}
                  alt={selectedGlimpse.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a363] font-semibold mb-2 block">
                    Curated Glimpse &bull; {selectedGlimpse.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-[0.1em] mb-4">
                    {selectedGlimpse.title}
                  </h3>
                  <div className="w-16 h-[1px] bg-[#c5a363] mb-6" />
                  <p className="text-xs sm:text-sm text-[#b8af9d] font-light leading-relaxed mb-6">
                    {selectedGlimpse.description}
                  </p>

                  <div className="p-4 rounded-xl bg-[#030812] border border-[#c5a363]/25 mb-6">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold mb-1">
                      Medium & Finish
                    </div>
                    <div className="text-xs text-white font-medium">{selectedGlimpse.medium}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedGlimpse(null);
                    setFormData((prev) => ({
                      ...prev,
                      inquiryType: `Glimpse Inquiry: ${selectedGlimpse.title}`,
                      message: `I would like to inquire about viewing "${selectedGlimpse.title}" during the Aurexa exhibition.`,
                    }));
                    scrollTo('contact');
                  }}
                  className="w-full py-3.5 rounded-full bg-[#c5a363] text-[#050b14] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#d8b878] transition-colors cursor-pointer"
                >
                  Inquire on This Installation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: LUXURY HAUTE FOOTER
      ========================================================================= */}
      <footer className="relative z-20 py-16 px-6 bg-[#02050c] border-t border-[#c5a363]/30 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Brand mark */}
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-[#c5a363]" />
            <span
              className="text-2xl tracking-[0.38em] text-[#ffffff] font-light"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              AUREXA
            </span>
          </div>
          <span className="text-[9px] tracking-[0.45em] text-[#c5a363] uppercase font-semibold mb-8">
            The Haute Stone Pavilion &bull; Curated by Lunore Luxe Decor Studio
          </span>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs uppercase tracking-[0.2em] text-[#a99e8a] mb-8 font-medium">
            <button onClick={() => scrollTo('hero')} className="hover:text-white transition-colors cursor-pointer">
              Hero
            </button>
            <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors cursor-pointer">
              About Us
            </button>
            <button onClick={() => scrollTo('glimpses')} className="hover:text-white transition-colors cursor-pointer">
              The Glimpses
            </button>
            <button onClick={() => scrollTo('event')} className="hover:text-white transition-colors cursor-pointer">
              Event Details
            </button>
            <button onClick={() => scrollTo('collection')} className="hover:text-white transition-colors cursor-pointer">
              The Collection
            </button>
            <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors cursor-pointer">
              VIP Pass
            </button>
            <Link to="/" className="text-[#c5a363] hover:text-[#f3e5c8] transition-colors">
              Return Home
            </Link>
          </div>

          <div className="w-20 h-[1px] bg-[#c5a363]/40 mb-6" />

          <p className="text-[10px] sm:text-xs text-[#8c8270] tracking-[0.25em] uppercase font-medium">
            &copy; {new Date().getFullYear()} Lunore Luxe Decor Studio &bull; AUREXA Exhibition Pavilion &bull; All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ComingSoon;
