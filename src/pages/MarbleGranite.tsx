import { Link } from 'react-router-dom';
import { ArrowRight, Check, Layers, Mountain, Gem, Sparkles } from 'lucide-react';
import { images } from '@/lib/images';

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
    <div>
      <section className="relative px-6 pt-32 pb-20 md:pt-44 md:pb-28 text-center max-w-4xl mx-auto">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <img src={images.marbleHero} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f2122]/80 to-[#1f2122]" />
        </div>
        <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
          Marble &amp; Granite
        </p>
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.08em] uppercase">
          Premium Marble &amp; Granite Solutions
        </h1>
        <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
        <p className="mt-8 text-lg text-[#a3a3a3] leading-relaxed font-light">
          Curating timeless stones for luxurious spaces.
        </p>
        <p className="mt-4 text-lg text-[#a3a3a3] leading-relaxed font-light">
          We provide premium quality marble, granite and exotic stones for residential
          and commercial projects across India.
        </p>
        <Link
          to="/products"
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all"
        >
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
            What We Supply
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supplies.map((s) => (
              <div
                key={s.title}
                className="p-8 border border-[rgba(255,255,255,0.1)] bg-[#2a2c2d]/30"
              >
                <s.icon className="w-8 h-8 text-[#c2a67e] mb-5" strokeWidth={1} />
                <h3 className="text-lg font-light mb-3">{s.title}</h3>
                <p className="text-sm text-[#a3a3a3] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
            Applications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {applications.map((a) => (
              <div
                key={a}
                className="p-5 text-center border border-[rgba(255,255,255,0.1)] text-xs tracking-[0.15em] uppercase text-[#a3a3a3] hover:text-[#c2a67e] hover:border-[#c2a67e] transition-all"
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
            Why Choose Lunore Materials
          </h2>
          <div className="space-y-6">
            {checklist.map((c) => (
              <div key={c.title} className="flex items-start gap-4">
                <Check className="w-5 h-5 text-[#c2a67e] flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="text-lg font-light">{c.title}</h3>
                  <p className="text-sm text-[#a3a3a3] leading-relaxed mt-1">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-light mb-5">
            Looking for Premium Marble &amp; Granite?
          </h2>
          <p className="text-lg text-[#a3a3a3] leading-relaxed font-light">
            Connect with Lunore Luxe Decor Studio for curated luxury stone solutions
            tailored to your project requirements.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all"
          >
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
