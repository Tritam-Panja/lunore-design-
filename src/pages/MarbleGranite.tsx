import { Link } from 'react-router-dom';
import { ArrowRight, Check, Layers, Mountain, Gem, Sparkles } from 'lucide-react';
import { images } from '@/lib/images';
import { Reveal } from '@/components/Reveal';
import { LazyImage } from '@/components/LazyImage';

const supplies = [
  {
    icon: Mountain,
    title: 'Imported Marble',
    desc: 'Premium marble sourced from the finest quarries across Italy, Greece, and beyond.',
  },
  {
    icon: Layers,
    title: 'Granite Solutions',
    desc: 'Durable, elegant granite for surfaces that demand both beauty and strength.',
  },
  {
    icon: Gem,
    title: 'Exotic Stone Collection',
    desc: 'Rare and exotic stones curated for statement features and one-of-a-kind installations.',
  },
  {
    icon: Sparkles,
    title: 'Custom Stone Requirements',
    desc: 'Bespoke stone sourcing and cutting tailored to your project\'s exact specifications.',
  },
];

const applications = [
  'Luxury Homes & Villas',
  'Commercial Spaces',
  'Hotels & Hospitality',
  'Retail Showrooms',
  'Feature Walls & Flooring',
  'Kitchen Countertops',
  'Bathrooms & Vanity Areas',
  'Staircases & Elevation Cladding',
];

const checklist = [
  { title: 'Premium Quality Selection', desc: 'Only the finest stones make it into our collection.' },
  { title: 'Expert Guidance', desc: 'Decades of experience to help you choose the right stone.' },
  { title: 'Residential & Commercial Supply', desc: 'Serving projects of every scale across India.' },
  { title: 'Luxury Finish & Detailing', desc: 'Precision cutting and finishing for a flawless result.' },
];

export function MarbleGranite() {
  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#b89a62]/8 rounded-full blur-[170px] pointer-events-none" />

      <section className="relative px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <LazyImage
            src={images.marbleHero}
            alt="Lunore Marble & Granite"
            className="w-full h-full opacity-20 kenburns"
            imgClassName="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e0e]/80 via-[#0d0e0e]/90 to-[#0d0e0e]" />
        </div>
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#ded9cf] font-light">
              Marble &amp; Granite
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
            Premium Marble &amp; Granite Solutions
          </h1>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
          <p className="mt-6 text-base sm:text-xl text-[#b9b5ae] leading-relaxed font-light max-w-2xl mx-auto">
            Curating timeless stones for luxurious spaces.
          </p>
          <p className="mt-3 text-xs sm:text-base text-[#b9b5ae]/80 leading-relaxed font-light max-w-xl mx-auto">
            We provide premium quality marble, granite and exotic stones for residential
            and commercial projects across India.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 liquid-glass-btn-primary text-xs tracking-[0.25em] uppercase text-[#0d0e0e] font-semibold transition-all shadow-lg active:scale-95"
          >
            Explore Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      {/* Supplies */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-14 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              What We Supply
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {supplies.map((s, i) => (
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

      {/* Applications */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-14 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Applications
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {applications.map((a, i) => (
              <Reveal
                key={a}
                direction="zoom"
                delay={(i % 4) * 0.06}
                className="p-4 sm:p-5 text-center liquid-glass-pill rounded-xl text-xs sm:text-sm tracking-[0.12em] uppercase text-[#ded9cf] hover:text-[#b89a62] hover:border-[#b89a62]/60 transition-all"
              >
                {a}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Lunore Materials */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 sm:mb-14 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Why Choose Lunore Materials
            </h2>
          </Reveal>
          <div className="space-y-4 sm:space-y-6">
            {checklist.map((c, i) => (
              <Reveal key={c.title} direction="left" delay={i * 0.08} className="liquid-glass-card p-5 sm:p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#b89a62]/20 border border-[#b89a62]/40 flex items-center justify-center text-[#b89a62] flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-normal text-[#f1eee7]">{c.title}</h3>
                    <p className="text-xs sm:text-sm text-[#b9b5ae] leading-relaxed mt-1">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 border-t border-white/10 text-center relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Looking for Premium Marble &amp; Granite?
            </h2>
            <p className="text-xs sm:text-base text-[#b9b5ae] leading-relaxed font-light max-w-xl mx-auto">
              Connect with Lunore Luxe Decor Studio for curated luxury stone solutions
              tailored to your project requirements.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 liquid-glass-btn-primary text-xs tracking-[0.25em] uppercase text-[#0d0e0e] font-semibold transition-all shadow-lg active:scale-95"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
