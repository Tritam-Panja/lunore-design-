import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Interior Design', to: '/interior-design' },
  { label: 'Marble & Granite', to: '/marble-granite' },
  { label: 'Collection', to: '/products' },
  { label: 'Projects', to: '/dream-project' },
  { label: 'Contact Us', to: '/contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.1)] bg-[#1f2122] mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Logo />
            <p className="mt-5 text-sm text-[#a3a3a3] leading-relaxed max-w-xs">
              Luxury stone sculpture, interior design, and marble &amp; granite supply —
              based in Mumbai, India.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group relative inline-flex items-center gap-1 text-sm text-[#a3a3a3] hover:text-[#f2f2f2] transition-colors"
                  >
                    <span className="w-0 h-px bg-[#c2a67e] transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
              Studio
            </h4>
            <p className="text-sm text-[#a3a3a3] leading-relaxed">
              57 Heera Panna M.R. No.2, MHADA Layout,<br />
              Oshiwara, Jogeshwari(W), Near Dhaba,<br />
              Mumbai 400058
            </p>
            <p className="mt-3 text-sm text-[#a3a3a3]">+91 97697 08628</p>
            <p className="text-sm text-[#a3a3a3]">support@lunoreluxedecorstudio.com</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.1)] flex flex-col md:flex-row justify-between gap-2">
          <p className="text-xs text-[#a3a3a3]/60">
            © {new Date().getFullYear()} LUNORE Luxe Decor Studio. All rights reserved.
          </p>
          <p className="text-xs text-[#a3a3a3]/60">Mumbai, India</p>
        </div>
      </div>
    </footer>
  );
}
