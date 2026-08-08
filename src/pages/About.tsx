import { Link } from 'react-router-dom';
import { ArrowRight, Hammer, Mountain, Eye, Landmark } from 'lucide-react';
import { images } from '@/lib/images';
import { Reveal } from '@/components/Reveal';

const features = [
  {
    icon: Hammer,
    title: 'Master Craftsmanship',
    desc: 'Every piece is hand-carved by sculptors with decades of experience in monumental stone work.',
  },
  {
    icon: Mountain,
    title: 'Sourced Monoliths',
    desc: 'We travel to quarries worldwide to select stones with the perfect density, veining, and character.',
  },
  {
    icon: Eye,
    title: 'Detail Obsessed',
    desc: 'From the first chisel to the final polish, every surface is studied and refined with intention.',
  },
  {
    icon: Landmark,
    title: 'Permanent Legacy',
    desc: 'Stone is the medium of eternity. Our sculptures are built to endure for generations.',
  },
];

export function About() {
  return (
    <div>
<section className="relative px-6 pt-32 pb-20 md:pt-44 md:pb-28 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <img src={images.aboutHero} alt="" className="w-full h-full object-cover opacity-20 kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f2122]/80 to-[#1f2122]" />
        </div>
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">About Us</p>
          <h1 className="text-4xl md:text-6xl font-light leading-tight">
            Shaping Legacy From Stone
          </h1>
          <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
          <p className="mt-8 text-lg text-[#a3a3a3] leading-relaxed font-light">
            We are dedicated to shaping raw earth into timeless art, creating monumental
            stone sculptures for elite spaces.
          </p>
        </Reveal>
      </section>

<section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <Reveal className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Our Philosophy: Precision. Weight. Impact.
          </h2>
          <p className="text-lg text-[#a3a3a3] leading-relaxed font-light">
            We believe stone is the ultimate medium of permanence. It speaks of
            eternity and strength. Our carving process is rooted in intention,
            exclusivity, and raw power.
          </p>
          <p className="mt-5 text-lg text-[#a3a3a3] leading-relaxed font-light">
            Led by master sculptors and stone artisans with profound experience in
            monumental and structural design.
          </p>
        </Reveal>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                direction="up"
                delay={i * 0.1}
                className="hover-lift border border-[rgba(255,255,255,0.1)] bg-[#2a2c2d]/30 p-8"
              >
                <f.icon className="w-8 h-8 text-[#c2a67e] mb-5" strokeWidth={1} />
                <h3 className="text-xl font-light mb-3">{f.title}</h3>
                <p className="text-sm text-[#a3a3a3] leading-relaxed">{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

<section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)] text-center">
        <Reveal className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all inline-flex items-center justify-center gap-2 shimmer"
          >
            View Collection <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="px-8 py-4 border border-[rgba(255,255,255,0.1)] text-xs tracking-[0.3em] uppercase text-[#a3a3a3] hover:border-[#c2a67e] hover:text-[#c2a67e] transition-all inline-flex items-center justify-center"
          >
            Contact Us
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
