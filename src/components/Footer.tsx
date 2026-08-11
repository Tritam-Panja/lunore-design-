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
    <footer className="border-t border-[rgba(184,154,98,0.16)] bg-[#111211] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Logo />
            <p className="mt-5 text-sm text-[#b9b5ae] leading-relaxed max-w-xs font-light">
              Luxury stone sculpture, interior design, and marble &amp; granite supply —
              based in Mumbai, India.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-5 font-medium">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => handleFooterLinkClick(e, link)}
                    className="group relative inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase text-[#b9b5ae] hover:text-[#f1eee7] transition-colors"
                  >
                    <span className="w-0 h-px bg-[#b89a62] transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-5 font-medium">
              Studio
            </h4>
            <p className="text-sm text-[#b9b5ae] leading-relaxed font-light">
              57 Heera Panna M.R. No.2, MHADA Layout,<br />
              Oshiwara, Jogeshwari(W), Near Dhaba,<br />
              Mumbai 400058
            </p>
            <p className="mt-3 text-sm text-[#b9b5ae] font-light">+91 97697 08628</p>
            <p className="text-sm text-[#b9b5ae] font-light">support@lunoreluxedecorstudio.com</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(184,154,98,0.15)] flex flex-col md:flex-row justify-between gap-2">
          <p className="text-xs text-[#85817a]">
            © {new Date().getFullYear()} LUNORE Luxe Decor Studio. All rights reserved.
          </p>
          <p className="text-xs text-[#85817a]">Mumbai, India</p>
        </div>
      </div>
    </footer>
  );
}
