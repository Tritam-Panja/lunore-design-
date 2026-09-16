import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface FullScreenImageViewerProps {
  src?: string | null;
  imageUrl?: string | null;
  alt?: string;
  altText?: string;
  onClose: () => void;
}

export function FullScreenImageViewer({
  src,
  imageUrl,
  alt = '',
  altText = '',
  onClose,
}: FullScreenImageViewerProps) {
  const activeUrl = src || imageUrl;
  const activeAlt = alt || altText;

  useEffect(() => {
    if (!activeUrl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeUrl, onClose]);

  if (!activeUrl) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 md:p-8 cursor-zoom-out select-none animate-in fade-in duration-200"
    >
      {/* Top right close button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 sm:w-12 h-10 sm:h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10 active:scale-95 shadow-2xl"
        title="Close (Esc)"
        aria-label="Close Full Screen View"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Pure Image Container */}
      <div
        className="relative max-w-[96vw] max-h-[92vh] flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={activeUrl}
          alt={activeAlt}
          className="w-auto h-auto max-w-[96vw] max-h-[92vh] object-contain rounded-xl sm:rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-200 select-none"
        />
      </div>
    </div>,
    document.body
  );
}

export default FullScreenImageViewer;
