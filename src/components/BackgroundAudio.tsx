import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VolumeX } from 'lucide-react';

const TARGET_VOLUME = 0.85;
const FADE_IN_DURATION = 3.2; // Seconds for gentle swell at start of loop
const FADE_OUT_DURATION = 3.6; // Seconds for gentle decrescendo near end of loop
const END_BUFFER = 0.25; // Reaches silence before track end for zero click/pop

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const interactionGainRef = useRef<number>(0);
  const fadeAnimationRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Calculate volume factor based on track position (Fade In & Fade Out)
  const getTrackFadeFactor = useCallback((currentTime: number, duration: number): number => {
    if (!duration || isNaN(duration) || duration <= 0) {
      const progress = Math.max(0, Math.min(1, currentTime / FADE_IN_DURATION));
      return Math.sin((progress * Math.PI) / 2);
    }

    // 1. Gentle fade-in at the start of each loop
    if (currentTime < FADE_IN_DURATION) {
      const progress = Math.max(0, Math.min(1, currentTime / FADE_IN_DURATION));
      return Math.sin((progress * Math.PI) / 2);
    }

    // 2. Gentle fade-out approaching the end of each loop
    const fadeOutStart = duration - FADE_OUT_DURATION - END_BUFFER;
    if (currentTime > fadeOutStart) {
      const remaining = Math.max(0, duration - END_BUFFER - currentTime);
      const progress = Math.max(0, Math.min(1, remaining / FADE_OUT_DURATION));
      return Math.sin((progress * Math.PI) / 2);
    }

    // 3. Steady playback in the body of the track
    return 1.0;
  }, []);

  // Update volume smoothly based on both track position and interaction gain
  const applySmoothVolume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.muted) {
      if (audio.volume !== 0) {
        audio.volume = 0;
      }
      return;
    }

    const trackFactor = getTrackFadeFactor(audio.currentTime, audio.duration);
    const target = TARGET_VOLUME * trackFactor * interactionGainRef.current;
    const clamped = Math.max(0, Math.min(1, target));

    // Update volume smoothly
    if (Math.abs(audio.volume - clamped) > 0.002) {
      audio.volume = clamped;
    }
  }, [getTrackFadeFactor]);

  // Smooth ramp for interaction gain (mute/unmute/interaction)
  const animateInteractionGain = useCallback(
    (targetGain: number, durationMs: number, onComplete?: () => void) => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
        fadeAnimationRef.current = null;
      }

      const startGain = interactionGainRef.current;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, Math.max(0, elapsed / durationMs));
        // Equal power sinusoidal easing
        const ease = Math.sin((progress * Math.PI) / 2);
        interactionGainRef.current = startGain + (targetGain - startGain) * ease;

        applySmoothVolume();

        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(step);
        } else {
          interactionGainRef.current = targetGain;
          applySmoothVolume();
          fadeAnimationRef.current = null;
          if (onComplete) onComplete();
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(step);
    },
    [applySmoothVolume]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start with volume 0 so it can fade in naturally
    audio.volume = 0;

    // Continuous 60fps volume update loop for organic crossfades
    const loopVolumeCheck = () => {
      applySmoothVolume();
      rafRef.current = requestAnimationFrame(loopVolumeCheck);
    };
    rafRef.current = requestAnimationFrame(loopVolumeCheck);

    const onVisibilityChange = () => {
      applySmoothVolume();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Function to unmute and smoothly fade in on user gesture
    const unmuteAndPlay = () => {
      if (!audio) return;
      audio.muted = false;

      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            audio.muted = false;
            setIsMuted(false);
            setIsPlaying(true);
            animateInteractionGain(1.0, 1400);
            removeInteractionListeners();
          })
          .catch(() => {
            // Browser still requires direct gesture
            audio.muted = true;
            setIsMuted(true);
          });
      } else {
        audio.muted = false;
        setIsMuted(false);
        setIsPlaying(true);
        animateInteractionGain(1.0, 1400);
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
    const initialPlay = audio.play();
    if (initialPlay !== undefined) {
      initialPlay
        .then(() => {
          audio.muted = false;
          setIsMuted(false);
          setIsPlaying(true);
          animateInteractionGain(1.0, 1400);
        })
        .catch(() => {
          // Browser requires interaction: start muted so audio track runs immediately
          audio.muted = true;
          setIsMuted(true);
          interactionGainRef.current = 0;
          audio.play().catch(() => {});

          // Attach broad interaction listeners to unmute and fade in on first user action
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
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, [animateInteractionGain, applySmoothVolume]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused && !isMuted) {
      // Smooth fade-out before pausing
      setIsMuted(true);
      animateInteractionGain(0.0, 320, () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });
    } else {
      audio.muted = false;
      audio.volume = 0;
      interactionGainRef.current = 0;
      setIsMuted(false);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          animateInteractionGain(1.0, 600);
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
        onTimeUpdate={applySmoothVolume}
        onPlay={() => {
          if (audioRef.current && !audioRef.current.muted) {
            setIsMuted(false);
            setIsPlaying(true);
          }
        }}
        onPause={() => {
          if (interactionGainRef.current === 0) {
            setIsPlaying(false);
          }
        }}
        onEnded={() => {
          // Backup loop handler if native loop ever completes
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
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
