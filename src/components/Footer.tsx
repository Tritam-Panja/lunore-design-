import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useLenis } from './SmoothScroll';

interface FooterLink {
  label: string;
  to: string;
  hash?: string;
}

const footerLinks: FooterLink[] = [
  { label: 'Home', to: '/', hash: '#hero' },
  { label: 'Brand Story', to: '/brand-story', hash: '#brand-story' },
  { label: 'About Us', to: '/about', hash: '#about' },
  { label: 'Interior Design', to: '/interior-design' },
  { label: 'Marble & Granite', to: '/marble-granite' },
  { label: 'Collection', to: '/products', hash: '#projects' },
  { label: 'Process', to: '/process', hash: '#process' },
  { label: 'Dream Projects', to: '/dream-project' },
  { label: 'Contact Us', to: '/contact', hash: '#contact' },
];

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollTo } = useLenis();

  const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: FooterLink) => {
    if (location.pathname === '/' && link.hash) {
      const target = document.querySelector(link.hash);
      if (target) {
        e.preventDefault();
        scrollTo(target as HTMLElement);
        return;
      }
    } else if (location.pathname !== '/' && link.hash) {
      e.preventDefault();
      navigate(`/${link.hash}`);
    }
  };

  return (
    <footer className="border-t border-[rgba(255,255,255,0.1)] bg-[#1f2122] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Logo />
            <p className="mt-5 text-sm text-[#a3a3a3] leading-relaxed max-w-xs font-light">
              Luxury stone sculpture, interior design, and marble &amp; granite supply —
              based in Mumbai, India.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5 font-medium">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => handleFooterLinkClick(e, link)}
                    className="group relative inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase text-[#a3a3a3] hover:text-[#f2f2f2] transition-colors"
                  >
                    <span className="w-0 h-px bg-[#c2a67e] transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5 font-medium">
              Studio
            </h4>
            <p className="text-sm text-[#a3a3a3] leading-relaxed font-light">
              57 Heera Panna M.R. No.2, MHADA Layout,<br />
              Oshiwara, Jogeshwari(W), Near Dhaba,<br />
              Mumbai 400058
            </p>
            <p className="mt-3 text-sm text-[#a3a3a3] font-light">+91 97697 08628</p>
            <p className="text-sm text-[#a3a3a3] font-light">support@lunoreluxedecorstudio.com</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row justify-between gap-2">
          <p className="text-xs text-[#a3a3a3]/60">
            © {new Date().getFullYear()} LUNORE Luxe Decor Studio. All rights reserved.
          </p>
          <p className="text-xs text-[#a3a3a3]/60">Mumbai, India</p>
        </div>
      </div>
    </footer>
  );
}
