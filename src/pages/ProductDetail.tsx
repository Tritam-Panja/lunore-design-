import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';

const fallbackProductsMap: Record<string, Product> = {
  '1': { id: '1', name: 'Marble Monolith', category: 'Monumental Artwork', description: 'Hand-carved Carrara marble monolith standing as a statement of architectural permanence.', dimensions: '240 × 120 × 90 cm', material: 'Carrara Marble', year: '2026', edition: 'Masterpiece 1 of 1', images: [] },
  '2': { id: '2', name: 'Obsidian Figure', category: 'Abstract Sculpture', description: 'Carved obsidian figure capturing fluid movement within rigid volcanic glass.', dimensions: '180 × 80 × 60 cm', material: 'Obsidian Stone', year: '2026', edition: 'Edition of 3', images: [] },
  '3': { id: '3', name: 'Limestone Relief', category: 'Architectural Feature', description: 'Hand-chiseled French limestone panel for interior and exterior architectural elevation.', dimensions: '180 × 180 × 25 cm', material: 'French Limestone', year: '2026', edition: 'Edition of 3', images: [] },
  '4': { id: '4', name: 'Figurative Sculptures', category: 'Classical Form', description: 'Polished classical figurative forms carved from hand-selected Italian marble.', dimensions: '195 × 75 × 70 cm', material: 'Italian Marble', year: '2025', edition: 'Masterpiece 1 of 1', images: [] },
  '5': { id: '5', name: 'Gilded Marble Sculptures', category: 'Premium Adornment', description: 'Veined Nero Marquina adorned with 24-karat gold leaf detailing.', dimensions: '210 × 90 × 80 cm', material: 'Nero Marquina & Gold Leaf', year: '2026', edition: 'Edition of 2', images: [] },
  '6': { id: '6', name: 'Spiritual / Religious Sculpture', category: 'Ethereal Art', description: 'Backlit translucent statuary onyx spiritual forms exuding serene luminosity.', dimensions: '240 × 110 × 90 cm', material: 'Statuary Onyx', year: '2026', edition: 'Unique 1 of 1', images: [] },
};

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          setProduct(data as Product);
        } else if (fallbackProductsMap[id]) {
          setProduct(fallbackProductsMap[id]);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e0e] text-[#f1eee7] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#b89a62] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0e0e] text-[#f1eee7] px-4 pt-40 pb-32 text-center">
        <h1 className="text-2xl sm:text-3xl font-light mb-4">Sculpture Not Found</h1>
        <Link to="/products" className="text-[#b89a62] hover:underline text-sm uppercase tracking-widest">
          Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e0e] text-[#f1eee7] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-24 left-1/3 w-[600px] h-[600px] bg-[#b89a62]/8 rounded-full blur-[160px] pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 sm:pt-36 pb-16 sm:pb-24 relative z-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#b9b5ae] hover:text-[#b89a62] transition-colors mb-8 sm:mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <Reveal direction="zoom" className="lg:col-span-6">
            <div className="liquid-glass-card p-3 sm:p-5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <Placeholder
                className="aspect-[3/4] w-full rounded-xl overflow-hidden"
                label={product.category}
                src={images.products[product.name]}
              />
            </div>
          </Reveal>

          <Reveal direction="right" className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4 w-fit">
              <Sparkles className="w-3 h-3 text-[#b89a62]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#ded9cf] font-light">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
              {product.name}
            </h1>

            <div className="w-16 h-px bg-gradient-to-r from-[#b89a62] to-transparent mb-6" />

            <p className="text-sm sm:text-base text-[#b9b5ae] leading-relaxed font-light mb-8">
              {product.description}
            </p>

            {/* Spec Details Card */}
            <div className="liquid-glass-card p-4 sm:p-6 rounded-2xl mb-8 space-y-3 text-xs sm:text-sm">
              {product.material && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#85817a] uppercase tracking-wider text-[11px]">Material</span>
                  <span className="text-[#f1eee7] font-medium">{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#85817a] uppercase tracking-wider text-[11px]">Dimensions</span>
                  <span className="text-[#f1eee7] font-medium">{product.dimensions}</span>
                </div>
              )}
              {product.edition && (
                <div className="flex justify-between">
                  <span className="text-[#85817a] uppercase tracking-wider text-[11px]">Edition</span>
                  <span className="text-[#b89a62] font-medium">{product.edition}</span>
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 liquid-glass-btn-primary text-xs tracking-[0.25em] uppercase text-[#0d0e0e] font-semibold transition-all shadow-lg active:scale-95 w-full sm:w-fit"
            >
              Inquire About This Piece <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
