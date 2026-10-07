import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { ReturnToHome } from '@/components/ReturnToHome';
import { INTERIOR_DOMAINS } from '@/components/InteriorExperience';

interface UpcomingProject {
  id: string;
  title: string;
  category: string;
  location: string;
  tagline: string;
  image: string;
  status: string;
  description: string;
  materials: string[];
  scope: string;
  targetYear: string;
}

const UPCOMING_PROJECTS: UpcomingProject[] = [
  {
    id: 'up-01',
    title: 'The Monolith Villa',
    category: 'Coastal Architectural Sanctuary',
    location: 'Alibaug, Maharashtra',
    tagline: 'Rough-Hewn Basalt & Sea Cantilever',
    image: '/assets/images/imagetrail1.webp',
    status: 'Breaking Ground Q4 2026',
    description:
      'A sea-facing monolithic sanctuary sculpted from raw black basalt and marine-grade brushed bronze. Expansive structural cantilevers suspend private terraces directly over coastal rock pools, housing dedicated subterranean stone art galleries and reflection water basins.',
    materials: ['Black Basalt Monoliths', 'Brushed Marine Bronze', 'Flamed Travertine'],
    scope: 'Full Turnkey Architecture, Landscape Sourcing & Custom Monoliths',
    targetYear: '2026 – 2027',
  },
  {
    id: 'up-02',
    title: 'The Celestial Duplex',
    category: 'Panoramic Skyline Horizon',
    location: 'Worli, Mumbai',
    tagline: 'Vein-Matched Statuario & Kinetic Glass',
    image: '/assets/images/imagetrail3.webp',
    status: 'Architectural Detailing',
    description:
      'A double-height sky residence commanding 360-degree Arabian Sea vistas. Designed around acoustic tranquility high above the metropolis, featuring book-matched Italian Statuario walls, sound-isolated private study suites, and circadian golden-hour lighting automation.',
    materials: ['Italian Bookmatched Statuario', 'Acoustic Suede Boiserie', 'Smoked Belgian Glass'],
    scope: 'Interior Architecture, Custom Joinery & Bespoke Lighting Engineering',
    targetYear: 'Late 2026',
  },
  {
    id: 'up-03',
    title: 'Brutalist Garden Pavilion',
    category: 'Biophilic Stone & Concrete Estate',
    location: 'Lonavala, Maharashtra',
    tagline: 'Board-Formed Concrete & Rare Quartzite',
    image: '/assets/images/imagetrail4.webp',
    status: 'In Concept & Spatial Planning',
    description:
      'An expansive hillside retreat nestled among mature banyan trees. Juxtaposes raw board-formed architectural concrete with illuminated green quartzite feature monoliths, allowing mist and natural rainfall to interact with tactile, enduring stone textures.',
    materials: ['Board-Formed Concrete', 'Rare Emerald Quartzite', 'Reclaimed Teak'],
    scope: 'Turnkey Architectural Construction & Monolith Art Commissioning',
    targetYear: '2027',
  },
  {
    id: 'up-04',
    title: 'The Dune Sanctuary',
    category: 'Heritage Stone Interpretation',
    location: 'Jodhpur, Rajasthan',
    tagline: 'Chiseled Sandstone & Courtyard Water Datum',
    image: '/assets/images/imagetrail5.webp',
    status: 'Material Curation Phase',
    description:
      'A contemporary reimagining of desert palatial architecture. Hand-chiseled local golden sandstone forms thermal-mass envelopes around quiet courtyard pools, providing passive geothermal cooling and dramatic interplay between deep shadow and intense sun.',
    materials: ['Chiseled Jodhpur Sandstone', 'Natural Lime Wash', 'Aged Copper Accents'],
    scope: 'Architectural Concept, Stone Sourcing & Interior Atmosphere',
    targetYear: '2027',
  },
];

type ProjectFilter = 'all' | 'completed' | 'upcoming';

export function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>('all');

  const showCompleted = filter === 'all' || filter === 'completed';
  const showUpcoming = filter === 'all' || filter === 'upcoming';

  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] min-h-screen relative overflow-hidden">
      {/* Subtle Ambient Radial Glows */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(184,154,98,0.1)_0%,rgba(184,154,98,0.03)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(184,154,98,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Return to Home Button */}
      <ReturnToHome />

      {/* Main Page Hero */}
      <section className="px-4 sm:px-6 pt-4 sm:pt-8 md:pt-10 pb-10 sm:pb-16 text-center max-w-5xl mx-auto relative z-10">
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill mb-4 sm:mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b89a62]">Portfolio Archive</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#f1eee7] tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Visionary Works
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-[#b9b5ae] font-light tracking-[0.14em] uppercase max-w-2xl mx-auto">
            Signature Built Residences &amp; Upcoming Architectural Commissions
          </p>
          <div className="mt-6 sm:mt-8 w-20 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
        </Reveal>

        {/* Filter Pills */}
        <Reveal direction="up" delay={0.1} className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
              filter === 'all'
                ? 'bg-[#b89a62] text-[#0d0e0e] font-semibold shadow-[0_0_25px_rgba(184,154,98,0.35)]'
                : 'liquid-glass-pill text-[#ded9cf]/80 hover:text-white hover:border-[#b89a62]/60'
            }`}
          >
            All Works ({INTERIOR_DOMAINS.length + UPCOMING_PROJECTS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
              filter === 'completed'
                ? 'bg-[#b89a62] text-[#0d0e0e] font-semibold shadow-[0_0_25px_rgba(184,154,98,0.35)]'
                : 'liquid-glass-pill text-[#ded9cf]/80 hover:text-white hover:border-[#b89a62]/60'
            }`}
          >
            Our Projects ({INTERIOR_DOMAINS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('upcoming')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-[#b89a62] text-[#0d0e0e] font-semibold shadow-[0_0_25px_rgba(184,154,98,0.35)]'
                : 'liquid-glass-pill text-[#ded9cf]/80 hover:text-white hover:border-[#b89a62]/60'
            }`}
          >
            Upcoming Projects ({UPCOMING_PROJECTS.length})
          </button>
        </Reveal>
      </section>

      {/* SECTION 1: OUR PROJECTS (COMPLETED RESIDENCES) */}
      {showCompleted && (
        <section className={`py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 ${!showUpcoming ? 'pb-24 sm:pb-36' : ''}`}>
          <div className="flex items-baseline justify-between mb-8 sm:mb-12 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b89a62]" />
                <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#b89a62] font-semibold">
                  Completed Living Spaces
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f1eee7]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Our Projects
              </h2>
            </div>
            <span className="text-xs font-mono text-[#85817a]">
              0{INTERIOR_DOMAINS.length} Residences
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {INTERIOR_DOMAINS.map((project, idx) => (
              <Reveal key={project.title} delay={idx * 0.06}>
                <Link
                  to={project.path}
                  className="group liquid-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between h-full border border-white/10 hover:border-[#b89a62]/60 transition-all duration-400 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(184,154,98,0.2)] block overflow-hidden"
                >
                  {/* Project Image */}
                  <div className="relative aspect-[16/11] rounded-xl sm:rounded-2xl overflow-hidden bg-black/50 mb-5 border border-white/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Top Tag Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] tracking-wider uppercase">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-[#b89a62] font-semibold shadow-sm">
                        Project {project.id || `0${idx + 1}`}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/10 text-[#ded9cf] text-[9px] shadow-sm">
                        Turnkey Built
                      </span>
                    </div>

                    {/* Bottom Subtitle on image */}
                    {project.subtitle && (
                      <div className="absolute bottom-3 left-3 right-3 truncate text-[11px] text-[#ded9cf]/90 font-light">
                        {project.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.24em] uppercase text-[#b89a62] font-medium mb-1.5">
                        {project.category}
                      </p>
                      <h3
                        className="text-xl sm:text-2xl font-light text-[#f1eee7] group-hover:text-white transition-colors mb-2.5"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#b9b5ae] font-light leading-relaxed line-clamp-3 mb-4">
                        {project.description}
                      </p>
                    </div>

                    {/* Materials & Footer */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.materials.slice(0, 3).map((mat) => (
                          <span
                            key={mat}
                            className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#ded9cf]/80"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#b89a62] group-hover:text-white transition-colors pt-1">
                        <span className="tracking-[0.18em] uppercase text-[10px] sm:text-[11px] font-medium">
                          Explore Room Stack
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: UPCOMING PROJECTS (IN DEVELOPMENT & CONCEPT) */}
      {showUpcoming && (
        <section className="pt-12 pb-24 sm:pt-20 sm:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 border-t border-white/10 mt-6 sm:mt-12">
          <div className="flex items-baseline justify-between mb-8 sm:mb-12 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b89a62] animate-ping" />
                <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#b89a62] font-semibold">
                  Architectural Pipeline
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f1eee7]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Upcoming Projects
              </h2>
            </div>
            <span className="text-xs font-mono text-[#85817a]">
              0{UPCOMING_PROJECTS.length} In Development
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {UPCOMING_PROJECTS.map((upcoming, idx) => (
              <Reveal key={upcoming.id} delay={idx * 0.08}>
                <div className="liquid-glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row gap-6 border border-white/10 hover:border-[#b89a62]/50 transition-all duration-300 h-full">
                  {/* Upcoming Image */}
                  <div className="relative w-full md:w-5/12 aspect-[4/3] md:aspect-auto rounded-xl sm:rounded-2xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                    <img
                      src={upcoming.image}
                      alt={upcoming.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center brightness-95 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/85 border border-[#b89a62]/40 text-[#b89a62] text-[9px] tracking-wider uppercase font-semibold shadow-sm">
                        {upcoming.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-[10px] text-[#ded9cf]/80">
                      <Clock className="w-3 h-3 text-[#b89a62]" />
                      <span>{upcoming.targetYear}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#b89a62] mb-1.5">
                        <span>{upcoming.category}</span>
                        <span className="text-[#85817a]">{upcoming.location}</span>
                      </div>
                      <h3
                        className="text-xl sm:text-2xl font-light text-[#f1eee7] mb-2 leading-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {upcoming.title}
                      </h3>
                      <p className="text-[11px] text-[#b89a62]/80 italic mb-2.5">
                        {upcoming.tagline}
                      </p>
                      <p className="text-xs text-[#b9b5ae] font-light leading-relaxed mb-4">
                        {upcoming.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2.5 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#85817a] block mb-1">
                          Key Materials
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {upcoming.materials.map((mat) => (
                            <span
                              key={mat}
                              className="text-[9px] px-2 py-0.5 rounded-full bg-black/50 border border-white/10 text-[#ded9cf]"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[10px] text-[#85817a] pt-1">
                        <span className="text-[#b89a62]">Scope: </span>
                        {upcoming.scope}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
