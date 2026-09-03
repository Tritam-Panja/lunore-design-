import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Hammer, Mountain, Eye, Landmark, Ruler, PenTool, Layers, Check, MapPin, Phone, Mail, Send, MessageCircle, ArrowUpRight, AlertCircle } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/SocialIcons';
import { supabase, type Product } from '@/lib/supabase';
import { sendContactInquiry } from '@/lib/contactService';
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
const AurexaSection = lazy(() => import('@/components/AurexaSection').then(m => ({ default: m.AurexaSection })));


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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const aboutRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Battery & CPU Optimization: Pause hero video when out of viewport or tab hidden
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else if (hero.getBoundingClientRect().bottom > 0) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

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

  // Idle pre-warm heavy 3D and interactive experiences so code chunks are cached before user scrolls
  useEffect(() => {
    const prewarmChunks = () => {
      import('@/components/InteriorExperience');
      import('@/components/SculpturesExperience');
      import('@/components/MarbleExperience');
      import('@/components/AurexaSection');
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number }).requestIdleCallback(prewarmChunks, { timeout: 1500 });
      return () => {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
      };
    } else {
      const timer = setTimeout(prewarmChunks, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll handler for scroll-driven index update (RAF throttled to avoid layout thrashing)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (aboutRef.current) {
            const rect = aboutRef.current.getBoundingClientRect();
            const totalHeight = rect.height - window.innerHeight;
            if (totalHeight > 0) {
              const progress = Math.max(0, Math.min(0.999, -rect.top / totalHeight));
              const step = 1 / directors.length;
              const index = Math.floor(progress / step);
              setActiveIndex(Math.max(0, Math.min(directors.length - 1, index)));
            }
          }
          ticking = false;
        });
      }
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
    setErrorMessage('');

    const result = await sendContactInquiry({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    if (!result.success) {
      setStatus('error');
      setErrorMessage(result.message || 'Something went wrong. Please try again.');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="relative bg-[#0d0e0e] text-[#f1eee7]">
      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        id="hero"
        className="relative w-full min-h-[88svh] sm:min-h-[90dvh] md:h-screen md:min-h-[600px] overflow-hidden bg-[#0d0e0e] flex items-center pt-24 sm:pt-28 md:pt-0"
      >
        {/* Background Hero Video */}
        <div className="absolute inset-0 flex justify-end items-center overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/images/hero.jpg"
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 flex items-center">
          <div className="max-w-xl text-left">
            {/* Main L U N O R E Wordmark with Golden Glowing N */}
            <h1
              className="text-[clamp(1.95rem,8.5vw,3.2rem)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-[0.06em] sm:tracking-[0.16em] uppercase text-[#f1eee7] leading-none select-none whitespace-nowrap"
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

            {/* Tagline (Positioned below the letter U, clean look without line) */}
            <div className="mt-3 sm:mt-6 ml-[6%] sm:ml-[16%] md:ml-[17%] lunore-brand-letter" style={{ animationDelay: '1s' }}>
              <p className="text-[9px] sm:text-sm md:text-[23px] tracking-[0.18em] sm:tracking-[0.30em] uppercase text-[#e2ddd3] font-light whitespace-nowrap">
                Luxe Decor Studio
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

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 3. INTERACTIVE INTERIOR EXPERIENCE SECTION (LAZY MOUNTED) */}
      <LazySection minHeight="600px" rootMargin="1200px">
        <Suspense fallback={<div className="w-full min-h-[600px] bg-[#0d0e0e]" />}>
          <InteriorExperience />
        </Suspense>
      </LazySection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 4. FEATURED PROJECTS & SIGNATURE COLLECTION SECTION (LAZY MOUNTED) */}
      <LazySection minHeight="600px" rootMargin="1200px">
        <Suspense fallback={<div className="w-full min-h-[600px] bg-[#0d0e0e]" />}>
          <SculpturesExperience />
        </Suspense>
      </LazySection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 5. MARBLE EXPERIENCE INTERACTIVE SECTION (LAZY MOUNTED) */}
      <LazySection minHeight="600px" rootMargin="1200px">
        <Suspense fallback={<div className="w-full min-h-[600px] bg-[#08090a]" />}>
          <MarbleExperience />
        </Suspense>
      </LazySection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 6. AUREXA HAUTE STONE SECTION (LAZY MOUNTED WITH GRADUAL BLUR) */}
      <LazySection minHeight="600px" rootMargin="1200px">
        <Suspense fallback={<div className="w-full min-h-[600px] bg-[#0a0b0c]" />}>
          <AurexaSection />
        </Suspense>
      </LazySection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 7. DIRECTORS OF LUNORE SECTION (TEAM PARADE) */}
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
                  <div className="flex items-center justify-center gap-3 sm:gap-5 w-full px-2">
                    {/* Previous Arrow */}
                    <button
                      onClick={() => setActiveIndex((prev) => (prev === 0 ? directors.length - 1 : prev - 1))}
                      aria-label="Previous Director"
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full liquid-glass-btn-secondary border border-[#b89a62]/40 text-[#e6cb97] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer shrink-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Main Avatar */}
                    <div className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden border-2 border-[#b89a62]/50 p-1 bg-[#181917] shadow-[0_0_25px_rgba(0,0,0,0.8),0_0_15px_rgba(184,154,98,0.3)] shrink-0">
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
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full liquid-glass-btn-secondary border border-[#b89a62]/40 text-[#e6cb97] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer shrink-0"
                    >
                      <ChevronRight className="w-5 h-5" />
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
                    <div className="flex items-center justify-center gap-2.5 sm:gap-3 px-2">
                      {directors.map((member, idx) => (
                        <button
                          key={member.name}
                          onClick={() => setActiveIndex(idx)}
                          aria-label={`Select ${member.name}`}
                          className={`relative rounded-full overflow-hidden flex-shrink-0 transition-all duration-300 cursor-pointer p-0.5 ${
                            idx === activeIndex
                              ? 'w-11 h-11 sm:w-12 sm:h-12 border-2 border-[#b89a62] scale-110 shadow-[0_0_15px_rgba(184,154,98,0.5)]'
                              : 'w-9 h-9 sm:w-10 sm:h-10 opacity-45 hover:opacity-80 border border-white/10'
                          }`}
                        >
                          <LazyImage
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full rounded-full"
                            imgClassName="w-full h-full object-cover rounded-full"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Mobile Dots */}
                <Reveal direction="blur" delay={0.35}>
                  <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                    {directors.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Select director ${idx + 1}`}
                        className={`h-2 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeIndex ? 'w-7 bg-[#b89a62]' : 'w-2 bg-white/20 hover:bg-white/40'
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
                    <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-start gap-2.5 leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage || 'Something went wrong. Please try again or reach out via WhatsApp/Phone.'}</span>
                    </div>
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
                  <p className="text-[#cfcac0] leading-relaxed text-sm font-sans font-light tracking-wide">
                    103 UPPER, ANDHERI INDUSTRIAL ESTATE,<br />
                    OFF VEERA DESAI ROAD, NEAR YASH RAJ FILMS, OPP CHITRAKOOT BANQUETS,<br />
                    ANDHERI WEST, MUMBAI 400053
                  </p>
                </div>

                {/* Clickable Direct Phone */}
                <div className="flex items-center gap-4 mb-5">
                  <Phone className="w-5 h-5 text-[#b89a62] flex-shrink-0" strokeWidth={1} />
                  <a
                    href="tel:+919769708628"
                    className="text-[#cfcac0] hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-2 group cursor-pointer text-sm font-sans font-normal tracking-wider"
                  >
                    <span>+91 97697 08628</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#b89a62]" />
                  </a>
                </div>

                {/* Social Channels: Filled Instagram & LinkedIn */}
                <div className="pt-2 pb-4 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#C13584] hover:brightness-110 text-xs text-white font-medium shadow-[0_3px_16px_rgba(225,48,108,0.35)] hover:shadow-[0_4px_22px_rgba(225,48,108,0.55)] transition-all duration-300 group cursor-pointer"
                    title="Follow Lunore on Instagram"
                  >
                    <InstagramIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-white tracking-wide">Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#0077B5] to-[#0A66C2] hover:brightness-110 text-xs text-white font-medium shadow-[0_3px_16px_rgba(10,102,194,0.35)] hover:shadow-[0_4px_22px_rgba(10,102,194,0.55)] transition-all duration-300 group cursor-pointer"
                    title="Connect with Lunore on LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-white tracking-wide">LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                {/* Direct Action Card Buttons: Email & WhatsApp */}
                <div className="space-y-3 pt-2">
                  {/* Direct Email Card Button */}
                  <a
                    href="mailto:support@lunoreluxedecorstudio.com"
                    className="group/mail cursor-pointer relative overflow-hidden inline-flex items-center justify-center gap-3.5 w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#b89a62]/20 via-[#b89a62]/10 to-[#8c7343]/20 hover:from-[#b89a62]/30 hover:to-[#8c7343]/30 border border-[#b89a62]/40 hover:border-[#b89a62] text-white shadow-[0_4px_20px_rgba(184,154,98,0.15)] hover:shadow-[0_6px_28px_rgba(184,154,98,0.3)] transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#b89a62]/25 flex items-center justify-center text-[#f3e5ab] group-hover/mail:scale-110 transition-transform flex-shrink-0">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col text-left flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] uppercase tracking-[0.2em] font-semibold text-white">Contact via Email</span>
                      <span className="text-xs sm:text-[13px] text-[#f3e5ab] font-medium tracking-normal truncate">support@lunoreluxedecorstudio.com</span>
                    </div>
                    <ArrowUpRight className="w-4.5 h-4.5 text-[#f3e5ab] ml-auto group-hover/mail:translate-x-0.5 group-hover/mail:-translate-y-0.5 transition-transform flex-shrink-0" />
                  </a>

                  {/* Direct WhatsApp Concierge Button */}
                  <a
                    href="https://wa.me/919769708628?text=Hello%20Lunore%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20bespoke%20stone%20and%20interior%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/wa cursor-pointer relative overflow-hidden inline-flex items-center justify-center gap-3.5 w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#25D366]/20 via-[#25D366]/10 to-[#128C7E]/20 hover:from-[#25D366]/30 hover:to-[#128C7E]/30 border border-[#25D366]/40 hover:border-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.15)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.3)] transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#25D366]/25 flex items-center justify-center text-[#25D366] group-hover/wa:scale-110 transition-transform flex-shrink-0">
                      <MessageCircle className="w-4.5 h-4.5 fill-current" />
                    </div>
                    <div className="flex flex-col text-left flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] uppercase tracking-[0.2em] font-semibold text-white">Contact via WhatsApp</span>
                      <span className="text-xs sm:text-[12px] text-[#25D366] font-medium tracking-wide">Direct Concierge • Instant Response</span>
                    </div>
                    <ArrowUpRight className="w-4.5 h-4.5 text-[#25D366] ml-auto group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5 transition-transform flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
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
