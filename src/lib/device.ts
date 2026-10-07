/**
 * Robust iOS detection recognizing iPhone, iPod, iPad, and iPadOS devices
 * reporting desktop MacIntel platform with multi-touch capability.
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // Direct iOS devices (iPhone, iPod, legacy iPad)
  const isDirectIOS = /iPhone|iPad|iPod/i.test(ua) || /iPhone|iPad|iPod/i.test(platform);

  // Modern iPadOS (iOS 13+) reporting desktop Safari / MacIntel user agent with touch points
  const isIPadOS = (platform === 'MacIntel' || /Macintosh/i.test(ua)) && maxTouchPoints > 1;

  return isDirectIOS || isIPadOS;
}
