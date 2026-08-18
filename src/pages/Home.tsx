import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hammer, Mountain, Eye, Landmark, Ruler, PenTool, Layers, Check, Sparkles, MapPin, Phone, Mail, Send } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';
import { ScrollLine } from '@/components/ScrollLine';
import { InteriorExperience } from '@/components/InteriorExperience';

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
                Spaces with Character
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY INTERIOR GALLERY TRANSITION THRESHOLD */}
      <div className="relative z-10 w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.3)] to-transparent" />

      {/* 2. BRAND STORY PREVIEW SECTION */}
      <section id="brand-story" className="py-20 sm:py-24 md:py-36 relative overflow-hidden bg-[#111211]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
              about Lunore 
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-light leading-tight text-[#f1eee7]">
              The Space that only you could live in 
            </h2>
            <div className="mt-6 sm:mt-8 w-16 h-px bg-[#b89a62] mx-auto" />
          </Reveal>

          <Reveal delay={0.1} className="mt-8 sm:mt-10">
            <p className="text-base sm:text-lg md:text-xl text-[#b9b5ae] leading-relaxed font-light px-2">
              Luxury homes begin with three things: exquisite space, exceptional materials, and meaningful art. Lunore masters all three. From turnkey interior design to premium marble sourcing to curated sculptures and paintings, we deliver homes that are completely, irreplaceably yours.
            </p>
          </Reveal>
        </div>

        {/* Organic Curved Scroll Line - Brand Story */}
        <ScrollLine
          path="M 50,0 C 250,150 750,50 950,200 C 1150,350 150,450 500,550"
          viewBox="0 0 1000 600"
          className="absolute inset-0 z-0 opacity-30 md:opacity-60 pointer-events-none"
          strokeColor="rgba(184, 154, 98, 0.35)"
          strokeWidth={1.5}
        />
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 3. ABOUT PREVIEW SECTION (TEAM PARADE) */}
      <section id="about" className="bg-[#0d0e0e] text-[#f1eee7] font-sans selection:bg-white/10 relative overflow-hidden">
        {/* Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#b89a62]/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

        {/* Intro Editorial Header */}
        <div className="px-6 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 text-center max-w-3xl mx-auto relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-3">
            Leadership
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-display tracking-tight text-[#f1eee7] leading-tight">
            Directors of Lunore
          </h2>
          <div className="mt-6 w-12 h-[1px] bg-[#b89a62]/40 mx-auto" />
        </div>

        {/* Interactive Directors Parade */}
        <div className="relative py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 flex flex-col justify-center relative">
            
            {isMobile ? (
              /* Mobile Vertical Stack Layout */
              <div className="flex flex-col items-center justify-center text-center space-y-5">
                {/* Active Role Label */}
                <div className="flex flex-col items-center px-4">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#b89a62] font-medium">
                    {activeMember.role}
                  </span>
                  <div className="w-8 h-[1px] bg-[#b89a62]/40 mt-2" />
                </div>

                {/* Active Name */}
                <h3 className="text-xl sm:text-2xl font-normal font-display text-[#f1eee7]">
                  {activeMember.name}
                </h3>

                {/* Large Portrait */}
                <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-full overflow-hidden border-2 border-[#b89a62]/40 p-1 bg-[#181917] shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_20px_rgba(184,154,98,0.2)]">
                  <img
                    src={activeMember.image}
                    alt={activeMember.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Testimonial Quote & Text */}
                <div className="max-w-md px-4 mt-2">
                  <span className="text-4xl font-serif text-[#b89a62] opacity-40 leading-none select-none block mb-1">“</span>
                  <p
                    className="text-sm leading-relaxed font-light font-display italic tracking-wide"
                    style={{ color: '#e6cb97' }}
                  >
                    {activeMember.testimonial}
                  </p>
                </div>

                {/* Mobile Avatar Parade (Centered Row) */}
                <div className="w-full pt-4 overflow-x-auto no-scrollbar">
                  <div className="flex items-center justify-center gap-3 px-4">
                    {directors.map((member, idx) => (
                      <button
                        key={member.name}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative rounded-full overflow-hidden flex-shrink-0 transition-all duration-300 ${
                          idx === activeIndex
                            ? 'w-12 h-12 border-2 border-[#b89a62] scale-110 shadow-[0_0_20px_rgba(184,154,98,0.5)]'
                            : 'w-9 h-9 opacity-40 hover:opacity-80 border border-white/10'
                        }`}
                      >
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Dots */}
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
              </div>
            ) : (
              /* Desktop & Tablet Layout */
              <div className="relative w-full min-h-[520px] flex flex-col justify-between">
                
                {/* Active Role and Name label above the central portrait */}
                <div className="text-center mb-4 z-40">
                  <span className="text-xs tracking-[0.3em] uppercase text-[#b89a62] block font-medium">
                    {activeMember.role}
                  </span>
                  <div className="w-8 h-[1px] bg-[#b89a62]/40 mx-auto my-2" />
                  <span className="text-base font-normal tracking-wide text-[#f1eee7] block">
                    {activeMember.name}
                  </span>
                </div>

                {/* Horizontal Parade Field */}
                <div className="relative w-full h-[260px] sm:h-[300px] flex items-center justify-center">
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
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full select-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Centered Testimonial & Quote for perfect tablet & desktop symmetry */}
                <div className="w-full max-w-2xl mx-auto text-center px-6 mt-4">
                  <span className="text-4xl font-serif text-[#b89a62] opacity-40 leading-none select-none block mb-1">“</span>
                  <p
                    className="text-base sm:text-lg font-light font-display italic leading-relaxed tracking-wide"
                    style={{ color: '#e6cb97' }}
                  >
                    {activeMember.testimonial}
                  </p>
                </div>

                {/* Navigation Dots */}
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

        {/* Organic Curved Scroll Line - Flowing smoothly along the side periphery framing the directors */}
        <ScrollLine
          path="M 880,0 C 960,180 970,340 880,440 C 760,540 840,680 890,780 C 940,880 780,930 640,950"
          viewBox="0 0 1000 950"
          className="absolute inset-0 z-0 opacity-30 md:opacity-50 pointer-events-none"
          strokeColor="rgba(184, 154, 98, 0.45)"
          strokeWidth={1.6}
          glow={true}
        />
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 4. INTERACTIVE INTERIOR EXPERIENCE SECTION */}
      <InteriorExperience />

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 5. FEATURED PROJECTS & SIGNATURE COLLECTION SECTION */}
      <section id="projects" className="py-24 md:py-36 relative overflow-hidden bg-[#0d0e0e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-3">
                Featured Portfolio
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-[#f1eee7]">Signature Sculptures</h2>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#b9b5ae] hover:text-[#b89a62] transition-colors group"
            >
              View Full Collection <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Marquee Carousel */}
        <div className="overflow-hidden mb-20">
          <div className="marquee-track flex gap-6 px-6 lg:px-10 pb-4">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group w-[280px] md:w-[320px] flex-shrink-0"
              >
                <Placeholder
                  className="aspect-[3/4] mb-5 gold-frame"
                  label={p.category}
                  src={images.products[p.name]}
                />
                <h3 className="text-xl font-light text-[#f1eee7] group-hover:text-[#b89a62] transition-colors">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#b9b5ae]">
                  {p.category}
                </p>
              </Link>
            ))}
            {/* Duplicate set for seamless infinite loop */}
            {products.map((p) => (
              <Link
                key={`dup-${p.id}`}
                to={`/products/${p.id}`}
                className="group w-[280px] md:w-[320px] flex-shrink-0"
                aria-hidden="true"
              >
                <Placeholder
                  className="aspect-[3/4] mb-5 gold-frame"
                  label={p.category}
                  src={images.products[p.name]}
                />
                <h3 className="text-xl font-light text-[#f1eee7] group-hover:text-[#b89a62] transition-colors">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#b9b5ae]">
                  {p.category}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Visionary Concepts Grid Preview */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 border-t border-[rgba(184,154,98,0.16)] pt-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-2">
                Conceptual Works
              </p>
              <h3 className="text-2xl md:text-4xl font-light text-[#f1eee7]">Dream Projects</h3>
            </div>
            <Link
              to="/dream-project"
              className="mt-4 md:mt-0 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#b9b5ae] hover:text-[#b89a62] transition-colors group"
            >
              Explore Dream Projects <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dreamConcepts.map((item, i) => (
              <Reveal key={item.title} direction="up" delay={i * 0.08}>
                <Placeholder
                  className="aspect-[4/3] mb-4"
                  label={item.title}
                  src={images.dreamProject[item.title]}
                />
                <h4 className="text-lg font-light text-[#f1eee7]">{item.title}</h4>
                <p className="text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mt-1">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Organic Curved Scroll Line - Projects */}
        <ScrollLine
          path="M 100,0 C 400,200 100,500 600,300 C 1000,100 800,600 1100,700"
          viewBox="0 0 1000 700"
          className="absolute inset-0 z-0 opacity-25 md:opacity-45"
          strokeColor="rgba(184, 154, 98, 0.35)"
          strokeWidth={1.5}
        />
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 6. DESIGN PHILOSOPHY & PROCESS SECTION */}
      <section id="process" className="py-24 md:py-36 relative bg-[#111211]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
              Design Philosophy
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-[#f1eee7]">Hand-Carved Excellence</h2>
            <p className="mt-6 text-lg text-[#b9b5ae] leading-relaxed font-light">
              Every masterpiece follows a journey of intense dedication and reverence for natural stone.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((s, i) => (
              <Reveal key={s.num} direction="up" delay={i * 0.1} className="p-8 rounded-3xl liquid-glass-card relative z-10">
                <span className="text-4xl md:text-5xl font-light text-[#b89a62] block mb-4">
                  {s.num}
                </span>
                <h3 className="text-xl font-light mb-3 text-[#f1eee7]">{s.title}</h3>
                <div className="w-10 h-px bg-[#b89a62]/60 mb-4" />
                <p className="text-sm text-[#b9b5ae] leading-relaxed font-light">{s.desc}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Reveal>
              <Link
                to="/process"
                className="liquid-glass-btn-secondary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-[0.25em] uppercase text-[#f1eee7] group shadow-lg"
              >
                Discover Full Process <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Organic Flowing Curve connecting Process Steps 01 -> 02 -> 03 */}
        <ScrollLine
          path="M 120,280 C 250,180 350,380 500,280 C 650,180 750,380 880,280"
          viewBox="0 0 1000 500"
          className="absolute inset-0 z-0 opacity-40 md:opacity-65"
          strokeColor="rgba(184, 154, 98, 0.45)"
          strokeWidth={1.8}
          glow={true}
        />
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 7. CALL TO ACTION (CTA) SECTION */}
      <section id="cta" className="py-20 md:py-32 relative text-center bg-gradient-to-b from-[#0d0e0e] via-[#151615] to-[#0d0e0e] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Reveal className="liquid-glass-card rounded-3xl p-10 md:p-16 text-center">
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

        {/* Organic Curved Scroll Line guiding eye toward CTA */}
        <ScrollLine
          path="M 0,250 C 300,50 700,450 1000,250"
          viewBox="0 0 1000 500"
          className="absolute inset-0 z-0 opacity-40 md:opacity-60"
          strokeColor="rgba(184, 154, 98, 0.4)"
          strokeWidth={1.5}
        />
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 8. CONTACT PREVIEW SECTION */}
      <section id="contact" className="py-24 md:py-36 relative bg-[#0d0e0e]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
              Get in Touch
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-[#f1eee7]">Connect With The Studio</h2>
            <p className="mt-4 text-sm tracking-[0.25em] uppercase text-[#b9b5ae]">
              Inquiries &amp; Consultations
            </p>
          </Reveal>

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
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
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
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
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
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
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
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
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
                    57 Heera Panna M.R. No.2, MHADA Layout,<br />
                    Oshiwara, Jogeshwari(W), Near Dhaba,<br />
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
