import React, { useEffect, useRef, useState, useCallback } from 'react';

const TARGET_VOLUME = 0.85;
const FADE_IN_DURATION = 3.2; // Seconds for gentle swell at start of loop
const FADE_OUT_DURATION = 3.6; // Seconds for gentle decrescendo near end of loop
const END_BUFFER = 0.25; // Reaches silence before track end for zero click/pop

interface InteractionAnimation {
  startGain: number;
  targetGain: number;
  startTime: number;
  durationMs: number;
  onComplete?: () => void;
}

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const interactionGainRef = useRef<number>(0);
  const interactionAnimRef = useRef<InteractionAnimation | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Directly stop the active volume RAF loop
  const stopVolumeLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Compute track fade-in/fade-out factor based on currentTime and duration
  const getTrackFadeFactor = useCallback((currentTime: number, duration: number): { factor: number; isActive: boolean } => {
    if (!duration || isNaN(duration) || duration <= 0) {
      if (currentTime < FADE_IN_DURATION) {
        const progress = Math.max(0, Math.min(1, currentTime / FADE_IN_DURATION));
        return { factor: Math.sin((progress * Math.PI) / 2), isActive: true };
      }
      return { factor: 1.0, isActive: false };
    }

    // 1. Gentle swell at start of loop
    if (currentTime < FADE_IN_DURATION) {
      const progress = Math.max(0, Math.min(1, currentTime / FADE_IN_DURATION));
      return { factor: Math.sin((progress * Math.PI) / 2), isActive: true };
    }

    // 2. Gentle decrescendo near end of loop
    const fadeOutStart = duration - FADE_OUT_DURATION - END_BUFFER;
    if (currentTime >= fadeOutStart) {
      const remaining = Math.max(0, duration - END_BUFFER - currentTime);
      const progress = Math.max(0, Math.min(1, remaining / FADE_OUT_DURATION));
      return { factor: Math.sin((progress * Math.PI) / 2), isActive: true };
    }

    // 3. Steady state in the middle section of the track
    return { factor: 1.0, isActive: false };
  }, []);

  // Set steady-state volume immediately without running animation frames
  const applySteadyVolume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.muted) {
      if (audio.volume !== 0) audio.volume = 0;
      return;
    }

    const { factor } = getTrackFadeFactor(audio.currentTime, audio.duration);
    const target = Math.max(0, Math.min(1, TARGET_VOLUME * factor * interactionGainRef.current));
    if (Math.abs(audio.volume - target) > 0.001) {
      audio.volume = target;
    }
  }, [getTrackFadeFactor]);

  // Active RAF step function: runs ONLY while a volume transition is taking place
  const stepVolumeTransition = useCallback(
    (now: number) => {
      const audio = audioRef.current;
      if (!audio) {
        rafIdRef.current = null;
        return;
      }

      // Stop immediately if audio is paused, muted, or tab is hidden
      if (audio.paused || audio.muted || document.hidden) {
        if (audio.volume !== 0) audio.volume = 0;
        rafIdRef.current = null;
        return;
      }

      // 1. Advance interaction gain animation if active
      let interactionActive = false;
      const anim = interactionAnimRef.current;
      if (anim) {
        const elapsed = now - anim.startTime;
        const progress = Math.min(1, Math.max(0, elapsed / anim.durationMs));
        const ease = Math.sin((progress * Math.PI) / 2);
        interactionGainRef.current = anim.startGain + (anim.targetGain - anim.startGain) * ease;

        if (progress >= 1) {
          interactionGainRef.current = anim.targetGain;
          const onComplete = anim.onComplete;
          interactionAnimRef.current = null;
          if (onComplete) onComplete();
        } else {
          interactionActive = true;
        }
      }

      // 2. Compute track-level fade
      const { factor, isActive: trackFadeActive } = getTrackFadeFactor(audio.currentTime, audio.duration);

      // 3. Apply volume
      const targetVol = Math.max(0, Math.min(1, TARGET_VOLUME * factor * interactionGainRef.current));
      if (Math.abs(audio.volume - targetVol) > 0.001) {
        audio.volume = targetVol;
      }

      // 4. Continue RAF ONLY if either interaction or track fade is actively changing volume
      if (interactionActive || (trackFadeActive && interactionGainRef.current > 0)) {
        rafIdRef.current = requestAnimationFrame(stepVolumeTransition);
      } else {
        // Transition complete: settle volume and STOP RAF loop completely
        const finalVol = Math.max(0, Math.min(1, TARGET_VOLUME * 1.0 * interactionGainRef.current));
        if (Math.abs(audio.volume - finalVol) > 0.001) {
          audio.volume = finalVol;
        }
        rafIdRef.current = null;
      }
    },
    [getTrackFadeFactor]
  );

  // Ensure transient RAF loop is running when a transition starts
  const ensureVolumeTransition = useCallback(() => {
    if (document.hidden) return;
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(stepVolumeTransition);
    }
  }, [stepVolumeTransition]);

  // Smooth interaction gain ramp (unmute / mute / user gesture)
  const animateInteractionGain = useCallback(
    (targetGain: number, durationMs: number, onComplete?: () => void) => {
      interactionAnimRef.current = {
        startGain: interactionGainRef.current,
        targetGain,
        startTime: performance.now(),
        durationMs,
        onComplete,
      };
      ensureVolumeTransition();
    },
    [ensureVolumeTransition]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start with volume 0 so it swells gently
    audio.volume = 0;

    // Event-driven check for track fade zones:
    // Only starts a transient RAF loop when currentTime enters a fade zone (0-3.2s or 53.2-57s).
    // During steady-state playback (88% of track), this handler is practically zero-cost.
    const handleTimeUpdate = () => {
      if (rafIdRef.current !== null || audio.paused || audio.muted || interactionGainRef.current === 0) {
        return;
      }
      const ct = audio.currentTime;
      const dur = audio.duration;
      const fadeOutStart = dur && !isNaN(dur) && dur > 0 ? dur - FADE_OUT_DURATION - END_BUFFER : Infinity;

      if (ct < FADE_IN_DURATION || ct >= fadeOutStart) {
        ensureVolumeTransition();
      }
    };

    const handlePlay = () => {
      if (!audio.muted) {
        ensureVolumeTransition();
      }
    };

    const handlePause = () => {
      if (!interactionAnimRef.current) {
        stopVolumeLoop();
        if (audio.volume !== 0) audio.volume = 0;
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopVolumeLoop();
      } else if (!audio.paused && !audio.muted) {
        applySteadyVolume();
        const ct = audio.currentTime;
        const dur = audio.duration;
        const fadeOutStart = dur && !isNaN(dur) && dur > 0 ? dur - FADE_OUT_DURATION - END_BUFFER : Infinity;
        if (ct < FADE_IN_DURATION || ct >= fadeOutStart || interactionAnimRef.current !== null) {
          ensureVolumeTransition();
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Unmute and fade in on first user gesture (Safari & mobile compliant)
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
            // Still waiting for direct gesture
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
          // Autoplay restricted: start muted so audio track runs and stays ready
          audio.muted = true;
          setIsMuted(true);
          interactionGainRef.current = 0;
          audio.play().catch(() => {});

          // Attach interaction listeners for user gesture
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
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      stopVolumeLoop();
    };
  }, [animateInteractionGain, applySteadyVolume, ensureVolumeTransition, stopVolumeLoop]);

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
        title={isAudible ? 'Sound On (Click to Mute)' : 'Sound Off (Click to Play)'}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 sm:bottom-6 sm:left-6 z-50 group cursor-pointer inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black/90 border border-white/25 hover:border-[#b89a62] text-[#f1eee7] shadow-[0_8px_25px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.95),0_0_25px_rgba(184,154,98,0.4)] transition-all duration-300 backdrop-blur-md select-none isolate transform-gpu"
      >
        {/* Animated Equalizer Wave Bars (Composite-only scaleY with bottom origin) */}
        <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 justify-center pb-[1px]">
          {isAudible ? (
            <>
              <span className="w-[2px] h-[13px] origin-bottom bg-[#b89a62] rounded-full animate-[soundbar-1_0.9s_ease-in-out_infinite]" />
              <span className="w-[2px] h-[13px] origin-bottom bg-[#b89a62] rounded-full animate-[soundbar-2_0.7s_ease-in-out_infinite]" />
              <span className="w-[2px] h-[13px] origin-bottom bg-[#b89a62] rounded-full animate-[soundbar-3_1.1s_ease-in-out_infinite]" />
            </>
          ) : (
            <>
              <span className="w-[2px] h-[3px] bg-[#b89a62]/40 rounded-full transition-all duration-300" />
              <span className="w-[2px] h-[5px] bg-[#b89a62]/40 rounded-full transition-all duration-300" />
              <span className="w-[2px] h-[3px] bg-[#b89a62]/40 rounded-full transition-all duration-300" />
            </>
          )}
        </div>
      </button>
    </>
  );
}
