import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, PenTool, Layers, Hammer, Check, Sparkles } from 'lucide-react';
import { images } from '@/lib/images';
import { Reveal } from '@/components/Reveal';
import { LazyImage } from '@/components/LazyImage';

const services = [
  {
    icon: Ruler,
    title: 'Space Planning & Concept Development',
    desc: 'Thoughtful layouts and creative concepts that blend aesthetics with functionality.',
  },
  {
    icon: PenTool,
    title: 'Interior Design Consultation',
    desc: 'Bespoke interior solutions tailored to your lifestyle, needs and personality.',
  },
  {
    icon: Layers,
    title: 'Material Selection & Styling',
    desc: 'Curated selection of premium materials, textures, finishes and décor elements.',
  },
  {
    icon: Hammer,
    title: 'Turnkey Project Execution',
    desc: 'End-to-end execution with quality control, skilled teams and timely delivery.',
  },
];

const spaces = [
  {
    title: 'Residential Interiors',
    desc: 'Homes designed around the way you live — warm, refined, and deeply personal.',
  },
  {
    title: 'Commercial Interiors',
    desc: 'Workspaces and retail environments crafted to impress and perform.',
  },
];

const process = [
  { num: '01', title: 'Discover', desc: 'We listen, observe, and understand your vision and lifestyle.' },
  { num: '02', title: 'Design', desc: 'Concepts, layouts, and material palettes take shape around your story.' },
  { num: '03', title: 'Execute', desc: 'Skilled teams bring the design to life with precision and care.' },
  { num: '04', title: 'Deliver', desc: 'Final styling and handover — your space, ready to be lived in.' },
];

const spacesWeDesign = [
  'Luxury Homes',
  'Villas & Penthouses',
  'Commercial Spaces',
  'Hospitality Projects',
];

const checklist = [
  'End-to-End Project Management',
  'Luxury Design Expertise',
  'Premium Material Curation',
  'Bespoke Customization',
  'Seamless Execution Process',
  'Attention to Every Detail',
];

export function InteriorDesign() {
  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#b89a62]/8 rounded-full blur-[170px] pointer-events-none" />

      <section className="relative px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <LazyImage
            src={images.interiorHero}
            alt="Lunore Interior Design"
            className="w-full h-full opacity-20 kenburns"
            imgClassName="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e0e]/80 via-[#0d0e0e]/90 to-[#0d0e0e]" />
        </div>
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#ded9cf] font-light">
              Interior Design
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.06em] sm:tracking-[0.1em] uppercase text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
            From Vision to Execution
          </h1>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
          <p className="mt-6 text-base sm:text-xl text-[#b9b5ae] leading-relaxed font-light max-w-2xl mx-auto">
            Complete interior solutions, crafted with passion and precision.
          </p>
          <p className="mt-3 text-xs sm:text-base text-[#b9b5ae]/80 leading-relaxed font-light max-w-xl mx-auto">
            At Lunore Luxe Decor Studio, we take care of everything — from planning and
            design to execution and final styling.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 liquid-glass-btn-primary text-xs tracking-[0.25em] uppercase text-[#0d0e0e] font-semibold transition-all shadow-lg active:scale-95"
          >
            Book a Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      {/* Services Grid */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-14 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              We Take Care of Everything
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((s, i) => (
              <Reveal
                key={s.title}
                direction="up"
                delay={i * 0.08}
                className="liquid-glass-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <s.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#b89a62] mb-4 sm:mb-5" strokeWidth={1.2} />
                  <h3 className="text-base sm:text-lg font-normal mb-2 text-[#f1eee7]">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-[#b9b5ae] leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-14 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Spaces
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {spaces.map((s, i) => (
              <Reveal key={s.title} direction={i % 2 === 0 ? 'left' : 'right'} className="p-6 sm:p-8 liquid-glass-card rounded-2xl">
                <h3 className="text-lg sm:text-xl font-normal mb-2 text-[#b89a62]">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[#b9b5ae] leading-relaxed font-light">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-14 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Our Process
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {process.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.08} className="liquid-glass-card p-6 sm:p-7 rounded-2xl">
                <span className="text-3xl sm:text-4xl font-mono font-light text-[#b89a62]">{p.num}</span>
                <h3 className="mt-2 text-base sm:text-lg font-normal text-[#f1eee7]">{p.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#b9b5ae] leading-relaxed font-light">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces We Design Grid */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-14 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Spaces We Design
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {spacesWeDesign.map((s, i) => (
              <Reveal
                key={s}
                direction="zoom"
                delay={i * 0.06}
                className="p-4 sm:p-6 text-center liquid-glass-pill rounded-xl text-xs sm:text-sm tracking-[0.15em] uppercase text-[#ded9cf] hover:text-[#b89a62] hover:border-[#b89a62]/60 transition-all"
              >
                {s}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Lunore */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-12 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Why Choose Lunore
            </h2>
          </Reveal>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {checklist.map((item, i) => (
              <Reveal key={item} as="li" delay={(i % 2) * 0.08}>
                <div className="flex items-center gap-3 p-3.5 rounded-xl liquid-glass-pill text-[#ded9cf]">
                  <Check className="w-4 h-4 text-[#b89a62] flex-shrink-0" strokeWidth={1.8} />
                  <span className="text-xs sm:text-sm">{item}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 border-t border-white/10 text-center relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Let's Build Your Dream Space
            </h2>
            <p className="text-xs sm:text-base text-[#b9b5ae] leading-relaxed font-light max-w-xl mx-auto">
              Whether it's a residence, office, showroom, or hospitality project — we
              create interiors that inspire and stand the test of time.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 liquid-glass-btn-primary text-xs tracking-[0.25em] uppercase text-[#0d0e0e] font-semibold transition-all shadow-lg active:scale-95"
            >
              Book a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
