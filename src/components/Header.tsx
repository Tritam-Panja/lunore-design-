import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  {
    label: 'Services',
    children: [
      { label: 'Interior Design', to: '/interior-design' },
      { label: 'Marble & Granite', to: '/marble-granite' },
    ],
  },
  { label: 'Collection', to: '/products' },
  { label: 'Projects', to: '/dream-project' },
  { label: 'Exhibitions', to: '/exhibitions' },
  { label: 'Contact Us', to: '/contact' },
];

export function Header() {
  const location = useLocation();
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

  const headerBg = scrolled
    ? 'bg-[#1f2122]/85 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-[rgba(255,255,255,0.06)]'
    : 'bg-transparent border-b border-transparent';

  const headerHeight = scrolled ? 'h-16' : 'h-20 md:h-24';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${headerBg}`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-10 transition-all duration-500 ease-out ${headerHeight}`}>
        <div className="flex items-center justify-between h-full">
          <div className={scrolled ? 'scale-90 origin-left transition-transform duration-500' : 'scale-100 transition-transform duration-500'}>
            <Logo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative header-nav-item"
                  style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
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
                  </button>

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
                  key={link.to}
                  to={link.to!}
                  className={({ isActive }) =>
                    `header-nav-item relative group text-xs tracking-[0.2em] uppercase py-2 transition-colors duration-300 ${
                      isActive
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
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-[#f2f2f2] focus:outline-none"
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

      {/* Mobile menu */}
      <div
        className={`lg:hidden absolute top-full inset-x-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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
                  <span className="text-xs tracking-[0.25em] uppercase text-[#c2a67e] font-medium">
                    {link.label}
                  </span>
                  <div className="ml-4 mt-2 flex flex-col gap-1 border-l border-[rgba(194,166,126,0.3)] pl-4">
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
                  key={`${link.to}-${open ? 'open' : 'closed'}`}
                  to={link.to!}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:pl-2 ${
                      open ? 'mobile-menu-item' : ''
                    } ${
                      isActive
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
