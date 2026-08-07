import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1f2122]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.1)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Logo />

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase text-[#a3a3a3] hover:text-[#f2f2f2] transition-colors py-2">
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-[#2a2c2d] border border-[rgba(255,255,255,0.1)] py-2 min-w-[200px]">
                        {link.children.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className="block px-5 py-2 text-xs tracking-[0.15em] uppercase text-[#a3a3a3] hover:text-[#c2a67e] transition-colors"
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to!}
                  className={({ isActive }) =>
                    `text-xs tracking-[0.2em] uppercase transition-colors ${
                      isActive ? 'text-[#c2a67e]' : 'text-[#a3a3a3] hover:text-[#f2f2f2]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          <button
            className="lg:hidden text-[#f2f2f2]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[rgba(255,255,255,0.1)] bg-[#1f2122]">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="py-2">
                  <span className="text-xs tracking-[0.2em] uppercase text-[#a3a3a3]">
                    {link.label}
                  </span>
                  <div className="ml-4 mt-2 flex flex-col gap-1">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className="py-1 text-xs tracking-[0.15em] uppercase text-[#a3a3a3] hover:text-[#c2a67e]"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to!}
                  onClick={() => setOpen(false)}
                  className="py-2 text-xs tracking-[0.2em] uppercase text-[#a3a3a3] hover:text-[#c2a67e]"
                >
                  {link.label}
                </NavLink>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
