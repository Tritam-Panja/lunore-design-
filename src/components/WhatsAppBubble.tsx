import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, ArrowUpRight } from 'lucide-react';

interface WhatsAppBubbleProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppBubble({
  phoneNumber = "919769708628",
  defaultMessage = "Hello Lunore Studio, I would like to inquire about your bespoke design and stone services."
}: WhatsAppBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If on the dedicated /contact page, always show
    if (location.pathname === '/contact') {
      setIsVisible(true);
      return;
    }

    const checkVisibility = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        // Reveal when the contact section is reached or approaching
        const inView = rect.top <= window.innerHeight + 100;
        setIsVisible(inView);
      } else {
        // Fallback: check if near bottom of page
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) {
          setIsVisible(window.scrollY / total > 0.85);
        }
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    checkVisibility();

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [location.pathname]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
    >
      {/* Floating Tooltip Pill on Hover */}
      <div
        className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111315]/90 border border-white/15 text-xs text-[#f1eee7] shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span className="font-light tracking-wide">Concierge Online</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#b89a62]" />
      </div>

      {/* Main Luxury WhatsApp Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat with Lunore Studio on WhatsApp"
        className="group relative cursor-pointer w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0d0e0e]/90 border border-[#25D366]/50 hover:border-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(37,211,102,0.25)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(37,211,102,0.5)] transition-all duration-400 transform hover:scale-110 active:scale-95 backdrop-blur-md"
      >
        {/* Ambient Pulse Ring */}
        <span className="absolute inset-0 rounded-full border border-[#25D366]/40 animate-ping opacity-30 pointer-events-none" />

        {/* Inner Highlight Gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#25D366]/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-6 h-6 fill-current transition-transform duration-300 group-hover:rotate-6" />
      </a>
    </div>
  );
}

export default WhatsAppBubble;
