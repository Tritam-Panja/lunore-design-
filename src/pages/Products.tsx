import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').order('created_at').then(({ data, error }) => {
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    });
  }, []);

  return (
<div>
      <section className="px-6 pt-32 pb-16 md:pt-44 md:pb-20 text-center max-w-4xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
            Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-light">Signature Sculptures</h1>
          <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
        </Reveal>
      </section>

      <section className="py-12 md:py-16 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#2a2c2d] border border-[rgba(255,255,255,0.1)]" />
                  <div className="h-5 bg-[#2a2c2d] mt-4 w-2/3" />
                  <div className="h-3 bg-[#2a2c2d] mt-2 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.1}>
                  <Link to={`/products/${p.id}`} className="group block">
                    <Placeholder
                      className="aspect-[3/4] mb-5"
                      label={p.category}
                      src={images.products[p.name]}
                    />
                    <h3 className="text-xl font-light group-hover:text-[#c2a67e] transition-colors">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#a3a3a3]">
                      {p.category}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
