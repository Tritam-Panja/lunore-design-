import { useEffect, useState } from 'react';
import { supabase, type Exhibition } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';
import { Sparkles, Calendar } from 'lucide-react';

const fallback: Exhibition[] = [
  {
    id: '1',
    title: 'AUREXA EXHIBITION',
    date: '5th April 2026',
    status: 'Current',
    description:
      'AUREXA is an exclusive, invite-only luxury exhibition curated to bring together high-net-worth individuals, premium brands, and meaningful experiences under one refined setting. Designed with a focus on elegance, sophistication, and curated networking, AUREXA aims to redefine how luxury is experienced and showcased.',
  },
  {
    id: '2',
    title: 'Echoes in Marble',
    date: null,
    status: 'Upcoming',
    description:
      'Step into a world of timeless marble sculptures, where every piece is shaped by skilled hands and careful craftsmanship. Our collection brings together classical beauty and modern luxury. Each sculpture tells its own story through the natural beauty of stone.',
  },
  {
    id: '3',
    title: 'Luxury Jewelry Exhibition',
    date: null,
    status: 'Upcoming',
    description:
      "Our jewelry exhibition brings together a beautiful collection of finely crafted pieces, each designed with incredible detail and care. Every necklace, ring, and bracelet highlights the natural beauty of rare gemstones and skilled craftsmanship. Set in an elegant gallery space, guests can take their time exploring the designs and appreciating the artistry behind them.",
  },
];

export function Exhibitions() {
  const [exhibitions, setExhibitions] = useState(fallback);

  useEffect(() => {
    supabase.from('exhibitions').select('*').order('created_at').then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setExhibitions(data as Exhibition[]);
      }
    });
  }, []);

  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b89a62]/8 rounded-full blur-[160px] pointer-events-none" />

      <section className="px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 text-center max-w-4xl mx-auto relative z-10">
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#ded9cf] font-light">
              Exhibitions
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
            Showcases &amp; Events
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm tracking-[0.25em] uppercase text-[#b89a62]">
            Curated Experiences &amp; Fine Art Pavilions
          </p>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
        </Reveal>
      </section>

      <section className="py-10 sm:py-16 border-t border-white/10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
          {exhibitions.map((ex, i) => (
            <Reveal key={ex.id} direction={i % 2 === 0 ? 'left' : 'right'}>
              <article className="liquid-glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
                <div className="overflow-hidden">
                  <Placeholder
                    className="aspect-[16/9] w-full"
                    label={ex.title}
                    src={images.exhibitions[ex.title]}
                  />
                </div>
                <div className="p-6 sm:p-10 md:p-12">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                    <span
                      className={`text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full border ${
                        ex.status === 'Current'
                          ? 'border-[#b89a62] text-[#b89a62] bg-[#b89a62]/10'
                          : 'border-white/20 text-[#b9b5ae] bg-white/[0.03]'
                      }`}
                    >
                      {ex.status}
                    </span>
                    {ex.date && (
                      <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-[#b9b5ae]">
                        <Calendar className="w-3.5 h-3.5 text-[#b89a62]" />
                        {ex.date}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-4 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
                    {ex.title}
                  </h2>
                  <div className="w-12 h-px bg-[#b89a62]/60 mb-5" />
                  <p className="text-xs sm:text-base text-[#b9b5ae] leading-relaxed font-light">
                    {ex.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
