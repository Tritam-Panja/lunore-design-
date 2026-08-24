import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  quote: string;
  testimonial: string;
  image: string;
}

const directors: TeamMember[] = [
  {
    name: "Marcus Vane",
    role: "Founding Director & Principal Sculptor",
    quote: "Stone is the language of geological time.",
    testimonial: "To carve is to listen to the stone's memory. We do not impose our will; we release the form that has waited for millennia inside the quarry.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Elena Rostova",
    role: "Co-Director & Head of Stone Sourcing",
    quote: "Every quarry tells a story of the deep Earth.",
    testimonial: "I travel the world to find monoliths that possess a singular soul. The line, the density, the mineral veining—they are the DNA of our future legacy.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Aidan Sterling",
    role: "Lead Structural Engineer",
    quote: "Gravitational balance is silent poetry.",
    testimonial: "A monumental sculpture must defy gravity while respecting the natural physics of the stone. We merge engineering rigor with pure artistic expression.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Sienna Moretti",
    role: "Master Carver & Finishing Artist",
    quote: "The final polish is a reflection of light.",
    testimonial: "In the final stages, the tool marks give way to smooth, light-absorbing planes. It is the moment the raw granite transforms into fluid silk.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Julian Vance",
    role: "Architectural Integration Director",
    quote: "Art should define the space it occupies.",
    testimonial: "We collaborate with architects from day one, ensuring that each monumental installation becomes a permanent, structural component of the space.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Clara Thorne",
    role: "Art Historian & Design Custodian",
    quote: "We design for the next five hundred years.",
    testimonial: "Our references span classical antiquity and modern brutalism. We seek a timeless aesthetic that refuses to acknowledge passing trends.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Viktor Petrov",
    role: "Senior Stone Artisan",
    quote: "The chisel is an extension of the heartbeat.",
    testimonial: "Hand-carving is a meditative labor. Every impact is precise, guided by decades of feeling the resistance, grain, and temperature of the rock.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Nadia Al-Jamil",
    role: "Spatial Curator",
    quote: "Placement dictates how a sculpture breathes.",
    testimonial: "The void around a sculpture is as important as the mass itself. We orchestrate shadows, natural light, and viewing angles to maximize emotional scale.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=compress&cs=tinysrgb&w=800&q=80"
  },
  {
    name: "Thomas Drake",
    role: "Director of Monumental Projects",
    quote: "We build landmarks, not simple displays.",
    testimonial: "Our scale is civic and residential-monumental. We aim to install works of stone that become focal points for communities and generational estates.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=compress&cs=tinysrgb&w=800&q=80"
  }
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

  // Scroll handler for scroll-driven index update with RAF throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
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
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

  return (
    <div className="bg-[#F2F0E6] text-[#2b2a27] font-sans selection:bg-[#2b2a27]/10 min-h-screen">
      {/* Intro Editorial Section */}
      <section className="px-6 pt-32 pb-16 md:pt-44 md:pb-20 text-center max-w-3xl mx-auto">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#85817a] mb-4">Studio Leadership</p>
        <h1 className="text-4xl md:text-6xl font-light font-display tracking-tight text-[#1a1a19] leading-tight">
          Directors of Lunore
        </h1>
        <div className="mt-8 w-12 h-[1px] bg-[#2b2a27]/20 mx-auto" />
        <p className="mt-8 text-base md:text-lg text-[#65625c] leading-relaxed font-light">
          A collective of master sculptors, visionary curators, and innovative architects shaping monumental geological art. Scroll down to meet the team.
        </p>
      </section>      {/* Sticky Scroll container */}
      <div ref={containerRef} className="relative h-[600vh]">
        {/* Sticky wrapper */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col h-full justify-center relative">
            
            {isMobile ? (
              /* Mobile Vertical Stack Layout */
              <div className="flex flex-col items-center justify-center text-center space-y-6 pt-10">
                {/* Active Role Label */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#2b2a27] font-medium">
                    {activeMember.role}
                  </span>
                  <div className="w-8 h-[1px] bg-[#2b2a27]/30 mt-2" />
                </div>

                {/* Active Name */}
                <h2 className="text-2xl font-normal font-display text-[#1a1a19]">
                  {activeMember.name}
                </h2>

                {/* Large Portrait */}
                <div className="w-[180px] h-[180px] rounded-full overflow-hidden border border-[#2b2a27]/10 p-1 bg-[#F2F0E6]">
                  <img
                    src={activeMember.image}
                    alt={activeMember.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Testimonial Quote & Text */}
                <div className="max-w-md px-4 mt-2">
                  <span className="text-5xl font-serif text-[#85817a] opacity-30 leading-none select-none block">“</span>
                  <p className="text-sm font-light text-[#65625c] leading-relaxed italic mb-3">
                    "{activeMember.quote}"
                  </p>
                  <p className="text-xs text-[#85817a] leading-relaxed font-light">
                    {activeMember.testimonial}
                  </p>
                </div>

                {/* Mobile Avatar Parade (Centered Row) */}
                <div className="w-full pt-4 overflow-x-auto no-scrollbar">
                  <div className="flex items-center justify-center gap-3 px-6">
                    {directors.map((member, idx) => (
                      <button
                        key={member.name}
                        onClick={() => {
                          const scrollElement = containerRef.current;
                          if (scrollElement) {
                            const stepHeight = (scrollElement.scrollHeight - window.innerHeight) / directors.length;
                            window.scrollTo({
                              top: scrollElement.offsetTop + (idx * stepHeight) + 10,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`relative rounded-full overflow-hidden flex-shrink-0 transition-all duration-500 ${
                          idx === activeIndex
                            ? 'w-12 h-12 border border-[#2b2a27]/40 scale-110'
                            : 'w-8 h-8 opacity-40 hover:opacity-80'
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
              </div>
            ) : (
              /* Desktop & Tablet Layout */
              <div className="relative w-full h-[550px] flex flex-col justify-between">
                
                {/* Upper Section: Parade and Role Label */}
                <div className="relative w-full h-[320px]">
                  
                  {/* Role and Name label above the central portrait */}
                  <div className="absolute left-[38%] translate-x-[-125px] top-4 z-40 w-[250px] text-left pointer-events-none">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#2b2a27] block font-medium">
                      {activeMember.role}
                    </span>
                    <div className="w-8 h-[1px] bg-[#2b2a27]/30 my-2" />
                    <span className="text-sm font-normal tracking-wide text-[#1a1a19] block">
                      {activeMember.name}
                    </span>
                  </div>

                  {/* Horizontal Parade Field */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                      {directors.map((member, idx) => {
                        const { size, opacity, x } = getAvatarStyle(idx);
                        const isActive = idx === activeIndex;

                        return (
                          <div
                            key={member.name}
                            onClick={() => {
                              const scrollElement = containerRef.current;
                              if (scrollElement) {
                                const stepHeight = (scrollElement.scrollHeight - window.innerHeight) / directors.length;
                                window.scrollTo({
                                  top: scrollElement.offsetTop + (idx * stepHeight) + 10,
                                  behavior: 'smooth'
                                });
                              }
                            }}
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              opacity: opacity,
                              transform: `translate3d(${x}px, ${isActive ? 15 : 0}px, 0)`,
                              zIndex: isActive ? 30 : 20 - Math.abs(idx - activeIndex),
                              willChange: 'transform, opacity',
                            }}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden cursor-pointer transition-all ease-[cubic-bezier(0.16,1,0.3,1)] duration-700 ${
                              isActive ? 'p-1.5 border border-[#2b2a27]/10 bg-[#F2F0E6]' : ''
                            }`}
                          >
                            <img
                              src={member.image}
                              alt={member.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover rounded-full select-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Lower Section: Testimonial & Quote (Offset to the right, beneath active portrait) */}
                <div className="w-full grid grid-cols-12 relative z-30">
                  <div className="col-start-6 col-span-6 md:col-start-6 md:col-span-5 text-left pl-4">
                    {/* Oversized Quote Marks */}
                    <span className="text-7xl font-serif text-[#85817a] opacity-15 leading-none select-none block -mb-4 -ml-2">
                      “
                    </span>
                    {/* Quote statement */}
                    <p className="text-base font-light font-display italic text-[#4a4843] mb-2 leading-relaxed">
                      "{activeMember.quote}"
                    </p>
                    {/* Muted testimonial paragraph */}
                    <p className="text-xs text-[#85817a] font-light leading-relaxed max-w-md">
                      {activeMember.testimonial}
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer Navigation Link back to collection */}
      <section className="py-24 text-center border-t border-[#2b2a27]/10 bg-[#F2F0E6]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs tracking-[0.2em] uppercase text-[#85817a] mb-6">explore our works</p>
          <Link
            to="/products"
            className="px-8 py-4 border border-[#2b2a27]/20 text-xs tracking-[0.3em] uppercase text-[#2b2a27] hover:bg-[#2b2a27] hover:text-[#F2F0E6] transition-all inline-flex items-center justify-center gap-2"
          >
            View Signature Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
