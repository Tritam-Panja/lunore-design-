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

// Development and verification diagnostics
const logAudioDiag = (msg: string, details?: any) => {
  if (typeof window !== 'undefined') {
    (window as any).__LUNORE_AUDIO_LOGS__ = (window as any).__LUNORE_AUDIO_LOGS__ || [];
    (window as any).__LUNORE_AUDIO_LOGS__.push({ time: Date.now(), msg, details });
  }
  console.log(`[LUNORE_AUDIO_DIAG] ${msg}`, details !== undefined ? details : '');
};

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const interactionGainRef = useRef<number>(0);
  const interactionAnimRef = useRef<InteractionAnimation | null>(null);
  const isActivatedRef = useRef<boolean>(false);
  const userExplicitlyMutedRef = useRef<boolean>(false);
  const removeListenersRef = useRef<(() => void) | null>(null);

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

    if (audio.muted || audio.paused) {
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

      // Stop immediately if tab is hidden
      if (document.hidden) {
        rafIdRef.current = null;
        return;
      }

      // If muted without an active gain animation, silence and stop loop
      if (audio.muted && !interactionAnimRef.current) {
        if (audio.volume !== 0) audio.volume = 0;
        rafIdRef.current = null;
        return;
      }

      // If paused without an active gain animation, pause loop without zeroing volume
      if (audio.paused && !interactionAnimRef.current) {
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

  // Unified reliable playback execution used for immediate mount autoplay, global fallback, and the dedicated icon
  const requestPlayback = useCallback(
    (source: string): Promise<boolean> => {
      const audio = audioRef.current;
      if (!audio) {
        logAudioDiag('Playback aborted: audio element unavailable', { source });
        return Promise.resolve(false);
      }

      logAudioDiag(`Executing requestPlayback from ${source}`, {
        audioSrc: audio.src,
        audioPaused: audio.paused,
        audioMuted: audio.muted,
      });

      // Synchronously set audio element properties within the execution call stack
      audio.muted = false;

      // Set target volume directly so audio is immediately audible without delay
      const { factor } = getTrackFadeFactor(audio.currentTime, audio.duration);
      interactionGainRef.current = 1.0;
      audio.volume = Math.max(0, Math.min(1, TARGET_VOLUME * factor));

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        return playPromise
          .then(() => {
            logAudioDiag(`audio.play() promise RESOLVED from ${source}`, {
              volume: audio.volume,
              currentTime: audio.currentTime,
            });
            isActivatedRef.current = true;
            setIsMuted(false);
            setIsPlaying(true);
            if (removeListenersRef.current) {
              removeListenersRef.current();
            }
            ensureVolumeTransition();
            return true;
          })
          .catch((err: any) => {
            logAudioDiag(`audio.play() promise REJECTED from ${source}`, {
              name: err?.name,
              message: err?.message,
            });
            // Autoplay blocked by browser policy or error: gracefully reset state for safe fallback
            audio.muted = true;
            setIsMuted(true);
            setIsPlaying(false);
            isActivatedRef.current = false;
            return false;
          });
      } else {
        logAudioDiag(`audio.play() non-promise resolved from ${source}`);
        isActivatedRef.current = true;
        setIsMuted(false);
        setIsPlaying(true);
        if (removeListenersRef.current) {
          removeListenersRef.current();
        }
        ensureVolumeTransition();
        return Promise.resolve(true);
      }
    },
    [ensureVolumeTransition, getTrackFadeFactor]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Event-driven check for track fade zones:
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

    // Global interaction listener fallback for devices where immediate autoplay was restricted
    const handleGlobalInteraction = (e: Event) => {
      if (isActivatedRef.current || userExplicitlyMutedRef.current) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target && target.closest('#sound-toggle-btn')) {
        return; // Handled directly by toggle button
      }

      logAudioDiag('Global interaction fallback received', {
        eventType: e.type,
        targetTag: target?.tagName,
        audioExists: !!audioRef.current,
        audioPaused: audioRef.current?.paused,
        audioMuted: audioRef.current?.muted,
      });

      requestPlayback(`global_${e.type}`);
    };

    const attachGlobalListeners = () => {
      const opts: AddEventListenerOptions = { capture: true, passive: true };
      window.addEventListener('pointerdown', handleGlobalInteraction, opts);
      window.addEventListener('click', handleGlobalInteraction, opts);
      window.addEventListener('keydown', handleGlobalInteraction, opts);
    };

    const removeGlobalListeners = () => {
      window.removeEventListener('pointerdown', handleGlobalInteraction, true);
      window.removeEventListener('click', handleGlobalInteraction, true);
      window.removeEventListener('keydown', handleGlobalInteraction, true);
    };

    removeListenersRef.current = removeGlobalListeners;
    attachGlobalListeners();
    logAudioDiag('Global interaction fallback listeners registered on mount');

    // Immediate unmuted autoplay attempt upon component mount
    if (!userExplicitlyMutedRef.current) {
      logAudioDiag('Initiating immediate unmuted autoplay on mount');
      requestPlayback('mount_autoplay');
    }

    return () => {
      removeGlobalListeners();
      removeListenersRef.current = null;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      stopVolumeLoop();
    };
  }, [applySteadyVolume, ensureVolumeTransition, requestPlayback, stopVolumeLoop]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const audio = audioRef.current;
    logAudioDiag('Dedicated music icon handleToggle clicked', {
      audioExists: !!audio,
      audioPaused: audio?.paused,
      audioMuted: audio?.muted,
      isMutedState: isMuted,
      isPlayingState: isPlaying,
    });

    if (!audio) return;

    if (isPlaying && !isMuted) {
      // User explicitly mutes
      userExplicitlyMutedRef.current = true;
      setIsMuted(true);
      animateInteractionGain(0.0, 320, () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.muted = true;
          setIsPlaying(false);
        }
      });
    } else {
      // User explicitly unmutes / starts playback
      userExplicitlyMutedRef.current = false;
      requestPlayback('dedicated_button');
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
