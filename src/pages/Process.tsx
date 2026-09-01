import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';
import { Sparkles } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Material Selection',
    desc: 'Every masterpiece begins at the source. We personally travel to quarries in Carrara, Puglia, and beyond to hand-select monoliths that possess the perfect density, vein patterns, and spiritual resonance for our visions.',
    img: images.process[0],
  },
  {
    num: '02',
    title: 'Artistic Revelation',
    desc: 'The stone dictates the form. Our master sculptors spend weeks studying the raw block before the first strike. We use traditional hand-tools alongside modern precision to reveal the elegance hidden within the weight.',
    img: images.process[1],
  },
  {
    num: '03',
    title: 'Refined Finishing',
    desc: "From the raw chisel marks to a silk-like polish, the finishing process is an obsessive journey of texture. Whether it's a mirror-finish obsidian or a textured limestone relief, the final touch ensures a permanent legacy.",
    img: images.process[2],
  },
];

export function Process() {
  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b89a62]/8 rounded-full blur-[160px] pointer-events-none" />

      <section className="px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 text-center max-w-4xl mx-auto relative z-10">
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#b89a62]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#ded9cf] font-light">
              Process
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
            Hand-Carved Excellence
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm tracking-[0.25em] uppercase text-[#b89a62]">
            Our Crafting Journey &amp; Legacy
          </p>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
        </Reveal>
      </section>

      <section className="py-10 sm:py-16 md:py-20 border-t border-white/10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-20">
          {steps.map((s, i) => (
            <div key={s.num} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center liquid-glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl">
              <Reveal direction={i % 2 === 0 ? 'left' : 'right'} className="rounded-xl overflow-hidden">
                <Placeholder className="aspect-[4/3] w-full" label={s.title} src={s.img} />
              </Reveal>
              <Reveal direction={i % 2 === 0 ? 'right' : 'left'} delay={0.15}>
                <span className="text-4xl sm:text-5xl md:text-6xl font-mono font-light text-[#b89a62]">
                  {s.num}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light mt-2 mb-3 sm:mb-4 text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>
                  {s.title}
                </h2>
                <div className="w-12 h-px bg-[#b89a62]/60 mb-4 sm:mb-5" />
                <p className="text-xs sm:text-base text-[#b9b5ae] leading-relaxed font-light">
                  {s.desc}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
