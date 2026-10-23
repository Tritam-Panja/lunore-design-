import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Check,
  Send,
  Phone,
  Mail,
  X,
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Grid,
  LayoutGrid,
  Eye
} from 'lucide-react';
import { sendContactInquiry } from '@/lib/contactService';
import { Reveal } from '@/components/Reveal';

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
  category: 'monoliths' | 'strata' | 'gilded' | 'figurative';
  material: string;
  dimensions: string;
  origin: string;
  edition: string;
  image: string;
  description: string;
  status: 'Exhibition Centerpiece' | 'Private Allocation' | 'Commission on Request' | 'Limited Edition';
  location?: string;
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
    image: '/assets/images/imagetrail8.webp',
    description: 'Intimate private viewing lounges where architectural visionaries align on custom commissions and private acquisitions.',
  },
];

const COLLECTION: CollectionPiece[] = [
  {
    id: 'c1',
    title: 'The Golden Kintsugi Totem',
    category: 'monoliths',
    material: 'Basalt, Nero Marquina & 24K Hand-Gilded Gold Seam',
    dimensions: '220 cm × 90 cm × 12 cm',
    origin: 'Tuscan Apuan Alps, Italy',
    edition: 'Unique Monolith (1 of 1)',
    image: '/assets/collections/aurexa_collection_1.jpeg',
    description: 'A tripartite vertical monolith of midnight basalt discs united by an unbroken organic fissure of hand-gilded 24-karat gold leaf.',
    status: 'Exhibition Centerpiece',
    location: 'Grand Rotunda • Column 01',
  },
  {
    id: 'c2',
    title: 'Chromatic Strata Horizon',
    category: 'strata',
    material: 'Lapis Lazuli, Malachite & Saffron Ochre on Linen',
    dimensions: '200 cm × 120 cm',
    origin: 'Badakhshan & Provence Quarry',
    edition: 'Limited Edition of 3',
    image: '/assets/collections/aurexa_collection_2.jpeg',
    description: 'Dynamic geological sedimentation capturing primordial earth strata across vibrant cobalt lapis, emerald malachite, and fiery ochre.',
    status: 'Limited Edition',
    location: 'East Gallery • Chamber IV',
  },
  {
    id: 'c3',
    title: 'Gilded Travertine Bas-Relief',
    category: 'gilded',
    material: 'Crushed Travertine, Gold Leaf & Jade Wash',
    dimensions: '240 cm × 100 cm',
    origin: 'Tivoli Quarry, Italy',
    edition: 'Private Collector Allocation',
    image: '/assets/collections/aurexa_collection_3.jpeg',
    description: 'An architectural totem panel featuring hand-pressed botanical impressions framed by pure gold foil and jade mineral bands.',
    status: 'Private Allocation',
    location: 'Private Salon • Suite A',
  },
  {
    id: 'c4',
    title: 'Modernist Totemic Equilibrium',
    category: 'monoliths',
    material: 'Sculpted Terracotta, Saffron & Aegean Quartz',
    dimensions: '210 cm × 85 cm',
    origin: 'Valencia Atelier, Spain',
    edition: 'Limited Edition of 5',
    image: '/assets/collections/aurexa_collection_4.jpeg',
    description: 'A study in geometric balance where cantilevered terracotta and azure blocks are embraced by a delicate tensile architectural wireframe.',
    status: 'Limited Edition',
    location: 'North Wing • Column 04',
  },
  {
    id: 'c5',
    title: 'The Obsidian Monolith & Wing',
    category: 'monoliths',
    material: 'Nero Assoluto Granite & Gold Dust Impasto',
    dimensions: '195 cm × 105 cm',
    origin: 'Mount Ararat & Florence',
    edition: 'Unique Monolith (1 of 1)',
    image: '/assets/collections/aurexa_collection_5.jpeg',
    description: 'A razor-sharp geometric pyramid of midnight stone set in dialogue with a tactile kinetic feather swept across warm Florentine gold.',
    status: 'Exhibition Centerpiece',
    location: 'Grand Rotunda • Column 02',
  },
  {
    id: 'c6',
    title: 'Luminous Amber Foliage',
    category: 'strata',
    material: 'Honey Onyx Dust, Florentine Gold Leaf & Oil',
    dimensions: '220 cm × 110 cm',
    origin: 'Siena & Carrara, Italy',
    edition: 'Private Collector Allocation',
    image: '/assets/collections/aurexa_collection_6.jpeg',
    description: 'Dappled sunlit canopy textures rendered through thick impasto layers of champagne gold leaf, raw amber, and forest moss.',
    status: 'Private Allocation',
    location: 'West Atrium • Salon III',
  },
  {
    id: 'c7',
    title: 'The Aurexa Muse (La Donna di Pietra)',
    category: 'figurative',
    material: 'Oil, Statuario Marble Dust & Sapphire Pigment',
    dimensions: '210 cm × 130 cm',
    origin: 'Milan Atelier, Italy',
    edition: 'Commission on Request',
    image: '/assets/collections/aurexa_collection_7.jpeg',
    description: 'Monumental figurative haute couture masterpiece embodying the living spirit of stone, draped in crimson velvet and sapphire silk.',
    status: 'Commission on Request',
    location: 'Haute Salon • Private Pavilion',
  },
  {
    id: 'c8',
    title: 'Solar Flare & Nocturnal Abyss',
    category: 'strata',
    material: 'Volcanic Basalt Ash, 24K Leaf & Saffron Enamel',
    dimensions: '200 cm × 115 cm',
    origin: 'Mount Etna Quarry, Sicily',
    edition: 'Limited Edition of 3',
    image: '/assets/collections/aurexa_collection_8.jpeg',
    description: 'A tempestuous gradient descending from blinding solar cadmium into deep impasto basalt textures flecked with raw gold embers.',
    status: 'Limited Edition',
    location: 'East Wing • Hall of Light',
  },
  {
    id: 'c9',
    title: 'Glacial Torrent & Porphyry',
    category: 'gilded',
    material: 'Patinated Copper, Turquoise & Raw Quartz',
    dimensions: '230 cm × 100 cm',
    origin: 'Valais Alps, Switzerland',
    edition: 'Limited Edition of 3',
    image: '/assets/collections/aurexa_collection_9.jpeg',
    description: 'Vertical alpine cascade of oxidised copper and glacial cerulean surging over subterranean charcoal and crystalline rock formations.',
    status: 'Limited Edition',
    location: 'South Terrace • Suite B',
  },
  {
    id: 'c10',
    title: 'Celestial Fissure (The Core)',
    category: 'monoliths',
    material: 'Backlit Honey Onyx, Lapis & 24K Gold Veining',
    dimensions: '240 cm × 115 cm',
    origin: 'Yazd Province & Carrara',
    edition: 'Unique Monolith (1 of 1)',
    image: '/assets/collections/aurexa_collection_10.jpeg',
    description: 'An incandescent vertical rift of liquid gold and deep lapis fracturing through a luminous iridescent halo of prismatic pigment.',
    status: 'Exhibition Centerpiece',
    location: 'Grand Rotunda • Center Column',
  },
  {
    id: 'c11',
    title: 'Arctic Stratum & Linear Rhythm',
    category: 'strata',
    material: 'Bianco Lasa Marble Dust & Indigo Mineral Wash',
    dimensions: '220 cm × 105 cm',
    origin: 'South Tyrol, Italy',
    edition: 'Private Collector Allocation',
    image: '/assets/collections/aurexa_collection_11.jpeg',
    description: 'Architectural horizontal louvers evoking sub-zero ice shelves and glacial serenity, executed in frosted white marble and midnight indigo.',
    status: 'Private Allocation',
    location: 'West Pavilion • Room 05',
  },
  {
    id: 'c12',
    title: 'Molten Gold & Volcanic Flora',
    category: 'gilded',
    material: 'Carved Bas-Relief, Molten Bronze & Amber',
    dimensions: '230 cm × 110 cm',
    origin: 'Vesuvian Quarry & Verona',
    edition: 'Commission on Request',
    image: '/assets/collections/aurexa_collection_12.jpeg',
    description: 'Tactile sculpted bas-relief leaves forged from bronze and volcanic ironstone, engulfed in a blazing ascension of molten gold and amber.',
    status: 'Commission on Request',
    location: 'East Atrium • Suite C',
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
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'monoliths' | 'strata' | 'gilded' | 'figurative'>('all');
  const [collectionColumns, setCollectionColumns] = useState<3 | 4>(3);

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

  // Countdown to 20th December
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      // Target: 20th December (Evening Vernissage at 18:00 IST)
      // Check year 2026 or dynamic current/next year
      let target = new Date(2026, 11, 20, 18, 0, 0);
      if (now.getTime() > target.getTime()) {
        target = new Date(now.getFullYear(), 11, 20, 18, 0, 0);
        if (now.getTime() > target.getTime()) {
          target = new Date(now.getFullYear() + 1, 11, 20, 18, 0, 0);
        }
      }

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateCountdown());
    const interval = setInterval(() => {
      setTimeLeft(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  // Keyboard shortcuts (Escape to close modals/menus, Arrow keys to cycle collection artworks)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPiece) {
          setSelectedPiece(null);
        } else if (selectedGlimpse) {
          setSelectedGlimpse(null);
        } else if (menuOpen) {
          setMenuOpen(false);
        }
      } else if (selectedPiece) {
        if (e.key === 'ArrowLeft') {
          const idx = COLLECTION.findIndex((p) => p.id === selectedPiece.id);
          if (idx > 0) setSelectedPiece(COLLECTION[idx - 1]);
          else setSelectedPiece(COLLECTION[COLLECTION.length - 1]);
        } else if (e.key === 'ArrowRight') {
          const idx = COLLECTION.findIndex((p) => p.id === selectedPiece.id);
          if (idx < COLLECTION.length - 1) setSelectedPiece(COLLECTION[idx + 1]);
          else setSelectedPiece(COLLECTION[0]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, selectedPiece, selectedGlimpse]);

  // Lock body scroll when overlay or modals are open
  useEffect(() => {
    if (menuOpen || selectedGlimpse || selectedPiece) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, selectedGlimpse, selectedPiece]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquiryForPiece = (piece: CollectionPiece) => {
    setSelectedPiece(null);
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
          1. LUXURY FLOATING HEADER (TRANSPARENT, REVEALED ON SCROLL)
      ========================================================================= */}
      <header
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-3 sm:py-5 md:py-6 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          scrolled || menuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-8'
        }`}
      >
        {/* Brand Wordmark (Top Left) */}
        <div className="pointer-events-auto">
          <button
            onClick={() => scrollTo('hero')}
            className="flex flex-col items-start group cursor-pointer focus:outline-none select-none text-left"
            aria-label="Aurexa - Return to Hero"
          >
            <div className="flex items-center">
              <span
                className="text-lg sm:text-2xl tracking-[0.38em] text-[#ffffff] font-light group-hover:text-[#f3e5c8] transition-colors leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                AUREXA
              </span>
            </div>
            <span className="text-[7px] sm:text-[8px] tracking-[0.45em] text-[#c5a363] uppercase font-semibold mt-1 group-hover:text-[#d4b574] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
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
            <div className="flex items-center">
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
                { id: 'about', num: '02', label: 'Story & Vision', sub: 'Where Art Meets the Art of Living' },
                { id: 'glimpses', num: '03', label: 'The Glimpses', sub: 'Curated Exhibition Gallery' },
                { id: 'event', num: '04', label: 'Event Details', sub: '20 December 2026 Countdown' },
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
                20 December 2026
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
        {/* Full-bleed Hero Photo - Clean & Clear with subtle ambient breathing drift */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/AUREXA-HERO.jpg"
            alt="Aurexa Pavilion Hero"
            className="w-full h-full object-cover object-center select-none aurexa-ambient-fabric scale-[1.02]"
          />
        </div>

        {/* Top Gold Edge Accent Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#c5a363] to-transparent opacity-80" />

        {/* Content Container - Pure Grand AUREXA Title (Shifted slightly upwards to true center) */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center -translate-y-8 sm:-translate-y-12">
          <h1
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] text-white font-light tracking-[0.05em] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)] aurexa-hero-title-reveal"
            style={{
              fontFamily: 'var(--font-serif)',
              textShadow: '0 4px 35px rgba(0, 0, 0, 0.8), 0 0 45px rgba(197, 163, 99, 0.4)',
            }}
          >
            AUREXA
          </h1>

          {/* Gold Metallic Accent Line */}
          <div className="w-24 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#c5a363] to-transparent mx-auto mt-4 shadow-[0_0_15px_rgba(197,163,99,0.9)] aurexa-glide-up-1" />
        </div>

        {/* Subtle Luxury Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none aurexa-float-anim aurexa-glide-up-3">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#dcd2be] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Explore Pavilion
          </span>
          <ChevronDown className="w-4 h-4 text-[#c5a363] opacity-80" />
        </div>

        {/* Seamless Blend into What is Aurexa (Champagne Beige) */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-b from-transparent via-[#F1ECE1]/50 to-[#F1ECE1] pointer-events-none z-[5]" />
      </section>

      {/* =========================================================================
          SECTION 2: WHAT IS AUREXA? - BEIGE SILK
      ========================================================================= */}
      <section id="about" className="relative py-28 sm:py-36 px-6 overflow-hidden text-[#1c1917]">
        {/* Champagne Beige Silk Background - Clean & Clear with subtle ambient drift */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/images/aurexa-beige-silk.jpg"
            alt="Lunore Haute Champagne Silk"
            className="w-full h-full object-cover object-center select-none aurexa-ambient-fabric scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[#F1ECE1]/20 pointer-events-none" />
        </div>

        {/* Seamless Blend from Hero */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-[#F1ECE1] via-[#F1ECE1]/70 to-transparent pointer-events-none z-[2]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-5xl mx-auto mb-16 sm:mb-20">
            <Reveal direction="down">
              <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.38em] text-[#8f6d2f] font-semibold mb-3">
                Our Story
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <div
                className="text-xs sm:text-sm uppercase tracking-[0.32em] text-[#a8884d] font-medium mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                AUREXA
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#171411] font-light tracking-[0.02em] leading-tight mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Where Art Meets the Art of Living.
              </h2>
            </Reveal>
            <Reveal direction="zoom" delay={0.15}>
              <div className="w-24 h-[1.5px] bg-[#a8884d] mx-auto mb-8" />
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <div className="space-y-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-[#473f35] font-normal tracking-[0.015em] leading-relaxed">
                <p>
                  AUREXA was born from a belief that luxury is not merely something we own, but something we experience, feel, and remember.
                </p>
                <p>
                  Initiated by Lunore Luxe Decor Studio, AUREXA began with a desire to take our passion for art, design, and craftsmanship beyond the spaces we create and bring it into an experience that connects people through creativity and culture.
                </p>
                <p>
                  We imagined a space where extraordinary artworks, sculptures, jewellery, and collectible pieces could find their audience—not simply as objects of admiration, but as expressions of stories, emotions, and individuality.
                </p>
                <p>
                  What began as an idea evolved into a vision: to bring art, luxury, and meaningful connections together under one roof.
                </p>
                <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#171411] pt-2">
                  AUREXA is our way of turning that vision into an experience.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Subtle Luxury Divider between Story & Vision */}
          <div className="flex items-center justify-center my-14 sm:my-20">
            <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-r from-transparent via-[#a8884d]/40 to-transparent" />
            <div className="mx-4 text-[#a8884d] text-xs font-serif italic tracking-widest">✦</div>
            <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-r from-transparent via-[#a8884d]/40 to-transparent" />
          </div>

          {/* OUR VISION Block */}
          <div className="text-center max-w-5xl mx-auto mb-16 sm:mb-20">
            <Reveal direction="down">
              <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.38em] text-[#8f6d2f] font-semibold mb-3">
                Our Vision
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <div
                className="text-xs sm:text-sm uppercase tracking-[0.32em] text-[#a8884d] font-medium mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                More Than an Exhibition.
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#171411] font-light tracking-[0.02em] leading-tight mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                A World of Possibilities.
              </h2>
            </Reveal>
            <Reveal direction="zoom" delay={0.15}>
              <div className="w-24 h-[1.5px] bg-[#a8884d] mx-auto mb-8" />
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <div className="space-y-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-[#473f35] font-normal tracking-[0.015em] leading-relaxed">
                <p>
                  We envision AUREXA as a distinguished luxury platform where artists, collectors, entrepreneurs, and premium brands come together through thoughtfully curated experiences.
                </p>
                <p>
                  Our ambition goes beyond a single exhibition. Through art showcases, live auctions, exclusive previews, and meaningful collaborations, we aim to create an environment where creativity meets opportunity and every interaction has the potential to become something lasting.
                </p>
                <p>
                  For us, exclusivity is not about keeping people out. It is about bringing the right people, ideas, and experiences together with intention.
                </p>
                <p>
                  As AUREXA evolves, our goal is to build a platform recognised for its curation, its character, and the connections it creates.
                </p>
              </div>

              {/* Highlight Quote Card */}
              <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-white/80 border border-[#a8884d]/30 shadow-[0_12px_35px_rgba(60,45,25,0.06)] backdrop-blur-sm max-w-2xl mx-auto">
                <p
                  className="text-base sm:text-lg md:text-xl text-[#171411] font-light italic tracking-[0.02em] leading-relaxed"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  “Because the finest experiences are not measured by what you see, but by what stays with you.”
                </p>
              </div>
            </Reveal>
          </div>

          {/* 4 Highlight Word Pillars */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-16">
            {[
              {
                word: 'ART',
                num: '01',
                sub: 'Exceptional Works & Sculptures',
              },
              {
                word: 'PEOPLE',
                num: '02',
                sub: 'HNIs, Collectors & Artists',
              },
              {
                word: 'EXPRESSION',
                num: '03',
                sub: 'Conversations & Live Auction',
              },
              {
                word: 'CONNECTION',
                num: '04',
                sub: 'Shared Discovery & Passion',
              },
            ].map((pillar, idx) => (
              <Reveal key={pillar.word} direction="up" delay={idx * 0.1}>
                <div className="h-full p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#d8cbbb] shadow-[0_12px_40px_rgba(60,45,25,0.06)] hover:border-[#a8884d] hover:shadow-[0_20px_50px_rgba(60,45,25,0.14)] aurexa-card-hover group backdrop-blur-sm flex flex-col items-center text-center cursor-default">
                  <span className="text-xs sm:text-sm font-mono text-[#8f6d2f] tracking-widest uppercase mb-2 font-medium">
                    {pillar.num}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl font-light tracking-[0.2em] text-[#171411] uppercase mb-2 group-hover:text-[#8f6d2f] transition-colors"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {pillar.word}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#544a3d] leading-relaxed font-normal">
                    {pillar.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Discover The Experience CTA Button */}
          <Reveal direction="up" delay={0.3} className="flex justify-center">
            <button
              onClick={() => scrollTo('glimpses')}
              className="group inline-flex items-center gap-3.5 px-8 sm:px-12 py-4 sm:py-4.5 rounded-full bg-[#171411] hover:bg-[#28221b] text-[#f7f4ee] hover:text-[#f3e5c8] border border-[#a8884d]/60 shadow-[0_12px_35px_rgba(23,20,17,0.3)] hover:shadow-[0_18px_50px_rgba(168,136,77,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span className="text-xs sm:text-sm uppercase tracking-[0.28em] font-medium">
                Discover the Experience
              </span>
              <ArrowRight className="w-4 h-4 text-[#c5a363] transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </Reveal>
        </div>

        {/* Seamless Blend into Next Section (Royal Blue Velvet) */}
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-56 bg-gradient-to-b from-transparent via-[#011438]/50 to-[#011438] pointer-events-none z-[2]" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pointer-events-none z-[3]">
          <div className="w-2/3 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#c5a363]/30 to-transparent blur-[0.5px]" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE GLIMPSES (CURATED EXHIBITION GALLERY) - ROYAL BLUE VELVET
      ========================================================================= */}
      <section id="glimpses" className="relative py-28 sm:py-36 px-6 overflow-hidden text-[#f7f4ee]">
        {/* Royal Blue Velvet Fabric Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/images/aurexa-blue-velvet.jpg"
            alt="Lunore Aurexa Royal Blue Velvet"
            className="w-full h-full object-cover object-center select-none aurexa-ambient-fabric scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[#011438]/20 pointer-events-none" />
        </div>

        {/* Seamless Blend from Previous Section (Royal Blue) */}
        <div className="absolute inset-x-0 top-0 h-40 sm:h-56 bg-gradient-to-b from-[#011438] via-[#011438]/70 to-transparent pointer-events-none z-[2]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Reveal direction="down">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#c5a363]/15 border border-[#c5a363]/40 mb-4 backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#d9cbb2] font-semibold">
                  Exhibition Gallery
                </span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                className="text-3xl sm:text-5xl text-white font-light tracking-[0.16em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                The Glimpses
              </h2>
            </Reveal>
            <Reveal direction="zoom" delay={0.15}>
              <div className="w-24 h-[1.5px] bg-[#c5a363] mx-auto mb-6" />
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-sm sm:text-base text-[#d1c6b2] font-light tracking-[0.06em]">
                Capturing moments of light, texture, and monumental scale from our private salons and pavilion installations.
              </p>
            </Reveal>
          </div>

          {/* Category Filter Tabs */}
          <Reveal direction="up" delay={0.15}>
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
                      ? 'bg-[#c5a363] text-[#050b14] font-semibold shadow-[0_0_20px_rgba(197,163,99,0.5)] scale-105'
                      : 'bg-[#081528]/60 text-[#d4c9b5] hover:bg-[#0c2242] border border-[#c5a363]/30 hover:scale-102'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Glimpse Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGlimpses.map((item, idx) => (
              <Reveal key={item.id} direction="up" delay={(idx % 4) * 0.1}>
                <div
                  onClick={() => setSelectedGlimpse(item)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#071324] border border-[#c5a363]/30 hover:border-[#c5a363] shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer aurexa-card-hover"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover aurexa-img-zoom"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-[#040810]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

                  {/* Content info bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col transform group-hover:-translate-y-1 transition-transform duration-500">
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
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Seamless Blend into Next Section (Champagne Beige) */}
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-56 bg-gradient-to-b from-transparent via-[#F1ECE1]/50 to-[#F1ECE1] pointer-events-none z-[2]" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pointer-events-none z-[3]">
          <div className="w-2/3 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#c5a363]/30 to-transparent blur-[0.5px]" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE EVENT DETAILS (DATE, TIMELINE & VENUE) - BEIGE SILK
      ========================================================================= */}
      <section id="event" className="relative py-28 sm:py-36 px-6 overflow-hidden text-[#1c1917]">
        {/* Champagne Beige Silk Background - Clean & Clear with subtle ambient drift */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/images/aurexa-beige-silk.jpg"
            alt="Lunore Haute Champagne Silk"
            className="w-full h-full object-cover object-center select-none aurexa-ambient-fabric scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[#F1ECE1]/20 pointer-events-none" />
        </div>

        {/* Seamless Blend from Previous Section (Champagne Beige) */}
        <div className="absolute inset-x-0 top-0 h-40 sm:h-56 bg-gradient-to-b from-[#F1ECE1] via-[#F1ECE1]/70 to-transparent pointer-events-none z-[2]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal direction="down">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#e3d9c7]/85 border border-[#a88d59]/40 mb-4 backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#4a3b22] font-semibold">
                  Event Architecture
                </span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                className="text-3xl sm:text-5xl text-[#171411] font-light tracking-[0.16em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Exhibition Details
              </h2>
            </Reveal>
            <Reveal direction="zoom" delay={0.15}>
              <div className="w-24 h-[1.5px] bg-[#a8884d] mx-auto mb-6" />
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-sm sm:text-base text-[#473f35] font-normal tracking-[0.04em]">
                An exclusive single-evening private pavilion reserved strictly for accredited patrons and invitation holders.
              </p>
            </Reveal>
          </div>

          {/* Centered Countdown Timer */}
          <Reveal direction="up" delay={0.25}>
            <div className="relative rounded-3xl bg-white/90 border border-[#d8cbbb] p-8 sm:p-14 shadow-[0_20px_50px_rgba(60,45,25,0.08)] backdrop-blur-md max-w-4xl mx-auto text-center">
              
              {/* Highlight Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f1ece1] border border-[#a8884d]/40 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#8f6d2f] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#8f6d2f] font-semibold">
                  Vernissage Opening &bull; 20th December
                </span>
              </div>

              {/* Main Days Left Callout */}
              <div className="mb-8">
                <div
                  className="text-2xl sm:text-3xl md:text-5xl text-[#171411] font-light tracking-[0.06em] uppercase"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  <span className="text-[#8f6d2f] font-normal mr-2 font-serif text-4xl sm:text-5xl md:text-6xl">
                    {timeLeft.days}
                  </span>
                  Days Left
                </div>
                <p className="text-xs sm:text-sm text-[#6e6352] mt-2 tracking-[0.05em] font-medium">
                  Until the Lunore Haute Stone Pavilion opens its private doors
                </p>
              </div>

              {/* Countdown Numbers Grid (Days, Hours, Minutes, Seconds) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
                {[
                  { label: 'Days Left', val: String(timeLeft.days).padStart(2, '0') },
                  { label: 'Hours', val: String(timeLeft.hours).padStart(2, '0') },
                  { label: 'Minutes', val: String(timeLeft.minutes).padStart(2, '0') },
                  { label: 'Seconds', val: String(timeLeft.seconds).padStart(2, '0') },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="p-5 sm:p-8 rounded-2xl bg-[#f8f5ee] border border-[#dfd4c3] hover:border-[#a8884d] transition-all shadow-[0_4px_15px_rgba(60,45,25,0.03)] flex flex-col items-center justify-center group"
                  >
                    <div
                      className="text-4xl sm:text-5xl md:text-6xl font-light text-[#171411] tracking-tight tabular-nums group-hover:text-[#8f6d2f] transition-colors"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {unit.val}
                    </div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8f6d2f] font-semibold mt-2.5">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Protocol & Quick VIP Pass Request */}
              <div className="pt-6 border-t border-[#dfd4c3] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-[#544a3d]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8f6d2f]" />
                    <span className="font-medium tracking-wide">Sunday, 20 December 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8f6d2f]" />
                    <span className="tracking-wide">18:00 – 23:00 IST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8f6d2f]" />
                    <span className="tracking-wide">The Haute Stone Pavilion</span>
                  </div>
                </div>

                <button
                  onClick={() => scrollTo('contact')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#171411] hover:bg-[#2b251f] text-[#f7f4ee] hover:text-[#f3e5c8] text-xs uppercase tracking-[0.22em] font-medium border border-[#a8884d]/50 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-98 shrink-0"
                >
                  <span>Request VIP Pass</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a363]" />
                </button>
              </div>

            </div>
          </Reveal>
        </div>

        {/* Seamless Blend into Next Section (Royal Blue Velvet) */}
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-56 bg-gradient-to-b from-transparent via-[#011438]/50 to-[#011438] pointer-events-none z-[2]" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pointer-events-none z-[3]">
          <div className="w-2/3 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#c5a363]/30 to-transparent blur-[0.5px]" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: THE COLLECTION (FEATURED HAUTE STONE CURATIONS) - ROYAL BLUE VELVET
      ========================================================================= */}
      <section id="collection" className="relative py-28 sm:py-36 px-6 overflow-hidden text-[#f7f4ee]">
        {/* Royal Blue Velvet Fabric Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/images/aurexa-blue-velvet.jpg"
            alt="Lunore Aurexa Royal Blue Velvet"
            className="w-full h-full object-cover object-center select-none aurexa-ambient-fabric scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[#011438]/20 pointer-events-none" />
        </div>

        {/* Seamless Blend from Previous Section (Royal Blue) */}
        <div className="absolute inset-x-0 top-0 h-40 sm:h-56 bg-gradient-to-b from-[#011438] via-[#011438]/70 to-transparent pointer-events-none z-[2]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal direction="down">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#c5a363]/15 border border-[#c5a363]/40 mb-4 backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#d9cbb2] font-semibold">
                  Haute Curations
                </span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                className="text-3xl sm:text-5xl text-white font-light tracking-[0.16em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                The Collection
              </h2>
            </Reveal>
            <Reveal direction="zoom" delay={0.15}>
              <div className="w-24 h-[1.5px] bg-[#c5a363] mx-auto mb-6" />
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-sm sm:text-base text-[#d1c6b2] font-light tracking-[0.06em]">
                Signature monumental sculptures and bespoke architectural pieces debuting at the Aurexa Pavilion.
              </p>
            </Reveal>
          </div>

          {/* Controls: Category Filter Tabs & Column Density Switcher */}
          <Reveal direction="up" delay={0.22}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#c5a363]/20">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { id: 'all', label: 'All Curations (12)' },
                  { id: 'monoliths', label: 'Monoliths & Totems' },
                  { id: 'strata', label: 'Mineral Strata' },
                  { id: 'gilded', label: 'Gilded & Relief' },
                  { id: 'figurative', label: 'Haute Muse' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCollectionFilter(tab.id as typeof collectionFilter)}
                    className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] font-medium transition-all cursor-pointer ${
                      collectionFilter === tab.id
                        ? 'bg-[#c5a363] text-[#050b14] font-semibold shadow-[0_0_15px_rgba(197,163,99,0.4)] scale-105'
                        : 'bg-[#081528]/70 text-[#d4c9b5] hover:bg-[#0c2242] border border-[#c5a363]/30 hover:scale-102'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Grid Density Switcher: 3 Columns vs 4 Columns */}
              <div className="hidden sm:flex items-center gap-1.5 bg-[#050e1c]/80 p-1 rounded-full border border-[#c5a363]/30">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#a99e8a] pl-2.5 pr-1 font-medium">
                  Grid Size:
                </span>
                <button
                  onClick={() => setCollectionColumns(3)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    collectionColumns === 3
                      ? 'bg-[#c5a363] text-[#050b14] font-semibold shadow-sm'
                      : 'text-[#d4c9b5] hover:text-white'
                  }`}
                  title="3 Columns - Balanced Gallery View"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>3 Col</span>
                </button>
                <button
                  onClick={() => setCollectionColumns(4)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    collectionColumns === 4
                      ? 'bg-[#c5a363] text-[#050b14] font-semibold shadow-sm'
                      : 'text-[#d4c9b5] hover:text-white'
                  }`}
                  title="4 Columns - Compact Pavilion View"
                >
                  <Grid className="w-3 h-3" />
                  <span>4 Col (Compact)</span>
                </button>
              </div>
            </div>
          </Reveal>

          {/* Collection Grid */}
          <div
            className={`grid gap-6 sm:gap-7 mb-16 ${
              collectionColumns === 3
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'
            }`}
          >
            {COLLECTION.filter((piece) => collectionFilter === 'all' || piece.category === collectionFilter).map((piece, idx) => (
              <Reveal key={piece.id} direction="up" delay={(idx % (collectionColumns === 3 ? 3 : 4)) * 0.08}>
                <div
                  className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#081528] to-[#040c17] border border-[#c5a363]/30 hover:border-[#c5a363] shadow-[0_12px_35px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_50px_rgba(197,163,99,0.2)] transition-all duration-500 flex flex-col h-full aurexa-card-hover"
                >
                  {/* Image Frame - Vertical portrait ratio reduced for elegant exhibition view */}
                  <div
                    onClick={() => setSelectedPiece(piece)}
                    className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#02050a] cursor-pointer"
                  >
                    <img
                      src={piece.image}
                      alt={piece.title}
                      className="w-full h-full object-cover aurexa-img-zoom transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Atmospheric luxury shading */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040c17] via-transparent to-black/40 opacity-70 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />

                    {/* Top Status Badge */}
                    <div className="absolute top-3.5 left-3.5 z-[2]">
                      <span className="px-3 py-1 rounded-full bg-[#040810]/85 backdrop-blur-md border border-[#c5a363]/50 text-[9px] uppercase tracking-[0.2em] text-[#e8d7b8] font-semibold shadow-md">
                        {piece.status}
                      </span>
                    </div>

                    {/* Top Right Quick Inspect Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPiece(piece);
                      }}
                      className="absolute top-3.5 right-3.5 z-[2] p-2 rounded-full bg-[#040810]/80 backdrop-blur-md border border-[#c5a363]/40 text-[#c5a363] hover:bg-[#c5a363] hover:text-[#040810] transition-all transform hover:scale-110 shadow-lg cursor-pointer"
                      title="Inspect Masterpiece"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Bottom subtle hover text */}
                    <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[#040c17] to-transparent pointer-events-none">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#f7e6c4] font-medium flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#c5a363]" /> Click to Inspect Full Art
                      </span>
                    </div>
                  </div>

                  {/* Body Details - Compact luxury styling */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#c5a363] font-semibold">
                          {piece.edition}
                        </span>
                        <span className="text-[10px] text-[#8e8574] tracking-wider truncate">
                          {piece.origin.split(',')[0]}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedPiece(piece)}
                        className="text-lg sm:text-xl text-white font-normal tracking-[0.08em] mb-1 font-serif group-hover:text-[#f7e6c4] transition-colors cursor-pointer line-clamp-1"
                      >
                        {piece.title}
                      </h3>

                      <p className="text-[11px] text-[#c5a363]/90 font-light tracking-wide mb-2 line-clamp-1">
                        {piece.material}
                      </p>

                      <p className="text-xs text-[#a89f8d] font-light leading-relaxed mb-4 line-clamp-2">
                        {piece.description}
                      </p>

                      {/* Compact Specs Matrix */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-5 p-3 rounded-xl bg-[#050e1c]/80 border border-[#c5a363]/20">
                        <div>
                          <div className="text-[8px] uppercase tracking-[0.22em] text-[#c5a363]">Dimensions</div>
                          <div className="text-[#f1eee7] font-medium text-[11px] truncate mt-0.5">{piece.dimensions}</div>
                        </div>
                        <div>
                          <div className="text-[8px] uppercase tracking-[0.22em] text-[#c5a363]">Origin</div>
                          <div className="text-[#f1eee7] font-medium text-[11px] truncate mt-0.5">{piece.origin}</div>
                        </div>
                      </div>
                    </div>

                    {/* Inquiry CTA & Full View */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#c5a363]/15">
                      <button
                        onClick={() => handleInquiryForPiece(piece)}
                        className="flex-1 py-2.5 px-3 rounded-full bg-[#c5a363]/15 hover:bg-[#c5a363] hover:text-[#040810] border border-[#c5a363]/80 text-[#f7f2e7] text-[11px] uppercase tracking-[0.18em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-[0_0_15px_rgba(197,163,99,0.25)] hover:scale-[1.01]"
                      >
                        <span>Inquire</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#c5a363] group-hover:text-[#040810] transition-colors" />
                      </button>
                      <button
                        onClick={() => setSelectedPiece(piece)}
                        className="p-2.5 rounded-full bg-[#081528] hover:bg-[#0f2444] border border-[#c5a363]/40 text-[#c5a363] hover:text-white transition-all cursor-pointer"
                        title="View Full Masterpiece"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: THE CONTACT (VIP INVITATION & CONCIERGE ACCESS) - ROYAL BLUE VELVET
      ========================================================================= */}
      <section id="contact" className="relative py-28 sm:py-36 px-6 overflow-hidden text-[#f7f4ee]">
        {/* Royal Blue Velvet Fabric Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/images/aurexa-blue-velvet.jpg"
            alt="Lunore Aurexa Royal Blue Velvet"
            className="w-full h-full object-cover object-center select-none aurexa-ambient-fabric scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[#011438]/20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal direction="down">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#c5a363]/15 border border-[#c5a363]/40 mb-4 backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#d9cbb2] font-semibold">
                  Accreditation & Inquiries
                </span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                className="text-3xl sm:text-5xl text-white font-light tracking-[0.16em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Request VIP Access
              </h2>
            </Reveal>
            <Reveal direction="zoom" delay={0.15}>
              <div className="w-24 h-[1.5px] bg-[#c5a363] mx-auto mb-6" />
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-sm sm:text-base text-[#d1c6b2] font-light tracking-[0.06em]">
                Attendance at Aurexa is strictly accredited to maintain an intimate salon atmosphere. Please submit
                your details to receive your formal pass and private catalog.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Concierge & Event Notes */}
            <Reveal direction="left" delay={0.15} className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#081528] to-[#050e1a] border border-[#c5a363]/35 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)] aurexa-card-hover">
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
                        +91 97697 08628
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
                        support@lunoreluxedecorstudio.com
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
            </Reveal>

            {/* Right Column: Interactive VIP Pass Request Form */}
            <Reveal direction="right" delay={0.2} className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#081528] to-[#050e1a] border border-[#c5a363]/40 shadow-[0_15px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl aurexa-card-hover">
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
                        Date: 20 December 2026 &bull; Status: Pending Concierge Dispatch
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
                          placeholder="Lord / Lady / Dr. / "
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
            </Reveal>
          </div>
        </div>

        {/* Seamless Blend into Footer */}
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-52 bg-gradient-to-b from-transparent to-[#02050c] pointer-events-none z-[2]" />
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
          LIGHTBOX MODAL FOR COLLECTION MASTERPIECES
      ========================================================================= */}
      {selectedPiece && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedPiece(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#061020] border border-[#c5a363]/60 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top action buttons */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setSelectedPiece(null)}
                className="p-2.5 rounded-full bg-black/70 hover:bg-[#c5a363] text-white hover:text-[#040810] border border-white/20 hover:border-[#c5a363] transition-all cursor-pointer shadow-lg"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Left side: Artwork Image Showcase with Navigation */}
            <div className="relative md:w-1/2 bg-[#02060f] flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[350px] md:min-h-[580px]">
              {/* Subtle radial glow behind art */}
              <div className="absolute inset-0 bg-radial from-[#c5a363]/10 via-transparent to-transparent opacity-60 pointer-events-none" />

              <img
                src={selectedPiece.image}
                alt={selectedPiece.title}
                className="max-h-[50vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#c5a363]/20"
              />

              {/* Prev / Next Floating Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = COLLECTION.findIndex((p) => p.id === selectedPiece.id);
                  if (idx > 0) setSelectedPiece(COLLECTION[idx - 1]);
                  else setSelectedPiece(COLLECTION[COLLECTION.length - 1]);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#c5a363] text-white hover:text-[#040810] border border-white/20 transition-all cursor-pointer shadow-lg"
                title="Previous Artwork (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = COLLECTION.findIndex((p) => p.id === selectedPiece.id);
                  if (idx < COLLECTION.length - 1) setSelectedPiece(COLLECTION[idx + 1]);
                  else setSelectedPiece(COLLECTION[0]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#c5a363] text-white hover:text-[#040810] border border-white/20 transition-all cursor-pointer shadow-lg"
                title="Next Artwork (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Counter indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#c5a363]/30 text-[10px] uppercase tracking-[0.2em] text-[#c5a363] font-semibold">
                {COLLECTION.findIndex((p) => p.id === selectedPiece.id) + 1} / {COLLECTION.length}
              </div>
            </div>

            {/* Right side: Curatorial Information & VIP Acquisition */}
            <div className="md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#c5a363]/15 border border-[#c5a363]/50 text-[10px] uppercase tracking-[0.22em] text-[#d9cbb2] font-semibold">
                    {selectedPiece.status}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e8574]">
                    {selectedPiece.edition}
                  </span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-serif text-white tracking-[0.08em] mb-2"
                >
                  {selectedPiece.title}
                </h3>

                <div className="w-16 h-[1.5px] bg-[#c5a363] mb-4" />

                <p className="text-xs sm:text-sm text-[#b8af9d] font-light leading-relaxed mb-6">
                  {selectedPiece.description}
                </p>

                {/* Detailed Provenance & Technical Specs */}
                <div className="space-y-2.5 mb-6 p-4 rounded-2xl bg-[#030812]/90 border border-[#c5a363]/25">
                  <div className="text-[9px] uppercase tracking-[0.28em] text-[#c5a363] font-semibold mb-2">
                    Curatorial Specifications
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#8e8574] block">Medium / Material</span>
                      <span className="text-[#f1eee7] font-medium text-xs mt-0.5 block">{selectedPiece.material}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#8e8574] block">Dimensions</span>
                      <span className="text-[#f1eee7] font-medium text-xs mt-0.5 block">{selectedPiece.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#8e8574] block">Origin & Quarry</span>
                      <span className="text-[#f1eee7] font-medium text-xs mt-0.5 block">{selectedPiece.origin}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#8e8574] block">Pavilion Location</span>
                      <span className="text-[#f1eee7] font-medium text-xs mt-0.5 block">{selectedPiece.location || 'Exhibition Grand Wing'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acquisition / Inquiry Action */}
              <div className="pt-4 border-t border-[#c5a363]/20 space-y-3">
                <button
                  onClick={() => {
                    const piece = selectedPiece;
                    setSelectedPiece(null);
                    handleInquiryForPiece(piece);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#c5a363] hover:bg-[#d8b878] text-[#050b14] font-semibold text-xs uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(197,163,99,0.4)] hover:scale-[1.01]"
                >
                  <span>Inquire About Private Acquisition</span>
                  <ArrowRight className="w-4 h-4 text-[#050b14]" />
                </button>
                <p className="text-[10px] text-center text-[#8e8574] tracking-wider">
                  Strictly accredited allocation for private collectors and architectural firms.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: LUXURY HAUTE FOOTER
      ========================================================================= */}
      <footer className="relative z-20 py-16 px-6 bg-[#02050c] text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Brand mark */}
          <div className="flex items-center mb-3">
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
              What Is Aurexa
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
