import { useEffect, useState } from 'react';
import { supabase, type Exhibition } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';

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
      "Our jewelry exhibition brings together a beautiful collection of finely crafted pieces, each designed with incredible detail and care. Every necklace, ring, and bracelet highlights the natural beauty of rare gemstones and skilled craftsmanship. Set in an elegant gallery space, guests can take their time exploring the designs and appreciating the artistry behind them. It's a warm celebration of luxury, creativity, and the timeless charm of fine jewelry.",
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
    <div>
      <section className="px-6 pt-32 pb-16 md:pt-44 md:pb-20 text-center max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
          Exhibitions
        </p>
        <h1 className="text-4xl md:text-6xl font-light">Showcases &amp; Events</h1>
        <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
      </section>

      <section className="py-12 md:py-16 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          {exhibitions.map((ex) => (
            <article
              key={ex.id}
              className="border border-[rgba(255,255,255,0.1)] bg-[#2a2c2d]/30 overflow-hidden"
            >
              <Placeholder
                className="aspect-[16/9] w-full"
                label={ex.title}
                src={images.exhibitions[ex.title]}
              />
              <div className="p-8 md:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                  <span
                    className={`text-[10px] tracking-[0.3em] uppercase px-3 py-1 border w-fit ${
                      ex.status === 'Current'
                        ? 'border-[#c2a67e] text-[#c2a67e]'
                        : 'border-[rgba(255,255,255,0.15)] text-[#a3a3a3]'
                    }`}
                  >
                    {ex.status}
                  </span>
                  {ex.date && (
                    <span className="text-xs tracking-[0.2em] uppercase text-[#a3a3a3]">
                      {ex.date}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-light mb-5">{ex.title}</h2>
                <div className="w-12 h-px bg-[#c2a67e] mb-6" />
                <p className="text-base text-[#a3a3a3] leading-relaxed font-light">
                  {ex.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
