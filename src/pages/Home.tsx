import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Hammer, Mountain, Eye, Landmark, Ruler, PenTool, Layers, Check, Sparkles, MapPin, Phone, Mail, Send } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';
import { TextReveal } from '@/components/TextReveal';
import { ScrollColorText } from '@/components/ScrollColorText';
import { LazyImage } from '@/components/LazyImage';
import { LazySection } from '@/components/LazySection';

// Lazily load heavy interactive 3D and media experiences
const InteriorExperience = lazy(() => import('@/components/InteriorExperience').then(m => ({ default: m.InteriorExperience })));
const SculpturesExperience = lazy(() => import('@/components/SculpturesExperience').then(m => ({ default: m.SculpturesExperience })));
const MarbleExperience = lazy(() => import('@/components/MarbleExperience').then(m => ({ default: m.MarbleExperience })));


const HERO_LETTERS = ['L', 'U', 'N', 'O', 'R', 'E'];

const fallbackProducts = [
  { id: '1', name: 'Marble Monolith', category: 'Monumental Artwork' },
  { id: '2', name: 'Obsidian Figure', category: 'Abstract Sculpture' },
  { id: '3', name: 'Limestone Relief', category: 'Architectural Feature' },
  { id: '4', name: 'Figurative Sculptures', category: 'Classical Form' },
  { id: '5', name: 'Gilded Marble Sculptures', category: 'Premium Adornment' },
  { id: '6', name: 'Spiritual / Religious Sculpture', category: 'Ethereal Art' },
];

const aboutPillars = [
  { icon: Hammer, title: 'Master Craftsmanship', desc: 'Hand-carved by sculptors with decades of experience in monumental stone work.' },
  { icon: Mountain, title: 'Sourced Monoliths', desc: 'Hand-selected rare stones from quarries worldwide with distinct veining.' },
  { icon: Eye, title: 'Detail Obsessed', desc: 'Studied and refined with intention from first chisel to final polish.' },
  { icon: Landmark, title: 'Permanent Legacy', desc: 'Built to endure for generations as the ultimate medium of permanence.' },
];

const dreamConcepts = [
  { title: 'Celestial Being', desc: 'Visionary Concept' },
  { title: 'Obsidian Equinox', desc: 'Visionary Concept' },
  { title: 'Emerald Gateway', desc: 'Visionary Concept' },
  { title: 'Illuminated Onyx', desc: 'Visionary Concept' },
];

const processSteps = [
  { num: '01', title: 'Material Selection', desc: 'We hand-select monoliths possessing raw density, vein patterns, and spiritual resonance.' },
  { num: '02', title: 'Artistic Revelation', desc: 'Master sculptors study raw blocks for weeks, using hand tools to reveal elegance within weight.' },
  { num: '03', title: 'Refined Finishing', desc: 'From raw chisel marks to silk-like polish, an obsessive journey of texture.' },
];

interface TeamMember {
  name: string;
  role: string;
  testimonial: string;
  image: string;
}

const directors: TeamMember[] = [
  {
    name: "DINKESH SHARMA",
    role: "Founder & Director — Interior Design & Project Execution",
    testimonial: "As founder, Dinkesh brings  creative vision and craftsmanship to every project. He steers luxury interiors from initial concept through to beautifully realised spaces , Whether intimate homes, sprawling villas or hospitality venues. Dinkesh works closely with clients to understand their dreams, and leads a talented design team to bring them to life. His philosophy is simple: listen carefully, design thoughtfully, and execute flawlessly..",
    image: "/assets/images/Director Dhinkesh.PNG"
  },
  
  {
    name: "Suchitra Pandey ",
    role: "Director — Human Resources",
    testimonial: "Suchitra is passionate about building a team where talented people do their best work. She leads recruitment, shapes HR policies, and nurtures a workplace culture grounded in respect, growth and collaboration. As Lunore expands, Suchitra ensures that our people feel valued, supported and connected to our shared mission: creating extraordinary spaces and experiences.",
    image: "/assets/images/Director Suchitra .jpeg"
  },
  {
    name: "CHIRAG GODSE",
    role: "Director — Marketing, Business Development & Aurexa",
    testimonial: "Every touchpoint tells a story. Chirag oversees Lunore's brand strategy, digital presence and business development with an eye toward creating memorable experiences. Through Aurexa, his passion project of luxury art events and auctions, Chirag has opened a direct channel to high-net-worth collectors and design influencers. He believes that authentic brands are built on genuine expertise and meaningful relationships , principles that guide everything from social media content to high-stakes client meetings.",
    image: "/assets/images/Director Chirag.PNG"
  },
  {
    name: "JITANDAR LOHAR ",
    role: "Director — Finance & Administration",
    testimonial: "Jitandar  keeps Lunore running smoothly behind the scenes. He manages finances with precision, handles compliance and statutory requirements, and builds the operational systems that let the team focus on creative work. Jitandar believes that strong administration and clear financial health are the foundation of sustainable growth and he takes pride in creating that foundation.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=compress&cs=tinysrgb&w=800&q=80"
  },
];

export function Home() {
  const [products, setProducts] = useState(fallbackProducts);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const aboutRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll handler for scroll-driven index update
  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current) return;
      const rect = aboutRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight <= 0) return;

      const progress = Math.max(0, Math.min(0.999, -rect.top / totalHeight));
      const step = 1 / directors.length;
      const index = Math.floor(progress / step);
      setActiveIndex(Math.max(0, Math.min(directors.length - 1, index)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to get placement attributes for avatars (Desktop & Tablet)
  const getAvatarStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

    // Responsive scaling variables
    const activeSize = isTablet ? 200 : 250;
    const neighborMultiplier = isTablet ? 0.75 : 1;

    let size = activeSize;
    let opacity = 1;
    let x = 0;

    if (absDiff === 0) {
      size = activeSize;
      opacity = 1;
      x = 0;
    } else {
      // Calculate sizes dynamically for parade effect
      if (absDiff === 1) {
        size = 100 * neighborMultiplier;
        opacity = 0.8;
      } else if (absDiff === 2) {
        size = 64 * neighborMultiplier;
        opacity = 0.6;
      } else if (absDiff === 3) {
        size = 36 * neighborMultiplier;
        opacity = 0.4;
      } else if (absDiff === 4) {
        size = 20 * neighborMultiplier;
        opacity = 0.25;
      } else if (absDiff === 5) {
        size = 12 * neighborMultiplier;
        opacity = 0.15;
      } else {
        size = 6 * neighborMultiplier;
        opacity = 0.08;
      }

      // Horizontal spacing
      const spacingUnit = isTablet ? 65 : 85;
      const initialGap = isTablet ? 140 : 180;
      
      if (diff < 0) {
        x = -initialGap - (Math.abs(diff) - 1) * spacingUnit;
      } else {
        x = initialGap + (diff - 1) * spacingUnit;
      }
    }

    return { size, opacity, x };
  };

  const activeMember = directors[activeIndex];

  useEffect(() => {
    supabase.from('products').select('id, name, category').then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data as Product[]);
      }
    });
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('inquiries').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="relative bg-[#0d0e0e] text-[#f1eee7]">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative w-full min-h-[85vh] sm:min-h-[90vh] md:h-screen md:min-h-[600px] overflow-hidden bg-[#0d0e0e] flex items-center pt-24 sm:pt-28 md:pt-0">
        {/* Background Hero Video */}
        <div className="absolute inset-0 flex justify-end items-center overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-[70%_center] sm:object-right md:w-auto md:max-w-none md:object-contain"
          >
            <source src="/assets/images/LUNORE_—_Subtle_Cinematic_Imag (1).mp4" type="video/mp4" />
          </video>
        </div>

        {/* Responsive Gradient Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0d0e0e] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0e] via-[#0d0e0e]/50 to-transparent sm:hidden pointer-events-none" />
        <div className="hidden sm:block absolute inset-y-0 left-0 w-1/2 lg:w-1/3 bg-gradient-to-r from-[#0d0e0e] via-[#0d0e0e]/75 to-transparent pointer-events-none" />

        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 left-1/6 w-[600px] h-[600px] bg-[#b89a62]/15 rounded-full blur-[150px] pointer-events-none" />

        {/* Left Side LUNORE Branding with Glowing Golden 'N' */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center">
          <div className="max-w-xl text-left">
            {/* Main L U N O R E Wordmark with Golden Glowing N */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-[0.12em] sm:tracking-[0.16em] uppercase text-[#f1eee7] leading-none select-none whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)', perspective: '1000px' }}
            >
              <span className="lunore-brand-letter inline-block" style={{ animationDelay: '0.2s' }}>L</span>
              <span className="lunore-brand-letter inline-block" style={{ animationDelay: '0.32s' }}>U</span>
              <span
                className="lunore-brand-letter lunore-n-glow inline-block text-[#b89a62]"
                style={{
                  animationDelay: '0.44s',
                  color: '#b89a62',
                  textShadow: '0 0 12px rgba(184,154,98,0.9), 0 0 28px rgba(184,154,98,0.7), 0 0 55px rgba(184,154,98,0.45)',
                }}
              >
                N
              </span>
              <span className="lunore-brand-letter inline-block" style={{ animationDelay: '0.56s' }}>O</span>
              <span className="lunore-brand-letter inline-block" style={{ animationDelay: '0.68s' }}>R</span>
              <span className="lunore-brand-letter inline-block" style={{ animationDelay: '0.8s' }}>E</span>
            </h1>

            {/* Subtle Divider Line & Tagline */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4 lunore-brand-letter" style={{ animationDelay: '1s' }}>
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-[#b89a62] to-transparent" />
              <p className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#b9b5ae] font-light">
               Luxe decor studio 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY INTERIOR GALLERY TRANSITION THRESHOLD */}
      <div className="relative z-10 w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.3)] to-transparent" />

      {/* 2. BRAND STORY PREVIEW SECTION */}
      <section id="brand-story" className="py-24 sm:py-32 md:py-44 relative overflow-hidden bg-[#0d0e0e]">
        {/* Ambient Radial Gold Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#b89a62]/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          {/* Main Headline with Staggered Word Mask */}
          <TextReveal
            text="The Space that only you could live in"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white tracking-tight"
            wordClassName="text-white"
            delay={0.1}
            stagger={0.06}
          />

          <Reveal direction="zoom" delay={0.3}>
            <div className="my-8 sm:my-10 w-24 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
          </Reveal>

          {/* Scroll Color Text Animation (Illuminates word-by-word into champagne gold as you scroll) */}
          <div className="mt-8 sm:mt-10">
            <ScrollColorText
              text="Luxury homes begin with three things: exquisite space, exceptional materials, and meaningful art. Lunore masters all three. From turnkey interior design to premium marble sourcing to curated sculptures and paintings, we deliver homes that are completely, irreplaceably yours."
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed font-light max-w-4xl mx-auto"
              style={{ fontFamily: 'var(--font-serif)' }}
            />
          </div>
        </div>

      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 3. ABOUT PREVIEW SECTION (TEAM PARADE) */}
      <section id="about" className="bg-[#0d0e0e] text-[#f1eee7] font-sans selection:bg-white/10 relative overflow-hidden">
        {/* Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#b89a62]/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

        {/* Intro Editorial Header */}
        <div className="px-6 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 text-center max-w-3xl mx-auto relative z-10">
          <Reveal direction="down">
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-3">
              Leadership
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-display tracking-tight text-[#f1eee7] leading-tight">
              Directors of Lunore
            </h2>
            <div className="mt-6 w-12 h-[1px] bg-[#b89a62]/40 mx-auto" />
          </Reveal>
        </div>

        {/* Interactive Directors Parade */}
        <div className="relative py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 flex flex-col justify-center relative">
            
            {isMobile ? (
              /* Mobile Vertical Stack Layout */
              <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-full overflow-hidden">
                {/* Active Role Label */}
                <Reveal direction="up" delay={0.1}>
                  <div className="flex flex-col items-center px-2 max-w-xs mx-auto">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#b9b5ae] font-light">
                      {activeMember.role}
                    </span>
                    <div className="w-8 h-[1px] bg-[#b89a62]/40 mt-1.5" />
                  </div>
                </Reveal>

                {/* Active Name in Champagne Gold */}
                <Reveal direction="up" delay={0.15}>
                  <h3
                    className="text-xl sm:text-2xl font-normal font-display tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#b89a62] drop-shadow-[0_2px_14px_rgba(184,154,98,0.45)] px-2 break-words"
                    style={{ color: '#b89a62' }}
                  >
                    {activeMember.name}
                  </h3>
                </Reveal>

                {/* Large Portrait with Mobile Navigation Arrows */}
                <Reveal direction="zoom" delay={0.2} className="w-full">
                  <div className="flex items-center justify-center gap-2 sm:gap-5 w-full px-2">
                    {/* Previous Arrow */}
                    <button
                      onClick={() => setActiveIndex((prev) => (prev === 0 ? directors.length - 1 : prev - 1))}
                      aria-label="Previous Director"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full liquid-glass-btn-secondary border border-[#b89a62]/40 text-[#e6cb97] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer shrink-0"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Main Avatar */}
                    <div className="w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden border-2 border-[#b89a62]/50 p-1 bg-[#181917] shadow-[0_0_25px_rgba(0,0,0,0.8),0_0_15px_rgba(184,154,98,0.3)] shrink-0">
                      <LazyImage
                        src={activeMember.image}
                        alt={activeMember.name}
                        className="w-full h-full rounded-full"
                        imgClassName="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Next Arrow */}
                    <button
                      onClick={() => setActiveIndex((prev) => (prev === directors.length - 1 ? 0 : prev + 1))}
                      aria-label="Next Director"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full liquid-glass-btn-secondary border border-[#b89a62]/40 text-[#e6cb97] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer shrink-0"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </Reveal>

                {/* Testimonial Quote & Text */}
                <Reveal direction="blur" delay={0.25}>
                  <div className="w-full max-w-sm sm:max-w-md px-3 sm:px-4 mt-1">
                    <span className="text-3xl font-serif text-[#b89a62] opacity-40 leading-none select-none block mb-0.5">“</span>
                    <p
                      className="text-xs sm:text-sm leading-relaxed font-light font-display italic tracking-wide break-words"
                      style={{ color: '#e6cb97' }}
                    >
                      {activeMember.testimonial}
                    </p>
                  </div>
                </Reveal>

                {/* Mobile Avatar Parade (Centered Row) */}
                <Reveal direction="up" delay={0.3} className="w-full">
                  <div className="w-full pt-3 overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
                      {directors.map((member, idx) => (
                        <button
                          key={member.name}
                          onClick={() => setActiveIndex(idx)}
                          className={`relative rounded-full overflow-hidden flex-shrink-0 transition-all duration-300 ${
                            idx === activeIndex
                              ? 'w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#b89a62] scale-110 shadow-[0_0_15px_rgba(184,154,98,0.5)]'
                              : 'w-8 h-8 sm:w-9 sm:h-9 opacity-40 hover:opacity-80 border border-white/10'
                          }`}
                        >
                          <LazyImage
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full"
                            imgClassName="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Mobile Dots */}
                <Reveal direction="blur" delay={0.35}>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {directors.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Select director ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeIndex ? 'w-6 bg-[#b89a62]' : 'w-1.5 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </Reveal>
              </div>
            ) : (
              /* Desktop & Tablet Layout */
              <div className="relative w-full min-h-[520px] flex flex-col justify-between">
                
                {/* Active Role and Name label above the central portrait */}
                <Reveal direction="up" delay={0.1}>
                  <div className="text-center mb-4 z-40">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#b9b5ae] block font-light">
                      {activeMember.role}
                    </span>
                    <div className="w-8 h-[1px] bg-[#b89a62]/40 mx-auto my-2" />
                    <h3
                      className="text-2xl sm:text-3xl font-normal font-display tracking-[0.14em] uppercase text-[#b89a62] block drop-shadow-[0_2px_14px_rgba(184,154,98,0.45)]"
                      style={{ color: '#b89a62' }}
                    >
                      {activeMember.name}
                    </h3>
                  </div>
                </Reveal>

                {/* Horizontal Parade Field with Left and Right Navigation Arrows */}
                <Reveal direction="zoom" delay={0.2} className="w-full">
                  <div className="relative w-full h-[260px] sm:h-[300px] flex items-center justify-center">
                    
                    {/* Left Navigation Arrow */}
                    <button
                      onClick={() => setActiveIndex((prev) => (prev === 0 ? directors.length - 1 : prev - 1))}
                      aria-label="Previous Director"
                      className="absolute left-2 sm:left-6 md:left-12 lg:left-24 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full liquid-glass-btn-secondary border border-[#b89a62]/40 text-[#e6cb97] hover:text-white hover:border-[#b89a62] hover:bg-[#b89a62]/20 flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 cursor-pointer group"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </button>

                    {/* Central Parade Orbit */}
                    <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                      {directors.map((member, idx) => {
                        const { size, opacity, x } = getAvatarStyle(idx);
                        const isActive = idx === activeIndex;

                        return (
                          <div
                            key={member.name}
                            onClick={() => setActiveIndex(idx)}
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              opacity: opacity,
                              transform: `translate3d(${x}px, ${isActive ? 10 : 0}px, 0)`,
                              zIndex: isActive ? 30 : 20 - Math.abs(idx - activeIndex),
                            }}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden cursor-pointer transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-700 ${
                              isActive
                                ? 'p-1.5 border-2 border-[#b89a62] bg-[#181917] shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_25px_rgba(184,154,98,0.3)]'
                                : 'border border-white/15 hover:opacity-90 hover:scale-105'
                            }`}
                          >
                            <LazyImage
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full rounded-full"
                              imgClassName="w-full h-full object-cover rounded-full select-none"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Navigation Arrow */}
                    <button
                      onClick={() => setActiveIndex((prev) => (prev === directors.length - 1 ? 0 : prev + 1))}
                      aria-label="Next Director"
                      className="absolute right-2 sm:right-6 md:right-12 lg:right-24 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full liquid-glass-btn-secondary border border-[#b89a62]/40 text-[#e6cb97] hover:text-white hover:border-[#b89a62] hover:bg-[#b89a62]/20 flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 cursor-pointer group"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </Reveal>

                {/* Centered Testimonial & Quote */}
                <Reveal direction="blur" delay={0.25}>
                  <div className="w-full max-w-2xl mx-auto text-center px-6 mt-4">
                    <span className="text-4xl font-serif text-[#b89a62] opacity-40 leading-none select-none block mb-1">“</span>
                    <p
                      className="text-base sm:text-lg font-light font-display italic leading-relaxed tracking-wide"
                      style={{ color: '#e6cb97' }}
                    >
                      {activeMember.testimonial}
                    </p>
                  </div>
                </Reveal>

                {/* Navigation Dots */}
                <Reveal direction="up" delay={0.3}>
                  <div className="flex items-center justify-center gap-2 pt-6">
                    {directors.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Select director ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeIndex ? 'w-8 bg-[#b89a62]' : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </Reveal>

              </div>
            )}

          </div>
        </div>

        {/* Footer Navigation Link back to collection */}
        <div className="py-12 sm:py-14 text-center border-t border-white/[0.08] bg-[#0d0e0e] relative z-10">
          <Link
            to="/about"
            className="liquid-glass-btn-secondary px-6 sm:px-8 py-3.5 text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#f1eee7] inline-flex items-center justify-center gap-2 hover:border-[#b89a62]/60 hover:text-[#b89a62] transition-all"
          >
            Learn More About Our Team <ArrowRight className="w-4 h-4 text-[#b89a62]" />
          </Link>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 4. INTERACTIVE INTERIOR EXPERIENCE SECTION (LAZY MOUNTED) */}
      <LazySection minHeight="600px" rootMargin="350px">
        <Suspense fallback={<div className="w-full min-h-[600px] bg-[#0d0e0e] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-[#c2a67e] animate-spin" /></div>}>
          <InteriorExperience />
        </Suspense>
      </LazySection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 5. FEATURED PROJECTS & SIGNATURE COLLECTION SECTION (LAZY MOUNTED) */}
      <LazySection minHeight="600px" rootMargin="350px">
        <Suspense fallback={<div className="w-full min-h-[600px] bg-[#0d0e0e] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-[#c2a67e] animate-spin" /></div>}>
          <SculpturesExperience />
        </Suspense>
      </LazySection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* MARBLE EXPERIENCE INTERACTIVE SECTION (LAZY MOUNTED) */}
      <LazySection minHeight="600px" rootMargin="350px">
        <Suspense fallback={<div className="w-full min-h-[600px] bg-[#08090a] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-[#c2a67e] animate-spin" /></div>}>
          <MarbleExperience />
        </Suspense>
      </LazySection>


      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 6. DESIGN PHILOSOPHY & PROCESS SECTION */}
      <section id="process" className="py-24 md:py-36 relative bg-[#111211]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal direction="down">
              <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
                Design Philosophy
              </p>
            </Reveal>
            <TextReveal
              text="Hand-Carved Excellence"
              as="h2"
              className="text-3xl md:text-5xl font-light text-[#f1eee7]"
              wordClassName="text-[#f1eee7]"
              delay={0.1}
              stagger={0.06}
            />
            <Reveal direction="blur" delay={0.25}>
              <p className="mt-6 text-lg text-[#b9b5ae] leading-relaxed font-light">
                Every masterpiece follows a journey of intense dedication and reverence for natural stone.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 [perspective:1400px]">
            {processSteps.map((s) => (
              <Reveal
                key={s.num}
                direction="flip-right"
                delay={1.0}
                threshold={0.35}
                rootMargin="-40px"
                className="group relative p-8 sm:p-10 rounded-3xl liquid-glass-card z-10 [transform-style:preserve-3d] transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(184,154,98,0.18)] border border-white/10 hover:border-[#b89a62]/50 overflow-hidden"
              >
                {/* Top Specular Edge Glow on Card */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:via-[#b89a62]/80 transition-all duration-500" />

                <span
                  className="text-4xl md:text-5xl font-light text-[#b89a62] block mb-4 transition-transform duration-500 group-hover:scale-105"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {s.num}
                </span>
                <h3
                  className="text-xl md:text-2xl font-light mb-3 text-[#f1eee7] group-hover:text-white transition-colors"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {s.title}
                </h3>
                <div className="w-10 h-px bg-[#b89a62]/60 mb-4 group-hover:w-16 group-hover:bg-[#b89a62] transition-all duration-500" />
                <p className="text-sm text-[#b9b5ae] leading-relaxed font-light">{s.desc}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Reveal direction="zoom" delay={0.2}>
              <Link
                to="/process"
                className="liquid-glass-btn-secondary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-[0.25em] uppercase text-[#f1eee7] group shadow-lg"
              >
                Discover Full Process <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>

      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 7. CALL TO ACTION (CTA) SECTION */}
      <section id="cta" className="py-20 md:py-32 relative text-center bg-gradient-to-b from-[#0d0e0e] via-[#151615] to-[#0d0e0e] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Reveal direction="zoom" delay={0.15} className="liquid-glass-card rounded-3xl p-10 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#b89a62]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#b89a62]">
                Bespoke Spaces
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#f1eee7]">
              Let's Build Your Dream Space
            </h2>
            <p className="mt-6 text-lg text-[#b9b5ae] leading-relaxed font-light max-w-2xl mx-auto">
              Whether it's a private residence, luxury villa, commercial office, or curated hospitality environment — we shape stone into enduring experiences.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="liquid-glass-btn-primary px-8 py-4 text-xs tracking-[0.25em] uppercase text-[#0d0e0e] font-semibold inline-flex items-center justify-center gap-2 shadow-xl"
              >
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="liquid-glass-btn-secondary px-8 py-4 text-xs tracking-[0.25em] uppercase text-[#f1eee7] inline-flex items-center justify-center"
              >
                Contact Page
              </Link>
            </div>
          </Reveal>
        </div>

      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 8. CONTACT PREVIEW SECTION */}
      <section id="contact" className="py-24 md:py-36 relative bg-[#0d0e0e]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal direction="down">
              <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
                Get in Touch
              </p>
            </Reveal>
            <TextReveal
              text="Connect With The Studio"
              as="h2"
              className="text-3xl md:text-5xl font-light text-[#f1eee7]"
              wordClassName="text-[#f1eee7]"
              delay={0.1}
              stagger={0.06}
            />
            <Reveal direction="blur" delay={0.25}>
              <p className="mt-4 text-sm tracking-[0.25em] uppercase text-[#b9b5ae]">
                Inquiries &amp; Consultations
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <Reveal direction="left" className="liquid-glass-card p-8 md:p-10 rounded-3xl">
              {status === 'success' ? (
                <div className="p-8 border border-[#b89a62] bg-[#b89a62]/10 rounded-2xl text-center">
                  <Check className="w-10 h-10 text-[#b89a62] mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-light mb-3 text-[#f1eee7]">Inquiry Received</h3>
                  <p className="text-[#b9b5ae] leading-relaxed">
                    Thank you for reaching out to LUNORE. Our studio representative will contact you shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-xs tracking-[0.3em] uppercase text-[#b89a62] hover:underline"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none resize-none"
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-sm text-red-400">
                      Something went wrong. Please try again.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="liquid-glass-btn-primary w-full py-4 text-xs tracking-[0.25em] uppercase font-semibold text-[#0d0e0e] inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg cursor-pointer"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
                    {status !== 'sending' && <Send className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </Reveal>

            {/* Studio Info */}
            <Reveal direction="right" className="liquid-glass-card p-8 md:p-10 rounded-3xl space-y-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-6">
                  Studio Details
                </h3>
                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="w-5 h-5 text-[#b89a62] flex-shrink-0 mt-1" strokeWidth={1} />
                  <p className="text-[#b9b5ae] leading-relaxed">
                    103 UPPER,ANDHERI INDUSTRAIL ESTATE,<br />
                    OFF VEERA SEAS,<br />
                    Mumbai 400058
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <Phone className="w-5 h-5 text-[#b89a62] flex-shrink-0" strokeWidth={1} />
                  <a href="tel:+919769708628" className="text-[#b9b5ae] hover:text-[#f1eee7] transition-colors">
                    +91 97697 08628
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[#b89a62] flex-shrink-0" strokeWidth={1} />
                  <a
                    href="mailto:support@lunoreluxedecorstudio.com"
                    className="text-[#b9b5ae] hover:text-[#f1eee7] transition-colors break-all"
                  >
                    support@lunoreluxedecorstudio.com
                  </a>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#b89a62] hover:text-white group"
                >
                  View Full Contact &amp; Location Page <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
