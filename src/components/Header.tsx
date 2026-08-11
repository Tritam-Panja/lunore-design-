import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { useLenis } from './SmoothScroll';
import { ExperienceToggle } from './ExperienceToggle';

interface NavItem {
  label: string;
  to: string;
  hash?: string;
  children?: { label: string; to: string }[];
}

const navLinks: NavItem[] = [
  { label: 'Home', to: '/', hash: '#hero' },
  { label: 'About Us', to: '/about', hash: '#about' },
  {
    label: 'Services',
    to: '/#services',
    hash: '#services',
    children: [
      { label: 'Interior Design', to: '/interior-design' },
      { label: 'Marble & Granite', to: '/marble-granite' },
    ],
  },
  { label: 'Collection', to: '/products', hash: '#projects' },
  { label: 'Projects', to: '/dream-project' },
  { label: 'Process', to: '/process', hash: '#process' },
  { label: 'Exhibitions', to: '/exhibitions' },
  { label: 'Contact Us', to: '/contact', hash: '#contact' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollTo } = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Track scroll position to toggle header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavItem) => {
    if (location.pathname === '/' && link.hash) {
      const targetEl = document.querySelector(link.hash);
      if (targetEl) {
        e.preventDefault();
        scrollTo(targetEl as HTMLElement);
        setOpen(false);
        return;
      }
    } else if (location.pathname !== '/' && link.hash) {
      e.preventDefault();
      setOpen(false);
      navigate(`/${link.hash}`);
    }
  };

  const headerBg = scrolled
    ? 'bg-[#1f2122]/90 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-[rgba(255,255,255,0.08)]'
    : 'bg-transparent border-b border-transparent';

  const headerHeight = scrolled ? 'h-16' : 'h-20 md:h-24';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${headerBg}`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-10 transition-all duration-500 ease-out ${headerHeight}`}>
        <div className="flex items-center justify-between h-full">
          <div className={scrolled ? 'scale-90 origin-left transition-transform duration-500' : 'scale-100 transition-transform duration-500'}>
            <NavLink to="/" onClick={(e) => handleLinkClick(e, { label: 'Home', to: '/', hash: '#hero' })}>
              <Logo />
            </NavLink>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link, i) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative header-nav-item"
                  style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <a
                    href={link.hash || link.to}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase py-2 group transition-colors ${
                      scrolled ? 'text-[#e8e8e8]' : 'text-[#f2f2f2]'
                    }`}
                  >
                    <span className="relative overflow-hidden pb-0.5">
                      <span className="hover:text-[#c2a67e] transition-colors">
                        {link.label}
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-px bg-[#c2a67e] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#a3a3a3] transition-transform duration-300 ${
                        servicesOpen ? 'rotate-180 text-[#c2a67e]' : ''
                      }`}
                    />
                  </a>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-0 pt-3 transition-all duration-300 ease-out ${
                      servicesOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="min-w-[210px] rounded-sm bg-[#2a2c2d]/95 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] py-2 shadow-2xl shadow-black/30 overflow-hidden">
                      <div className="absolute top-0 left-8 w-10 h-px bg-gradient-to-r from-transparent via-[#c2a67e] to-transparent" />
                      {link.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `relative block px-6 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:pl-8 ${
                              isActive
                                ? 'text-[#c2a67e] bg-[#c2a67e]/5'
                                : 'text-[#d8d8d8] hover:text-[#c2a67e] hover:bg-[#c2a67e]/5'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-[#c2a67e] transition-all duration-300 ${
                                  isActive ? 'h-1/2' : 'h-0'
                                }`}
                              />
                              {child.label}
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={({ isActive }) =>
                    `header-nav-item relative group text-xs tracking-[0.2em] uppercase py-2 transition-colors duration-300 ${
                      isActive && !link.hash
                        ? 'text-[#c2a67e]'
                        : scrolled
                          ? 'text-[#e8e8e8] hover:text-[#c2a67e]'
                          : 'text-[#f2f2f2] hover:text-[#c2a67e]'
                    }`
                  }
                  style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                >
                  {({ isActive }) => (
                    <>
                      <span className="pb-0.5">{link.label}</span>
                      <span
                        className={`absolute bottom-0 left-0 h-px bg-[#c2a67e] transition-all duration-300 ease-out ${
                          isActive && !link.hash ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              )
            )}

            {/* Desktop Experience Toggle */}
            <div className="header-nav-item ml-2" style={{ animationDelay: '0.9s' }}>
              <ExperienceToggle />
            </div>
          </nav>

          {/* Mobile menu header action */}
          <div className="flex items-center gap-3 lg:hidden">
            <ExperienceToggle className="scale-90" />
            <button
              className="relative w-10 h-10 flex items-center justify-center text-[#f2f2f2] focus:outline-none"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <div
                className={`absolute inset-0 rounded-sm border border-[rgba(255,255,255,0.15)] transition-all duration-300 ${
                  open ? 'border-[#c2a67e]/60 bg-[#c2a67e]/10 rotate-45' : ''
                }`}
              />
              <Menu
                className={`absolute w-5 h-5 transition-all duration-300 ${
                  open ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
                }`}
              />
              <X
                className={`absolute w-5 h-5 transition-all duration-300 ${
                  open
                    ? 'opacity-100 scale-100 rotate-0 text-[#c2a67e]'
                    : 'opacity-0 scale-50 -rotate-90'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden absolute top-full inset-x-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'max-h-[550px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="border-t border-[rgba(255,255,255,0.08)] bg-[#1f2122]/95 backdrop-blur-xl shadow-2xl shadow-black/40">
          <div className="px-6 py-6 flex flex-col gap-1">
            {navLinks.map((link, i) =>
              link.children ? (
                <div
                  key={`${link.label}-${open ? 'open' : 'closed'}`}
                  className={`py-2 ${open ? 'mobile-menu-item' : ''}`}
                  style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                >
                  <a
                    href={link.hash || link.to}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="text-xs tracking-[0.25em] uppercase text-[#c2a67e] font-medium block mb-2"
                  >
                    {link.label}
                  </a>
                  <div className="ml-4 flex flex-col gap-1 border-l border-[rgba(194,166,126,0.3)] pl-4">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `py-1.5 text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:pl-2 ${
                            isActive
                              ? 'text-[#c2a67e]'
                              : 'text-[#d8d8d8] hover:text-[#c2a67e]'
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={`${link.label}-${open ? 'open' : 'closed'}`}
                  to={link.to}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={({ isActive }) =>
                    `py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:pl-2 ${
                      open ? 'mobile-menu-item' : ''
                    } ${
                      isActive && !link.hash
                        ? 'text-[#c2a67e]'
                        : 'text-[#e8e8e8] hover:text-[#c2a67e]'
                    }`
                  }
                  style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                >
                  {link.label}
                </NavLink>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
