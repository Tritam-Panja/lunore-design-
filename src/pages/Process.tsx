import { images } from '@/lib/images';
import { Placeholder } from '@/components/Placeholder';
import { Reveal } from '@/components/Reveal';

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
    <div>
      <section className="px-6 pt-32 pb-16 md:pt-44 md:pb-20 text-center max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
          Process
        </p>
        <h1 className="text-4xl md:text-6xl font-light">Hand-Carved Excellence</h1>
        <p className="mt-6 text-sm tracking-[0.3em] uppercase text-[#a3a3a3]">
          Our Crafting Journey
        </p>
        <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
      </section>

      <section className="py-12 md:py-20 border-t border-[rgba(255,255,255,0.1)] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 space-y-20 relative z-10">
          {steps.map((s, i) => (
            <div key={s.num} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <Reveal direction={i % 2 === 0 ? 'left' : 'right'}>
                <Placeholder className="aspect-[4/3]" label={s.title} src={s.img} />
              </Reveal>
              <Reveal direction={i % 2 === 0 ? 'right' : 'left'} delay={0.15}>
                <span className="text-5xl md:text-6xl font-light text-[#c2a67e]">
                  {s.num}
                </span>
                <h2 className="text-2xl md:text-3xl font-light mt-3 mb-5">{s.title}</h2>
                <div className="w-12 h-px bg-[#c2a67e] mb-6" />
                <p className="text-lg text-[#a3a3a3] leading-relaxed font-light">
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
