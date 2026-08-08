import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { images } from '@/lib/images';
import { Reveal } from '@/components/Reveal';

const paragraphs = [
  'LUNORE started as a vision to bring a more refined, thoughtful approach to luxury decor. In a world where design often follows trends, LUNORE chose a different path — focusing on timeless aesthetics, attention to detail, and the emotional connection people have with their spaces.',
  'Every project at LUNORE begins with understanding the client\'s story. Because true luxury isn\'t about excess — it\'s about intention. From carefully selected materials to balanced compositions, every element is curated to create an environment that feels personal, elegant, and lasting.',
  'What sets LUNORE apart is its ability to blend modern sophistication with subtle artistic expression. Whether it\'s a residence, a commercial space, or a curated installation, the goal remains the same — to create spaces that leave a quiet but powerful impression.',
  'Today, LUNORE Luxe Decor Studio continues to grow, not just as a design brand, but as a creative identity that stands for understated luxury, precision, and authenticity.',
];

export function BrandStory() {
  return (
    <div>
      <section className="relative px-6 pt-32 pb-16 md:pt-44 md:pb-20 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <img src={images.brandStoryHero} alt="" className="w-full h-full object-cover opacity-20 kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f2122]/80 to-[#1f2122]" />
        </div>
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
            Brand Story
          </p>
          <h1 className="text-3xl md:text-5xl font-light leading-tight">
            LUNORE Luxe Decor Studio — Brand Story
          </h1>
          <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
          <p className="mt-8 text-lg text-[#a3a3a3] leading-relaxed font-light">
            LUNORE Luxe Decor Studio was born from a simple belief — that spaces are not
            just designed, they are felt.
          </p>
          <p className="mt-5 text-sm tracking-[0.2em] uppercase text-[#a3a3a3]">
            Founded by: Dinkesh Sharma &amp; Suchitra Pandey
          </p>
        </Reveal>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-light text-center mb-12">
              Timeless Aesthetics
            </h2>
          </Reveal>
          <div className="space-y-8">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-lg text-[#a3a3a3] leading-relaxed font-light">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <blockquote className="mt-16 text-center text-2xl md:text-3xl font-light italic text-[#c2a67e] leading-relaxed">
              "Because at LUNORE, we don't just design spaces — we shape experiences."
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)] text-center">
        <Reveal>
          <Link
            to="/contact"
            className="px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all inline-flex items-center gap-2 shimmer"
          >
            Contact the Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
