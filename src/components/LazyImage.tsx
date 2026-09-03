import React, { useState, useEffect, useRef } from 'react';
import { Gem, ImageOff } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  skeletonClassName?: string;
  aspectRatio?: string;
  threshold?: number;
  rootMargin?: string;
  fallbackSrc?: string;
}

export function LazyImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  skeletonClassName = '',
  aspectRatio,
  threshold = 0.01,
  rootMargin = '800px',
  fallbackSrc,
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not available, load immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Check if image is already cached in memory
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [isInView, src]);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#181917] ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 z-0 bg-[#202222] overflow-hidden ${skeletonClassName}`}
          aria-hidden="true"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#c2a67e]/10 to-transparent animate-[shimmer_1.8s_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Gem className="w-5 h-5 text-[#c2a67e]/20" strokeWidth={1} />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1d1f1f] text-[#a3a3a3]/60 p-4">
          <ImageOff className="w-6 h-6 mb-2 text-[#c2a67e]/40" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] uppercase text-center">
            Image Unavailable
          </span>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (fallbackSrc && src !== fallbackSrc) {
              // try fallback
            } else {
              setHasError(true);
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          {...props}
        />
      )}
    </div>
  );
}

export default LazyImage;
