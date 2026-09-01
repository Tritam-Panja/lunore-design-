import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { images } from '@/lib/images';
import { Reveal } from '@/components/Reveal';
import { LazyImage } from '@/components/LazyImage';

const paragraphs = [
  'LUNORE started as a vision to bring a more refined, thoughtful approach to luxury decor. In a world where design often follows trends, LUNORE chose a different path — focusing on timeless aesthetics, attention to detail, and the emotional connection people have with their spaces.',
  'Every project at LUNORE begins with understanding the client\'s story. Because true luxury isn\'t about excess — it\'s about intention. From carefully selected materials to balanced compositions, every element is curated to create an environment that feels personal, elegant, and lasting.',
  'What sets LUNORE apart is its ability to blend modern sophistication with subtle artistic expression. Whether it\'s a residence, a commercial space, or a curated installation, the goal remains the same — to create spaces that leave a quiet but powerful impression.',
  'Today, LUNORE Luxe Decor Studio continues to grow, not just as a design brand, but as a creative identity that stands for understated luxury, precision, and authenticity.',
];

export function BrandStory() {
  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] relative overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b89a62]/8 rounded-full blur-[160px] pointer-events-none" />

      <section className="relative px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <LazyImage
            src={images.brandStoryHero}
            alt="Lunore Brand Story"
            className="w-full h-full opacity-20 kenburns"
            imgClassName="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e0e]/80 via-[#0d0e0e]/90 to-[#0d0e0e]" />
        </div>

        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#ded9cf] font-light">
              Brand Story
            </span>
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
            LUNORE Luxe Decor Studio
          </h1>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
          <p className="mt-6 text-base sm:text-xl text-[#b9b5ae] leading-relaxed font-light max-w-2xl mx-auto">
            LUNORE Luxe Decor Studio was born from a simple belief — that spaces are not
            just designed, they are felt.
          </p>
          <p className="mt-4 text-xs sm:text-sm tracking-[0.2em] uppercase text-[#b89a62]">
            Founded by: Dinkesh Sharma &amp; Suchitra Pandey
          </p>
        </Reveal>
      </section>

      <section className="py-12 sm:py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-8 sm:mb-12 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              Timeless Aesthetics &amp; Purpose
            </h2>
          </Reveal>
          <div className="space-y-6 sm:space-y-8">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08} className="liquid-glass-card p-5 sm:p-7 rounded-2xl">
                <p className="text-sm sm:text-base md:text-lg text-[#b9b5ae] leading-relaxed font-light">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <blockquote className="mt-12 sm:mt-16 text-center text-xl sm:text-2xl md:text-3xl font-light italic text-[#b89a62] leading-relaxed px-2" style={{ fontFamily: 'var(--font-serif)' }}>
              "Because at LUNORE, we don't just design spaces — we shape experiences."
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24 border-t border-white/10 text-center relative z-10">
        <Reveal>
          <Link
            to="/contact"
            className="liquid-glass-btn-secondary px-8 py-4 text-xs tracking-[0.3em] uppercase text-[#f1eee7] hover:text-[#b89a62] hover:border-[#b89a62]/60 transition-all inline-flex items-center gap-2"
          >
            Contact the Studio <ArrowRight className="w-4 h-4 text-[#b89a62]" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
