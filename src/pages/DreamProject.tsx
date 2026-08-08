import { Placeholder } from '@/components/Placeholder';
import { images } from '@/lib/images';
import { Reveal } from '@/components/Reveal';

const items = [
  { title: 'Celestial Being', desc: 'Visionary Concepts' },
  { title: 'Obsidian Equinox', desc: 'Visionary Concepts' },
  { title: 'Emerald Gateway', desc: 'Visionary Concepts' },
  { title: 'Illuminated Onyx', desc: 'Visionary Concepts' },
];

export function DreamProject() {
  return (
    <div>
<section className="px-6 pt-32 pb-16 md:pt-44 md:pb-20 text-center max-w-4xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
            Projects
          </p>
          <h1 className="text-4xl md:text-6xl font-light">Dream Project</h1>
          <p className="mt-6 text-sm tracking-[0.3em] uppercase text-[#a3a3a3]">
            Visionary Concepts
          </p>
          <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
        </Reveal>
      </section>

      <section className="py-12 md:py-16 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {items.map((item, i) => (
              <Reveal key={item.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={(i % 2) * 0.12}>
                <Placeholder
                  className="aspect-[4/3]"
                  label={item.title}
                  src={images.dreamProject[item.title]}
                />
                <h3 className="mt-5 text-xl font-light">{item.title}</h3>
                <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#a3a3a3]">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
