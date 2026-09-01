import { Placeholder } from '@/components/Placeholder';
import { images } from '@/lib/images';
import { Reveal } from '@/components/Reveal';
import { Sparkles } from 'lucide-react';

const items = [
  { title: 'Celestial Being', desc: 'Visionary Concepts' },
  { title: 'Obsidian Equinox', desc: 'Visionary Concepts' },
  { title: 'Emerald Gateway', desc: 'Visionary Concepts' },
  { title: 'Illuminated Onyx', desc: 'Visionary Concepts' },
];

export function DreamProject() {
  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b89a62]/8 rounded-full blur-[160px] pointer-events-none" />

      <section className="px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 text-center max-w-4xl mx-auto relative z-10">
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#ded9cf] font-light">
              Projects
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
            Dream Projects
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm tracking-[0.25em] uppercase text-[#b89a62]">
            Visionary Concepts &amp; Monolithic Art
          </p>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
        </Reveal>
      </section>

      <section className="py-10 sm:py-16 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {items.map((item, i) => (
              <Reveal key={item.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={(i % 2) * 0.1} className="liquid-glass-card p-4 sm:p-5 rounded-2xl group">
                <div className="rounded-xl overflow-hidden">
                  <Placeholder
                    className="aspect-[4/3] w-full"
                    label={item.title}
                    src={images.dreamProject[item.title]}
                  />
                </div>
                <div className="pt-4 px-1">
                  <h3 className="text-lg sm:text-xl font-normal text-[#f1eee7] group-hover:text-[#b89a62] transition-colors">{item.title}</h3>
                  <p className="mt-1 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#b9b5ae]">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
