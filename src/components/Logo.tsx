import { Link } from 'react-router-dom';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-[var(--font-heading)] text-2xl tracking-[0.3em] uppercase text-[#f2f2f2]">
        LU<span className="text-[#c2a67e]">N</span>ORE
      </span>
      <span className="mt-1 text-[10px] tracking-[0.35em] uppercase text-[#a3a3a3]">
        Luxe Decor Studio
      </span>
    </Link>
  );
}
