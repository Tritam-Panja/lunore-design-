import React, { useEffect, useRef, useState } from 'react';
import { VolumeX } from 'lucide-react';

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1.0;

    // Function to unmute and ensure playback
    const unmuteAndPlay = () => {
      if (!audio) return;
      audio.muted = false;
      audio.volume = 1.0;

      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            audio.muted = false;
            audio.volume = 1.0;
            setIsMuted(false);
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch(() => {
            // Browser still requires a direct click/tap gesture: keep muted until gesture occurs
            audio.muted = true;
            setIsMuted(true);
          });
      } else {
        audio.muted = false;
        setIsMuted(false);
        setIsPlaying(true);
        removeInteractionListeners();
      }
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('pointerup', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('touchend', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    const handleInteraction = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('#sound-toggle-btn')) {
        return; // Handled directly by toggle button
      }
      unmuteAndPlay();
    };

    // 1. Try immediate unmuted play on mount
    audio.muted = false;
    audio.volume = 1.0;
    const initialPlay = audio.play();
    if (initialPlay !== undefined) {
      initialPlay
        .then(() => {
          audio.muted = false;
          setIsMuted(false);
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser requires interaction: start muted so audio track runs immediately
          audio.muted = true;
          setIsMuted(true);
          audio.play().catch(() => {});

          // Attach broad interaction listeners (click, tap, scroll, key) to unmute on first action
          window.addEventListener('click', handleInteraction, { passive: true });
          window.addEventListener('pointerup', handleInteraction, { passive: true });
          window.addEventListener('pointerdown', handleInteraction, { passive: true });
          window.addEventListener('touchend', handleInteraction, { passive: true });
          window.addEventListener('touchstart', handleInteraction, { passive: true });
          window.addEventListener('wheel', handleInteraction, { passive: true });
          window.addEventListener('scroll', handleInteraction, { passive: true });
          window.addEventListener('keydown', handleInteraction, { passive: true });
        });
    }

    return () => {
      removeInteractionListeners();
    };
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused && !isMuted) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio.volume = 1.0;
      setIsMuted(false);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  const isAudible = isPlaying && !isMuted;

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/LUNORE.mp3"
        autoPlay
        loop
        muted={isMuted}
        preload="auto"
        playsInline
        onPlay={() => {
          if (audioRef.current && !audioRef.current.muted) {
            setIsMuted(false);
            setIsPlaying(true);
          }
        }}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={() => {
          if (audioRef.current) {
            setIsMuted(audioRef.current.muted);
          }
        }}
      />

      <button
        id="sound-toggle-btn"
        onClick={handleToggle}
        type="button"
        aria-label={isAudible ? 'Mute background audio' : 'Play background audio'}
        title={isAudible ? 'Click to Mute' : 'Click to Play'}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 sm:bottom-6 sm:left-6 z-50 group cursor-pointer inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/75 hover:bg-black/90 border border-white/25 hover:border-[#b89a62] text-[#f1eee7] shadow-[0_8px_25px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.95),0_0_25px_rgba(184,154,98,0.4)] transition-all duration-300 backdrop-blur-md select-none"
      >
        {/* Animated Equalizer Wave Bars or Sound Off Icon */}
        <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 justify-center pb-[1px]">
          {isAudible ? (
            <>
              <span className="w-[2px] bg-[#b89a62] rounded-full animate-[soundbar-1_0.9s_ease-in-out_infinite]" />
              <span className="w-[2px] bg-[#b89a62] rounded-full animate-[soundbar-2_0.7s_ease-in-out_infinite]" />
              <span className="w-[2px] bg-[#b89a62] rounded-full animate-[soundbar-3_1.1s_ease-in-out_infinite]" />
            </>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[#ded9cf]/70 group-hover:text-[#b89a62] transition-colors" />
          )}
        </div>

        <span className="text-[10px] sm:text-xs tracking-[0.22em] uppercase font-semibold text-[#ded9cf] group-hover:text-[#b89a62] transition-colors">
          {isAudible ? 'Sound On' : 'Sound Off'}
        </span>
      </button>
    </>
  );
}
