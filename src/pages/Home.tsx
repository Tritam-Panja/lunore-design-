import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hammer, Mountain, Eye, Landmark, Ruler, PenTool, Layers, Check, Sparkles, MapPin, Phone, Mail, Send } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';
import { ScrollLine } from '@/components/ScrollLine';
import { MoonHeroCanvas } from '@/components/MoonHeroCanvas';

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

export function Home() {
  const [products, setProducts] = useState(fallbackProducts);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
      <section id="hero" className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-48 md:pb-36 min-h-[95vh] overflow-hidden bg-[#0d0e0e]">
        {/* 3D Realistic Cinematic Moon Hero Canvas */}
        <MoonHeroCanvas />

        {/* Seamless Crater Exit Gradient Overlay into Dark Graphite World */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e0e]/20 via-[#0d0e0e]/60 to-[#0d0e0e]" />
        </div>
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b89a62]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] uppercase text-[#f1eee7]" style={{ perspective: '800px', fontFamily: 'var(--font-display)' }}>
            {HERO_LETTERS.map((letter, i) => (
              <span
                key={i}
                className={`hero-word ${i === 2 ? 'text-[#b89a62]' : ''}`}
                style={{ animationDelay: `${0.2 + i * 0.12}s` }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-sm tracking-[0.5em] uppercase text-[#b9b5ae] hero-word" style={{ animationDelay: '1.1s' }}>
            Luxe Decor Studio
          </p>
          <div className="mt-10 w-16 h-px bg-[#b89a62] mx-auto" />
          <p className="mt-8 text-lg md:text-xl text-[#b9b5ae] font-light max-w-xl mx-auto leading-relaxed hero-word" style={{ animationDelay: '1.3s' }}>
           
          </p>
          <div className="mt-12 flex justify-center hero-word" style={{ animationDelay: '1.5s' }}>
            <a href="#brand-story" className="inline-block w-5 h-8 border border-[#b89a62]/60 rounded-full relative animate-bounce transition-colors hover:border-[#b89a62]">
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#b89a62] rounded-full" />
            </a>
          </div>
        </div>
      </section>

      {/* LUXURY INTERIOR GALLERY TRANSITION THRESHOLD */}
      <div className="relative z-10 w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.3)] to-transparent" />

      {/* 2. BRAND STORY PREVIEW SECTION */}
      <section id="brand-story" className="py-24 md:py-36 relative overflow-hidden bg-[#111211]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
              about Lunore 
            </p>
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#f1eee7]">
              The Space that only you could live in 
            </h2>
            <p className="mt-4 text-xs tracking-[0.2em] uppercase text-[#b9b5ae]">
              
            </p>
            <div className="mt-8 w-16 h-px bg-[#b89a62] mx-auto" />
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <p className="text-lg md:text-xl text-[#b9b5ae] leading-relaxed font-light">
              LUNORE Luxe Decor Studio was born from a simple belief: true luxury isn't about excess — it's about intention. We blend modern sophistication with subtle artistic expression to shape spaces that leave a quiet, lasting impression.
            </p>
          </Reveal>

          
        </div>

        {/* Organic Curved Scroll Line - Brand Story */}
        <ScrollLine
          path="M 50,0 C 250,150 750,50 950,200 C 1150,350 150,450 500,550"
          viewBox="0 0 1000 600"
          className="absolute inset-0 z-0 opacity-40 md:opacity-60"
          strokeColor="rgba(184, 154, 98, 0.35)"
          strokeWidth={1.5}
        />
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.16)] to-transparent" />

      {/* 3. ABOUT PREVIEW SECTION */}
      <section id="about" className="py-24 md:py-36 relative bg-[#0d0e0e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
              About Us
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-[#f1eee7]">Shaping Legacy From Stone</h2>
            <p className="mt-6 text-lg text-[#b9b5ae] leading-relaxed font-light">
              Dedicated to shaping raw earth into timeless art, creating monumental stone sculptures for elite residential and commercial spaces.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutPillars.map((p, i) => (
              <Reveal
                key={p.title}
                direction="up"
                delay={i * 0.1}
                className="hover-lift border border-[rgba(184,154,98,0.16)] bg-[#181917] p-8 transition-colors hover:border-[#b89a62]/60 shadow-xl shadow-black/30"
              >
                <p.icon className="w-8 h-8 text-[#b89a62] mb-5" strokeWidth={1} />
                <h3 className="text-xl font-light mb-3 text-[#f1eee7]">{p.title}</h3>
                <p className="text-sm text-[#b9b5ae] leading-relaxed">{p.desc}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Reveal>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[rgba(184,154,98,0.25)] text-xs tracking-[0.3em] uppercase text-[#f1eee7] hover:border-[#b89a62] hover:text-[#b89a62] transition-all group"
              >
                Read About Our Legacy <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Organic Curved Scroll Line - About */}
        <ScrollLine
          path="M 0,100 C 300,0 700,400 1000,200 C 800,500 200,300 0,600"
          viewBox="0 0 1000 600"
          className="absolute inset-0 z-0 opacity-30 md:opacity-50"
          strokeColor="rgba(184, 154, 98, 0.3)"
          strokeWidth={1.2}
        />
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(184,154,98,0.2)] to-transparent" />

      {/* 4. SERVICES PREVIEW SECTION */}
      <section id="services" className="py-24 md:py-36 relative bg-[#111211]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
              Our Expertise
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-[#f1eee7]">Services &amp; Craft</h2>
            <p className="mt-6 text-lg text-[#b9b5ae] leading-relaxed font-light">
              From full-scope interior design execution to curating rare marble &amp; granite monoliths across India.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service 1: Interior Design */}
            <Reveal direction="left" className="p-8 md:p-12 border border-[rgba(184,154,98,0.16)] bg-[#181917] flex flex-col justify-between hover-lift shadow-xl shadow-black/30">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs tracking-[0.3em] uppercase text-[#b89a62]">Full-Scope</span>
                  <Ruler className="w-8 h-8 text-[#b89a62]" strokeWidth={1} />
                </div>
                <h3 className="text-2xl md:text-3xl font-light mb-4 text-[#f1eee7]">Interior Design Solutions</h3>
                <p className="text-[#b9b5ae] leading-relaxed font-light mb-6">
                  Complete interior solutions from concept development and space planning to bespoke material selection and turnkey execution.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Space Planning & Concepts', 'Turnkey Execution', 'Residential & Commercial'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#b9b5ae]">
                      <Check className="w-4 h-4 text-[#b89a62]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/interior-design"
                className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#b89a62] hover:underline mt-4 group"
              >
                Explore Interior Design <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>

            {/* Service 2: Marble & Granite */}
            <Reveal direction="right" className="p-8 md:p-12 border border-[rgba(184,154,98,0.16)] bg-[#181917] flex flex-col justify-between hover-lift shadow-xl shadow-black/30">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs tracking-[0.3em] uppercase text-[#b89a62]">Curated Stones</span>
                  <Sparkles className="w-8 h-8 text-[#b89a62]" strokeWidth={1} />
                </div>
                <h3 className="text-2xl md:text-3xl font-light mb-4 text-[#f1eee7]">Marble &amp; Granite Solutions</h3>
                <p className="text-[#b9b5ae] leading-relaxed font-light mb-6">
                  Imported marble sourced from Italy and global quarries, durable granite, and exotic natural stone collections for statement spaces.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Imported Marble Sourcing', 'Exotic Stone Collection', 'Precision Cutting & Finish'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#b9b5ae]">
                      <Check className="w-4 h-4 text-[#b89a62]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/marble-granite"
                className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#b89a62] hover:underline mt-4 group"
              >
                Explore Marble &amp; Granite <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

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
              <Reveal key={s.num} direction="up" delay={i * 0.1} className="p-8 border border-[rgba(184,154,98,0.16)] bg-[#181917] relative hover-lift z-10 shadow-xl shadow-black/30">
                <span className="text-4xl md:text-5xl font-light text-[#b89a62] block mb-4">
                  {s.num}
                </span>
                <h3 className="text-xl font-light mb-3 text-[#f1eee7]">{s.title}</h3>
                <div className="w-10 h-px bg-[#b89a62]/60 mb-4" />
                <p className="text-sm text-[#b9b5ae] leading-relaxed">{s.desc}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Reveal>
              <Link
                to="/process"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[#b89a62] text-xs tracking-[0.3em] uppercase text-[#b89a62] hover:bg-[#b89a62] hover:text-[#0d0e0e] transition-all group shimmer"
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
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4">
              Bespoke Spaces
            </p>
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#f1eee7]">
              Let's Build Your Dream Space
            </h2>
            <p className="mt-6 text-lg text-[#b9b5ae] leading-relaxed font-light">
              Whether it's a private residence, luxury villa, commercial office, or curated hospitality environment — we shape stone into enduring experiences.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-4 border border-[#b89a62] text-xs tracking-[0.3em] uppercase text-[#b89a62] hover:bg-[#b89a62] hover:text-[#0d0e0e] transition-all inline-flex items-center justify-center gap-2 shimmer"
              >
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="px-8 py-4 border border-[rgba(184,154,98,0.25)] text-xs tracking-[0.3em] uppercase text-[#b9b5ae] hover:border-[#b89a62] hover:text-[#b89a62] transition-all inline-flex items-center justify-center"
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Form */}
            <Reveal direction="left">
              {status === 'success' ? (
                <div className="p-8 border border-[#b89a62] bg-[#b89a62]/10 text-center">
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
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-transparent border-b border-[rgba(184,154,98,0.25)] py-3 text-[#f1eee7] focus:border-[#b89a62] focus:outline-none transition-colors"
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
                      className="w-full bg-transparent border-b border-[rgba(184,154,98,0.25)] py-3 text-[#f1eee7] focus:border-[#b89a62] focus:outline-none transition-colors"
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
                      className="w-full bg-transparent border-b border-[rgba(184,154,98,0.25)] py-3 text-[#f1eee7] focus:border-[#b89a62] focus:outline-none transition-colors"
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
                      className="w-full bg-transparent border-b border-[rgba(184,154,98,0.25)] py-3 text-[#f1eee7] focus:border-[#b89a62] focus:outline-none transition-colors resize-none"
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
                    className="inline-flex items-center gap-2 px-8 py-4 border border-[#b89a62] text-xs tracking-[0.3em] uppercase text-[#b89a62] hover:bg-[#b89a62] hover:text-[#0d0e0e] transition-all disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
                    {status !== 'sending' && <Send className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </Reveal>

            {/* Studio Info */}
            <Reveal direction="right" className="space-y-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-5">
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

              <div className="pt-8 border-t border-[rgba(184,154,98,0.16)]">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#b89a62] hover:underline group"
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
