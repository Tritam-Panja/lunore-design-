import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, PenTool, Layers, Hammer, Check } from 'lucide-react';
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
    <div>
<section className="relative px-6 pt-32 pb-20 md:pt-44 md:pb-28 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <LazyImage
            src={images.interiorHero}
            alt="Lunore Interior Design"
            className="w-full h-full opacity-20 kenburns"
            imgClassName="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f2122]/80 to-[#1f2122]" />
        </div>
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
            Interior Design
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase">
            From Vision to Execution
          </h1>
          <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
          <p className="mt-8 text-lg text-[#a3a3a3] leading-relaxed font-light">
            Complete interior solutions, crafted with passion and precision.
          </p>
          <p className="mt-4 text-lg text-[#a3a3a3] leading-relaxed font-light">
            At Lunore Luxe Decor Studio, we take care of everything — from planning and
            design to execution and final styling.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all"
          >
            Book a Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
<div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
              We Take Care of Everything
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <Reveal
                key={s.title}
                direction="up"
                delay={i * 0.1}
                className="hover-lift p-8 border border-[rgba(255,255,255,0.1)] bg-[#2a2c2d]/30"
              >
                <s.icon className="w-8 h-8 text-[#c2a67e] mb-5" strokeWidth={1} />
                <h3 className="text-lg font-light mb-3">{s.title}</h3>
                <p className="text-sm text-[#a3a3a3] leading-relaxed">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-12">Spaces</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spaces.map((s, i) => (
              <Reveal key={s.title} direction={i % 2 === 0 ? 'left' : 'right'} className="p-8 border border-[rgba(255,255,255,0.1)] hover-lift">
                <h3 className="text-xl font-light mb-3 text-[#c2a67e]">{s.title}</h3>
                <p className="text-base text-[#a3a3a3] leading-relaxed font-light">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
              Our Process
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.1}>
                <span className="text-4xl font-light text-[#c2a67e]">{p.num}</span>
                <h3 className="mt-3 text-xl font-light">{p.title}</h3>
                <p className="mt-2 text-sm text-[#a3a3a3] leading-relaxed">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
<div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
              Spaces We Design
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spacesWeDesign.map((s, i) => (
              <Reveal
                key={s}
                direction="zoom"
                delay={i * 0.08}
                className="p-6 text-center border border-[rgba(255,255,255,0.1)] text-sm tracking-[0.15em] uppercase text-[#a3a3a3] hover:text-[#c2a67e] hover:border-[#c2a67e] transition-all"
              >
                {s}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
              Why Choose Lunore
            </h2>
          </Reveal>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checklist.map((item, i) => (
              <Reveal key={item} as="li" delay={(i % 2) * 0.1}>
                <div className="flex items-center gap-3 text-[#a3a3a3]">
                  <Check className="w-5 h-5 text-[#c2a67e] flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm">{item}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)] text-center">
<div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light mb-5">
              Let's Build Your Dream Space
            </h2>
            <p className="text-lg text-[#a3a3a3] leading-relaxed font-light">
              Whether it's a residence, office, showroom, or hospitality project — we
              create interiors that inspire and stand the test of time.
            </p>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all shimmer"
            >
              Book a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
