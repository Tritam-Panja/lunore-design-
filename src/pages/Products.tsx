import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';
import { Sparkles, ArrowRight } from 'lucide-react';

const fallbackProducts: Product[] = [
  { id: '1', name: 'Marble Monolith', category: 'Monumental Artwork', description: 'Hand-carved Carrara marble monolith standing as a statement of architectural permanence.', dimensions: '240 × 120 × 90 cm', material: 'Carrara Marble', year: '2026', edition: 'Masterpiece 1 of 1', images: [] },
  { id: '2', name: 'Obsidian Figure', category: 'Abstract Sculpture', description: 'Carved obsidian figure capturing fluid movement within rigid volcanic glass.', dimensions: '180 × 80 × 60 cm', material: 'Obsidian Stone', year: '2026', edition: 'Edition of 3', images: [] },
  { id: '3', name: 'Limestone Relief', category: 'Architectural Feature', description: 'Hand-chiseled French limestone panel for interior and exterior architectural elevation.', dimensions: '180 × 180 × 25 cm', material: 'French Limestone', year: '2026', edition: 'Edition of 3', images: [] },
  { id: '4', name: 'Figurative Sculptures', category: 'Classical Form', description: 'Polished classical figurative forms carved from hand-selected Italian marble.', dimensions: '195 × 75 × 70 cm', material: 'Italian Marble', year: '2025', edition: 'Masterpiece 1 of 1', images: [] },
  { id: '5', name: 'Gilded Marble Sculptures', category: 'Premium Adornment', description: 'Veined Nero Marquina adorned with 24-karat gold leaf detailing.', dimensions: '210 × 90 × 80 cm', material: 'Nero Marquina & Gold Leaf', year: '2026', edition: 'Edition of 2', images: [] },
  { id: '6', name: 'Spiritual / Religious Sculpture', category: 'Ethereal Art', description: 'Backlit translucent statuary onyx spiritual forms exuding serene luminosity.', dimensions: '240 × 110 × 90 cm', material: 'Statuary Onyx', year: '2026', edition: 'Unique 1 of 1', images: [] },
];

export function Products() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').order('created_at').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setProducts(data as Product[]);
      }
      setLoading(false);
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
              Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
            Signature Sculptures
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm tracking-[0.25em] uppercase text-[#b89a62]">
            Rare Monolithic Form &amp; Geological Art
          </p>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
        </Reveal>
      </section>

      <section className="py-10 sm:py-16 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08} className="liquid-glass-card p-4 sm:p-5 rounded-2xl group">
                <Link to={`/products/${p.id}`} className="block">
                  <div className="rounded-xl overflow-hidden mb-4 relative aspect-[3/4] bg-[#141515]">
                    <Placeholder
                      className="w-full h-full"
                      label={p.category}
                      src={images.products[p.name]}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#f3e5ab] font-medium tracking-wide">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-normal text-[#f1eee7] group-hover:text-[#b89a62] transition-colors">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[#b9b5ae]">
                    {p.category}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
