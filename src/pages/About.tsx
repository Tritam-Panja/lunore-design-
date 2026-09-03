import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';
import { Reveal } from '@/components/Reveal';

interface TeamMember {
  name: string;
  role: string;
  quote?: string;
  testimonial: string;
  image: string;
}

const directors: TeamMember[] = [
  {
    name: "DINKESH SHARMA",
    role: "Founder & Director — Interior Design & Project Execution",
    quote: "Listen carefully, design thoughtfully, and execute flawlessly.",
    testimonial: "As founder, Dinkesh brings creative vision and craftsmanship to every project. He steers luxury interiors from initial concept through to beautifully realised spaces, whether intimate homes, sprawling villas or hospitality venues. Dinkesh works closely with clients to understand their dreams, and leads a talented design team to bring them to life.",
    image: "/assets/images/Director Dhinkesh.PNG"
  },
  {
    name: "SUCHITRA PANDEY",
    role: "Director — Human Resources",
    quote: "Talented people thrive when nurtured with respect and growth.",
    testimonial: "Suchitra is passionate about building a team where talented people do their best work. She leads recruitment, shapes HR policies, and nurtures a workplace culture grounded in respect, growth and collaboration. As Lunore expands, Suchitra ensures that our people feel valued, supported and connected to our shared mission.",
    image: "/assets/images/Director Suchitra .jpeg"
  },
  {
    name: "CHIRAG GODSE",
    role: "Director — Marketing, Business Development & Aurexa",
    quote: "Every touchpoint tells a story of authentic luxury.",
    testimonial: "Every touchpoint tells a story. Chirag oversees Lunore's brand strategy, digital presence and business development with an eye toward creating memorable experiences. Through Aurexa, his passion project of luxury art events and auctions, Chirag has opened a direct channel to high-net-worth collectors and design influencers.",
    image: "/assets/images/Director Chirag.PNG"
  },
  {
    name: "JITANDAR LOHAR",
    role: "Director — Finance & Administration",
    quote: "Precision and clarity are the foundation of sustainable growth.",
    testimonial: "Jitandar keeps Lunore running smoothly behind the scenes. He manages finances with precision, handles compliance and statutory requirements, and builds the operational systems that let the team focus on creative work. He takes pride in creating a rock-solid foundation for artistic excellence.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=compress&cs=tinysrgb&w=800&q=80"
  },
];

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
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
      if (absDiff === 1) {
        size = 100 * neighborMultiplier;
        opacity = 0.8;
      } else if (absDiff === 2) {
        size = 64 * neighborMultiplier;
        opacity = 0.6;
      } else if (absDiff === 3) {
        size = 36 * neighborMultiplier;
        opacity = 0.4;
      } else {
        size = 20 * neighborMultiplier;
        opacity = 0.2;
      }

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

  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] font-sans selection:bg-white/10 min-h-screen relative overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#b89a62]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Intro Editorial Section */}
      <section className="px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-16 text-center max-w-3xl mx-auto relative z-10">
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#ded9cf] font-light">
              Leadership
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light font-display tracking-tight text-[#f1eee7] leading-tight">
            Directors of Lunore
          </h1>
          <div className="mt-6 w-12 h-[1px] bg-[#b89a62]/40 mx-auto" />
          <p className="mt-6 text-sm sm:text-base text-[#b9b5ae] leading-relaxed font-light max-w-xl mx-auto">
            A collective of visionary leaders, master craftsmen, and design innovators shaping turnkey architectural elegance.
          </p>
        </Reveal>
      </section>

      {/* Directors Interactive Display */}
      <div ref={containerRef} className="relative py-6 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 flex flex-col justify-center relative z-10">
          
          {isMobile ? (
            /* Mobile Vertical Stack Layout with Touch Navigation */
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

              {/* Active Name */}
              <Reveal direction="up" delay={0.15}>
                <h2
                  className="text-xl sm:text-2xl font-normal font-display tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#b89a62] drop-shadow-[0_2px_14px_rgba(184,154,98,0.45)] px-2"
                  style={{ color: '#b89a62' }}
                >
                  {activeMember.name}
                </h2>
              </Reveal>

              {/* Large Portrait with Navigation Arrows */}
              <Reveal direction="zoom" delay={0.2} className="w-full">
                <div className="flex items-center justify-center gap-3 sm:gap-5 w-full">
                  <button
                    onClick={() => setActiveIndex((prev) => (prev === 0 ? directors.length - 1 : prev - 1))}
                    aria-label="Previous Director"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full liquid-glass-btn-secondary border border-[#b89a62]/40 text-[#e6cb97] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] rounded-full overflow-hidden border-2 border-[#b89a62]/50 p-1 bg-[#181917] shadow-[0_0_25px_rgba(0,0,0,0.8),0_0_15px_rgba(184,154,98,0.3)] shrink-0">
                    <LazyImage
                      src={activeMember.image}
                      alt={activeMember.name}
                      className="w-full h-full rounded-full"
                      imgClassName="w-full h-full object-cover rounded-full"
                    />
                  </div>

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

              {/* Mobile Avatar Selector Bar */}
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

              {/* Indicator Dots */}
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
                  <h2
                    className="text-2xl sm:text-3xl font-normal font-display tracking-[0.14em] uppercase text-[#b89a62] block drop-shadow-[0_2px_14px_rgba(184,154,98,0.45)]"
                    style={{ color: '#b89a62' }}
                  >
                    {activeMember.name}
                  </h2>
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
      <section className="py-16 sm:py-24 text-center border-t border-white/10 bg-[#0d0e0e] relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs tracking-[0.25em] uppercase text-[#b9b5ae] mb-6">Explore Our Works</p>
          <Link
            to="/products"
            className="liquid-glass-btn-secondary px-8 py-4 text-xs tracking-[0.3em] uppercase text-[#f1eee7] hover:text-[#b89a62] hover:border-[#b89a62]/60 transition-all inline-flex items-center justify-center gap-2"
          >
            View Signature Collection <ArrowRight className="w-4 h-4 text-[#b89a62]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
