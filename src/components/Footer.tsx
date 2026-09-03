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
    <footer className="border-t border-white/10 bg-[#0d0e0e]/95 backdrop-blur-2xl mt-16 sm:mt-24 relative overflow-hidden">
      {/* Subtle radial glow in footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#b89a62]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <Logo />
            <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-[#b9b5ae] leading-relaxed max-w-xs font-light">
              Luxury stone sculpture, interior design, and marble &amp; granite supply —
              based in Mumbai, India.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4 sm:mb-5 font-medium">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => handleFooterLinkClick(e, link)}
                    className="group relative inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase text-[#b9b5ae] hover:text-white transition-colors py-0.5"
                  >
                    <span className="w-0 h-px bg-[#b89a62] transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-4 sm:mb-5 font-medium">
              Studio
            </h4>
            <p className="text-xs sm:text-sm text-[#cfcac0] leading-relaxed font-sans font-light tracking-wide">
              103 UPPER, ANDHERI INDUSTRIAL ESTATE,<br />
              OFF VEERA DESAI ROAD, NEAR YASH RAJ FILMS, OPP CHITRAKOOT BANQUETS,<br />
              ANDHERI WEST, MUMBAI 400053
            </p>
            <p className="mt-3 text-xs sm:text-sm text-[#cfcac0] font-sans font-normal tracking-wider">
              <a href="tel:+919769708628" className="hover:text-[#f3e5ab] transition-colors">+91 97697 08628</a>
            </p>
            <p className="text-xs sm:text-sm text-[#cfcac0] font-sans font-light truncate">
              <a href="mailto:support@lunoreluxedecorstudio.com" className="hover:text-[#f3e5ab] transition-colors">support@lunoreluxedecorstudio.com</a>
            </p>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-[11px] sm:text-xs text-[#85817a]">
            © {new Date().getFullYear()} LUNORE Luxe Decor Studio. All rights reserved.
          </p>
          <p className="text-[11px] sm:text-xs text-[#85817a]">Mumbai, India</p>
        </div>
      </div>
    </footer>
  );
}

