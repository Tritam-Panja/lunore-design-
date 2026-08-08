import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';

const HERO_LETTERS = ['L', 'U', 'N', 'O', 'R', 'E'];

const fallbackProducts = [
  { id: '1', name: 'Marble Monolith', category: 'Monumental Artwork' },
  { id: '2', name: 'Obsidian Figure', category: 'Abstract Sculpture' },
  { id: '3', name: 'Limestone Relief', category: 'Architectural Feature' },
  { id: '4', name: 'Figurative Sculptures', category: 'Classical Form' },
  { id: '5', name: 'Gilded Marble Sculptures', category: 'Premium Adornment' },
  { id: '6', name: 'Spiritual / Religious Sculpture', category: 'Ethereal Art' },
];

export function Home() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    supabase.from('products').select('id, name, category').then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data as Product[]);
      }
    });
  }, []);

  return (
    <div>
{/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-48 md:pb-36 min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={images.heroBg}
            alt=""
            className="w-full h-full object-cover opacity-0.35 kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f2122]/70 via-[#1f2122]/60 to-[#1f2122]" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.15em] uppercase text-[#f2f2f2]" style={{ perspective: '800px' }}>
            {HERO_LETTERS.map((letter, i) => (
              <span
                key={i}
                className={`hero-word ${i === 2 ? 'text-[#c2a67e]' : ''}`}
                style={{ animationDelay: `${0.2 + i * 0.12}s` }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-sm text-amber-50 tracking-[0.5em] uppercase text-[#a3a3a3] hero-word" style={{ animationDelay: '1.1s' }}>
            Luxe Decor Studio
          </p>
          <div className="mt-10 w-16 h-px bg-[#c2a67e] mx-auto" />
          <p className="mt-8 text-lg md:text-xl text-[#a3a3a3] font-light max-w-xl mx-auto leading-relaxed hero-word" style={{ animationDelay: '1.3s' }}>
            Stone sculpture, interior design, and marble &amp; granite —
            crafted for timeless spaces.
          </p>
          <div className="mt-12 flex justify-center hero-word" style={{ animationDelay: '1.5s' }}>
            <span className="inline-block w-5 h-8 border border-[#c2a67e]/60 rounded-full relative animate-bounce">
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#c2a67e] rounded-full" />
            </span>
          </div>
        </div>
      </section>

{/* Signature Sculptures carousel */}
      <section className="py-20 md:py-28 border-t border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-3">
                Curated
              </p>
              <h2 className="text-3xl md:text-5xl font-light">Signature Sculptures</h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#a3a3a3] hover:text-[#c2a67e] transition-colors group"
            >
              View All <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="overflow-hidden">
          <div className="marquee-track flex gap-6 px-6 lg:px-10 pb-4">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group w-[300px] md:w-[340px] flex-shrink-0"
              >
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
            ))}
            {/* Duplicate set for seamless marquee loop */}
            {products.map((p) => (
              <Link
                key={`dup-${p.id}`}
                to={`/products/${p.id}`}
                className="group w-[300px] md:w-[340px] flex-shrink-0"
                aria-hidden="true"
              >
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
            ))}
          </div>
        </div>
      </section>

{/* The Art of Stone */}
      <section className="py-20 md:py-32 border-t border-[rgba(255,255,255,0.1)]">
        <Reveal className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
            The Art of Stone
          </p>
          <p className="text-lg md:text-xl text-[#a3a3a3] leading-relaxed font-light">
            At LUNORE, every sculpture begins with a carefully selected piece of rare
            marble or natural stone sourced from around the world. Our artisans shape
            these raw materials by hand, turning them into timeless sculptures that
            highlight the beauty, strength, and character of the stone. Each piece is
            crafted with patience and precision, creating artwork meant to last for
            generations.
          </p>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all shimmer"
          >
            Read Our Story <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
