import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';

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
        if (!error && data) setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="px-6 pt-40 pb-32 text-center text-[#a3a3a3]">Loading…</div>
    );
  }

  if (!product) {
    return (
      <div className="px-6 pt-40 pb-32 text-center">
        <h1 className="text-3xl font-light mb-4">Sculpture Not Found</h1>
        <Link to="/products" className="text-[#c2a67e] hover:underline">
          Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-20">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#a3a3a3] hover:text-[#c2a67e] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <Reveal direction="zoom">
            <Placeholder
              className="aspect-[3/4]"
              label={product.category}
              src={images.products[product.name]}
            />
          </Reveal>

          <Reveal direction="right" className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-4">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-8">{product.name}</h1>
            <div className="w-12 h-px bg-[#c2a67e] mb-8" />
            <p className="text-lg text-[#a3a3a3] leading-relaxed font-light">
              {product.description}
            </p>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all w-fit shimmer"
            >
              Inquire About This Piece
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
